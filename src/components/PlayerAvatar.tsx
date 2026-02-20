import { Player } from '@/types/auction';

const roleStyles: Record<string, string> = {
  Batsman: 'from-blue-500 to-cyan-400 ⚡',
  Bowler: 'from-red-500 to-orange-400 🎯',
  'All-Rounder': 'from-green-500 to-emerald-400 🛡️',
  'Wicket-Keeper': 'from-purple-500 to-fuchsia-400 🧤',
  WK: 'from-purple-500 to-fuchsia-400 🧤'
};

export function PlayerAvatar({ player }: { player: Player }) {
  if (player.image_url) return <img src={player.image_url} alt={player.name} className="h-24 w-24 rounded-2xl object-cover" />;
  const [gradient, emoji] = roleStyles[player.role]?.split(' ') ?? ['from-gray-600 to-gray-400', '🏏'];
  return (
    <div className={`grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-xl font-black`}>
      {emoji} {player.name.slice(0, 2).toUpperCase()}
    </div>
  );
}
