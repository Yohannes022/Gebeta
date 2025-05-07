import { addresses } from "@/mocks/addresses";
import { restaurants } from "@/mocks/restaurants";
import { currentUser } from "@/mocks/users";
import { CartItem, MenuItem, Order } from "@/types/restaurant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  
  // Cart actions
  addToCart: (restaurantId: string, menuItemId: string, quantity: number, specialInstructions?: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateInstructions: (menuItemId: string, instructions: string) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  
  // Cart calculations
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getCartItemCount: () => number;
  getCartItems: () => Array<CartItem & { menuItem: MenuItem }>;
  
  // Orders
  orders: Order[];
  createOrder: (
    paymentMethod: 'card' | 'cash' | 'mobile-money',
    addressId: string,
    tip: number
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      orders: [],
      
      addToCart: (restaurantId, menuItemId, quantity, specialInstructions) => {
        const { items, restaurantId: currentRestaurantId } = get();
        
        // If adding from a different restaurant, clear the cart first
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
          if (items.length > 0) {
            // In a real app, you would show a confirmation dialog here
            set({ items: [], restaurantId: null });
          }
        }
        
        const existingItemIndex = items.findIndex(item => item.menuItemId === menuItemId);
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          if (specialInstructions) {
            updatedItems[existingItemIndex].specialInstructions = specialInstructions;
          }
          set({ items: updatedItems, restaurantId });
        } else {
          // Add new item
          set({
            items: [
              ...items,
              {
                menuItemId,
                restaurantId,
                quantity,
                specialInstructions,
              },
            ],
            restaurantId,
          });
        }
      },
      
      updateQuantity: (menuItemId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          set({
            items: items.filter(item => item.menuItemId !== menuItemId),
          });
          
          // If this was the last item, clear the restaurantId
          if (items.length === 1) {
            set({ restaurantId: null });
          }
        } else {
          // Update quantity
          set({
            items: items.map(item =>
              item.menuItemId === menuItemId
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },
      
      updateInstructions: (menuItemId, instructions) => {
        const { items } = get();
        
        set({
          items: items.map(item =>
            item.menuItemId === menuItemId
              ? { ...item, specialInstructions: instructions }
              : item
          ),
        });
      },
      
      removeFromCart: (menuItemId) => {
        const { items } = get();
        
        const updatedItems = items.filter(item => item.menuItemId !== menuItemId);
        
        set({ items: updatedItems });
        
        // If this was the last item, clear the restaurantId
        if (updatedItems.length === 0) {
          set({ restaurantId: null });
        }
      },
      
      clearCart: () => {
        set({ items: [], restaurantId: null });
      },
      
      getCartItems: () => {
        const { items, restaurantId } = get();
        
        if (!restaurantId) return [];
        
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return [];
        
        return items.map(item => {
          const menuItem = restaurant.menu.find(mi => mi.id === item.menuItemId);
          return {
            ...item,
            menuItem: menuItem!,
          };
        });
      },
      
      getCartSubtotal: () => {
        const cartItems = get().getCartItems();
        
        return cartItems.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0
        );
      },
      
      getDeliveryFee: () => {
        const { restaurantId } = get();
        
        if (!restaurantId) return 0;
        
        const restaurant = restaurants.find(r => r.id === restaurantId);
        return restaurant ? restaurant.deliveryFee : 0;
      },
      
      getTax: () => {
        // Assuming 15% VAT in Ethiopia
        return get().getCartSubtotal() * 0.15;
      },
      
      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        
        return subtotal + deliveryFee + tax;
      },
      
      getCartItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      createOrder: (paymentMethod, addressId, tip) => {
        const { getCartItems, getCartSubtotal, getDeliveryFee, getTax, getCartTotal, clearCart } = get();
        
        const cartItems = getCartItems();
        const subtotal = getCartSubtotal();
        const deliveryFee = getDeliveryFee();
        const tax = getTax();
        const total = getCartTotal() + tip;
        
        const address = addresses.find(a => a.id === addressId);
        
        if (!address) {
          throw new Error("Delivery address not found");
        }
        
        const restaurant = restaurants.find(r => r.id === get().restaurantId);
        
        if (!restaurant) {
          throw new Error("Restaurant not found");
        }
        
        const newOrder: Order = {
          id: Date.now().toString(),
          userId: currentUser.id,
          restaurantId: restaurant.id,
          items: cartItems.map(item => ({
            menuItemId: item.menuItemId,
            name: item.menuItem.name,
            price: item.menuItem.price,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions,
          })),
          status: 'pending',
          subtotal,
          deliveryFee,
          tax,
          tip,
          total,
          paymentMethod,
          deliveryAddress: {
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            instructions: address.instructions,
            location: address.location,
          },
          createdAt: new Date().toISOString(),
          estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
          driverInfo: {
            name: "Dawit Haile",
            phone: "+251922345678",
            photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
            currentLocation: {
              latitude: restaurant.location.latitude,
              longitude: restaurant.location.longitude,
            },
          },
        };
        
        set(state => ({
          orders: [newOrder, ...state.orders],
        }));
        
        // Clear the cart after creating an order
        clearCart();
        
        return newOrder;
      },
      
      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },
      
      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status }
              : order
          ),
        }));
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);