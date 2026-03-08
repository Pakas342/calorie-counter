import { createClient } from "@/lib/supabase/server"
import type { DailySummary, FoodLog } from "@/lib/types"

export async function getFoodLogsForDay(date: string): Promise<FoodLog[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("logged_at", date)
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getDailySummary(date: string): Promise<DailySummary | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("daily_summary")
    .select("*")
    .eq("logged_at", date)
    .single()

  if (error) return null
  return data
}

export async function addFoodLog(entry: {
  logged_at: string
  description: string
  calories: number
  protein: number
}): Promise<FoodLog> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("food_logs")
    .insert({ ...entry, user_id: user!.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteFoodLog(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("food_logs")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}
