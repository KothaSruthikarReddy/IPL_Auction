import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPL_TEAMS } from '@/data/teams';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { makeSessionId } from '@/lib/utils';

export function CreateRoomPage() {
  const nav = useNavigate();
  const [admin, setAdmin] = useState('');
  const [selected, setSelected] = useState<string[]>(IPL_TEAMS.map((t) => t.short));
  const [settings, setSettings] = useState({ purse: 1000, maxSquad: 25, maxOverseas: 8, timer: 20, bidIncrement: 10 });

  const code = useMemo(() => Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  const createRoom = () => {
    const session = makeSessionId();
    const room = {
      code,
      admin_name: admin,
      admin_session_id: session,
      settings,
      status: 'waiting',
      teams: IPL_TEAMS.filter((t) => selected.includes(t.short)).map((t) => ({
        id: crypto.randomUUID(),
        room_id: code,
        team_name: t.name,
        team_short: t.short,
        logo_url: t.logo,
        purse: settings.purse,
        squad: [],
        overseas_count: 0,
        joined: false,
        is_active: true
      }))
    };
    localStorage.setItem(`room_${code}`, JSON.stringify(room));
    nav(`/auction/${code}`);
  };

  return <Card className="mx-auto mt-8 max-w-4xl space-y-4"><h2 className="text-2xl font-bold">Create Room</h2><Input placeholder="Admin name" value={admin} onChange={(e)=>setAdmin(e.target.value)} />
  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{IPL_TEAMS.map((t)=><button key={t.short} onClick={()=>setSelected((p)=>p.includes(t.short)?p.filter(x=>x!==t.short):[...p,t.short])} className={`rounded-xl border p-2 ${selected.includes(t.short)?'border-yellow-400':'border-white/20'}`}>{t.short}</button>)}</div>
  <div className="grid grid-cols-2 gap-2">{Object.entries(settings).map(([k,v])=><Input key={k} type="number" value={v} onChange={(e)=>setSettings((p)=>({...p,[k]:Number(e.target.value)}))} placeholder={k} />)}</div>
  <Button className="bg-gradient-to-r from-yellow-400 to-amber-600 text-black" onClick={createRoom} disabled={!admin || selected.length<2}>Create ({code})</Button></Card>;
}
