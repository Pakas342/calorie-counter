import type { FoodLog } from "@/lib/types";
import { DeleteFoodButton } from "./delete-food-button";

export function FoodLogList({ items }: { items: FoodLog[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No food logged today.</p>
    );
  }

  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex justify-between items-center text-sm py-1.5 border-b border-border/40 last:border-0"
        >
          <span className="text-muted-foreground">{item.description}</span>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <span>{item.calories} kcal</span>
            <span className="text-muted-foreground w-10 text-right">
              {item.protein}g
            </span>
            <DeleteFoodButton id={item.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}
