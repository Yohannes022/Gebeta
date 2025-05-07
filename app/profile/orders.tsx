import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Clock } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
 

import { restaurants } from "@/mocks/restaurants";
import { useCartStore } from "@/store/cartStore";

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useCartStore();

  const getRestaurantById = (id: string) => {
    return restaurants.find(r => r.id === id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderOrderStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Check size={16} color={"#43A047"} />;
      case "cancelled":
        return <AlertTriangle size={16} color={"#E53935"} />;
      default:
        return <Clock size={16} color={"#D9A566"} />;
    }
  };

  const renderOrderStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "out-for-delivery":
        return "On the way";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item: order }) => {
    const restaurant = getRestaurantById(order.restaurantId);
    
    if (!restaurant) return null;
    
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/order/${order.id}`)}
      >
        <View style={styles.orderHeader}>
          <Image
            source={{ uri: restaurant.imageUrl }}
            style={styles.restaurantImage}
            contentFit="cover"
          />
          <View style={styles.orderInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            <View style={styles.orderStatusContainer}>
              {renderOrderStatusIcon(order.status)}
              <Text
                style={[
                  styles.orderStatus,
                  order.status === "delivered" && styles.deliveredStatus,
                  order.status === "cancelled" && styles.cancelledStatus,
                ]}
              >
                {renderOrderStatusText(order.status)}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={"#8A8A8A"} />
        </View>
        
        <View style={styles.orderItems}>
          <Text style={styles.orderItemsText}>
            {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
          </Text>
        </View>
        
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{order.total.toFixed(2)} Birr</Text>
          {(order.status === "out-for-delivery" || order.status === "preparing") && (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => router.push(`/delivery-tracking/${order.id}`)}
            >
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={"#2D2D2D"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Your order history will appear here
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/restaurants")}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F9F5F0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: "#F9F5F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    color: "#8A8A8A",
    marginBottom: 4,
  },
  orderStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderStatus: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    color: "#D9A566",
    marginLeft: 4,
  },
  deliveredStatus: {
    color: "#43A047",
  },
  cancelledStatus: {
    color: "#E53935",
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 12,
    marginBottom: 12,
  },
  orderItemsText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotal: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    fontWeight: "600",
  },
  trackButton: {
    backgroundColor: "#F9F5F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  trackButtonText: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    // color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#F9F5F0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
});
