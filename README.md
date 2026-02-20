# IPL Auction Simulator

Real-time IPL Cricket Auction Simulator built with React + TypeScript + Tailwind + Framer Motion + Supabase Realtime.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Supabase schema

```sql
create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  nationality text not null,
  is_overseas boolean default false,
  base_price numeric not null,
  category text,
  image_url text,
  bio text,
  age int,
  matches int,
  batting_runs int,
  batting_strike_rate numeric,
  batting_50s int,
  batting_100s int,
  batting_average numeric,
  bowling_wickets int,
  bowling_economy numeric,
  bowling_5w int,
  bowling_3w int,
  bowling_average numeric
);

create table auction_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  admin_name text not null,
  admin_session_id text not null,
  status text not null default 'waiting',
  settings jsonb not null,
  allow_late_join boolean default true,
  current_player_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table room_teams (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  team_name text not null,
  team_short text not null,
  logo_url text,
  purse numeric not null,
  squad jsonb default '[]'::jsonb,
  overseas_count int default 0,
  session_id text,
  joined boolean default false,
  is_active boolean default true
);

create table room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  status text not null default 'pending',
  sold_to_team_id uuid references room_teams(id),
  sold_price numeric,
  bid_order int not null
);

create table bids (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  team_id uuid references room_teams(id) on delete cascade,
  amount numeric not null,
  created_at timestamptz default now()
);

create table not_interested (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references auction_rooms(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  team_id uuid references room_teams(id) on delete cascade,
  created_at timestamptz default now()
);
```

Enable realtime on all tables and disable RLS for hackathon/simple setup.

## Features implemented

- Dark cricket themed UI with glass cards and gold accents.
- Home, create room, join room, auction room, and admin player pool pages.
- Realtime room sync via Supabase channel subscriptions.
- Auction flow with random order, bidding, pass, timer expiry, and auto complete.
- Team purse/squad/overseas updates after sale.
- CSV bulk import and player CRUD.
