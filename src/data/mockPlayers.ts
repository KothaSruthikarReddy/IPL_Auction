import { Player } from '@/types/auction';

export const mockPlayers: Player[] = [
  { id: 'p1', name: 'Virat Kohli', role: 'Batsman', nationality: 'India', is_overseas: false, base_price: 200, batting_runs: 7263, batting_average: 37, batting_strike_rate: 130, batting_50s: 50, batting_100s: 7 },
  { id: 'p2', name: 'Rashid Khan', role: 'Bowler', nationality: 'Afghanistan', is_overseas: true, base_price: 180, bowling_wickets: 149, bowling_average: 20, bowling_economy: 6.7, bowling_3w: 8, bowling_5w: 1 },
  { id: 'p3', name: 'Ben Stokes', role: 'All-Rounder', nationality: 'England', is_overseas: true, base_price: 160, batting_runs: 920, bowling_wickets: 28 },
  { id: 'p4', name: 'Rishabh Pant', role: 'WK', nationality: 'India', is_overseas: false, base_price: 140, batting_runs: 2838, batting_strike_rate: 148 }
];
