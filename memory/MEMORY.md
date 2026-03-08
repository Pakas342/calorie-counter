# Cals Counter — Project Memory

## What it is
Personal calorie/protein tracker. Single user (the developer). No multi-user concern.
Single-page app — everything on one page, no navigation.

## Stack
- Next.js App Router + TypeScript
- Supabase (auth + DB) — publishable key only, no service role key needed
- Tailwind + shadcn/ui
- Anthropic SDK (Haiku 4.5) for food parsing

## DB Schema
Four tables: `goals`, `food_logs`, `weight_logs`, `cardio_logs`
One view: `daily_summary`
Two RPC functions: `get_month_summary(year, month)`, `get_weight_stats()`

### Key design decisions
- Goals have `starts_at` date — active goal for any day = latest goal where starts_at <= that day
- Cardio = presence of row in cardio_logs for that date (insert/delete to toggle)
- Weight: unique per day, upsert on conflict
- Cardio adds 300 kcal to daily goal

## File Structure
```
lib/
  types.ts                  — all shared types
  services/
    goals.ts                — getCurrentGoal, setGoal
    food.ts                 — getFoodLogsForDay, getDailySummary, addFoodLog, deleteFoodLog
    weight.ts               — getWeightLogs, getWeightStats, upsertWeight
    cardio.ts               — getCardioForDay, enableCardio, disableCardio
    month.ts                — getMonthSummary
app/
  actions/
    goals.ts                — setGoalAction
    food.ts                 — addFoodLogAction, deleteFoodLogAction
    weight.ts               — upsertWeightAction
    cardio.ts               — toggleCardioAction
  api/
    chat/route.ts           — POST: parses food message via Haiku, inserts food_logs
  protected/
    page.tsx                — main single-page dashboard (to build)
```

## AI Food Parsing
- Route: POST /api/chat
- Body: { message: string, date: string }
- Uses tool_choice forced to "log_food" tool — always returns structured { entries: [{description, calories, protein}] }
- Saves all entries, returns saved rows
- Model: claude-haiku-4-5-20251001

## Auth
- Supabase SSR auth via cookies
- Middleware in proxy.ts redirects unauthenticated users to /auth/login
- Protected routes live under /app/protected/

## Patterns
- Server Components import services directly (no hooks for reads)
- Server Actions call services for mutations + revalidatePath("/")
- Client Components use Server Actions for mutations
- No API routes except /api/chat (AI)
