"use server"

import { revalidatePath } from "next/cache"
import { addFoodLog, deleteFoodLog } from "@/lib/services/food"

export async function addFoodLogAction(entry: {
  logged_at: string
  description: string
  calories: number
  protein: number
}) {
  await addFoodLog(entry)
  revalidatePath("/")
}

export async function deleteFoodLogAction(id: string) {
  await deleteFoodLog(id)
  revalidatePath("/")
}
