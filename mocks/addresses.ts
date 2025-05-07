import { Address } from "@/types/restaurant";
import { currentUser } from "./users";

export const addresses: Address[] = [
  {
    id: "1",
    userId: currentUser.id,
    label: "Home",
    addressLine1: "Bole Road, Sunshine Apartments",
    addressLine2: "Building B, Apt 502",
    city: "Addis Ababa",
    instructions: "Gate code: 1234. Call when you arrive.",
    isDefault: true,
    location: {
      latitude: 9.0222,
      longitude: 38.7468,
    },
  },
  {
    id: "2",
    userId: currentUser.id,
    label: "Work",
    addressLine1: "Meskel Square, Unity Building",
    addressLine2: "4th Floor, Office 405",
    city: "Addis Ababa",
    instructions: "Ask for Makeda at reception.",
    isDefault: false,
    location: {
      latitude: 9.0105,
      longitude: 38.7612,
    },
  },
  {
    id: "3",
    userId: currentUser.id,
    label: "Friend's House",
    addressLine1: "Kazanchis, Green View Residences",
    city: "Addis Ababa",
    isDefault: false,
    location: {
      latitude: 9.0127,
      longitude: 38.7639,
    },
  },
];

export const paymentMethods = [
  {
    id: "1",
    userId: currentUser.id,
    type: "card",
    cardBrand: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
  {
    id: "2",
    userId: currentUser.id,
    type: "mobile-money",
    provider: "telebirr",
    phoneNumber: "+251911234567",
    isDefault: false,
  },
  {
    id: "3",
    userId: currentUser.id,
    type: "card",
    cardBrand: "mastercard",
    last4: "8765",
    expiryMonth: "09",
    expiryYear: "2024",
    isDefault: false,
  },
  {
    id: "4",
    userId: currentUser.id,
    type: "card",
    cardBrand: "amex",
    last4: "1234",
    expiryMonth: "11",
    expiryYear: "2026",
    isDefault: false,
  },
];
