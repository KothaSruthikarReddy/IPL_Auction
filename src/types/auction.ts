export type Role = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper' | 'WK';

export interface Player {
  id: string;
  name: string;
  role: Role;
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

export interface TeamConfig {
  name: string;
  short: string;
  color: string;
  logo: string;
}

export interface RoomSettings {
  purse: number;
  maxSquad: number;
  maxOverseas: number;
  timer: number;
  bidIncrement: number;
}

export interface RoomTeam {
  id: string;
  room_id: string;
  team_name: string;
  team_short: string;
  logo_url: string;
  purse: number;
  squad: Array<{ player: Player; price: number }>;
  overseas_count: number;
  session_id?: string;
  joined: boolean;
  is_active: boolean;
}

export interface Bid {
  id: string;
  room_id: string;
  player_id: string;
  team_id: string;
  amount: number;
  created_at: string;
}

export type RoomStatus = 'waiting' | 'active' | 'paused' | 'completed';
