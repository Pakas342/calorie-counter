"use server"

import { revalidatePath } from "next/cache"
import { upsertWeight } from "@/lib/services/weight"

export async function upsertWeightAction(date: string, weight: number) {
  await upsertWeight(date, weight)
  revalidatePath("/")
}
