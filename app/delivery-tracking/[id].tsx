import { Image } from "expo-image";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin, MessageCircle, Navigation, Phone } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import OrderStatusTracker from "@/components/OrderStatusTracker";
import { restaurants } from "@/mocks/restaurants";
import { useCartStore } from "@/store/cartStore";

export default function DeliveryTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById } = useCartStore();
  const mapRef = useRef<MapView>(null);
  
  const order = getOrderById(id);
  const restaurant = restaurants.find(r => r.id === order?.restaurantId);
  
  const [driverLocation, setDriverLocation] = useState(
    order?.driverInfo?.currentLocation || restaurant?.location
  );
  
  const [estimatedTime, setEstimatedTime] = useState<number>(
    order?.estimatedDeliveryTime ? parseInt(order.estimatedDeliveryTime.split("-")[1]) : 30
  );

  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
      
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);
  
  useEffect(() => {
    // Simulate driver movement
    const interval = setInterval(() => {
      if (order?.status === "out-for-delivery" && driverLocation && order.deliveryAddress.location) {
        // Move driver closer to delivery location
        const deliveryLoc = order.deliveryAddress.location;
        const newLat = driverLocation.latitude + (deliveryLoc.latitude - driverLocation.latitude) * 0.1;
        const newLng = driverLocation.longitude + (deliveryLoc.longitude - driverLocation.longitude) * 0.1;
        
        setDriverLocation({
          latitude: newLat,
          longitude: newLng,
        });
        
        // Update estimated time
        setEstimatedTime((prev) => Math.max(1, prev - 1));
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [driverLocation, order]);

  useEffect(() => {
    // Fit map to show all markers
    if (mapRef.current && restaurant?.location && order?.deliveryAddress.location && driverLocation) {
      const points = [
        restaurant.location,
        order.deliveryAddress.location,
        driverLocation
      ];
      
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [restaurant, order, driverLocation]);
  
  const handleCallDriver = () => {
    if (order?.driverInfo?.phone) {
      Linking.openURL(`tel:${order.driverInfo.phone}`);
    }
  };
  
  const handleMessageDriver = () => {
    if (order?.driverInfo?.phone) {
      Linking.openURL(`sms:${order.driverInfo.phone}`);
    }
  };

  const requestLocationPermission = async () => {
    Alert.alert(
      "Location Permission",
      "We need your location to show you on the map and provide better delivery tracking.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === "granted");
            
            if (status === "granted") {
              const location = await Location.getCurrentPositionAsync({});
              setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }
          }
        }
      ]
    );
  };
  
  if (!order || !restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={{fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#2D2D2D",}}>Order not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/profile")}
        >
          <Text style={styles.backButtonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={"#2D2D2D"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Tracking</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.mapContainer}>
        {Platform.OS === "web" ? (
          <View style={[styles.map, { backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ fontSize: 16,
    lineHeight: 24, color: "#8A8A8A" }}>Map View</Text>
            <Text style={{ fontSize: 12,
    lineHeight: 16, color: "#8A8A8A", marginTop: 8 }}>
              (Map would be displayed here in a real app)
            </Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: restaurant.location.latitude,
              longitude: restaurant.location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Restaurant marker */}
            <Marker
              coordinate={restaurant.location}
              title={restaurant.name}
              description="Restaurant location"
            >
              <View style={styles.restaurantMarker}>
                <MapPin size={24} color={"#FFFFFF"} />
              </View>
            </Marker>
            
            {/* Delivery address marker */}
            {order.deliveryAddress.location && (
              <Marker
                coordinate={order.deliveryAddress.location}
                title="Delivery Address"
                description={order.deliveryAddress.addressLine1}
              >
                <View style={styles.destinationMarker}>
                  <MapPin size={24} color={"#FFFFFF"} />
                </View>
              </Marker>
            )}
            
            {/* Driver marker */}
            {driverLocation && (
              <Marker
                coordinate={driverLocation}
                title={order.driverInfo?.name || "Driver"}
                description="Your delivery driver"
              >
                <View style={styles.driverMarker}>
                  <Navigation size={24} color={"#FFFFFF"} />
                </View>
              </Marker>
            )}

            {/* User location marker */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
              >
                <View style={styles.userMarker}>
                  <View style={styles.userMarkerInner} />
                </View>
              </Marker>
            )}
          </MapView>
        )}

        {!locationPermission && Platform.OS !== "web" && (
          <TouchableOpacity 
            style={styles.locationPermissionButton}
            onPress={requestLocationPermission}
          >
            <Text style={styles.locationPermissionText}>Show my location</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <OrderStatusTracker status={order.status} />
        </View>
        
        <View style={styles.estimatedTimeContainer}>
          <Text style={styles.estimatedTimeLabel}>Estimated Arrival</Text>
          <Text style={styles.estimatedTimeValue}>
            {estimatedTime} minutes
          </Text>
        </View>
        
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
                <Phone size={20} color={"#FFFFFF"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.driverAction}
                onPress={handleMessageDriver}
              >
                <MessageCircle size={20} color={"#FFFFFF"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.deliveryAddressContainer}>
          <Text style={styles.deliveryAddressTitle}>Delivery Address</Text>
          <Text style={styles.deliveryAddress}>
            {order.deliveryAddress.addressLine1}
            {order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ""}
            {", "}
            {order.deliveryAddress.city}
          </Text>
          
          {order.deliveryAddress.instructions && (
            <Text style={styles.deliveryInstructions}>
              Note: {order.deliveryAddress.instructions}
            </Text>
          )}
        </View>
        
        <View style={styles.orderSummaryContainer}>
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>
          
          <View style={styles.orderItems}>
            {order.items.map((item) => (
              <View key={item.menuItemId} style={styles.orderItem}>
                <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                <Text style={styles.orderItemName}>{item.name}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.total.toFixed(2)} Birr</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    lineHeight: 24,
    color: "#3E7EA6",
    fontWeight: "600",
  },
  mapContainer: {
    height: height * 0.4,
    width: width,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  restaurantMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9A566",
    justifyContent: "center",
    alignItems: "center",
  },
  destinationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6A8E7F",
    justifyContent: "center",
    alignItems: "center",
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9F5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F9F5F0" + "40",
    justifyContent: "center",
    alignItems: "center",
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F9F5F0",
  },
  locationPermissionButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#F9F5F0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationPermissionText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#3E7EA6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#F9F5F0",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  statusContainer: {
    marginBottom: 16,
  },
  estimatedTimeContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  estimatedTimeLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
    marginBottom: 4,
  },
  estimatedTimeValue: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#3E7EA6",
  },
  driverContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    marginBottom: 2,
  },
  driverRole: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
  },
  driverActions: {
    flexDirection: "row",
  },
  driverAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9F5F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deliveryAddressContainer: {
    marginBottom: 24,
  },
  deliveryAddressTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  deliveryAddress: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  deliveryInstructions: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
    fontStyle: "italic",
  },
  orderSummaryContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  orderItemQuantity: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    marginRight: 8,
    width: 30,
  },
  orderItemName: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E7EA6",
  },
});
