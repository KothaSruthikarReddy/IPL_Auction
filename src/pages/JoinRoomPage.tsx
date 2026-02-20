import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { getSessionId } from '@/lib/utils';
import { RoomTeam } from '@/types';

export const JoinRoomPage = () => {
  const { code } = useParams();
  const nav = useNavigate();
  const [teams, setTeams] = useState<RoomTeam[]>([]);
  const [name, setName] = useState('');
  const [picked, setPicked] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const { data: room } = await supabase.from('auction_rooms').select('id').eq('code', code).single();
      if (!room) return;
      const { data } = await supabase.from('room_teams').select('*').eq('room_id', room.id).eq('joined', false);
      setTeams((data ?? []) as RoomTeam[]);
    };
    load();
  }, [code]);

  const join = async () => {
    const session = getSessionId();
    await supabase.from('room_teams').update({ joined: true, session_id: session, owner_name: name }).eq('id', picked);
    nav(`/room/${code}`);
  };

  return <Card className="mx-auto max-w-xl space-y-4"><h2 className="display-title text-2xl">Join Room {code}</h2><Input placeholder="Owner name" value={name} onChange={(e)=>setName(e.target.value)}/><div className="grid gap-2">{teams.map((t)=><button key={t.id} onClick={()=>setPicked(t.id)} className={`rounded-xl border p-3 ${picked===t.id?'border-amber-400':'border-white/10'}`}>{t.team_short} - {t.team_name}</button>)}</div><Button onClick={join} disabled={!picked || !name}>Enter Lobby</Button></Card>;
};
