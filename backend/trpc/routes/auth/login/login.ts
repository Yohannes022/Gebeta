import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Define the login input schema
const loginInputSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  userType: z.enum(["user", "restaurant"]),
});

// Define the OTP verification schema
const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  userType: z.enum(["user", "restaurant"]),
});

// Login procedure
export const loginProcedure = publicProcedure
  .input(loginInputSchema)
  .mutation(async ({ input }) => {
    // In a real app, this would:
    // 1. Validate the phone number
    // 2. Generate an OTP
    // 3. Send the OTP via SMS
    // 4. Store the OTP in a temporary storage with expiration

    // For demo purposes, we'll just return success
    return {
      success: true,
      message: "OTP sent successfully",
    };
  });

// Verify OTP procedure
export const verifyOtpProcedure = publicProcedure
  .input(verifyOtpSchema)
  .mutation(async ({ input }) => {
    // In a real app, this would:
    // 1. Validate the OTP against the stored OTP
    // 2. Check if the OTP is expired
    // 3. If valid, create or fetch the user
    // 4. Generate JWT tokens
    // 5. Return user data and tokens

    // For demo purposes, we'll just return a mock user
    const isRestaurantOwner = input.userType === "restaurant";
    
    return {
      success: true,
      user: {
        id: isRestaurantOwner ? "rest-123" : "user-123",
        name: isRestaurantOwner ? "Restaurant Owner" : "Regular User",
        phone: input.phone,
        email: isRestaurantOwner ? "restaurant@example.com" : "user@example.com",
        role: isRestaurantOwner ? "restaurant" : "user",
        restaurantId: isRestaurantOwner ? "rest-1" : null,
      },
      token: "mock-jwt-token",
    };
  });