/**
 * tRPC procedure for getting order details
 */

import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/trpc";
import { TRPCError } from "@trpc/server";

const orderDetailSchema = z.object({
  id: z.string(),
});

export const orderDetailProcedure = protectedProcedure
  .input(orderDetailSchema)
  .query(async ({ input, ctx }) => {
    try {
      // In a real app, this would query the database
      // For demo purposes, we'll return a mock order
      
      // Check if the order ID is valid (simple check for demo)
      if (!input.id.startsWith("order-")) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      
      // Generate a mock order
      const mockOrder = {
        id: input.id,
        userId: ctx.user.id,
        restaurantId: "restaurant-1",
        restaurant: {
          id: "restaurant-1",
          name: "Habesha Restaurant",
          imageUrl: