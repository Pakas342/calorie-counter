"use server"

import { revalidatePath } from "next/cache"
import { enableCardio, disableCardio } from "@/lib/services/cardio"

export async function toggleCardioAction(date: string, enabled: boolean) {
  if (enabled) {
    await enableCardio(date)
  } else {
    await disableCardio(date)
  }
  revalidatePath("/")
}
