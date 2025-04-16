export interface User {
    id: string;
    name: string;
    email?: string;
    phone: string;
    avatar: string;
    isHost: boolean;
    savedExperiences: string[];
    bookings: string[];
  }
  
  export interface Experience {
    id: string;
    title: string;
    description: string;
    images: string[];
    price: number;
    currency: string;
    location: Location;
    host: Host;
    rating: number;
    reviewCount: number;
    category: string;
    duration: number;
    maxGuests: number;
    includes: string[];
    deliveryTime?: number;
    reviews: Review[];
    dates: string[];
  }
  
  export interface Location {
    city: string;
    address: string;
    latitude: number;
    longitude: number;
  }
  
  export interface Host {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    description: string;
    responseRate: number;
    responseTime: string;
    isSuperhost: boolean;
  }
  
  export interface Review {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    rating: number;
    date: string;
    comment: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    icon: string;
    image: string;
  }
  
  export interface Booking {
    id: string;
    experienceId: string;
    userId: string;
    date: string;
    guests: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    phone: string;
    verificationId: string;
    setPhone: (phone: string) => void;
    setVerificationId: (id: string) => void;
    login: (user: User) => void;
    logout: () => void;
    saveExperience: (experienceId: string) => void;
    unsaveExperience: (experienceId: string) => void;
    addBooking: (bookingId: string) => void;
  }
  
  export interface ExperiencesState {
    experiences: Experience[];
    featuredExperiences: Experience[];
    popularExperiences: Experience[];
    newExperiences: Experience[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    selectedCategory: string | null;
    filters: {
      minPrice: number | null;
      maxPrice: number | null;
      duration: string | null;
      guests: number | null;
    };
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;
    setFilters: (filters: any) => void;
    getFilteredExperiences: () => Experience[];
    getExperienceById: (id: string) => Experience | null;
  }
  
  export interface BookingsState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
    cancelBooking: (bookingId: string) => Promise<void>;
  }