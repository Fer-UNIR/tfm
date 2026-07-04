// Tipos de dominio y respuesta REST para recetas generadas en Fase 5.
export const MEAL_TYPES = ['desayuno', 'almuerzo', 'cena', 'colacion', 'cualquiera'] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export interface RecipeIngredient {
  name: string;
  quantity: string;
}

export interface GeneratedRecipe {
  title: string;
  mealType: MealType;
  servings: number;
  preparationTimeMinutes: number;
  ingredientsUsed: RecipeIngredient[];
  optionalIngredients: string[];
  missingIngredients: string[];
  steps: string[];
  notes: string;
}

interface MetaWithTimestamp {
  timestamp: string;
}

export interface GeneratedRecipeResponse {
  data: GeneratedRecipe;
  meta: MetaWithTimestamp;
}
