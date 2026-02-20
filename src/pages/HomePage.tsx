import { Gavel } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const HomePage = () => {
  const [code, setCode] = useState('');
  const nav = useNavigate();
  return (
    <Card className="mx-auto max-w-3xl p-10 text-center">
      <Gavel className="mx-auto mb-5 h-12 w-12 text-amber-300" />
      <h1 className="display-title mb-3 text-5xl text-amber-100">IPL AUCTION</h1>
      <p className="mb-8 text-white/60">Build teams, battle in realtime, and own the mega auction table.</p>
      <div className="mx-auto mb-4 max-w-md"><Link to="/create"><Button variant="gold" className="w-full">Create Auction Room</Button></Link></div>
      <div className="mx-auto flex max-w-md gap-2">
        <Input placeholder="Enter room code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} />
        <Button onClick={() => nav(`/join/${code}`)}>Join</Button>
      </div>
      <Link to="/admin/players" className="mt-6 inline-block text-amber-300 underline">Manage Player Pool</Link>
    </Card>
  );
};
