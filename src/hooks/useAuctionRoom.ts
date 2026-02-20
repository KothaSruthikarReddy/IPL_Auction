import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { shuffle } from '@/lib/utils';
import { AuctionRoom, Bid, Player, RoomPlayer, RoomTeam } from '@/types';

export const useAuctionRoom = (roomCode?: string) => {
  const [room, setRoom] = useState<AuctionRoom | null>(null);
  const [teams, setTeams] = useState<RoomTeam[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomPlayers, setRoomPlayers] = useState<RoomPlayer[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);

  const currentRoomPlayer = useMemo(() => roomPlayers.find((rp) => rp.player_id === room?.current_player_id), [roomPlayers, room]);
  const currentPlayer = useMemo(() => players.find((p) => p.id === room?.current_player_id), [players, room]);

  const loadAll = async (code: string) => {
    setLoading(true);
    const { data: roomData } = await supabase.from('auction_rooms').select('*').eq('code', code).single();
    if (!roomData) {
      setLoading(false);
      return;
    }
    setRoom(roomData as AuctionRoom);
    const [{ data: teamsData }, { data: roomPlayersData }, { data: bidsData }] = await Promise.all([
      supabase.from('room_teams').select('*').eq('room_id', roomData.id),
      supabase.from('room_players').select('*').eq('room_id', roomData.id).order('bid_order'),
      supabase.from('bids').select('*').eq('room_id', roomData.id).order('created_at', { ascending: false }).limit(100)
    ]);
    setTeams((teamsData ?? []) as RoomTeam[]);
    setRoomPlayers((roomPlayersData ?? []) as RoomPlayer[]);
    setBids((bidsData ?? []) as Bid[]);

    const ids = (roomPlayersData ?? []).map((x) => x.player_id);
    if (ids.length) {
      const { data: playerData } = await supabase.from('players').select('*').in('id', ids);
      setPlayers((playerData ?? []) as Player[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!roomCode) return;
    loadAll(roomCode);
  }, [roomCode]);

  useEffect(() => {
    if (!room?.id) return;
    const channel = supabase
      .channel(`room-${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_rooms', filter: `id=eq.${room.id}` }, () => loadAll(room.code))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_teams', filter: `room_id=eq.${room.id}` }, () => loadAll(room.code))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids', filter: `room_id=eq.${room.id}` }, () => loadAll(room.code))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${room.id}` }, () => loadAll(room.code))
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

  const startAuction = async () => {
    if (!room) return;
    const { data: allPlayers } = await supabase.from('players').select('id');
    const shuffled = shuffle((allPlayers ?? []).map((p) => p.id));
    await supabase.from('room_players').delete().eq('room_id', room.id);
    await supabase.from('room_players').insert(
      shuffled.map((id, index) => ({
        room_id: room.id,
        player_id: id,
        status: index === 0 ? 'bidding' : 'pending',
        bid_order: index
      }))
    );
    await supabase.from('auction_rooms').update({ status: 'active', current_player_id: shuffled[0] }).eq('id', room.id);
  };

  return { room, teams, players, roomPlayers, bids, currentPlayer, currentRoomPlayer, loading, loadAll, startAuction };
};
