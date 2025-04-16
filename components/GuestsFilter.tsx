import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

interface GuestsFilterProps {
  onValueChange: (filters: any) => void;
}

export function GuestsFilter({ onValueChange }: GuestsFilterProps) {
  const [selectedGuests, setSelectedGuests] = useState<number | null>(null);
  
  const guestOptions = [
    { label: "Any", value: null },
    { label: "1-2 guests", value: 2 },
    { label: "3-4 guests", value: 4 },
    { label: "5+ guests", value: 5 },
  ];

  const handleGuestsSelect = (value: number | null) => {
    setSelectedGuests(value);
    onValueChange({ guests: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Number of Guests</Text>
      <View style={styles.guestsContainer}>
        {guestOptions.map((option) => (
          <TouchableOpacity
            key={option.value || "any"}
            style={[
              styles.guestsButton,
              selectedGuests === option.value && styles.selectedButton,
            ]}
            onPress={() => handleGuestsSelect(option.value)}
          >
            <Text
              style={[
                styles.guestsText,
                selectedGuests === option.value && styles.selectedText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  guestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  guestsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  guestsText: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#fff",
  },
}); 