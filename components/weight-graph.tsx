import type { WeightLog } from "@/lib/types";

export function WeightGraph({ logs }: { logs: WeightLog[] }) {
  if (logs.length < 2) {
    return (
      <p className="text-xs text-muted-foreground">
        Log more weight entries to see the graph.
      </p>
    );
  }

  const weights = logs.map((l) => Number(l.weight));
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;
  const W = 400;
  const H = 80;
  const pad = 6;

  const points = logs
    .map((_, i) => {
      const x = pad + (i / (logs.length - 1)) * (W - 2 * pad);
      const y = H - pad - ((weights[i] - min) / range) * (H - 2 * pad);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-20 text-foreground"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
