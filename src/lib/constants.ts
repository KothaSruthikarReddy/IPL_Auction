import { TeamShort } from '@/types';

export const IPL_TEAMS: Array<{ short: TeamShort; name: string; color: string; logo: string }> = [
  { short: 'MI', name: 'Mumbai Indians', color: '#0C3B8C', logo: '/team-logos/MI.png' },
  { short: 'CSK', name: 'Chennai Super Kings', color: '#F7E31A', logo: '/team-logos/CSK.png' },
  { short: 'RCB', name: 'Royal Challengers Bangalore', color: '#D71920', logo: '/team-logos/RCB.png' },
  { short: 'KKR', name: 'Kolkata Knight Riders', color: '#3B1D72', logo: '/team-logos/KKR.png' },
  { short: 'DC', name: 'Delhi Capitals', color: '#17449B', logo: '/team-logos/DC.png' },
  { short: 'RR', name: 'Rajasthan Royals', color: '#EA1A85', logo: '/team-logos/RR.png' },
  { short: 'SRH', name: 'Sunrisers Hyderabad', color: '#F26B1D', logo: '/team-logos/SRH.png' },
  { short: 'PBKS', name: 'Punjab Kings', color: '#ED1B24', logo: '/team-logos/PBKS.png' },
  { short: 'GT', name: 'Gujarat Titans', color: '#1A275A', logo: '/team-logos/GT.png' },
  { short: 'LSG', name: 'Lucknow Super Giants', color: '#00AEEF', logo: '/team-logos/LSG.png' }
];

export const roleMeta = {
  Batsman: { emoji: '🏏', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  Bowler: { emoji: '🎯', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  'All-Rounder': { emoji: '🔥', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  'Wicket-Keeper': { emoji: '🧤', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  WK: { emoji: '🧤', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
};
