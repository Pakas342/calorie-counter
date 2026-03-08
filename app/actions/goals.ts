"use server"

import { revalidatePath } from "next/cache"
import { setGoal } from "@/lib/services/goals"

export async function setGoalAction(calGoal: number, protGoal: number) {
  await setGoal(calGoal, protGoal)
  revalidatePath("/")
}
