create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  nationality text not null,
  is_overseas boolean default false,
  base_price integer not null,
  category text,
  image_url text,
  bio text,
  age integer,
  matches integer,
  batting_runs integer,
  batting_strike_rate numeric,
  batting_50s integer,
  batting_100s integer,
  batting_average numeric,
  bowling_wickets integer,
  bowling_economy numeric,
  bowling_5w integer,
  bowling_3w integer,
  bowling_average numeric
);

create table if not exists auction_rooms (
  id uuid primary key default gen_random_uuid(),
  code varchar(6) unique not null,
  admin_name text not null,
  admin_session_id text not null,
  status text not null,
  settings jsonb not null,
  allow_late_join boolean default true,
  current_player_id uuid references players(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists room_teams (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  team_name text not null,
  team_short text not null,
  logo_url text,
  purse integer not null,
  squad jsonb default '[]'::jsonb,
  overseas_count integer default 0,
  session_id text,
  joined boolean default false,
  is_active boolean default true
);

create table if not exists room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  player_id uuid references players(id),
  status text default 'pending',
  sold_to_team_id uuid references room_teams(id),
  sold_price integer,
  bid_order integer
);

create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  player_id uuid references players(id),
  team_id uuid references room_teams(id),
  amount integer not null,
  created_at timestamptz default now()
);

create table if not exists not_interested (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  player_id uuid references players(id),
  team_id uuid references room_teams(id),
  created_at timestamptz default now()
);

alter publication supabase_realtime add table players, auction_rooms, room_teams, room_players, bids, not_interested;
