import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 
import Button from "@/components/Button";
import CartItem from "@/components/CartItem";

import { restaurants } from "@/mocks/restaurants";
import { useCartStore } from "@/store/cartStore";

export default function CartScreen() {
  const router = useRouter();
  const {
    getCartItems,
    getCartSubtotal,
    getDeliveryFee,
    getTax,
    getCartTotal,
    updateQuantity,
    removeFromCart,
    restaurantId,
    clearCart,
  } = useCartStore();

  const cartItems = getCartItems();
  const subtotal = getCartSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getCartTotal();

  const restaurant = restaurants.find(r => r.id === restaurantId);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Your cart is empty", "Add some items to your cart first.");
      return;
    }
    
    router.push("/checkout");
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => clearCart(),
          style: "destructive",
        },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag size={80} color={"#8A8A8A"} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add items from restaurants to start an order
        </Text>
        <Button
          title="Browse Restaurants"
          onPress={() => router.push("/restaurants")}
          variant="primary"
          style={styles.browseButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {restaurant && (
          <View style={styles.restaurantContainer}>
            <Image
              source={{ uri: restaurant.imageUrl }}
              style={styles.restaurantImage}
              contentFit="cover"
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <TouchableOpacity
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              >
                <Text style={styles.addMoreText}>Add more items</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.itemsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Order</Text>
            {cartItems.length > 0 && (
              <TouchableOpacity onPress={handleClearCart}>
                <Text style={styles.clearText}>Clear Cart</Text>
              </TouchableOpacity>
            )}
          </View>

          {cartItems.map((item) => (
            <CartItem
              key={item.menuItemId}
              menuItem={item.menuItem}
              quantity={item.quantity}
              specialInstructions={item.specialInstructions}
              onUpdateQuantity={(quantity) => updateQuantity(item.menuItemId, quantity)}
              onRemove={() => removeFromCart(item.menuItemId)}
            />
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal} Birr</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{deliveryFee} Birr</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (15%)</Text>
            <Text style={styles.summaryValue}>{tax.toFixed(2)} Birr</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} Birr</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.checkoutContainer}>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F0",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // color: "#8E8E8E",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    marginTop: 16,
  },
  restaurantContainer: {
    flexDirection: "row",
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    overflow: "hidden",
    margin: 20,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: 80,
    height: 80,
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  addMoreText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24
    // color: "#3E7EA6",
  },
  itemsContainer: {
    padding: 20,
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
    color: "#000000",
    letterSpacing: 0.2,
  },
  clearText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24
    // color: "#ED4956",
  },
  summaryContainer: {
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // color: "#8E8E8E",
  },
  summaryValue: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    // color: "#3E7EA6",
  },
  checkoutContainer: {
    backgroundColor: "#F9F5F0",
    padding: 20,
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
  },
});
