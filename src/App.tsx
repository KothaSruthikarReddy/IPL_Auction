import { Link, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { CreateRoomPage } from '@/pages/CreateRoomPage';
import { JoinRoomPage } from '@/pages/JoinRoomPage';
import { AuctionRoomPage } from '@/pages/AuctionRoomPage';
import { AdminPlayersPage } from '@/pages/AdminPlayersPage';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur"><Link to="/" className="text-lg font-black tracking-widest text-gold">IPL AUCTION SIMULATOR</Link></header>
      <main className="px-4 pb-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/join/:code" element={<JoinRoomPage />} />
          <Route path="/auction/:code" element={<AuctionRoomPage />} />
          <Route path="/admin/players" element={<AdminPlayersPage />} />
        </Routes>
      </main>
    </div>
  );
}
