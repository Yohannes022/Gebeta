/**
 * tRPC procedure for user registration
 * Handles both customer and restaurant owner registration
 */

import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/trpc";
import { TRPCError } from "@trpc/server";

// Schema for customer registration
const customerRegistrationSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  role: z.literal("customer"),
});

// Schema for restaurant owner registration
const restaurantRegistrationSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  role: z.literal("restaurant_owner"),
  restaurant: z.object({
    name: z.string().min(2, "Restaurant name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    cuisineType: z.array(z.string()).min(1, "At least one cuisine type is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    email: z.string().email("Invalid email address").optional(),
    openingHours: z.object({
      open: z.string(),
      close: z.string(),
    }),
  }),
});

// Combined schema for both types of registration
const registrationSchema = z.discriminatedUnion("role", [
  customerRegistrationSchema,
  restaurantRegistrationSchema,
]);

export const registerProcedure = publicProcedure
  .input(registrationSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // In a real app, this would create a user in the database
      // and send a verification code to the phone number
      
      // Generate a random verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // For demo purposes, we'll just return the verification code
      // In a real app, this would be sent via SMS and not returned in the response
      
      if (input.role === "customer") {
        // Handle customer registration
        return {
          success: true,
          message: "Verification code sent to your phone",
          verificationCode,
          userId: `user-${Date.now()}`,
          role: "customer",
        };
      } else {
        // Handle restaurant owner registration
        // In a real app, this might require admin approval
        return {
          success: true,
          message: "Restaurant registration submitted for review",
          verificationCode,
          userId: `user-${Date.now()}`,
          role: "restaurant_owner",
          restaurantId: `restaurant-${Date.now()}`,
        };
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to register user",
        cause: error,
      });
    }
  });