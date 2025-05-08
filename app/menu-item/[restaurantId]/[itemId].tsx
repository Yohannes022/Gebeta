import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Flame,
  Leaf,
  Minus,
  Plus,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
 
import Button from "@/components/Button";

import { restaurants } from "@/mocks/restaurants";
import { useCartStore } from "@/store/cartStore";

export default function MenuItemDetailScreen() {
  const { restaurantId, itemId } = useLocalSearchParams<{ restaurantId: string; itemId: string }>();
  const router = useRouter();
  const { addToCart } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  const restaurant = restaurants.find(r => r.id === restaurantId);
  const menuItem = restaurant?.menu.find(item => item.id === itemId);
  
  if (!restaurant || !menuItem) {
    return (
      <View style={styles.notFound}>
        <Text style={{fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,}}>Item not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(restaurant.id, menuItem.id, quantity, specialInstructions);
    Alert.alert(
      "Added to Cart",
      `${quantity} ${menuItem.name} added to your cart.`,
      [
        {
          text: "Continue Shopping",
          onPress: () => router.back(),
          style: "cancel",
        },
        {
          text: "View Cart",
          onPress: () => router.push("/cart"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: menuItem.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
          
          <View style={styles.badgesContainer}>
            {menuItem.isSpicy && (
              <View style={styles.badge}>
                <Flame size={16} color={"#FFFFFF"} />
                <Text style={styles.badgeText}>Spicy</Text>
              </View>
            )}
            {menuItem.isVegetarian && (
              <View style={[styles.badge, styles.vegBadge]}>
                <Leaf size={16} color={"#FFFFFF"} />
                <Text style={styles.badgeText}>Vegetarian</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{menuItem.name}</Text>
            <Text style={styles.price}>{menuItem.price} Birr</Text>
          </View>
          
          <Text style={styles.description}>{menuItem.description}</Text>
          
          {menuItem.ingredients && menuItem.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.ingredientsContainer}>
                {menuItem.ingredients.map((ingredient, index) => (
                  <View key={ingredient} style={styles.ingredient}>
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Add notes (e.g. allergies, spice level, etc.)"
              placeholderTextColor={"#8A8A8A"}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus size={20} color={quantity <= 1 ? "#8A8A8A" : "#2D2D2D"} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}
              >
                <Plus size={20} color={"#2D2D2D"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{menuItem.price * quantity} Birr</Text>
        </View>
        
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          variant="primary"
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backIconButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  badgesContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  vegBadge: {
    backgroundColor: "#6A8E7F",
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.3,
    flex: 1,
    marginRight: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,
    // color: "#3E7EA6",
  },
  description: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ingredient: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24
  },
  instructionsInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    textAlignVertical: "top",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  quantityTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
    flexDirection: "row",
    alignItems: "center",
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // color: "#8E8E8E",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
  },
});
