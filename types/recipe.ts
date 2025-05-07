// import { Ingredient, Step } from "@/types/recipe";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  steps: Step[];
  region?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  rating: number;
  ratingCount: number;
  comments: Comment[];
};

export type Ingredient = {
  id: string;
  name: string;
  amount: string;
  unit: string;
};

export type Step = {
  id: string;
  description: string;
  imageUrl?: string;
};

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  recipeId: string; 
};
