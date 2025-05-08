import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Bookmark,
  ChevronRight,
  CreditCard,
  Edit2,
  Grid,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 
import RecipeCard from "@/components/RecipeCard";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useProfileStore } from "@/store/profileStore";
import { useRecipeStore } from "@/store/recipeStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { recipes } = useRecipeStore();
  const { addresses, paymentMethods } = useProfileStore();
  const { orders } = useCartStore();
  const [activeTab, setActiveTab] = useState<"recipes" | "saved">("recipes");

  if (!user) {
    router.replace("/(auth)");
    return null;
  }

  const userRecipes = recipes.filter((recipe) => recipe.authorId === user.id);
  const savedRecipes = recipes.filter((recipe) => recipe.isSaved);
  
  const defaultAddress = addresses.find(a => a.isDefault);
  const defaultPaymentMethod = paymentMethods.find(p => p.isDefault);
  const recentOrders = orders.slice(0, 3);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace("/(auth)");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
          <Settings size={24} color={"#2D2D2D"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <LogOut size={24} color={"#2D2D2D"} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.profileImage}
            contentFit="cover"
          />
          <Text style={styles.profileName}>{user.name}</Text>
          {user.location && (
            <Text style={styles.profileLocation}>{user.location}</Text>
          )}
          {user.bio && <Text style={styles.profileBio}>{user.bio}</Text>}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userRecipes.length}</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Edit2 size={16} color={"#2D2D2D"} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/orders")}
          >
            <View style={styles.menuItemLeft}>
              <ShoppingBag size={20} color={"#3E7EA6"} />
              <Text style={styles.menuItemText}>My Orders</Text>
            </View>
            <ChevronRight size={20} color={"#8A8A8A"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/addresses")}
          >
            <View style={styles.menuItemLeft}>
              <MapPin size={20} color={"#3E7EA6"} />
              <Text style={styles.menuItemText}>My Addresses</Text>
            </View>
            <ChevronRight size={20} color={"#8A8A8A"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/payment")}
          >
            <View style={styles.menuItemLeft}>
              <CreditCard size={20} color={"#3E7EA6"} />
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color={"#8A8A8A"} />
          </TouchableOpacity>
        </View>
        
        {recentOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity onPress={() => router.push("/profile/orders")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderItem}
                onPress={() => router.push(`/order/${order.id}`)}
              >
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle}>Order #{order.id.slice(-4)}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.orderStatus}>
                  <Text
                    style={[
                      styles.orderStatusText,
                      order.status === "delivered" && styles.deliveredStatus,
                      order.status === "cancelled" && styles.cancelledStatus,
                    ]}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/-/g, " ")}
                  </Text>
                  <ChevronRight size={16} color={"#8A8A8A"} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "recipes" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("recipes")}
          >
            <Grid
              size={20}
              color={
                activeTab === "recipes" ? "#3E7EA6" : "#8A8A8A"
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "recipes" && styles.activeTabText,
              ]}
            >
              My Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "saved" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("saved")}
          >
            <Bookmark
              size={20}
              color={activeTab === "saved" ? "#3E7EA6" : "#8A8A8A"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.activeTabText,
              ]}
            >
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recipesContainer}>
          {activeTab === "recipes" &&
            (userRecipes.length > 0 ? (
              userRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No recipes yet</Text>
                <Text style={styles.emptyStateText}>
                  Create your first recipe to share with the community
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push("/create-recipe")}
                >
                  <Text style={styles.createButtonText}>Create Recipe</Text>
                </TouchableOpacity>
              </View>
            ))}

          {activeTab === "saved" &&
            (savedRecipes.length > 0 ? (
              savedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No saved recipes</Text>
                <Text style={styles.emptyStateText}>
                  Save recipes to access them later
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push("/search")}
                >
                  <Text style={styles.createButtonText}>Explore Recipes</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  iconButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D2D2D",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    // color: "#8A8A8A",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundcolor: "#DBDBDB",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    bordercolor: "#DBDBDB",
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    marginLeft: 8,
  },
  section: {
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#3E7EA6",
    fontWeight: "600",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomcolor: "#DBDBDB",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    marginLeft: 12,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomcolor: "#DBDBDB",
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    // color: "#8A8A8A",N
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderStatusText: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    // color: "#D9A566",
    marginRight: 4,
  },
  deliveredStatus: {
    color: "#43A047",
  },
  cancelledStatus: {
    color: "#E53935",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomcolor: "#DBDBDB",
    backgroundColor: "#F9F5F0",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#3E7EA6",
  },
  tabText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
    marginLeft: 8,
  },
  activeTabText: {
    color: "#3E7EA6",
    fontWeight: "600",
  },
  recipesContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: "#F9F5F0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
});
