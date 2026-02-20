import { roleMeta } from '@/lib/constants';
import { Player } from '@/types';

export const PlayerAvatar = ({ player }: { player: Player }) => {
  if (player.image_url) return <img src={player.image_url} alt={player.name} className="h-16 w-16 rounded-full object-cover" />;
  const meta = roleMeta[player.role];
  return (
    <div className={`flex h-16 w-16 items-center justify-center rounded-full border text-lg font-bold ${meta.color}`}>
      {meta.emoji} {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
    </div>
  );
};
