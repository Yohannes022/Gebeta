import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
 

import { useAuthStore } from "@/store/authStore";

export default function CreateScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleCreateRecipe = () => {
    router.push("/create-recipe");
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Sign in to create recipes</Text>
          <Text style={styles.authText}>
            Join our community to share your favorite Ethiopian recipes
          </Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push("/(auth)")}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Recipe</Text>
      <Text style={styles.subtitle}>
        Share your favorite Ethiopian dishes with the community
      </Text>

      <TouchableOpacity
        style={styles.createCard}
        onPress={handleCreateRecipe}
        activeOpacity={0.8}
      >
        <View style={styles.createCardContent}>
          <View>
            <Text style={styles.createCardTitle}>New Recipe</Text>
            <Text style={styles.createCardText}>
              Create a complete recipe with ingredients, steps, and photos
            </Text>
          </View>
          <ChevronRight size={24} color={"#3E7EA6"} />
        </View>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?q=80&w=500",
          }}
          style={styles.createCardImage}
          contentFit="cover"
        />
      </TouchableOpacity>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for great recipes</Text>
        
        <View style={styles.tipItem}>
          <View style={styles.tipNumber}>
            <Text style={styles.tipNumberText}>1</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipItemTitle}>Be specific with ingredients</Text>
            <Text style={styles.tipItemText}>
              Include exact measurements and any substitutions
            </Text>
          </View>
        </View>
        
        <View style={styles.tipItem}>
          <View style={styles.tipNumber}>
            <Text style={styles.tipNumberText}>2</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipItemTitle}>Add clear instructions</Text>
            <Text style={styles.tipItemText}>
              Break down the cooking process into simple steps
            </Text>
          </View>
        </View>
        
        <View style={styles.tipItem}>
          <View style={styles.tipNumber}>
            <Text style={styles.tipNumberText}>3</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipItemTitle}>Include a good photo</Text>
            <Text style={styles.tipItemText}>
              A quality photo makes your recipe more appealing
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // color: "#8E8E8E",
    marginBottom: 24,
  },
  createCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  createCardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  createCardText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    maxWidth: "90%",
    // color: "#8E8E8E",
  },
  createCardImage: {
    height: 150,
    width: "100%",
  },
  tipsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipNumberText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tipContent: {
    flex: 1,
  },
  tipItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  tipItemText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // color: "#8E8E8E",
  },
  authPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 12,
    textAlign: "center",
  },
  authText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
    // color: "#8E8E8E",
  },
  authButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
});