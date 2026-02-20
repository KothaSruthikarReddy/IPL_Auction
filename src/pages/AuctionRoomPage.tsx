import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuctionRoom } from '@/hooks/useAuctionRoom';
import { mockPlayers } from '@/data/mockPlayers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TeamCard } from '@/components/TeamCard';
import { PlayerAvatar } from '@/components/PlayerAvatar';
import { Dialog } from '@/components/ui/dialog';
import { Table } from '@/components/ui/table';
import { currency, makeSessionId } from '@/lib/utils';

export function AuctionRoomPage() {
  const { code = '' } = useParams();
  const session = makeSessionId();
  const room = useMemo(() => {
    const raw = localStorage.getItem(`room_${code}`);
    return raw ? JSON.parse(raw) : null;
  }, [code]);
  const settings = room?.settings ?? { purse: 1000, maxSquad: 25, maxOverseas: 8, timer: 20, bidIncrement: 10 };
  const { state, currentPlayer, leaderboard, startAuction, placeBid, passBid } = useAuctionRoom(mockPlayers, room?.teams ?? [], settings);
  const [showSquad, setShowSquad] = useState<string | null>(null);

  if (!room) return <p className="p-8">Room not found.</p>;

  const isAdmin = session === room.admin_session_id;
  const joinedCount = room.teams.filter((t: any) => t.joined).length;

  if (state.status === 'waiting') {
    return <Card className="mx-auto mt-8 max-w-5xl space-y-4"><h2 className="text-2xl font-bold">Lobby</h2>
    <p>Room Code: <span className="font-black text-gold">{room.code}</span> <button onClick={()=>navigator.clipboard.writeText(room.code)}><Copy className="inline h-4"/></button></p>
    <div className="grid gap-3 md:grid-cols-3">{room.teams.map((team:any)=><TeamCard key={team.id} team={team} settings={settings} />)}</div>
    {isAdmin && <Button className="bg-gradient-to-r from-yellow-400 to-amber-600 text-black" onClick={startAuction} disabled={joinedCount<2}>Start Auction</Button>}</Card>;
  }

  if (state.status === 'completed') {
    const exportCSV = () => {
      const lines = ['Team,Player,Price,Status'];
      state.teams.forEach((team) => team.squad.forEach((s) => lines.push(`${team.team_short},${s.player.name},${s.price},Sold`)));
      const sold = new Set(state.teams.flatMap((t) => t.squad.map((s) => s.player.id)));
      state.players.filter((p) => !sold.has(p.id)).forEach((p) => lines.push(`NA,${p.name},0,Unsold`));
      const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${room.code}-summary.csv`;
      a.click();
    };
    const exportPDF = () => {
      const html = `<html><body style="font-family:sans-serif;background:#0a0a0f;color:#fff"><h1>Auction ${room.code}</h1>${state.teams.map((team)=>`<h2>${team.team_short}</h2><table border='1' cellpadding='8'>${team.squad.map((s)=>`<tr><td>${s.player.name}</td><td>${s.price}</td></tr>`).join('')}</table>`).join('')}</body></html>`;
      const w = window.open('', '_blank');
      w?.document.write(html);
      w?.print();
    };

    return <Card className="mx-auto mt-8 max-w-4xl space-y-4"><Trophy className="h-10 w-10 text-gold"/><h2 className="text-3xl font-black">Auction Complete</h2>
    {leaderboard.map((team)=><details key={team.id} className="rounded-xl border border-white/20 p-3"><summary>{team.team_short} - {team.squad.length} players ({currency(team.purse)} left)</summary>{team.squad.map((s)=><p key={s.player.id}>{s.player.name} - {currency(s.price)}</p>)}</details>)}
    <div className="flex gap-2"><Button className="bg-gold text-black" onClick={exportCSV}>Export CSV</Button><Button className="bg-white/10" onClick={exportPDF}>Export PDF</Button></div></Card>;
  }

  const me = state.teams.find((t) => t.session_id === session);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 p-4 lg:grid-cols-[1fr_2fr_1fr]">
      <Card className="space-y-3">{state.teams.map((team) => <div key={team.id}><TeamCard team={team} settings={settings} /><Button className="mt-2 w-full bg-white/10" onClick={() => setShowSquad(team.id)}>View Squad</Button></div>)}</Card>
      <Card className="space-y-4">
        {currentPlayer && <><div className="flex gap-3"><PlayerAvatar player={currentPlayer} /><div><h3 className="text-2xl font-bold">{currentPlayer.name} {currentPlayer.is_overseas && '🌍'}</h3><p>{currentPlayer.role} • {currentPlayer.nationality}</p><p>Base: {currency(currentPlayer.base_price)}</p></div></div>
        <div className="grid grid-cols-2 gap-2 text-sm"><p>Runs: {currentPlayer.batting_runs ?? 0}</p><p>Avg: {currentPlayer.batting_average ?? 0}</p><p>SR: {currentPlayer.batting_strike_rate ?? 0}</p><p>50s/100s: {currentPlayer.batting_50s ?? 0}/{currentPlayer.batting_100s ?? 0}</p><p>Wkts: {currentPlayer.bowling_wickets ?? 0}</p><p>Eco: {currentPlayer.bowling_economy ?? 0}</p></div>
        <Card className="space-y-2"><p>Current Bid: <span className="text-gold">{currency(state.currentBid)}</span></p><p className={`${state.timer<=5?'text-red-400':''}`}>Timer: {state.timer}s</p>
          <div className="flex gap-2"><Button className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-600 text-black" onClick={() => me && placeBid(me.id)} disabled={!me}>Bid {currency(state.currentBid + settings.bidIncrement)}</Button>
          <Button className="bg-white/10" onClick={() => me && passBid(me.id)} disabled={!me}>Pass</Button></div>
          {isAdmin && <div className="flex gap-2"><Button className="bg-emerald-500">Mark Sold</Button><Button className="bg-rose-500">Unsold</Button></div>}
        </Card>
        <Card><h4 className="mb-2 font-semibold">Bid History</h4>{state.bids.slice(0, 6).map((b) => <p key={b.id} className="text-sm">{state.teams.find((t) => t.id === b.team_id)?.team_short}: {currency(b.amount)}</p>)}</Card></>}
      </Card>
      <Card><h3 className="mb-3 text-lg font-bold">Leaderboard</h3>{leaderboard.map((team, idx)=><p key={team.id}>{idx+1}. {team.team_short} • {team.squad.length} • {currency(team.purse)}</p>)}</Card>
      <Dialog open={!!showSquad} onClose={() => setShowSquad(null)}>
        <h3 className="mb-3 text-xl font-bold">Squad</h3>
        <Table><tbody>{state.teams.find((t)=>t.id===showSquad)?.squad.map((s)=><tr key={s.player.id}><td>{s.player.name}</td><td>{currency(s.price)}</td></tr>)}</tbody></Table>
      </Dialog>
    </motion.div>
  );
}
