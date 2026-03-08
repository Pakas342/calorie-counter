"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatInput({ date }: { date: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || isPending) return;

    startTransition(async () => {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, date }),
      });
      setMessage("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What did you eat?"
        disabled={isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={isPending || !message.trim()}>
        {isPending ? "Logging..." : "Log"}
      </Button>
    </form>
  );
}
