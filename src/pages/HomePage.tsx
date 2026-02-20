import { motion } from 'framer-motion';
import { Gavel } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function HomePage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl space-y-8 py-16 text-center">
      <Gavel className="mx-auto h-14 w-14 text-gold" />
      <h1 className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-6xl font-black tracking-widest text-transparent">IPL AUCTION</h1>
      <Card className="mx-auto max-w-xl space-y-4">
        <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 text-black" onClick={() => navigate('/create-room')}>Create Auction Room</Button>
        <div className="flex gap-2">
          <Input placeholder="Enter room code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} />
          <Button className="bg-white/10" onClick={() => navigate(`/join/${code}`)} disabled={code.length < 6}>Join</Button>
        </div>
        <Link to="/admin/players" className="text-sm text-yellow-300 underline">Manage Player Pool</Link>
      </Card>
    </motion.div>
  );
}
