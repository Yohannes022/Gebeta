import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity,
  FlatList
} from "react-native";
import { Star } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { Review } from "@/types";

interface ReviewsListProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function ReviewsList({ 
  reviews, 
  rating, 
  reviewCount 
}: ReviewsListProps) {
  const [showAll, setShowAll] = React.useState(false);
  
  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);
  
  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              size={16} 
              color={Colors.rating}
              fill={star <= Math.round(rating) ? Colors.rating : "transparent"}
            />
          ))}
        </View>
        <Text style={styles.reviewCount}>
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </Text>
      </View>
      
      {displayedReviews.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <Image 
              source={{ uri: review.user.avatar }} 
              style={styles.avatar} 
            />
            <View style={styles.reviewHeaderText}>
              <Text style={styles.reviewerName}>{review.user.name}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.reviewRating}>
              <Star size={14} color={Colors.rating} fill={Colors.rating} />
              <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
      
      {reviews.length > 2 && (
        <TouchableOpacity 
          style={styles.showMoreButton}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.showMoreText}>
            {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.l,
  },
  ratingBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Layout.spacing.m,
  },
  ratingText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: Layout.spacing.s,
  },
  reviewCount: {
    color: Colors.lightText,
    fontSize: 14,
  },
  reviewItem: {
    marginBottom: Layout.spacing.l,
    paddingBottom: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: Layout.spacing.s,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Layout.spacing.s,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  reviewDate: {
    fontSize: 14,
    color: Colors.lightText,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewRatingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  reviewComment: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text,
  },
  showMoreButton: {
    paddingVertical: Layout.spacing.m,
  },
  showMoreText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
});