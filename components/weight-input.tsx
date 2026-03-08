"use client";

import { useState, useTransition } from "react";
import { upsertWeightAction } from "@/app/actions/weight";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function WeightInput({
  date,
  currentWeight,
}: {
  date: string;
  currentWeight: number | null;
}) {
  const [weight, setWeight] = useState(
    currentWeight ? String(currentWeight) : ""
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(weight);
    if (isNaN(val) || val <= 0) return;

    startTransition(async () => {
      await upsertWeightAction(date, val);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <Input
        type="number"
        step="0.1"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="kg"
        disabled={isPending}
        className="w-24"
      />
      <Button type="submit" disabled={isPending || !weight} variant="outline" size="sm">
        {saved ? "Saved!" : isPending ? "..." : currentWeight ? "Update" : "Log"}
      </Button>
    </form>
  );
}
