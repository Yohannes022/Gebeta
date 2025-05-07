import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Address, PaymentMethod } from "@/types/restaurant";
import { addresses as mockAddresses, paymentMethods as mockPaymentMethods } from "@/mocks/addresses";
import { User } from "@/types/recipe";

interface ProfileState {
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  
  // Address actions
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Payment method actions
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  
  // Profile settings
  notificationSettings: {
    orderUpdates: boolean;
    promotions: boolean;
    newRestaurants: boolean;
  };
  updateNotificationSettings: (settings: Partial<ProfileState["notificationSettings"]>) => void;
  
  // Language preference
  language: "english" | "amharic";
  setLanguage: (language: "english" | "amharic") => void;
  
  // Theme preference
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      addresses: mockAddresses,
      paymentMethods: mockPaymentMethods,
      
      notificationSettings: {
        orderUpdates: true,
        promotions: true,
        newRestaurants: true,
      },
      
      language: "english",
      theme: "system",
      
      addAddress: (address) => {
        const newAddress: Address = {
          ...address,
          id: Date.now().toString(),
        };
        
        set(state => ({
          addresses: [...state.addresses, newAddress],
        }));
      },
      
      updateAddress: (id, addressUpdate) => {
        set(state => ({
          addresses: state.addresses.map(address =>
            address.id === id
              ? { ...address, ...addressUpdate }
              : address
          ),
        }));
      },
      
      deleteAddress: (id) => {
        set(state => ({
          addresses: state.addresses.filter(address => address.id !== id),
        }));
      },
      
      setDefaultAddress: (id) => {
        set(state => ({
          addresses: state.addresses.map(address => ({
            ...address,
            isDefault: address.id === id,
          })),
        }));
      },
      
      addPaymentMethod: (method) => {
        const newMethod: PaymentMethod = {
          ...method,
          id: Date.now().toString(),
        };
        
        set(state => ({
          paymentMethods: [...state.paymentMethods, newMethod],
        }));
      },
      
      updatePaymentMethod: (id, methodUpdate) => {
        set(state => ({
          paymentMethods: state.paymentMethods.map(method =>
            method.id === id
              ? { ...method, ...methodUpdate }
              : method
          ),
        }));
      },
      
      deletePaymentMethod: (id) => {
        set(state => ({
          paymentMethods: state.paymentMethods.filter(method => method.id !== id),
        }));
      },
      
      setDefaultPaymentMethod: (id) => {
        set(state => ({
          paymentMethods: state.paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id,
          })),
        }));
      },
      
      updateNotificationSettings: (settings) => {
        set(state => ({
          notificationSettings: {
            ...state.notificationSettings,
            ...settings,
          },
        }));
      },
      
      setLanguage: (language) => {
        set({ language });
      },
      
      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
