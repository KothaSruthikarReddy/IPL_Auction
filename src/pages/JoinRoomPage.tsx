import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { makeSessionId } from '@/lib/utils';

export function JoinRoomPage() {
  const { code = '' } = useParams();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const room = useMemo(() => {
    const raw = localStorage.getItem(`room_${code}`);
    return raw ? JSON.parse(raw) : null;
  }, [code]);

  const join = () => {
    if (!room || !teamId) return;
    const session = makeSessionId();
    room.teams = room.teams.map((team: any) => (team.id === teamId ? { ...team, joined: true, session_id: session, owner_name: name } : team));
    localStorage.setItem(`room_${code}`, JSON.stringify(room));
    nav(`/auction/${code}`);
  };

  if (!room) return <p className="p-8">Room not found.</p>;

  return <Card className="mx-auto mt-8 max-w-xl space-y-4"><h2 className="text-xl font-bold">Join Room {code}</h2><Input placeholder="Owner name" value={name} onChange={(e)=>setName(e.target.value)} />
  <div className="grid grid-cols-2 gap-2">{room.teams.filter((t:any)=>!t.joined).map((t:any)=><button key={t.id} onClick={()=>setTeamId(t.id)} className={`rounded-xl border p-2 ${teamId===t.id?'border-gold':'border-white/20'}`}>{t.team_short}</button>)}</div>
  <Button className="bg-gold text-black" onClick={join} disabled={!name || !teamId}>Enter Lobby</Button></Card>;
}
