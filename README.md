# IPL Auction Simulator

Real-time IPL auction simulator built with React + TypeScript + Tailwind + Framer Motion + Supabase.

## Features
- Home, Create Room, Join Room, Auction Room (waiting/active/completed), and Admin Players pages.
- Dark cricket-themed UI with gold accents and glass-morphism cards.
- Randomized player order, bidding + pass flow, timer reset on bid, and automatic sold/unsold resolution.
- Session management with localStorage session IDs.
- CSV and printable PDF export on completion.
- Supabase schema for required tables and realtime publication.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start development:
   ```bash
   npm run dev
   ```

## Supabase
Run `supabase/schema.sql` in your Supabase SQL editor, with RLS disabled for simplicity per project requirement.
