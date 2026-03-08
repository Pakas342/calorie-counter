"use client";

import { useTransition } from "react";
import { deleteFoodLogAction } from "@/app/actions/food";
import { X } from "lucide-react";

export function DeleteFoodButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => deleteFoodLogAction(id))}
      disabled={isPending}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <X size={13} />
    </button>
  );
}
