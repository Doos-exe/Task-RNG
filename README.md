# Fate-Tasker MVP

A productivity web app that combines a Notion-style task manager with a weighted slot machine. Instead of choosing your next activity, you **spin for destiny** — the probability dynamically scales based on your task load.

## Core Features

### 🎰 Weighted Slot Machine
- **Static Categories**: Sleep (10), Play (10), Eat (10)
- **Dynamic Category**: Work weight = (Number of Pending Tasks) × 5
- Visual spinning animation with Framer Motion
- When "Work" is selected, a random pending task is chosen

### ⏱️ Commitment Timer
- 60-minute countdown after each spin
- Prevents re-spinning until timer expires
- Visual progress indicator

### 📊 Probability Visualizer
- Real-time display of Work vs Leisure chances
- Updates dynamically as tasks are added/completed
- Shows pending task count

### ✅ Task Management
- Notion-style minimalist interface
- Full CRUD functionality
- Task priority levels (low, medium, high)
- Mark tasks as complete/incomplete
- Pending task counter

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page (home)
│   └── globals.css         # Global Tailwind styles
├── components/
│   ├── SlotMachine.tsx     # Slot machine with animation
│   ├── CommitmentTimer.tsx # 60-min countdown timer
│   ├── ProbabilityVisualizer.tsx # Work/Leisure ratio display
│   └── TaskList.tsx        # Task CRUD interface
├── lib/
│   ├── probability.ts      # Weighted probability logic
│   └── store.ts            # Zustand task store
├── tailwind.config.ts      # Tailwind customization
├── tsconfig.json
├── package.json
└── next.config.ts
```

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Language**: TypeScript

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

### Probability Calculation

The weighted probability system is the heart of Fate-Tasker:

```
Weight Distribution:
- Sleep: 10
- Play: 10
- Eat: 10
- Work: (pendingTasks × 5)

Total Weight = 10 + 10 + 10 + (pendingTasks × 5)

Example:
- With 0 tasks: Work 0%, Leisure 100%
- With 2 tasks: Work 50%, Sleep/Play/Eat 16.67% each
- With 4 tasks: Work 66.67%, Sleep/Play/Eat 11.11% each
```

### Spin Mechanics

1. User clicks "Spin for Destiny"
2. Slot machine animates for 3 seconds
3. Weighted probability selects a category
4. If "Work" is selected, a random pending task is chosen
5. Result is displayed
6. 60-minute commitment timer starts
7. User cannot spin again until timer expires

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

✅ Weighted probability logic
✅ Slot machine animation
✅ Commitment timer
✅ Probability visualizer
✅ Task CRUD
✅ Notion-style UI
✅ Framer Motion animations
✅ TypeScript support
✅ Tailwind CSS styling
✅ State management with Zustand

## Future Enhancements

- [ ] Persistent storage with Supabase
- [ ] User authentication
- [ ] Statistics dashboard
- [ ] Custom category weights
- [ ] Integration with calendar apps
- [ ] Notification system
- [ ] Dark mode toggle
- [ ] Export/import tasks
- [ ] Collaborative mode
- [ ] Mobile app (React Native)

## License

MIT
