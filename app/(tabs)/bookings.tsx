import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Calendar, Clock, Users, CheckCircle, XCircle, Clock3 } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useBookingsStore } from "@/store/bookings-store";
import { useExperiencesStore } from "@/store/experiences-store";
import { Booking } from "@/types";

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState(false);
  
  const { bookings, cancelBooking } = useBookingsStore();
  const { getExperienceById } = useExperiencesStore();

  const upcomingBookings = bookings.filter(
    booking => booking.status === 'confirmed' || booking.status === 'pending'
  );
  
  const pastBookings = bookings.filter(
    booking => booking.status === 'completed' || booking.status === 'cancelled'
  );

  const handleViewExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}`);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setIsLoading(true);
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const experience = getExperienceById(item.experienceId);
    if (!experience) return null;

    return (
      <View style={styles.bookingCard}>
        <TouchableOpacity 
          style={styles.bookingContent}
          onPress={() => handleViewExperience(item.experienceId)}
          activeOpacity={0.8}
        >
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle} numberOfLines={1}>
              {experience.title}
            </Text>
            <View style={[
              styles.statusBadge,
              item.status === 'confirmed' && styles.confirmedBadge,
              item.status === 'pending' && styles.pendingBadge,
              item.status === 'completed' && styles.completedBadge,
              item.status === 'cancelled' && styles.cancelledBadge,
            ]}>
              <Text style={styles.statusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Calendar size={16} color={Colors.lightText} />
              <Text style={styles.detailText}>{item.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={16} color={Colors.lightText} />
              <Text style={styles.detailText}>{experience.duration} hours</Text>
            </View>
            <View style={styles.detailRow}>
              <Users size={16} color={Colors.lightText} />
              <Text style={styles.detailText}>{item.guests} guests</Text>
            </View>
          </View>

          <View style={styles.bookingFooter}>
            <Text style={styles.priceText}>
              ${item.totalPrice.toFixed(2)}
            </Text>
            
            {(item.status === 'confirmed' || item.status === 'pending') && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => handleCancelBooking(item.id)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'upcoming' && styles.activeTabText
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'past' && styles.activeTabText
          ]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'upcoming' ? upcomingBookings : pastBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming' 
                  ? "No upcoming bookings" 
                  : "No past bookings"}
              </Text>
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.push("/")}
              >
                <Text style={styles.browseButtonText}>
                  Browse Experiences
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingVertical: Layout.spacing.m,
    marginRight: Layout.spacing.l,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.lightText,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "500",
  },
  list: {
    padding: Layout.spacing.l,
  },
  bookingCard: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.m,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  bookingContent: {
    padding: Layout.spacing.m,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.s,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
    marginRight: Layout.spacing.s,
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.small,
    backgroundColor: Colors.inactive,
  },
  confirmedBadge: {
    backgroundColor: Colors.success,
  },
  pendingBadge: {
    backgroundColor: Colors.warning,
  },
  completedBadge: {
    backgroundColor: Colors.secondary,
  },
  cancelledBadge: {
    backgroundColor: Colors.error,
  },
  statusText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },
  bookingDetails: {
    marginVertical: Layout.spacing.s,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  detailText: {
    marginLeft: Layout.spacing.s,
    color: Colors.lightText,
    fontSize: 14,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Layout.spacing.s,
    paddingTop: Layout.spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  cancelButton: {
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    backgroundColor: "transparent",
    borderRadius: Layout.borderRadius.small,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.m,
  },
  browseButton: {
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
  },
  browseButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "500",
  },
});