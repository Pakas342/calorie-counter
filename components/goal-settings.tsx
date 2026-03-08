"use client";

import { useState, useTransition } from "react";
import { setGoalAction } from "@/app/actions/goals";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function GoalSettings({
  currentCalGoal,
  currentProtGoal,
}: {
  currentCalGoal: number;
  currentProtGoal: number;
}) {
  const [cals, setCals] = useState(String(currentCalGoal));
  const [prot, setProt] = useState(String(currentProtGoal));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const calVal = parseInt(cals);
    const protVal = parseInt(prot);
    if (isNaN(calVal) || isNaN(protVal)) return;

    startTransition(async () => {
      await setGoalAction(calVal, protVal);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">Goals</h2>
      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex flex-col gap-1">
          <Label htmlFor="cal-goal" className="text-xs text-muted-foreground">
            Calories (kcal)
          </Label>
          <Input
            id="cal-goal"
            type="number"
            value={cals}
            onChange={(e) => setCals(e.target.value)}
            className="w-28"
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="prot-goal" className="text-xs text-muted-foreground">
            Protein (g)
          </Label>
          <Input
            id="prot-goal"
            type="number"
            value={prot}
            onChange={(e) => setProt(e.target.value)}
            className="w-28"
            disabled={isPending}
          />
        </div>
        <Button type="submit" disabled={isPending} variant="outline" size="sm">
          {saved ? "Saved!" : isPending ? "Saving..." : "Save goals"}
        </Button>
      </div>
    </form>
  );
}
