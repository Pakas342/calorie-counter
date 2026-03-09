import { Suspense } from "react";
import { connection } from "next/server";
import { getDailySummary, getFoodLogsForDay } from "@/lib/services/food";
import { getWeightStats, getWeightLogs } from "@/lib/services/weight";
import { getMonthSummary } from "@/lib/services/month";
import { getCurrentGoal } from "@/lib/services/goals";
import { getCardioForDay } from "@/lib/services/cardio";
import { CardioToggle } from "@/components/cardio-toggle";
import { ChatInput } from "@/components/chat-input";
import { FoodLogList } from "@/components/food-log-list";
import { WeightInput } from "@/components/weight-input";
import { WeightGraph } from "@/components/weight-graph";
import { MonthView } from "@/components/month-view";
import { GoalSettings } from "@/components/goal-settings";

export default function ProtectedPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await connection();
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [summary, foodLogs, weightStats, weightLogs, monthData, currentGoal, didCardio] =
    await Promise.all([
      getDailySummary(today),
      getFoodLogsForDay(today),
      getWeightStats(),
      getWeightLogs(90),
      getMonthSummary(year, month),
      getCurrentGoal(),
      getCardioForDay(today),
    ]);

  const totalCals = summary?.total_cals ?? 0;
  const totalProt = summary?.total_protein ?? 0;
  const calGoal =
    summary?.effective_cal_goal ??
    (currentGoal?.cal_goal ?? 0) + (didCardio ? 300 : 0);
  const protGoal = summary?.prot_goal ?? currentGoal?.prot_goal ?? 0;

  const todayWeight =
    weightStats.latest_date === today ? weightStats.latest_weight : null;

  const dateLabel = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">{dateLabel}</h1>
        <CardioToggle date={today} initialChecked={didCardio} />
      </div>

      {/* Daily stats */}
      <div className="flex flex-col gap-3">
        <StatBar label="Calories" value={totalCals} goal={calGoal} unit="kcal" />
        <StatBar label="Protein" value={totalProt} goal={protGoal} unit="g" />
      </div>

      {/* Chat input */}
      <ChatInput date={today} />

      {/* Today's food log */}
      <FoodLogList items={foodLogs} />

      {/* Weight + Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">Weight</h2>
          <WeightInput date={today} currentWeight={todayWeight} />
          {weightStats.avg_last_7_days && (
            <p className="text-sm text-muted-foreground">
              7-day avg:{" "}
              <span className="font-medium text-foreground">
                {weightStats.avg_last_7_days} kg
              </span>
            </p>
          )}
          <WeightGraph logs={weightLogs} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">
            {now.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </h2>
          <MonthView data={monthData} year={year} month={month} />
        </div>
      </div>

      {/* Goal settings */}
      <div className="border-t pt-6">
        <GoalSettings
          currentCalGoal={currentGoal?.cal_goal ?? 0}
          currentProtGoal={currentGoal?.prot_goal ?? 0}
        />
      </div>
    </div>
  );
}

function StatBar({
  label,
  value,
  goal,
  unit,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
}) {
  const pct = goal > 0 ? Math.min(Math.round((value / goal) * 100), 100) : 0;
  const over = goal > 0 && value > goal;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className={over ? "text-red-500 font-medium" : ""}>
          {value} / {goal} {unit}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${over ? "bg-red-500" : "bg-foreground"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
