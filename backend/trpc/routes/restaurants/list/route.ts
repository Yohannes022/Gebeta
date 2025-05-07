/**
 * tRPC procedure for listing restaurants
 */

import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { restaurants } from "@/mocks/restaurants";

const listRestaurantsSchema = z.object({
  search: z.string().optional(),
  cuisineType: z.string().optional(),
  priceRange: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  maxDistance: z.number().optional(),
});

export const listRestaurantsProcedure = publicProcedure
  .input(listRestaurantsSchema)
  .query(async ({ input, ctx }) => {
    try {
      // In a real app, this would query the database
      // For demo purposes, we'll use the mock data
      
      let filteredRestaurants = [...restaurants];
      
      // Apply search filter
      if (input.search) {
        const searchLower = input.search.toLowerCase();
        filteredRestaurants = filteredRestaurants.filter(
          (restaurant) =>
            restaurant.name.toLowerCase().includes(searchLower) ||
            restaurant.description.toLowerCase().includes(searchLower) ||
            restaurant.cuisineType.some((cuisine) => cuisine.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply cuisine type filter
      if (input.cuisineType) {
        filteredRestaurants = filteredRestaurants.filter((restaurant) =>
          restaurant.cuisineType.includes(input.cuisineType!)
        );
      }
      
      // Apply price range filter
      if (input.priceRange) {
        filteredRestaurants = filteredRestaurants.filter(
          (restaurant) => restaurant.priceRange === input.priceRange
        );
      }
      
      // Apply location filter if coordinates are provided
      if (input.latitude && input.longitude) {
        // Calculate distance using Haversine formula
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // Earth's radius in km
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };
        
        const maxDistance = input.maxDistance || 10; // Default to 10km
        
        filteredRestaurants = filteredRestaurants
          .filter((restaurant) => {
            if (!restaurant.location) return false;
            
            const distance = calculateDistance(
              input.latitude!,
              input.longitude!,
              restaurant.location.latitude,
              restaurant.location.longitude
            );
            
            return distance <= maxDistance;
          })
          .map((restaurant) => {
            const distance = calculateDistance(
              input.latitude!,
              input.longitude!,
              restaurant.location.latitude,
              restaurant.location.longitude
            );
            
            return {
              ...restaurant,
              distance: parseFloat(distance.toFixed(1)),
            };
          })
          .sort((a, b) => a.distance - b.distance);
      }
      
      return {
        restaurants: filteredRestaurants,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch restaurants",
        cause: error,
      });
    }
  });