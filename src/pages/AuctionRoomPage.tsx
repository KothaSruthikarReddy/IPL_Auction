import { Trophy, Copy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuctionRoom } from '@/hooks/useAuctionRoom';
import { formatLakhs, getSessionId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { roleMeta } from '@/lib/constants';
import { PlayerAvatar } from '@/components/PlayerAvatar';

const sound = (name: string) => new Audio(`/sounds/${name}.mp3`).play().catch(() => undefined);

export const AuctionRoomPage = () => {
  const { code = '' } = useParams();
  const { room, teams, bids, currentPlayer, roomPlayers, startAuction } = useAuctionRoom(code);
  const [time, setTime] = useState(0);
  const session = getSessionId();
  const isAdmin = room?.admin_session_id === session;
  const myTeam = teams.find((t) => t.session_id === session);
  const currentBids = bids.filter((b) => b.player_id === currentPlayer?.id);
  const topBid = currentBids[0];

  useEffect(() => {
    if (!room?.settings.timerDuration || room.status !== 'active' || !currentPlayer) return;
    setTime(room.settings.timerDuration);
  }, [room?.current_player_id, room?.status]);

  useEffect(() => {
    if (room?.status !== 'active' || !currentPlayer) return;
    const i = setInterval(async () => {
      setTime((t) => {
        if (t === 6) sound('timer-warning');
        if (t <= 1) {
          resolveCurrent();
          sound('timer-expired');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, [room?.status, currentPlayer?.id, topBid?.id]);

  const activeTeams = teams.filter((t) => t.joined && t.is_active);
  const nextBid = (topBid?.amount ?? currentPlayer?.base_price ?? 0) + (room?.settings.bidIncrement ?? 0);

  const bid = async () => {
    if (!myTeam || !currentPlayer || !room) return;
    await supabase.from('bids').insert({ room_id: room.id, player_id: currentPlayer.id, team_id: myTeam.id, amount: nextBid });
    setTime(room.settings.timerDuration);
    sound('bid');
  };

  const pass = async () => {
    if (!myTeam || !currentPlayer || !room) return;
    await supabase.from('not_interested').insert({ room_id: room.id, player_id: currentPlayer.id, team_id: myTeam.id });
  };

  const resolveCurrent = async (force?: 'sold' | 'unsold') => {
    if (!room || !currentPlayer) return;
    const { data: passed } = await supabase.from('not_interested').select('team_id').eq('room_id', room.id).eq('player_id', currentPlayer.id);
    const passCount = passed?.length ?? 0;
    const shouldUnsold = force === 'unsold' || (!topBid && passCount >= activeTeams.length);
    const shouldSold = force === 'sold' || (!!topBid && passCount >= activeTeams.length - 1) || !!topBid;

    if (shouldUnsold && !topBid) {
      await supabase.from('room_players').update({ status: 'unsold' }).eq('room_id', room.id).eq('player_id', currentPlayer.id);
      sound('unsold');
    } else if (shouldSold && topBid) {
      const winTeam = teams.find((t) => t.id === topBid.team_id);
      if (!winTeam) return;
      const squad = [...winTeam.squad, { playerId: currentPlayer.id, name: currentPlayer.name, soldPrice: topBid.amount, role: currentPlayer.role, isOverseas: currentPlayer.is_overseas }];
      await supabase.from('room_teams').update({ purse: winTeam.purse - topBid.amount, squad, overseas_count: winTeam.overseas_count + (currentPlayer.is_overseas ? 1 : 0) }).eq('id', winTeam.id);
      await supabase.from('room_players').update({ status: 'sold', sold_to_team_id: winTeam.id, sold_price: topBid.amount }).eq('room_id', room.id).eq('player_id', currentPlayer.id);
      sound('sold');
    }

    const next = roomPlayers.find((rp) => rp.status === 'pending');
    if (!next) {
      await supabase.from('auction_rooms').update({ status: 'completed', current_player_id: null }).eq('id', room.id);
      return;
    }
    await supabase.from('room_players').update({ status: 'bidding' }).eq('id', next.id);
    await supabase.from('auction_rooms').update({ current_player_id: next.player_id }).eq('id', room.id);
    await supabase.from('not_interested').delete().eq('room_id', room.id).eq('player_id', currentPlayer.id);
  };

  const leaderboard = useMemo(() => [...teams].sort((a, b) => b.squad.length - a.squad.length || b.purse - a.purse), [teams]);

  if (!room) return <Card>Loading room...</Card>;

  if (room.status === 'waiting') return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="display-title text-2xl">Lobby</h2><Button onClick={() => navigator.clipboard.writeText(room.code)}><Copy className="mr-1 h-4 w-4"/> {room.code}</Button></div>
      <div className="grid gap-2 md:grid-cols-3">{teams.map((t)=><div key={t.id} className="rounded-xl border border-white/10 p-3">{t.team_short} {t.joined ? '✅':'⏳'}</div>)}</div>
      {isAdmin && <Button variant="gold" disabled={teams.filter((t)=>t.joined).length < 2} onClick={startAuction}>Start Auction</Button>}
    </Card>
  );

  if (room.status === 'completed') return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2"><Trophy className="text-amber-300"/><h2 className="display-title text-3xl">Auction Complete</h2></div>
      {leaderboard.map((t)=><Card key={t.id} className="p-3"><div className="font-bold">{t.team_short} • Purse {formatLakhs(t.purse)}</div><div className="text-sm text-white/70">Squad: {t.squad.map((p)=>`${p.name} (${formatLakhs(p.soldPrice)})`).join(', ') || 'None'}</div></Card>)}
      <div className="flex gap-2"><Button onClick={()=>window.open(`/print/${code}`,'_blank')}>Export PDF</Button><Button onClick={()=>window.location.href=`/api/export/${code}.csv`}>Export CSV</Button></div>
    </Card>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr_1.2fr]">
      <Card><h3 className="mb-3 font-bold">Teams</h3>{teams.map((t)=><div key={t.id} className="mb-2 rounded-xl border border-white/10 p-2"><div>{t.team_short}</div><div className="text-xs text-white/70">{formatLakhs(t.purse)} • {t.squad.length}/{room.settings.maxSquadSize} • 🌍 {t.overseas_count}</div></div>)}</Card>
      <Card>
        {currentPlayer && (
          <motion.div key={currentPlayer.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-3 flex items-center gap-3"><PlayerAvatar player={currentPlayer} /><div><h2 className="text-2xl font-bold">{currentPlayer.name} {currentPlayer.is_overseas && '🌍'}</h2><Badge className={roleMeta[currentPlayer.role].color}>{currentPlayer.role}</Badge></div></div>
            <div className="mb-3 grid grid-cols-2 gap-2 text-sm"><div>Base: {formatLakhs(currentPlayer.base_price)}</div><div>Nationality: {currentPlayer.nationality}</div><div>Runs: {currentPlayer.batting_runs ?? 0}</div><div>SR: {currentPlayer.batting_strike_rate ?? 0}</div><div>Wkts: {currentPlayer.bowling_wickets ?? 0}</div><div>Eco: {currentPlayer.bowling_economy ?? 0}</div></div>
            <Card className="mb-3 p-3 text-center"><div className="text-white/60">Current Bid</div><div className="text-3xl font-black text-amber-300">{formatLakhs(topBid?.amount ?? currentPlayer.base_price)}</div><div className={`${time <= 5 ? 'text-rose-400' : 'text-white/70'}`}>⏱ {time}s</div></Card>
            <div className="flex gap-2">{myTeam && <Button variant="gold" onClick={bid}>Bid {formatLakhs(nextBid)}</Button>}{myTeam && <Button variant="outline" onClick={pass}>Pass</Button>}{isAdmin && <Button onClick={()=>resolveCurrent('sold')}>Sell</Button>}{isAdmin && <Button variant="danger" onClick={()=>resolveCurrent('unsold')}>Unsold</Button>}</div>
            <div className="mt-3 text-sm">{currentBids.map((b)=><div key={b.id}>{teams.find((t)=>t.id===b.team_id)?.team_short}: {formatLakhs(b.amount)}</div>)}</div>
          </motion.div>
        )}
      </Card>
      <Card><h3 className="mb-2 font-bold">Leaderboard</h3>{leaderboard.map((t,i)=><div key={t.id} className="mb-1 flex justify-between rounded-lg bg-white/5 px-2 py-1"><span>#{i+1} {t.team_short}</span><span>{t.squad.length} | {formatLakhs(t.purse)}</span></div>)}</Card>
    </div>
  );
};
