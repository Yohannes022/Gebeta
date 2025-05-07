/**
 * tRPC procedure for verifying phone number with OTP
 */

import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const verifySchema = z.object({
  userId: z.string(),
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
});

export const verifyProcedure = publicProcedure
  .input(verifySchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // In a real app, this would verify the code against what was sent
      // For demo purposes, we'll just assume the code is correct
      
      // Generate a mock user
      const user = {
        id: input.userId,
        name: "Demo User",
        phone: "+251912345678",
        email: "user@example.com",
        role: input.userId.includes("restaurant") ? "restaurant_owner" : "customer",
        createdAt: new Date().toISOString(),
      };
      
      // Generate a mock token
      const token = `token-${Date.now()}`;
      
      return {
        success: true,
        message: "Phone number verified successfully",
        user,
        token,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to verify phone number",
        cause: error,
      });
    }
  });