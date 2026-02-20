import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IPL_TEAMS } from '@/lib/constants';
import { getSessionId } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export const CreateRoomPage = () => {
  const nav = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [settings, setSettings] = useState({ purse: 1000, maxSquadSize: 25, maxOverseas: 8, timerDuration: 15, bidIncrement: 10 });
  const [selected, setSelected] = useState(IPL_TEAMS.map((t) => t.short));

  const createRoom = async () => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const session = getSessionId();
    const { data: room } = await supabase
      .from('auction_rooms')
      .insert({ code, admin_name: adminName, admin_session_id: session, status: 'waiting', settings, allow_late_join: true })
      .select('*')
      .single();
    if (!room) return;
    await supabase.from('room_teams').insert(
      IPL_TEAMS.filter((t) => selected.includes(t.short)).map((team) => ({
        room_id: room.id,
        team_name: team.name,
        team_short: team.short,
        logo_url: team.logo,
        purse: settings.purse,
        squad: [],
        overseas_count: 0,
        joined: false,
        is_active: true
      }))
    );
    nav(`/room/${code}`);
  };

  return (
    <Card className="mx-auto max-w-4xl space-y-5">
      <h2 className="display-title text-3xl">Create Room</h2>
      <Input placeholder="Admin name" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {Object.entries(settings).map(([key, value]) => <Input key={key} type="number" value={value} onChange={(e) => setSettings((s) => ({ ...s, [key]: Number(e.target.value) }))} placeholder={key} />)}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {IPL_TEAMS.map((team) => (
          <button key={team.short} onClick={() => setSelected((s) => s.includes(team.short) ? s.filter((x) => x !== team.short) : [...s, team.short])} className={`rounded-xl border p-3 text-left ${selected.includes(team.short) ? 'border-amber-400 bg-amber-400/10' : 'border-white/15'}`}>
            <div className="font-bold">{team.short}</div><div className="text-xs text-white/70">{team.name}</div>
          </button>
        ))}
      </div>
      <Button variant="gold" onClick={createRoom}>Create & Share Room</Button>
    </Card>
  );
};
