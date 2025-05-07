/**
 * Recipe detail API route
 * Handles fetching detailed recipe information by ID
 * Includes recipe data, ingredients, instructions, and related metadata
 */

import { protectedProcedure, publicProcedure } from "../../../create-context";
import { z } from "zod";
import { mockRecipes } from "@/mocks/recipes";

/**
 * Get recipe details by ID
 * Public procedure that returns recipe information
 * Includes error handling for recipe not found
 */
export const getRecipeDetailProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      // In a real app, this would fetch from a database
      const recipe = mockRecipes.find((recipe) => recipe.id === input.id);
      
      if (!recipe) {
        throw new Error("Recipe not found");
      }
      
      return {
        success: true,
        recipe,
      };
    } catch (error) {
      console.error("Error fetching recipe detail:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch recipe",
      };
    }
  });

/**
 * Update recipe views count
 * Protected procedure that increments the view count for a recipe
 * Requires authentication to prevent view count manipulation
 */
export const updateRecipeViewsProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // In a real app, this would update a database record
      // For mock purposes, we'll just return success
      
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error updating recipe views:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update views",
      };
    }
  });

/**
 * Add recipe rating
 * Protected procedure that allows users to rate recipes
 * Validates rating value and prevents duplicate ratings
 */
export const addRecipeRatingProcedure = protectedProcedure
  .input(
    z.object({
      recipeId: z.string(),
      rating: z.number().min(1).max(5),
      review: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    try {
      // In a real app, this would add a rating to the database
      // For mock purposes, we'll just return success
      
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error adding recipe rating:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add rating",
      };
    }
  });