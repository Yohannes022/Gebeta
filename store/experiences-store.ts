import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExperiencesState, Experience } from "@/types";
import { experiences } from "@/mocks/experience";

// For demo purposes, we'll create some featured, popular, and new experiences
const featuredExperiences = experiences.slice(0, 3);
const popularExperiences = experiences.slice(0, 4);
const newExperiences = experiences.slice(2, 5);

export const useExperiencesStore = create<ExperiencesState>()(
  persist(
    (set, get) => ({
      experiences: experiences || [],
      featuredExperiences,
      popularExperiences,
      newExperiences,
      loading: false,
      error: null,
      searchQuery: "",
      selectedCategory: null,
      filters: {
        minPrice: null,
        maxPrice: null,
        duration: null,
        guests: null,
      },
      
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      
      setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),
      
      setFilters: (filters: any) => set({ filters }),

      getFilteredExperiences: () => {
        const { experiences, searchQuery, selectedCategory, filters } = get();
        
        if (!experiences || !Array.isArray(experiences)) {
          return [];
        }
        
        return experiences.filter(exp => {
          // Search query filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = 
              exp.title.toLowerCase().includes(query) ||
              exp.description.toLowerCase().includes(query) ||
              exp.category.toLowerCase().includes(query);
            if (!matchesSearch) return false;
          }
          
          // Category filter
          if (selectedCategory && exp.category !== selectedCategory) {
            return false;
          }
          
          // Price range filter
          if (filters.minPrice !== null && exp.price < filters.minPrice) {
            return false;
          }
          if (filters.maxPrice !== null && exp.price > filters.maxPrice) {
            return false;
          }
          
          // Duration filter
          if (filters.duration && exp.duration !== filters.duration) {
            return false;
          }
          
          // Guests filter
          if (filters.guests && exp.maxGuests < filters.guests) {
            return false;
          }
          
          return true;
        });
      },
      
      getExperienceById: (id: string) => {
        const { experiences } = get();
        if (!experiences || !Array.isArray(experiences)) {
          return null;
        }
        // Use a for loop instead of find
        for (let i = 0; i < experiences.length; i++) {
          if (experiences[i].id === id) {
            return experiences[i];
          }
        }
        return null;
      }
    }),
    {
      name: "experiences-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        filters: state.filters,
      }),
    }
  )
);