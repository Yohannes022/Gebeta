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
      experiences,
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
      
      getExperienceById: (id: string) => {
        return get().experiences.find(exp => exp.id === id);
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