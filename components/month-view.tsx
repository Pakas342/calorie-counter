import type { DayResult } from "@/lib/types";

export function MonthView({
  data,
  year,
  month,
}: {
  data: DayResult[];
  year: number;
  month: number;
}) {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const startOffset = (firstDow + 6) % 7; // Mon=0 … Sun=6

  const cells: (DayResult | null)[] = [
    ...Array(startOffset).fill(null),
    ...data,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (DayResult | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="text-xs">
      <div className="grid grid-cols-7 text-muted-foreground mb-1">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            const symbol = !day
              ? ""
              : !day.has_data
                ? "·"
                : day.on_track
                  ? "✓"
                  : "✗";
            const color =
              !day || !day.has_data
                ? "text-muted-foreground"
                : day.on_track
                  ? "text-green-500"
                  : "text-red-500";
            return (
              <div
                key={di}
                className={`text-center py-0.5 ${color}`}
                title={day?.day ?? undefined}
              >
                {symbol}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
