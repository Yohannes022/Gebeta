/**
 * tRPC procedure for user login
 */

import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const loginProcedure = publicProcedure
  .input(loginSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // In a real app, this would check if the user exists
      // and send a verification code to the phone number
      
      // Generate a random verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // For demo purposes, we'll just return the verification code
      // In a real app, this would be sent via SMS and not returned in the response
      
      return {
        success: true,
        message: "Verification code sent to your phone",
        verificationCode,
        userId: `user-${Date.now()}`,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send verification code",
        cause: error,
      });
    }
  });