/**
 * tRPC procedure for creating an order
 */

import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/trpc";
import { TRPCError } from "@trpc/server";

const createOrderSchema = z.object({
  restaurantId: z.string(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
      selectedOptions: z
        .array(
          z.object({
            optionId: z.string(),
            choiceIds: z.array(z.string()),
          })
        )
        .optional(),
      specialInstructions: z.string().optional(),
    })
  ),
  deliveryAddress: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  paymentMethod: z.enum(["credit_card", "debit_card", "cash", "mobile_money"]),
  deliveryInstructions: z.string().optional(),
  tip: z.number().optional(),
});

export const createOrderProcedure = protectedProcedure
  .input(createOrderSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // In a real app, this would create an order in the database
      // For demo purposes, we'll just return a mock order
      
      // Generate a mock order ID
      const orderId = `order-${Date.now()}`;
      
      // Calculate order totals
      const subtotal = 500; // Mock value
      const deliveryFee = 50;
      const tax = Math.round(subtotal * 0.1);
      const tip = input.tip || 0;
      const total = subtotal + deliveryFee + tax + tip;
      
      return {
        success: true,
        message: "Order created successfully",
        order: {
          id: orderId,
          userId: ctx.user.id,
          restaurantId: input.restaurantId,
          items: input.items,
          status: "pending",
          subtotal,
          deliveryFee,
          tax,
          tip,
          total,
          paymentMethod: input.paymentMethod,
          paymentStatus: "completed", // For demo purposes
          deliveryAddress: input.deliveryAddress,
          deliveryInstructions: input.deliveryInstructions,
          estimatedDeliveryTime: 45, // Default estimate
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create order",
        cause: error,
      });
    }
  });