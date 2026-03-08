import { createClient } from "@/lib/supabase/server"
import type { WeightLog, WeightStats } from "@/lib/types"

export async function getWeightLogs(limitDays = 90): Promise<WeightLog[]> {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - limitDays)

  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .gte("logged_at", since.toISOString().split("T")[0])
    .order("logged_at", { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getWeightStats(): Promise<WeightStats> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_weight_stats")

  if (error) throw new Error(error.message)

  // rpc returns an array, we only expect one row
  const row = data?.[0]
  return {
    latest_weight: row?.latest_weight ?? null,
    latest_date: row?.latest_date ?? null,
    avg_last_7_days: row?.avg_last_7_days ?? null,
  }
}

export async function upsertWeight(date: string, weight: number): Promise<WeightLog> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("weight_logs")
    .upsert(
      { user_id: user!.id, logged_at: date, weight },
      { onConflict: "user_id,logged_at" }
    )
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
