# Supabase Setup Instructions

Follow these steps to set up your Supabase project with the TaskRoulette database.

## 1. Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Enter project name: `TaskRoulette` (or your preference)
4. Create a strong password and save it
5. Choose region closest to you
6. Click "Create new project" (takes ~2 minutes)

## 2. Get Your Credentials

1. Go to **Settings → API**
2. Copy your credentials:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Create `.env.local` file in project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```

## 3. Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy all the SQL below and paste it:

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks (per-user)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  emoji TEXT DEFAULT '📝',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leisure activities (per-user, custom only; Rest & Game are in code)
CREATE TABLE leisure_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  emoji TEXT DEFAULT '🎮',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress (coins, skip cost, pity system)
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  coins INTEGER DEFAULT 0,
  skip_cost INTEGER DEFAULT 1,
  last_skip_date DATE,
  spin_history TEXT[] DEFAULT ARRAY[]::TEXT[],
  task_consecutive_count INTEGER DEFAULT 0,
  leisure_consecutive_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active timers (one per user)
CREATE TABLE active_timers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  result TEXT NOT NULL,
  is_task BOOLEAN,
  task_priority TEXT,
  start_time BIGINT NOT NULL,
  duration INTEGER NOT NULL,
  source TEXT CHECK (source IN ('spin', 'roll')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leisure_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_timers ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies
-- User profiles: Users can only access their own profile
CREATE POLICY "User can view/update own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- Tasks: Users can only access their own tasks
CREATE POLICY "User can CRUD own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

-- Leisure: Users can only access their own leisure activities
CREATE POLICY "User can CRUD own leisure" ON leisure_activities
  FOR ALL USING (auth.uid() = user_id);

-- Progress: Users can only access their own progress
CREATE POLICY "User can view/update own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Timers: Users can only access their own timer
CREATE POLICY "User can view/update own timer" ON active_timers
  FOR ALL USING (auth.uid() = user_id);
```

4. Click "Run" (or Ctrl+Enter)
5. Wait for success message

### Option B: Using Supabase CLI

```bash
# Not recommended for first-time setup, but for reference:
# supabase db push
```

## 4. Enable Email Authentication

1. Go to **Authentication → Providers**
2. Enable "Email" provider
3. Go to **Email Templates**
4. The default templates should work fine

## 5. Configure Email Verification

1. Go to **Authentication → Email Templates**
2. Make sure "Confirm sign up" template is enabled
3. Users will receive verification emails automatically

## 6. Test Connection

Run in your project directory:
```bash
npm run dev
```

If no errors, your Supabase setup is working!

## 7. Troubleshooting

### "Permission denied" error
- Check your .env.local file has the correct keys
- Make sure NEXT_PUBLIC_ prefix is on environment variables

### "Table already exists"
- Your tables were already created (safe to ignore)

### "Policy blocking query"
- RLS policies are working correctly
- This will only happen during development debugging

### No email verification emails arriving
- Check Supabase → Logs tab for errors
- Free tier uses shared mail servers (may have delays)
- Try different email address

---

## Next Steps

After Supabase is set up, the implementation will:
1. Create API routes in `app/api/`
2. Update auth system to use Supabase Auth
3. Update game pages to fetch data from Supabase
4. All user data will be automatically isolated per user
