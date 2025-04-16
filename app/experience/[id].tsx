import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Platform,
  Share,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Heart, 
  Share2, 
  ChevronLeft,
  Check,
  Truck,
  ShoppingBag
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useExperiencesStore } from "@/store/experiences-store";
import { useAuthStore } from "@/store/auth-store";
import * as Haptics from "expo-haptics";
import ReviewsList from "@/components/ReviewsList";
import HostInfo from "@/components/HostInfo";
import ImageGallery from "@/components/ImageGallery";
import DeliveryModal from "@/components/DeliveryModal";

const { width } = Dimensions.get("window");

export default function ExperienceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getExperienceById } = useExperiencesStore();
  const { user, saveExperience, unsaveExperience } = useAuthStore();
  
  const experience = getExperienceById(id as string);
  const [isSaved, setIsSaved] = useState(
    user?.savedExperiences.includes(id as string) || false
  );
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);

  if (!experience) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Experience not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isSaved) {
      unsaveExperience(experience.id);
    } else {
      saveExperience(experience.id);
    }
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing Ethiopian food experience: ${experience.title}`,
        url: `https://ethiopianfood.app/experience/${experience.id}`,
        title: experience.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBookNow = () => {
    router.push({
      pathname: "/booking",
      params: { experienceId: experience.id }
    });
  };

  const handleOrderDelivery = () => {
    setIsDeliveryModalVisible(true);
  };

  const handleDeliveryConfirm = (address: string, time: string) => {
    setIsDeliveryModalVisible(false);
    
    // In a real app, this would create an order in the backend
    Alert.alert(
      "Order Confirmed",
      `Your order will be delivered to ${address} in approximately ${time}.`,
      [{ text: "OK" }]
    );
  };

  const canBeDelivered = experience.deliveryTime !== undefined;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleSave}
              >
                <Heart 
                  size={24} 
                  color={isSaved ? Colors.error : Colors.text} 
                  fill={isSaved ? Colors.error : "transparent"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleShare}
              >
                <Share2 size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ImageGallery images={experience.images} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{experience.title}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={18} color={Colors.rating} fill={Colors.rating} />
            <Text style={styles.rating}>
              {experience.rating.toFixed(1)} 
              <Text style={styles.reviewCount}>
                ({experience.reviewCount} reviews)
              </Text>
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={18} color={Colors.lightText} />
            <Text style={styles.location}>{experience.location.city}</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Clock size={20} color={Colors.text} />
              <Text style={styles.detailText}>{experience.duration} hours</Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={20} color={Colors.text} />
              <Text style={styles.detailText}>Up to {experience.maxGuests} guests</Text>
            </View>
            {canBeDelivered && (
              <View style={styles.detailItem}>
                <Truck size={20} color={Colors.text} />
                <Text style={styles.detailText}>Delivery: {experience.deliveryTime} min</Text>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this experience</Text>
            <Text style={styles.description}>{experience.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's included</Text>
            <View style={styles.includesContainer}>
              {experience.includes.map((item, index) => (
                <View key={index} style={styles.includeItem}>
                  <Check size={18} color={Colors.success} />
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your host</Text>
            <HostInfo host={experience.host} />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <ReviewsList reviews={experience.reviews} rating={experience.rating} reviewCount={experience.reviewCount} />
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            ${experience.price}
            <Text style={styles.perPerson}> / person</Text>
          </Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          {canBeDelivered && (
            <TouchableOpacity 
              style={styles.deliveryButton}
              onPress={handleOrderDelivery}
            >
              <ShoppingBag size={20} color={Colors.background} />
              <Text style={styles.deliveryButtonText}>Order Delivery</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.bookButton, canBeDelivered && styles.bookButtonSmaller]}
            onPress={handleBookNow}
          >
            <Text style={styles.bookButtonText}>Book Experience</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <DeliveryModal
        visible={isDeliveryModalVisible}
        onClose={() => setIsDeliveryModalVisible(false)}
        onConfirm={handleDeliveryConfirm}
        estimatedTime={experience.deliveryTime || 30}
        price={experience.price}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollView: {
      flex: 1,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    headerActions: {
      flexDirection: "row",
    },
    contentContainer: {
      padding: Layout.spacing.l,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: Colors.text,
      marginBottom: Layout.spacing.s,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Layout.spacing.s,
    },
    rating: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.text,
      marginLeft: Layout.spacing.xs,
    },
    reviewCount: {
      fontWeight: "normal",
      color: Colors.lightText,
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Layout.spacing.m,
    },
    location: {
      fontSize: 16,
      color: Colors.lightText,
      marginLeft: Layout.spacing.xs,
    },
    detailsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: Layout.spacing.l,
      paddingBottom: Layout.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: Layout.spacing.l,
      marginBottom: Layout.spacing.s,
    },
    detailText: {
      fontSize: 16,
      color: Colors.text,
      marginLeft: Layout.spacing.xs,
    },
    section: {
      marginBottom: Layout.spacing.l,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: Colors.text,
      marginBottom: Layout.spacing.m,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: Colors.text,
    },
    includesContainer: {
      marginTop: Layout.spacing.s,
    },
    includeItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Layout.spacing.s,
    },
    includeText: {
      fontSize: 16,
      color: Colors.text,
      marginLeft: Layout.spacing.s,
    },
    footer: {
      padding: Layout.spacing.m,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      backgroundColor: Colors.background,
    },
    priceContainer: {
      marginBottom: Layout.spacing.s,
    },
    price: {
      fontSize: 22,
      fontWeight: "bold",
      color: Colors.text,
    },
    perPerson: {
      fontSize: 16,
      fontWeight: "normal",
      color: Colors.lightText,
    },
    buttonsContainer: {
      flexDirection: "row",
    },
    bookButton: {
      flex: 1,
      paddingVertical: Layout.spacing.m,
      backgroundColor: Colors.primary,
      borderRadius: Layout.borderRadius.medium,
      alignItems: "center",
      justifyContent: "center",
    },
    bookButtonSmaller: {
      flex: 0.6,
    },
    bookButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.background,
    },
    deliveryButton: {
      flex: 0.4,
      flexDirection: "row",
      paddingVertical: Layout.spacing.m,
      backgroundColor: Colors.secondary,
      borderRadius: Layout.borderRadius.medium,
      alignItems: "center",
      justifyContent: "center",
      marginRight: Layout.spacing.m,
    },
    deliveryButtonText: {
      fontSize: 14,
      fontWeight: "bold",
      color: Colors.background,
      marginLeft: Layout.spacing.xs,
    },
    notFoundContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: Layout.spacing.l,
    },
    notFoundText: {
      fontSize: 18,
      fontWeight: "bold",
      color: Colors.text,
      marginBottom: Layout.spacing.l,
    },
    backButton: {
      paddingHorizontal: Layout.spacing.l,
      paddingVertical: Layout.spacing.m,
      backgroundColor: Colors.primary,
      borderRadius: Layout.borderRadius.medium,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.background,
    },
  });
