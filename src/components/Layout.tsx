import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Layout = () => (
  <div className="min-h-screen px-4 py-6 md:px-8">
    <header className="mb-6 flex items-center justify-between">
      <Link to="/" className="display-title text-xl text-amber-300">🏏 IPL Auction</Link>
      <nav className="flex gap-3 text-sm">
        <Link to="/create" className="text-white/70 hover:text-white">Create</Link>
        <Link to="/admin/players" className="text-white/70 hover:text-white">Players</Link>
      </nav>
    </header>
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Outlet />
    </motion.main>
  </div>
);
