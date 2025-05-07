import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Restaurant } from "@/types/restaurant";
import { restaurants as mockRestaurants } from "@/mocks/restaurants";
import { API_CONFIG } from "@/constants/API_CONFIG";

interface RestaurantState {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRestaurants: () => Promise<void>;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  filterRestaurants: () => void;
  sortRestaurants: (sortBy: string, userLocation?: { latitude: number; longitude: number } | null) => void;
  filterByPriceLevel: (level: number | null) => void;
  filterByDeliveryTime: (maxTime: number | null) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
  addReview: (restaurantId: string, rating: number, comment: string, userId: string) => void;
}

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: mockRestaurants,
      filteredRestaurants: mockRestaurants,
      selectedCategory: null,
      searchQuery: "",
      isLoading: false,
      error: null,
      
      fetchRestaurants: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          // const response = await fetch(`${API_CONFIG.BASE_URL}/restaurants`);
          // if (!response.ok) throw new Error('Failed to fetch restaurants');
          // const data = await response.json();
          
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            restaurants: mockRestaurants, 
            filteredRestaurants: mockRestaurants,
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching restaurants:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch restaurants',
            isLoading: false 
          });
        }
      },
      
      setRestaurants: (restaurants) => set({ 
        restaurants, 
        filteredRestaurants: restaurants 
      }),
      
      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
        get().filterRestaurants();
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterRestaurants();
      },
      
      filterRestaurants: () => {
        const { restaurants, selectedCategory, searchQuery } = get();
        
        let filtered = [...restaurants];
        
        if (selectedCategory && selectedCategory !== "All") {
          filtered = filtered.filter((restaurant) =>
            restaurant.categories.includes(selectedCategory)
          );
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (restaurant) =>
              restaurant.name.toLowerCase().includes(query) ||
              restaurant.description.toLowerCase().includes(query) ||
              restaurant.categories.some((category) => 
                category.toLowerCase().includes(query)
              ) ||
              restaurant.menu.some((item) => 
                item.name.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
              )
          );
        }
        
        set({ filteredRestaurants: filtered });
      },
      
      sortRestaurants: (sortBy, userLocation) => {
        const { filteredRestaurants } = get();
        let sorted = [...filteredRestaurants];
        
        switch (sortBy) {
          case 'popular':
            // Sort by review count (most popular)
            sorted.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
            
          case 'rating':
            // Sort by rating (highest first)
            sorted.sort((a, b) => b.rating - a.rating);
            break;
            
          case 'distance':
            // Sort by distance if user location is available
            if (userLocation) {
              sorted.sort((a, b) => {
                const distanceA = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  a.location.latitude,
                  a.location.longitude
                );
                const distanceB = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  b.location.latitude,
                  b.location.longitude
                );
                return distanceA - distanceB;
              });
            }
            break;
            
          case 'price-asc':
            // Sort by price level (low to high)
            sorted.sort((a, b) => a.priceLevel - b.priceLevel);
            break;
            
          case 'price-desc':
            // Sort by price level (high to low)
            sorted.sort((a, b) => b.priceLevel - a.priceLevel);
            break;
            
          default:
            // Default sort by popularity
            sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        }
        
        set({ filteredRestaurants: sorted });
      },
      
      filterByPriceLevel: (level) => {
        const { restaurants, selectedCategory, searchQuery } = get();
        
        let filtered = [...restaurants];
        
        if (selectedCategory && selectedCategory !== "All") {
          filtered = filtered.filter((restaurant) =>
            restaurant.categories.includes(selectedCategory)
          );
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (restaurant) =>
              restaurant.name.toLowerCase().includes(query) ||
              restaurant.description.toLowerCase().includes(query) ||
              restaurant.categories.some((category) => 
                category.toLowerCase().includes(query)
              )
          );
        }
        
        if (level !== null) {
          filtered = filtered.filter((restaurant) => restaurant.priceLevel === level);
        }
        
        set({ filteredRestaurants: filtered });
      },
      
      filterByDeliveryTime: (maxTime) => {
        const { restaurants, selectedCategory, searchQuery } = get();
        
        let filtered = [...restaurants];
        
        if (selectedCategory && selectedCategory !== "All") {
          filtered = filtered.filter((restaurant) =>
            restaurant.categories.includes(selectedCategory)
          );
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (restaurant) =>
              restaurant.name.toLowerCase().includes(query) ||
              restaurant.description.toLowerCase().includes(query) ||
              restaurant.categories.some((category) => 
                category.toLowerCase().includes(query)
              )
          );
        }
        
        if (maxTime !== null) {
          filtered = filtered.filter((restaurant) => {
            const deliveryTime = restaurant.estimatedDeliveryTime;
            if (!deliveryTime) return false;
            
            // Parse delivery time (e.g., "30-45 min" -> 45)
            const match = deliveryTime.match(/(\d+)-(\d+)/);
            if (match) {
              const maxDeliveryTime = parseInt(match[2], 10);
              return maxDeliveryTime <= maxTime;
            }
            return false;
          });
        }
        
        set({ filteredRestaurants: filtered });
      },
      
      getRestaurantById: (id) => {
        return get().restaurants.find(restaurant => restaurant.id === id);
      },
      
      addReview: (restaurantId, rating, comment, userId) => {
        const { restaurants } = get();
        
        const updatedRestaurants = restaurants.map(restaurant => {
          if (restaurant.id === restaurantId) {
            // Calculate new average rating
            const totalRatings = restaurant.reviewCount;
            const currentRatingTotal = restaurant.rating * totalRatings;
            const newRatingTotal = currentRatingTotal + rating;
            const newReviewCount = totalRatings + 1;
            const newAverageRating = newRatingTotal / newReviewCount;
            
            return {
              ...restaurant,
              rating: parseFloat(newAverageRating.toFixed(1)),
              reviewCount: newReviewCount,
              // In a real app, you would also add the review to a reviews array
            };
          }
          return restaurant;
        });
        
        set({ 
          restaurants: updatedRestaurants,
          filteredRestaurants: get().filteredRestaurants
        });
      }
    }),
    {
      name: "restaurant-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        selectedCategory: state.selectedCategory,
        searchQuery: state.searchQuery,
      }),
    }
  )
);

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
