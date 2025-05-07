/**
 * tRPC procedure for getting restaurant details
 */

import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { restaurants, menuItems, reviews } from "@/mocks/restaurants";

const restaurantDetailSchema = z.object({
  id: z.string(),
});

export const restaurantDetailProcedure = publicProcedure
  .input(restaurantDetailSchema)
  .query(async ({ input, ctx }) => {
    try {
      // In a real app, this would query the database
      // For demo purposes, we'll use the mock data
      
      const restaurant = restaurants.find((r) => r.id === input.id);
      
      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }
      
      // Get menu items for this restaurant
      const restaurantMenuItems = menuItems.filter(
        (item) => item.restaurantId === input.id
      );
      
      // Get reviews for this restaurant
      const restaurantReviews = reviews.filter(
        (review) => review.restaurantId === input.id
      );
      
      return {
        restaurant,
        menuItems: restaurantMenuItems,
        reviews: restaurantReviews,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch restaurant details",
        cause: error,
      });
    }
  });