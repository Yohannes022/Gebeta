import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import { X } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import PriceRangeSlider from "./PriceRangeSlider";
import GuestCounter from "./GuestCounter";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FilterModal({ 
  visible, 
  onClose, 
  onApply 
}: FilterModalProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [duration, setDuration] = useState<number | null>(null);
  const [guests, setGuests] = useState(1);

  const handleApply = () => {
    onApply({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      duration,
      guests,
    });
  };

  const handleReset = () => {
    setPriceRange([0, 100]);
    setDuration(null);
    setGuests(1);
  };

  const handleDurationSelect = (hours: number | null) => {
    setDuration(hours);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <PriceRangeSlider
                range={priceRange}
                onRangeChange={setPriceRange}
                min={0}
                max={100}
              />
              <View style={styles.priceLabels}>
                <Text style={styles.priceLabel}>${priceRange[0]}</Text>
                <Text style={styles.priceLabel}>${priceRange[1]}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <View style={styles.durationOptions}>
                <TouchableOpacity
                  style={[
                    styles.durationOption,
                    duration === null && styles.selectedDuration,
                  ]}
                  onPress={() => handleDurationSelect(null)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      duration === null && styles.selectedDurationText,
                    ]}
                  >
                    Any
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.durationOption,
                    duration === 1 && styles.selectedDuration,
                  ]}
                  onPress={() => handleDurationSelect(1)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      duration === 1 && styles.selectedDurationText,
                    ]}
                  >
                    1h
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.durationOption,
                    duration === 2 && styles.selectedDuration,
                  ]}
                  onPress={() => handleDurationSelect(2)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      duration === 2 && styles.selectedDurationText,
                    ]}
                  >
                    2h
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.durationOption,
                    duration === 3 && styles.selectedDuration,
                  ]}
                  onPress={() => handleDurationSelect(3)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      duration === 3 && styles.selectedDurationText,
                    ]}
                  >
                    3h+
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Guests</Text>
              <GuestCounter
                count={guests}
                onIncrement={() => setGuests(guests + 1)}
                onDecrement={() => guests > 1 && setGuests(guests - 1)}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Layout.borderRadius.large,
    borderTopRightRadius: Layout.borderRadius.large,
    height: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Layout.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  resetText: {
    fontSize: 16,
    color: Colors.primary,
  },
  scrollContent: {
    flex: 1,
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
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Layout.spacing.s,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  durationOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Layout.spacing.m,
    marginHorizontal: Layout.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
  },
  selectedDuration: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedDurationText: {
    color: Colors.background,
    fontWeight: "bold",
  },
  footer: {
    padding: Layout.spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.background,
  },
});