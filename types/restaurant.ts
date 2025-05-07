export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isPopular?: boolean;
  ingredients?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  coverImageUrl: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3; // 1 = $, 2 = $$, 3 = $$$
  categories: string[];
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  website?: string;
  openingHours: {
    [key: string]: string; // e.g., "Monday": "9:00 AM - 10:00 PM"
  };
  menu: MenuItem[];
  deliveryFee: number;
  minOrderAmount: number;
  estimatedDeliveryTime: string; // e.g., "30-45 min"
  isOpen: boolean;
}

export interface CartItem {
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }[];
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out-for-delivery"
    | "delivered"
    | "cancelled";
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: "card" | "cash" | "mobile-money";
  deliveryAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    instructions?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  driverInfo?: {
    name: string;
    phone: string;
    photoUrl: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface Address {
  id: string;
  userId: string;
  label: string; // e.g., "Home", "Work"
  addressLine1: string;
  addressLine2?: string;
  city: string;
  instructions?: string;
  isDefault: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: "card" | "mobile-money";
  // For cards
  cardBrand?: "visa" | "mastercard" | "amex";
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  // For mobile money
  provider?: "telebirr" | "cbe-birr" | "amole";
  phoneNumber?: string;
  isDefault: boolean;
}
