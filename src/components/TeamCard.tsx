import { RoomTeam, RoomSettings } from '@/types/auction';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { currency } from '@/lib/utils';

export function TeamCard({ team, settings }: { team: RoomTeam; settings: RoomSettings }) {
  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-bold">{team.team_short}</p>
        {!team.joined && <Badge>Open</Badge>}
      </div>
      <p className="text-xs text-white/70">Purse: {currency(team.purse)}</p>
      <p className="text-xs text-white/70">Squad: {team.squad.length}/{settings.maxSquad}</p>
      <p className="text-xs text-white/70">Overseas: {team.overseas_count}/{settings.maxOverseas}</p>
    </Card>
  );
}
