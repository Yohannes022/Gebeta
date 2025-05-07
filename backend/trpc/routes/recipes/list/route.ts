/**
 * tRPC procedure for listing recipes
 */

import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const listRecipesSchema = z.object({
  limit: z.number().optional().default(10),
  cursor: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export const listRecipesProcedure = publicProcedure
  .input(listRecipesSchema)
  .query(async ({ input }) => {
    try {
      // Mock data for recipes
      const recipes = [
        {
          id: "1",
          title: "Doro Wat",
          description: "Ethiopian spicy chicken stew",
          image: "https://images.unsplash.com/photo-1567360425618-1594206637d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          ingredients: [
            "1 kg chicken",
            "2 onions",
            "4 tbsp berbere spice",
            "2 tbsp garlic paste",
            "1 tbsp ginger paste",
            "4 hard-boiled eggs",
            "1/2 cup oil",
            "Salt to taste"
          ],
          instructions: [
            "Sauté onions until golden brown",
            "Add berbere, garlic, and ginger and cook for 5 minutes",
            "Add chicken and cook until done",
            "Add hard-boiled eggs and simmer for 10 minutes"
          ],
          cookingTime: 60,
          servings: 4,
          difficulty: "Medium",
          category: "Main Dish",
          createdAt: new Date().toISOString(),
          createdBy: {
            id: "user1",
            name: "Abeba Tadesse"
          },
          likes: 120,
          comments: 24
        },
        {
          id: "2",
          title: "Injera",
          description: "Ethiopian sourdough flatbread",
          image: "https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          ingredients: [
            "3 cups teff flour",
            "4 cups water",
            "1/2 tsp salt",
            "1/4 tsp baking soda"
          ],
          instructions: [
            "Mix teff flour with water and let ferment for 3 days",
            "Add salt and baking soda",
            "Cook on a hot griddle until bubbles form and edges lift"
          ],
          cookingTime: 30,
          servings: 6,
          difficulty: "Hard",
          category: "Bread",
          createdAt: new Date().toISOString(),
          createdBy: {
            id: "user2",
            name: "Dawit Haile"
          },
          likes: 85,
          comments: 12
        },
        {
          id: "3",
          title: "Shiro",
          description: "Ethiopian chickpea stew",
          image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          ingredients: [
            "2 cups shiro powder",
            "1 onion",
            "4 cloves garlic",
            "2 tbsp oil",
            "4 cups water",
            "Salt to taste"
          ],
          instructions: [
            "Sauté onions and garlic in oil",
            "Add water and bring to a boil",
            "Slowly add shiro powder while stirring",
            "Simmer for 15 minutes until thick"
          ],
          cookingTime: 25,
          servings: 4,
          difficulty: "Easy",
          category: "Side Dish",
          createdAt: new Date().toISOString(),
          createdBy: {
            id: "user3",
            name: "Tigist Bekele"
          },
          likes: 65,
          comments: 8
        }
      ];

      // Filter by category if provided
      let filteredRecipes = recipes;
      if (input.category) {
        filteredRecipes = recipes.filter(recipe => 
          recipe.category.toLowerCase() === input.category?.toLowerCase()
        );
      }

      // Search by title or description if provided
      if (input.search) {
        const searchTerm = input.search.toLowerCase();
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.title.toLowerCase().includes(searchTerm) || 
          recipe.description.toLowerCase().includes(searchTerm)
        );
      }

      return {
        recipes: filteredRecipes,
        nextCursor: null, // In a real app, this would be the ID of the last item
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch recipes",
        cause: error,
      });
    }
  });