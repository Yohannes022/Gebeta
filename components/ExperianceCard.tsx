import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ViewStyle,
  Platform
} from "react-native";
import { MapPin, Star, Heart } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
  onPress: () => void;
  onSavePress?: () => void;
  isSaved?: boolean;
  style?: ViewStyle;
}

export default function ExperienceCard({ 
  experience, 
  onPress, 
  onSavePress,
  isSaved = false,
  style 
}: ExperienceCardProps) {
  
  const handleSavePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onSavePress) {
      onSavePress();
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: experience.images[0] }} 
          style={styles.image}
          resizeMode="cover"
        />
        {onSavePress && (
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={handleSavePress}
          >
            <Heart 
              size={22} 
              color={isSaved ? Colors.error : Colors.background} 
              fill={isSaved ? Colors.error : "transparent"} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {experience.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.rating} fill={Colors.rating} />
            <Text style={styles.rating}>{experience.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={Colors.lightText} />
          <Text style={styles.location} numberOfLines={1}>
            {experience.location.city}
          </Text>
        </View>
        
        <Text style={styles.price}>
          <Text style={styles.priceValue}>${experience.price}</Text> / person
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Layout.spacing.m,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
    marginRight: Layout.spacing.s,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.s,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.lightText,
  },
  price: {
    fontSize: 14,
    color: Colors.text,
  },
  priceValue: {
    fontWeight: "bold",
  },
});