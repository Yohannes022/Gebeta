import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { currentUser } from "@/mocks/users";

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  updateProfile: (data: Partial<{ name: string; email: string; phone: string; avatar: string }>) => Promise<void>;
  generateOtp: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      phoneNumber: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll just set the current user
          set({
            user: currentUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "Invalid email or password",
            isLoading: false,
          });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      
      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll create a new user based on the input
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          };
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "Registration failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },
      
      sendOtp: async (phone) => {
        set({ isLoading: true, error: null, phoneNumber: phone });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would send an OTP to the user's phone
          set({ isLoading: false });
        } catch (error) {
          set({
            error: "Failed to send verification code. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },
      
      verifyOtp: async (otp) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll just set the current user
          set({
            user: currentUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "Invalid verification code. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },
      
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          
          if (!user) {
            throw new Error("User not found");
          }
          
          const updatedUser = {
            ...user,
            ...data,
          };
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: "Failed to update profile. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      generateOtp: () => {
        // Generate a random 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
