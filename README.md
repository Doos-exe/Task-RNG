# TASK RNG

A productivity web app with a luck based task management, perfect for people who are indecisive!

## Core Features

### 🎰 Slot Machine
- **Personalized Luck**: You can add different task and leisures
- **Pity System**: To avoid getting extremely lucky or unlucky

### 🎲 Dice Game
- **Roll Your Fate**: Let the dice decide for your specific task or leisure
- **Fight The System**: Test your luck against the system

### ⏱️ Commitment Timer
- There will be a timer for each task or leisure you get
- Leisure timer are randomized
- Task timer depend on the risks

### ✅ Task Management
- Minimalist interface
- Task priority levels (low, medium, high)
- Easy to navigate
- Editable

## Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout with theme & metadata
│   ├── page.tsx                # Landing/home page
│   ├── auth/page.tsx           # Authentication page
│   ├── spin/page.tsx           # Slot machine RNG page
│   ├── roll/page.tsx           # Dice rolling RNG page
│   ├── bet/page.tsx            # Task/leisure management page
│   ├── about/page.tsx          # About & features page
│   └── api/                    # API routes (Supabase integration)
├── components/
│   ├── SlotMachine.tsx         # Spinning reels animation
│   ├── InteractiveHandle.tsx   # Slot machine lever UI
│   ├── TaskList.tsx            # Task/Leisure CRUD interface
│   ├── EmojiPicker.tsx         # Emoji selector for items
│   ├── CommitmentTimer.tsx     # Activity countdown timer
│   ├── ResultTimer.tsx         # Result display timer
│   ├── ProbabilityVisualizer.tsx # Odds display & weight breakdown
│   ├── ConfirmationDialog.tsx  # Reusable confirmation modal
│   ├── PokerChip.tsx           # Coin display component
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── ThemeToggle.tsx         # Dark mode toggle
│   ├── AuthGuard.tsx           # Auth wrapper component
│   └── Layout.tsx              # Shared layout wrapper
├── lib/
│   ├── probability.ts          # Weighted probability logic & calculations
│   ├── store.ts                # Zustand state management (tasks, coins, timers)
│   └── supabase.ts            # Supabase client initialization
├── styles/
│   └── globals.css             # Global Tailwind CSS
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4+
- **Animation**: Framer Motion 11+
- **State Management**: Zustand 4.4+
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Language**: TypeScript 5

## Getting Started

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## How It Works

### Weighted Probability System

The app uses dynamic weighted probabilities to determine outcomes:

**Weight Calculation:**
- **Tasks Weight** = (Number of Pending Tasks) × 5
- **Leisure Weight** = 10 per leisure activity

**Total Weight** = Tasks Weight + (Total Leisure Weight)

**Example with 3 pending tasks and 2 leisures:**
```
Tasks Weight = 3 × 5 = 15
Leisures Weight = 2 × 10 = 20
Total Weight = 35

Task Probability = 15/35 ≈ 43%
Leisure Probability = 20/35 ≈ 57%
```

### Slot Machine RNG (Spin Page)

1. User pulls the lever to spin
2. Slot machine reels animate for 5 seconds with spinning animation
3. System calculates weighted probability based on task/leisure counts
4. **Pity System Check**: If 4+ consecutive same type (tasks or leisures), force opposite type
5. Selects a random item from the "winning" category
6. Reels stop on the selected item
7. Result displays with popup notification
8. Commitment timer starts based on activity type
9. User can collect coins by completing tasks early, or skip (costs coins)

### Dice Rolling RNG (Roll Page)

1. User places a **Higher** or **Lower** bet
2. System rolls dice with adjusted probabilities
3. **Higher Bet**: Increases task weight
4. **Lower Bet**: Increases leisure weight
5. Dice animation resolves to result
6. Timer starts for selected activity
7. Coins system applies (earn/spend)

### Pity System

**Purpose**: Prevent bad luck streaks and guarantee variety

- Tracks consecutive outcomes (4 consecutive tasks/leisures)
- After 4 consecutive of same type, **next spin is guaranteed to be opposite**
- Resets counter when opposite type is rolled
- Visual progress bar shows pity meter (0-4)

### Coins System

- **Earn**: 1 coin per task completed early
- **Spend**: Skip an activity (escalating cost)
- **Re-spin**: Use coins to re-spin if unsatisfied
- No maximum limit

### Commitment Timer

- **Task Timer**: Duration based on task priority (Low/Medium/High)
- **Leisure Timer**: Randomized duration
- **Skip Option**: Pay coins to skip (cost increases per skip)
- Prevents new spins while active
- Shows remaining time with visual countdown

### Activity Pity Filtering

Avoids repeating recently spun items:
- Recent spin history filters out just-used items
- Falls back to any item if all have been used recently
- Encourages variety in activity selection

## Design System

### Colors
- **Background**: `#F7F7F5` (soft gray)
- **Border**: `#E5E5E5` (light gray)
- **Text**: `#000000` (black)
- **Secondary**: `#626060` (dark gray)

### Typography
- **Font**: Inter or Plus Jakarta Sans
- **Border**: 1px solid `#E5E5E5`
- **Spacing**: Consistent 8px grid

## Features Implemented

✅ Weighted probability calculation
✅ Slot machine animation with Framer Motion
✅ Dice rolling RNG system
✅ Commitment timers (task & leisure)
✅ Coins system (earn/spend)
✅ Pity system (4-streak guarantee)
✅ Activity pity filtering
✅ Task/Leisure CRUD management
✅ Custom emoji personalization
✅ Dark mode toggle
✅ Priority levels (Low/Medium/High)
✅ Responsive UI with Tailwind CSS
✅ TypeScript type safety
✅ State management with Zustand
✅ Supabase authentication (setup)
✅ Probability visualizer

## Future Enhancements

- [ ] Persistent database storage with Supabase
- [ ] User profiles & login
- [ ] Statistics dashboard (win rates, patterns)
- [ ] Customizable timer durations
- [ ] Activity history/log
- [ ] Multiplayer mode
- [ ] Seasonal rewards
- [ ] Achievements/badges
- [ ] Export activities to calendar
- [ ] Mobile app (React Native)

## Made by

Doos
