import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Player, Role } from '@/types/auction';

const empty: Partial<Player> = { role: 'Batsman', nationality: 'India', base_price: 20 };

export function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>(() => JSON.parse(localStorage.getItem('global_players') || '[]'));
  const [draft, setDraft] = useState<Partial<Player>>(empty);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const save = (next: Player[]) => {
    setPlayers(next);
    localStorage.setItem('global_players', JSON.stringify(next));
  };

  const add = () => {
    if (!draft.name) return;
    save([...players, { ...(draft as Player), id: crypto.randomUUID(), is_overseas: draft.nationality !== 'India' }]);
    setDraft(empty);
  };

  const remove = (id: string) => save(players.filter((p) => p.id !== id));

  const importCSV = (file?: File | null) => {
    if (!file) return;
    file.text().then((text) => {
      const rows = text.trim().split('\n').slice(1);
      const imported = rows.map((line) => {
        const [name, role, nationality, base_price] = line.split(',');
        return { id: crypto.randomUUID(), name, role: role as Role, nationality, base_price: Number(base_price), is_overseas: nationality !== 'India' } as Player;
      });
      save([...players, ...imported]);
    });
  };

  const filtered = useMemo(() => players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) && (roleFilter === 'all' || p.role === roleFilter)), [players, query, roleFilter]);

  return <Card className="mx-auto mt-8 max-w-6xl space-y-4"><h2 className="text-2xl font-bold">Manage Player Pool</h2>
  <div className="grid gap-2 md:grid-cols-4"><Input placeholder="Name" value={draft.name || ''} onChange={(e)=>setDraft((p)=>({...p,name:e.target.value}))}/>
  <Select value={draft.role} onChange={(e)=>setDraft((p)=>({...p,role:e.target.value as Role}))}>{['Batsman','Bowler','All-Rounder','Wicket-Keeper','WK'].map((r)=><option key={r}>{r}</option>)}</Select>
  <Input placeholder="Nationality" value={draft.nationality || ''} onChange={(e)=>setDraft((p)=>({...p,nationality:e.target.value}))}/>
  <Input type="number" placeholder="Base price" value={draft.base_price || 0} onChange={(e)=>setDraft((p)=>({...p,base_price:Number(e.target.value)}))}/></div>
  <div className="grid gap-2 md:grid-cols-3"><Input placeholder="Image URL" value={draft.image_url || ''} onChange={(e)=>setDraft((p)=>({...p,image_url:e.target.value}))}/><Input placeholder="Age" type="number" value={draft.age || 0} onChange={(e)=>setDraft((p)=>({...p,age:Number(e.target.value)}))}/><Input placeholder="Bio" value={draft.bio || ''} onChange={(e)=>setDraft((p)=>({...p,bio:e.target.value}))}/></div>
  <div className="grid gap-2 md:grid-cols-5">{['batting_runs','batting_average','batting_strike_rate','bowling_wickets','bowling_economy'].map((k)=><Input key={k} type="number" placeholder={k} value={(draft as any)[k] || 0} onChange={(e)=>setDraft((p)=>({...p,[k]:Number(e.target.value)}))}/>)}</div>
  <div className="flex gap-2"><Button className="bg-gold text-black" onClick={add}>Add Player</Button><Input type="file" accept=".csv" onChange={(e)=>importCSV(e.target.files?.[0])}/></div>
  <div className="grid gap-2 md:grid-cols-2"><Input placeholder="Search" value={query} onChange={(e)=>setQuery(e.target.value)} /><Select value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}><option value="all">All Roles</option><option>Batsman</option><option>Bowler</option><option>All-Rounder</option><option>Wicket-Keeper</option><option>WK</option></Select></div>
  <Table><thead><tr><th>Name</th><th>Role</th><th>Nationality</th><th>Base</th><th/></tr></thead><tbody>{filtered.map((p)=><tr key={p.id}><td>{p.name}</td><td>{p.role}</td><td>{p.nationality}</td><td>{p.base_price}</td><td><Button className="bg-rose-600" onClick={()=>remove(p.id)}>Delete</Button></td></tr>)}</tbody></Table></Card>;
}
