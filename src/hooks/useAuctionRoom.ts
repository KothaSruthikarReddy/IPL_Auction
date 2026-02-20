import { useEffect, useMemo, useState } from 'react';
import { Bid, Player, RoomSettings, RoomStatus, RoomTeam } from '@/types/auction';
import { playSound } from '@/lib/audio';

interface AuctionState {
  roomCode: string;
  status: RoomStatus;
  teams: RoomTeam[];
  players: Player[];
  currentIndex: number;
  currentBid: number;
  highestBidder?: string;
  bids: Bid[];
  passedTeams: string[];
  timer: number;
  settings: RoomSettings;
}

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export function useAuctionRoom(initialPlayers: Player[], initialTeams: RoomTeam[], settings: RoomSettings) {
  const [state, setState] = useState<AuctionState>({
    roomCode: 'DEMO01',
    status: 'waiting',
    teams: initialTeams,
    players: [],
    currentIndex: 0,
    currentBid: 0,
    bids: [],
    passedTeams: [],
    timer: settings.timer,
    settings
  });

  const currentPlayer = state.players[state.currentIndex];

  useEffect(() => {
    if (state.status !== 'active') return;
    const id = setInterval(() => {
      setState((prev) => {
        const nextTimer = prev.timer - 1;
        if (nextTimer === 5) playSound('warning');
        if (nextTimer > 0) return { ...prev, timer: nextTimer };
        playSound('expired');
        return resolvePlayer(prev);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.status]);

  const startAuction = () => {
    setState((prev) => ({
      ...prev,
      status: 'active',
      players: shuffle(initialPlayers),
      currentIndex: 0,
      currentBid: initialPlayers[0]?.base_price ?? 0,
      timer: prev.settings.timer,
      passedTeams: []
    }));
  };

  const placeBid = (teamId: string) => {
    setState((prev) => {
      if (!prev.players[prev.currentIndex]) return prev;
      const amount = prev.currentBid + prev.settings.bidIncrement;
      playSound('bid');
      return {
        ...prev,
        currentBid: amount,
        highestBidder: teamId,
        timer: prev.settings.timer,
        passedTeams: prev.passedTeams.filter((id) => id !== teamId),
        bids: [
          {
            id: crypto.randomUUID(),
            room_id: prev.roomCode,
            player_id: prev.players[prev.currentIndex].id,
            team_id: teamId,
            amount,
            created_at: new Date().toISOString()
          },
          ...prev.bids
        ]
      };
    });
  };

  const passBid = (teamId: string) => {
    setState((prev) => {
      if (prev.passedTeams.includes(teamId)) return prev;
      const passedTeams = [...prev.passedTeams, teamId];
      const activeTeams = prev.teams.filter((t) => t.joined).length;
      if (passedTeams.length >= activeTeams) return resolvePlayer({ ...prev, passedTeams });
      return { ...prev, passedTeams };
    });
  };

  const resolvePlayer = (prev: AuctionState): AuctionState => {
    const player = prev.players[prev.currentIndex];
    if (!player) return prev;
    if (!prev.highestBidder) playSound('unsold');
    const teams = prev.teams.map((team) => {
      if (team.id !== prev.highestBidder) return team;
      playSound('sold');
      return {
        ...team,
        purse: team.purse - prev.currentBid,
        squad: [...team.squad, { player, price: prev.currentBid }],
        overseas_count: team.overseas_count + (player.is_overseas ? 1 : 0)
      };
    });
    const nextIndex = prev.currentIndex + 1;
    if (nextIndex >= prev.players.length) {
      return { ...prev, status: 'completed', teams };
    }
    return {
      ...prev,
      teams,
      currentIndex: nextIndex,
      currentBid: prev.players[nextIndex].base_price,
      highestBidder: undefined,
      passedTeams: [],
      timer: prev.settings.timer
    };
  };

  const leaderboard = useMemo(
    () => [...state.teams].sort((a, b) => b.squad.length - a.squad.length || b.purse - a.purse),
    [state.teams]
  );

  return { state, currentPlayer, leaderboard, startAuction, placeBid, passBid };
}
