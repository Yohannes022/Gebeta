import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, User } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      phone: "",
      verificationId: "",
      
      setPhone: (phone: string) => set({ phone }),
      
      setVerificationId: (id: string) => set({ verificationId: id }),
      
      login: (user: User) => set({ 
        user, 
        isAuthenticated: true,
        isLoading: false,
        error: null 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false,
        error: null,
        phone: "",
        verificationId: ""
      }),
      
      saveExperience: (experienceId: string) => {
        const { user } = get();
        if (!user) return;
        
        const updatedSavedExperiences = [...user.savedExperiences, experienceId];
        
        set({
          user: {
            ...user,
            savedExperiences: updatedSavedExperiences
          }
        });
      },
      
      unsaveExperience: (experienceId: string) => {
        const { user } = get();
        if (!user) return;
        
        const updatedSavedExperiences = user.savedExperiences.filter(
          id => id !== experienceId
        );
        
        set({
          user: {
            ...user,
            savedExperiences: updatedSavedExperiences
          }
        });
      },
      
      addBooking: (bookingId: string) => {
        const { user } = get();
        if (!user) return;
        
        const updatedBookings = [...user.bookings, bookingId];
        
        set({
          user: {
            ...user,
            bookings: updatedBookings
          }
        });
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);