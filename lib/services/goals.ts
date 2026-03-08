import { createClient } from "@/lib/supabase/server"
import type { Goal } from "@/lib/types"

export async function getCurrentGoal(): Promise<Goal | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .lte("starts_at", new Date().toISOString().split("T")[0])
    .order("starts_at", { ascending: false })
    .limit(1)
    .single()

  if (error) return null
  return data
}

export async function setGoal(calGoal: number, protGoal: number): Promise<Goal> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: user!.id,
      cal_goal: calGoal,
      prot_goal: protGoal,
      starts_at: new Date().toISOString().split("T")[0],
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
