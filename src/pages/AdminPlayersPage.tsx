import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Player } from '@/types';
import { supabase } from '@/lib/supabase';

const emptyPlayer: Partial<Player> = { name: '', role: 'Batsman', nationality: 'India', base_price: 20, is_overseas: false, batting_runs: 0, bowling_wickets: 0 };

export const AdminPlayersPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Player>>(emptyPlayer);

  const load = async () => {
    const { data } = await supabase.from('players').select('*').order('name');
    setPlayers((data ?? []) as Player[]);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => players.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.role.includes(search)), [players, search]);

  const save = async () => {
    await supabase.from('players').insert(form);
    setForm(emptyPlayer);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('players').delete().eq('id', id);
    load();
  };

  const onCsv = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async ({ data }) => {
        await supabase.from('players').insert(data as Player[]);
        load();
      }
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
      <Card className="space-y-2">
        <h2 className="display-title text-2xl">Add Player</h2>
        {['name','role','nationality','base_price','age','matches','batting_runs','batting_average','batting_strike_rate','batting_50s','batting_100s','bowling_wickets','bowling_average','bowling_economy','bowling_3w','bowling_5w','image_url','bio'].map((k)=><Input key={k} placeholder={k} value={(form as any)[k] ?? ''} onChange={(e)=>setForm((f)=>({...f,[k]:e.target.value}))}/>)}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_overseas} onChange={(e)=>setForm((f)=>({...f,is_overseas:e.target.checked}))}/> Overseas</label>
        <Button variant="gold" onClick={save}>Save Player</Button>
        <Input type="file" accept=".csv" onChange={(e)=> e.target.files?.[0] && onCsv(e.target.files[0])} />
      </Card>
      <Card>
        <div className="mb-2 flex gap-2"><Input placeholder="Search players" value={search} onChange={(e)=>setSearch(e.target.value)}/></div>
        <div className="space-y-2 max-h-[70vh] overflow-auto">{filtered.map((p)=><div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 p-2"><div><div className="font-semibold">{p.name} {p.is_overseas && '🌍'}</div><div className="text-xs text-white/60">{p.role} • Base {p.base_price}L</div></div><Button variant="danger" onClick={()=>remove(p.id)}>Delete</Button></div>)}</div>
      </Card>
    </div>
  );
};
