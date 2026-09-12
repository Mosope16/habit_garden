# 🌱 Habit Garden

A gamified habit tracker that visualizes your daily consistency as a growing garden. Build streaks, earn XP, and watch your virtual garden flourish.

![Habit Garden Dashboard](./public/screenshot-placeholder.png) *(Note: Replace with actual screenshot before sharing)*

## 🚀 Features

- **Gamified Habit Tracking**: Earn XP for every habit you complete daily.
- **Dynamic Garden**: Your garden visually grows based on your overall level and XP.
- **Detailed Statistics**: Track your 30-day adherence, total XP earned, and per-habit completion rates with interactive charts.
- **Secure Authentication**: Email-based signup and login protected by Supabase Auth and Row Level Security (RLS).
- **Premium Dark Aesthetics**: A calming, nighttime garden theme built with Tailwind CSS.
- **Mobile Responsive**: Custom bottom navigation for mobile, preserving a native app-like experience.

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Base UI primitives, Shadcn-like components
- **State & Data Fetching**: TanStack Query (React Query)
- **Database & Auth**: Supabase (PostgreSQL)
- **Visuals**: Recharts (Statistics), SVG Illustrations (Garden)

## 🗄️ Database Schema

The backend relies on Supabase PostgreSQL with strict Row Level Security (RLS) policies ensuring users can only access their own data.

- **`profiles`**: User metadata, total XP, current level, and streaks.
- **`garden` & `garden_plants`**: Represents the state of the user's virtual garden.
- **`habits`**: The core habits the user is trying to build. Supports soft-deletion (`is_active`).
- **`habit_completions`**: A ledger of every habit completed. Enforces a `UNIQUE(habit_id, completion_date)` constraint to prevent duplicate logs.

*Note: Complex operations like completing a habit and calculating streak stats are handled securely on the database side via PL/pgSQL RPC functions.*

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/habit-garden.git
cd habit-garden
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Setup the Database
Navigate to your Supabase SQL Editor and execute the SQL files found in the `/supabase` folder in chronological order (`schema.sql` -> `schema_v2.sql` -> `schema_v3.sql`). This will build the tables, RLS policies, and RPC functions.

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔒 Production Hardening Checks
Before deploying, ensure you verify:
- **RLS Isolation**: Log in with two different accounts to ensure no cross-contamination of habits or stats.
- **Duplicate Prevention**: Try double-clicking the complete button; the database constraint will safely reject the second attempt.
- **Archive Integrity**: Deleting a habit only soft-deletes it, ensuring your past XP and statistics remain intact.
- **Session Management**: Test logging out and attempting to access `/` to verify the middleware catches unauthorized access.

---
*Built as Project #1 in the Modern Stack App Series.*
