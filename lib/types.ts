export type Goal = {
  id: string
  user_id: string
  cal_goal: number
  prot_goal: number
  starts_at: string
  created_at: string
}

export type FoodLog = {
  id: string
  user_id: string
  logged_at: string
  description: string | null
  calories: number
  protein: number
  created_at: string
}

export type WeightLog = {
  id: string
  user_id: string
  logged_at: string
  weight: number
  created_at: string
}

export type CardioLog = {
  id: string
  user_id: string
  date: string
  created_at: string
}

export type DailySummary = {
  user_id: string
  logged_at: string
  total_cals: number
  total_protein: number
  cal_goal: number
  prot_goal: number
  did_cardio: boolean
  effective_cal_goal: number
}

export type DayResult = {
  day: string
  total_cals: number
  total_protein: number
  effective_goal: number
  prot_goal: number
  did_cardio: boolean
  has_data: boolean
  on_track: boolean
}

export type WeightStats = {
  latest_weight: number | null
  latest_date: string | null
  avg_last_7_days: number | null
}
