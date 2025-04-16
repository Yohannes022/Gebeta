import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookingsState, Booking } from "@/types";
import { useAuthStore } from "./auth-store";

// Mock bookings for demo
const initialBookings: Booking[] = [
  {
    id: "b1",
    experienceId: "1",
    userId: "u1",
    date: "2023-06-15",
    guests: 2,
    totalPrice: 70,
    status: "confirmed",
    createdAt: "2023-05-20T10:30:00Z",
  },
  {
    id: "b2",
    experienceId: "2",
    userId: "u1",
    date: "2023-05-10",
    guests: 1,
    totalPrice: 45,
    status: "completed",
    createdAt: "2023-04-15T14:20:00Z",
  },
];

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: initialBookings,
      loading: false,
      error: null,
      
      createBooking: async (booking: Omit<Booking, "id" | "createdAt">) => {
        try {
          set({ loading: true });
          
          // In a real app, this would be an API call
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newBooking: Booking = {
            ...booking,
            id: `b${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            bookings: [...state.bookings, newBooking],
            loading: false,
          }));
          
          // Update user's bookings
          useAuthStore.getState().addBooking(newBooking.id);
          
          return newBooking;
        } catch (error) {
          set({ loading: false, error: "Failed to create booking" });
          throw error;
        }
      },
      
      cancelBooking: async (bookingId: string) => {
        try {
          set({ loading: true });
          
          // In a real app, this would be an API call
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: "cancelled" } 
                : booking
            ),
            loading: false,
          }));
        } catch (error) {
          set({ loading: false, error: "Failed to cancel booking" });
          throw error;
        }
      },
    }),
    {
      name: "bookings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);