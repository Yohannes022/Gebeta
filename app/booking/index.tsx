import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Calendar as CalendarIcon, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Info
} from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { useExperiencesStore } from "@/store/experiences-store";
import { useBookingsStore } from "@/store/bookings-store";
import { useAuthStore } from "@/store/auth-store";
import DatePicker from "@/components/DatePicker";
import GuestPicker from "@/components/GuestPicker";

export default function BookingScreen() {
  const { experienceId } = useLocalSearchParams();
  const router = useRouter();
  const { getExperienceById } = useExperiencesStore();
  const { createBooking } = useBookingsStore();
  const { user, addBooking } = useAuthStore();
  
  const experience = getExperienceById(experienceId as string);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isGuestPickerVisible, setIsGuestPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!experience) {
      Alert.alert("Error", "Experience not found", [
        { text: "OK", onPress: () => router.back() }
      ]);
    }
  }, [experience]);

  if (!experience) {
    return null;
  }

  const totalPrice = experience.price * guestCount;

  const handleBookNow = async () => {
    if (!selectedDate) {
      Alert.alert("Please select a date");
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      const booking = {
        experienceId: experience.id,
        userId: user.id,
        date: selectedDate,
        guests: guestCount,
        totalPrice,
        status: "pending" as const,
      };

      await createBooking(booking);
      
      if (Platform.OS !== "web") {
        Alert.alert(
          "Booking Successful",
          "Your booking has been confirmed!",
          [{ text: "View Bookings", onPress: () => router.push("/bookings") }]
        );
      } else {
        router.push("/bookings");
      }
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Booking Failed", "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Book Experience",
          headerTitleStyle: styles.headerTitle,
        }}
      />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.experienceInfo}>
            <Text style={styles.experienceTitle}>{experience.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                ${experience.price}
                <Text style={styles.perPerson}> / person</Text>
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setIsDatePickerVisible(true)}
            >
              <View style={styles.selectorIcon}>
                <CalendarIcon size={20} color={Colors.text} />
              </View>
              <Text style={[
                styles.selectorText,
                !selectedDate && styles.placeholderText
              ]}>
                {selectedDate || "Select a date"}
              </Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Number of Guests</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setIsGuestPickerVisible(true)}
            >
              <View style={styles.selectorIcon}>
                <Users size={20} color={Colors.text} />
              </View>
              <Text style={styles.selectorText}>
                {guestCount} {guestCount === 1 ? "guest" : "guests"}
              </Text>
              <ChevronDown size={20} color={Colors.lightText} />
            </TouchableOpacity>
            <Text style={styles.maxGuests}>
              Maximum {experience.maxGuests} guests
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                ${experience.price} × {guestCount} {guestCount === 1 ? "guest" : "guests"}
              </Text>
              <Text style={styles.priceValue}>${totalPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>$0</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalPrice}</Text>
            </View>
          </View>

          <View style={styles.policySection}>
            <Info size={16} color={Colors.lightText} />
            <Text style={styles.policyText}>
              Free cancellation up to 24 hours before the experience starts.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.bookButton,
              (!selectedDate || isLoading) && styles.disabledButton
            ]}
            onPress={handleBookNow}
            disabled={!selectedDate || isLoading}
          >
            <Text style={styles.bookButtonText}>
              {isLoading ? "Processing..." : "Book Now"}
            </Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          visible={isDatePickerVisible}
          onClose={() => setIsDatePickerVisible(false)}
          onSelectDate={setSelectedDate}
          availableDates={experience.dates}
          selectedDate={selectedDate}
        />

        <GuestPicker
          visible={isGuestPickerVisible}
          onClose={() => setIsGuestPickerVisible(false)}
          guestCount={guestCount}
          onGuestCountChange={setGuestCount}
          maxGuests={experience.maxGuests}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  experienceInfo: {
    padding: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  experienceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.s,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  perPerson: {
    fontWeight: "normal",
    color: Colors.lightText,
  },
  section: {
    padding: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.m,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    padding: Layout.spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.card,
  },
  selectorIcon: {
    marginRight: Layout.spacing.m,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.lightText,
  },
  maxGuests: {
    fontSize: 14,
    color: Colors.lightText,
    marginTop: Layout.spacing.s,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Layout.spacing.m,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  priceValue: {
    fontSize: 16,
    color: Colors.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  policySection: {
    flexDirection: "row",
    padding: Layout.spacing.l,
    backgroundColor: Colors.highlight,
    borderRadius: Layout.borderRadius.medium,
    margin: Layout.spacing.l,
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: Colors.lightText,
    marginLeft: Layout.spacing.s,
  },
  footer: {
    padding: Layout.spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.background,
  },
});