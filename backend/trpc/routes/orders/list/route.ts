/**
 * tRPC procedure for listing user orders
 */

import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/trpc";
import { TRPCError } from "@trpc/server";

const listOrdersSchema = z.object({
  status: z.enum([
    "all",
    "pending",
    "confirmed",
    "preparing",
    "ready_for_pickup",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]).optional().default("all"),
});

export const listOrdersProcedure = protectedProcedure
  .input(listOrdersSchema)
  .query(async ({ input, ctx }) => {
    try {
      // In a real app, this would query the database
      // For demo purposes, we'll return mock orders
      
      // Generate mock orders
      const mockOrders = [
        {
          id: "order-1",
          userId: ctx.user.id,
          restaurantId: "restaurant-1",
          items: [
            {
              menuItemId: "menu-item-1",
              name: "Doro Wat",
              quantity: 2,
              price: 150,
              totalPrice: 300,
            },
            {
              menuItemId: "menu-item-2",
              name: "Injera",
              quantity: 4,
              price: 20,
              totalPrice: 80,
            },
          ],
          status: "delivered",
          subtotal: 380,
          deliveryFee: 50,
          tax: 38,
          tip: 0,
          total: 468,
          paymentMethod: "cash",
          paymentStatus: "completed",
          deliveryAddress: {
            latitude: 9.0222,
            longitude: 38.7468,
            address: "Bole, Addis Ababa",
          },
          estimatedDeliveryTime: 45,
          actualDeliveryTime: 40,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 84600000).toISOString(),
        },
        {
          id: "order-2",
          userId: ctx.user.id,
          restaurantId: "restaurant-2",
          items: [
            {
              menuItemId: "menu-item-3",
              name: "Kitfo",
              quantity: 1,
              price: 200,
              totalPrice: 200,
            },
            {
              menuItemId: "menu-item-4",
              name: "Special Tibs",
              quantity: 1,
              price: 180,
              totalPrice: 180,
            },
          ],
          status: "out_for_delivery",
          subtotal: 380,
          deliveryFee: 50,
          tax: 38,
          tip: 20,
          total: 488,
          paymentMethod: "credit_card",
          paymentStatus: "completed",
          deliveryAddress: {
            latitude: 9.0222,
            longitude: 38.7468,
            address: "Bole, Addis Ababa",
          },
          deliveryPersonId: "delivery-person-1",
          deliveryPersonLocation: {
            latitude: 9.0200,
            longitude: 38.7450,
          },
          estimatedDeliveryTime: 35,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          updatedAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ];
      
      // Filter by status if specified
      let filteredOrders = mockOrders;
      if (input.status !== "all") {
        filteredOrders = mockOrders.filter((order) => order.status === input.status);
      }
      
      return {
        orders: filteredOrders,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch orders",
        cause: error,
      });
    }
  });