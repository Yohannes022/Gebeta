// API Configuration
export const API_CONFIG = {
    // Base URL for API requests
    BASE_URL: "https://api.habesharecipes.com/v1",
    
    // Endpoints
    ENDPOINTS: {
      // Authentication
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      VERIFY_OTP: "/auth/verify",
      REFRESH_TOKEN: "/auth/refresh",
      
      // User
      USER_PROFILE: "/user/profile",
      USER_ADDRESSES: "/user/addresses",
      USER_PAYMENT_METHODS: "/user/payment-methods",
      
      // Recipes
      RECIPES: "/recipes",
      RECIPE_DETAIL: (id: string) => `/recipes/${id}`,
      RECIPE_COMMENTS: (id: string) => `/recipes/${id}/comments`,
      RECIPE_RATINGS: (id: string) => `/recipes/${id}/ratings`,
      
      // Restaurants
      RESTAURANTS: "/restaurants",
      RESTAURANT_DETAIL: (id: string) => `/restaurants/${id}`,
      RESTAURANT_MENU: (id: string) => `/restaurants/${id}/menu`,
      RESTAURANT_REVIEWS: (id: string) => `/restaurants/${id}/reviews`,
      
      // Orders
      ORDERS: "/orders",
      ORDER_DETAIL: (id: string) => `/orders/${id}`,
      ORDER_TRACKING: (id: string) => `/orders/${id}/tracking`,
      
      // Search
      SEARCH: "/search",
      
      // Chatbot
      CHATBOT: "/chatbot/message",
    },
    
    // API Keys
    KEYS: {
      GOOGLE_MAPS: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with actual key in production
    },
    
    // Request timeout in milliseconds
    TIMEOUT: 10000,
    
    // Cache duration in milliseconds
    CACHE_DURATION: {
      RECIPES: 60 * 60 * 1000, // 1 hour
      RESTAURANTS: 30 * 60 * 1000, // 30 minutes
      USER_DATA: 5 * 60 * 1000, // 5 minutes
    },
  };
  
  // Helper functions for API requests
  export const apiHelpers = {
    // Function to handle API errors
    handleError: (error: any) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("API Error Response:", error.response.data);
        return {
          status: error.response.status,
          message: error.response.data.message || "An error occurred",
          data: error.response.data,
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API Error Request:", error.request);
        return {
          status: 0,
          message: "No response from server",
          data: null,
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("API Error Setup:", error.message);
        return {
          status: 0,
          message: error.message || "Request setup error",
          data: null,
        };
      }
    },
    
    // Function to format query parameters
    formatQueryParams: (params: Record<string, any>) => {
      return Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join("&");
    },
  };
  