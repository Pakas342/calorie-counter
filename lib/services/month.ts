import { createClient } from "@/lib/supabase/server"
import type { DayResult } from "@/lib/types"

export async function getMonthSummary(year: number, month: number): Promise<DayResult[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_month_summary", {
    p_year: year,
    p_month: month,
  })

  if (error) throw new Error(error.message)
  return data ?? []
}
