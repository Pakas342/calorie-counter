"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleCardioAction } from "@/app/actions/cardio";

export function CardioToggle({
  date,
  initialChecked,
}: {
  date: string;
  initialChecked: boolean;
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    const next = !checked;
    setChecked(next);
    startTransition(async () => {
      await toggleCardioAction(date, next);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`text-sm px-3 py-1 rounded-full border transition-colors ${
        checked
          ? "bg-foreground text-background border-foreground"
          : "border-foreground/20 text-muted-foreground"
      }`}
    >
      Cardio {checked ? "· +300 kcal" : "· off"}
    </button>
  );
}
