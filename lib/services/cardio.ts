import { createClient } from "@/lib/supabase/server"

export async function getCardioForDay(date: string): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("cardio_logs")
    .select("id")
    .eq("date", date)
    .single()

  return !!data
}

export async function enableCardio(date: string): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from("cardio_logs")
    .upsert(
      { user_id: user!.id, date },
      { onConflict: "user_id,date" }
    )

  if (error) throw new Error(error.message)
}

export async function disableCardio(date: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("cardio_logs")
    .delete()
    .eq("date", date)

  if (error) throw new Error(error.message)
}
