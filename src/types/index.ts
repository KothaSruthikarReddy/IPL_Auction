export type TeamShort = 'MI' | 'CSK' | 'RCB' | 'KKR' | 'DC' | 'RR' | 'SRH' | 'PBKS' | 'GT' | 'LSG';

export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper' | 'WK';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  nationality: string;
  is_overseas: boolean;
  base_price: number;
  category?: string;
  image_url?: string;
  bio?: string;
  age?: number;
  matches?: number;
  batting_runs?: number;
  batting_strike_rate?: number;
  batting_50s?: number;
  batting_100s?: number;
  batting_average?: number;
  bowling_wickets?: number;
  bowling_economy?: number;
  bowling_5w?: number;
  bowling_3w?: number;
  bowling_average?: number;
}

export interface AuctionSettings {
  purse: number;
  maxSquadSize: number;
  maxOverseas: number;
  timerDuration: number;
  bidIncrement: number;
}

export interface AuctionRoom {
  id: string;
  code: string;
  admin_name: string;
  admin_session_id: string;
  status: 'waiting' | 'active' | 'paused' | 'completed';
  settings: AuctionSettings;
  allow_late_join: boolean;
  current_player_id: string | null;
}

export interface RoomTeam {
  id: string;
  room_id: string;
  team_name: string;
  team_short: TeamShort;
  logo_url: string;
  purse: number;
  squad: Array<{ playerId: string; name: string; soldPrice: number; role: PlayerRole; isOverseas: boolean }>;
  overseas_count: number;
  session_id: string | null;
  joined: boolean;
  is_active: boolean;
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  player_id: string;
  status: 'pending' | 'bidding' | 'sold' | 'unsold';
  sold_to_team_id: string | null;
  sold_price: number | null;
  bid_order: number;
}

export interface Bid {
  id: string;
  room_id: string;
  player_id: string;
  team_id: string;
  amount: number;
  created_at: string;
}
