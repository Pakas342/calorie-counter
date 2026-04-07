import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { addFoodLog } from "@/lib/services/food";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FOOD_LOG_TOOL: Anthropic.Tool = {
  name: "log_food",
  description:
    "Log one or more food items with estimated calories and protein. Use standard nutritional data for estimates. When uncertain, lean toward realistic average portions.",
  input_schema: {
    type: "object" as const,
    properties: {
      entries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "Short, clean description of the food item",
            },
            calories: {
              type: "integer",
              description: "Estimated calories (kcal)",
            },
            protein: {
              type: "integer",
              description: "Estimated protein in grams",
            },
          },
          required: ["description", "calories", "protein"],
        },
      },
    },
    required: ["entries"],
  },
};

type FoodEntry = {
  description: string;
  calories: number;
  protein: number;
};

export async function POST(request: NextRequest) {
  const { message, date } = await request.json();

  if (!message || !date) {
    return NextResponse.json(
      { error: "message and date are required" },
      { status: 400 },
    );
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system:
      "You are a nutrition tracker. The user (Australia/SYD) will describe what they ate. Parse each distinct food item and estimate its calories (Kcal) and protein (grams). Be practical — use realistic portion sizes if not specified. If in doubt about soemthing, assume more calories",
    tools: [FOOD_LOG_TOOL],
    tool_choice: { type: "tool", name: "log_food" },
    messages: [{ role: "user", content: message }],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    return NextResponse.json(
      { error: "Unexpected response from AI" },
      { status: 500 },
    );
  }

  const { entries } = toolUse.input as { entries: FoodEntry[] };

  const saved = await Promise.all(
    entries.map((entry) =>
      addFoodLog({
        logged_at: date,
        description: entry.description,
        calories: entry.calories,
        protein: entry.protein,
      }),
    ),
  );

  return NextResponse.json({ entries: saved });
}
