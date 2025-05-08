import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Clock, MapIcon, MapPin, Phone } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 
import Button from "@/components/Button";
import OrderStatusTracker from "@/components/OrderStatusTracker";

import { restaurants } from "@/mocks/restaurants";
import { useCartStore } from "@/store/cartStore";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, updateOrderStatus } = useCartStore();
  
  const order = getOrderById(id);
  const restaurant = restaurants.find(r => r.id === order?.restaurantId);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  useEffect(() => {
    if (order && order.status !== "delivered" && order.status !== "cancelled") {
      // Simulate order progress
      const timer = setTimeout(() => {
        if (order.status === "pending") {
          updateOrderStatus(order.id, "confirmed");
        } else if (order.status === "confirmed") {
          updateOrderStatus(order.id, "preparing");
        } else if (order.status === "preparing") {
          updateOrderStatus(order.id, "out-for-delivery");
        } else if (order.status === "out-for-delivery") {
          updateOrderStatus(order.id, "delivered");
        }
      }, 15000); // Update status every 15 seconds for demo
      
      return () => clearTimeout(timer);
    }
  }, [order?.status]);
  
  useEffect(() => {
    if (order && order.status !== "delivered" && order.status !== "cancelled") {
      // Parse estimated delivery time (e.g., "30-45 min")
      const timeRange = order.estimatedDeliveryTime.match(/(\d+)-(\d+)/);
      if (timeRange) {
        const maxMinutes = parseInt(timeRange[2]);
        setTimeLeft(maxMinutes);
        
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 60000); // Update every minute
        
        return () => clearInterval(interval);
      }
    }
  }, [order]);
  
  const handleCallDriver = () => {
    if (order?.driverInfo?.phone) {
      Linking.openURL(`tel:${order.driverInfo.phone}`);
    }
  };
  
  const handleViewMap = () => {
    router.push(`/delivery-tracking/${order?.id}`);
  };
  
  if (!order || !restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={{fontSize: 24,
    fontWeight: "700",
    color: "#2D2D2D",
    letterSpacing: 0.2,}}>Order not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/profile")}
        >
          <Text style={styles.backButtonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
        <Text style={styles.headerTitle}>Order #{order.id.slice(-4)}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statusContainer}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>
              {order.status === "pending" && "Order Placed"}
              {order.status === "confirmed" && "Order Confirmed"}
              {order.status === "preparing" && "Preparing Your Food"}
              {order.status === "out-for-delivery" && "On the Way"}
              {order.status === "delivered" && "Delivered"}
              {order.status === "cancelled" && "Cancelled"}
            </Text>
            
            {timeLeft !== null && order.status !== "delivered" && order.status !== "cancelled" && (
              <View style={styles.timeContainer}>
                <Clock size={16} color={"#D9A566"} />
                <Text style={styles.timeText}>
                  {timeLeft} min
                </Text>
              </View>
            )}
          </View>
          
          <OrderStatusTracker status={order.status} />
          
          {order.status === "out-for-delivery" && order.driverInfo && (
            <View style={styles.driverContainer}>
              <View style={styles.driverHeader}>
                <Image
                  source={{ uri: order.driverInfo.photoUrl }}
                  style={styles.driverImage}
                  contentFit="cover"
                />
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{order.driverInfo.name}</Text>
                  <Text style={styles.driverRole}>Your Delivery Driver</Text>
                </View>
              </View>
              
              <View style={styles.driverActions}>
                <TouchableOpacity
                  style={styles.driverAction}
                  onPress={handleCallDriver}
                >
                  <Phone size={20} color={"#3E7EA6"} />
                  <Text style={styles.driverActionText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.driverAction}
                  onPress={handleViewMap}
                >
                  <MapIcon size={20} color={"#3E7EA6"} />
                  <Text style={styles.driverActionText}>Track</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
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
              <Text style={styles.viewRestaurantText}>View Restaurant</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          <View style={styles.orderItems}>
            {order.items.map((item) => (
              <View key={item.menuItemId} style={styles.orderItem}>
                <View style={styles.orderItemHeader}>
                  <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemPrice}>
                    {item.price * item.quantity} Birr
                  </Text>
                </View>
                
                {item.specialInstructions && (
                  <Text style={styles.orderItemInstructions}>
                    Note: {item.specialInstructions}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          <View style={styles.infoItem}>
            <MapPin size={18} color={"#3E7EA6"} />
            <Text style={styles.infoText}>
              {order.deliveryAddress.addressLine1}
              {order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ""}
              {", "}
              {order.deliveryAddress.city}
            </Text>
          </View>
          
          {order.deliveryAddress.instructions && (
            <View style={styles.infoItem}>
              <Text style={styles.instructionsText}>
                Note: {order.deliveryAddress.instructions}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.paymentMethod}>
            {order.paymentMethod === "card" ? (
              <View style={styles.paymentMethodItem}>
                <Text style={styles.paymentMethodText}>
                  Paid with Credit Card
                </Text>
              </View>
            ) : order.paymentMethod === "mobile-money" ? (
              <View style={styles.paymentMethodItem}>
                <Text style={styles.paymentMethodText}>
                  Paid with Mobile Money
                </Text>
              </View>
            ) : (
              <View style={styles.paymentMethodItem}>
                <Text style={styles.paymentMethodText}>
                  Cash on Delivery
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{order.subtotal} Birr</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{order.deliveryFee} Birr</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{order.tax.toFixed(2)} Birr</Text>
          </View>
          
          {order.tip > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Driver Tip</Text>
              <Text style={styles.summaryValue}>{order.tip} Birr</Text>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.total.toFixed(2)} Birr</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderInfoLabel}>Order ID:</Text>
            <Text style={styles.orderInfoValue}>#{order.id}</Text>
          </View>
          
          <View style={styles.orderInfo}>
            <Text style={styles.orderInfoLabel}>Order Date:</Text>
            <Text style={styles.orderInfoValue}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>
        
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <View style={styles.actionsContainer}>
            <Button
              title="View Live Tracking"
              onPress={handleViewMap}
              variant="primary"
              fullWidth
            />
          </View>
        )}
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
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#3E7EA6",
    fontWeight: "600",
  },
  statusContainer: {
    backgroundColor: "#F9F5F0",
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9A566" + "20", // 20% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#D9A566",
    fontWeight: "600",
    marginLeft: 4,
  },
  driverContainer: {
    marginTop: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 2,
  },
  driverRole: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
  },
  driverActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
    paddingTop: 12,
  },
  driverAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  driverActionText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#3E7EA6",
    fontWeight: "600",
    marginLeft: 8,
  },
  restaurantContainer: {
    flexDirection: "row",
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    overflow: "hidden",
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
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
    color: "#2D2D2D",
    marginBottom: 4,
  },
  viewRestaurantText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#3E7EA6",
  },
  section: {
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  orderItems: {
    marginBottom: 8,
  },
  orderItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomcolor: "#DBDBDB",
  },
  orderItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderItemQuantity: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    fontWeight: "600",
    marginRight: 8,
  },
  orderItemName: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    fontWeight: "600",
  },
  orderItemInstructions: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    // color: "#8A8A8A",
    marginTop: 4,
    fontStyle: "italic",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    marginLeft: 12,
    flex: 1,
  },
  instructionsText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
    fontStyle: "italic",
    marginLeft: 30, // Align with the text above
  },
  paymentMethod: {
    marginBottom: 16,
  },
  paymentMethodItem: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  paymentMethodText: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    fontWeight: "500",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
  },
  summaryValue: {
    fontSize: 16,
    color: "#2D2D2D",
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
    color: "#2D2D2D",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    // color: "#3E7EA6",
  },
  orderInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    // color: "#8A8A8A",
    width: 100,
  },
  orderInfoValue: {
    fontSize: 16,
    color: "#2D2D2D",
    lineHeight: 24,
    flex: 1,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 20,
  },
});