# Prometheus - Life Gamification SaaS

Prometheus is a Next.js 14 application designed to gamify your life journey. Track your skills, complete quests, earn badges, and level up in real life.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Charts:** Nivo
- **Graph:** React Flow
- **Authentication:** Clerk

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env.local` file and add your Clerk keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Project Structure

- `/app`: Next.js App Router pages and layout
- `/components`: Reusable UI components
- `/lib`: Utility functions and static data
- `/store`: Global state management (Zustand)
- `/types`: TypeScript interfaces

## Features

- **Dashboard:** Overview of progress, current quest, and recent badges.
- **Quests:** Quest board with available, locked, and completed quests.
- **Badges:** Collection of achievements with rarity and unlock conditions.
- **Skill Tree:** Interactive graph of your skill progression.
- **Stats:** Detailed analytics of your attributes and XP history.
- **Profile:** User profile management.

## License

MIT
