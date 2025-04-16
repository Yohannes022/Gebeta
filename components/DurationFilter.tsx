import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

interface DurationFilterProps {
  onValueChange: (filters: any) => void;
}

export function DurationFilter({ onValueChange }: DurationFilterProps) {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  
  const durations = [
    { label: "Any", value: null },
    { label: "1-2 hours", value: "1-2" },
    { label: "2-4 hours", value: "2-4" },
    { label: "4+ hours", value: "4+" },
  ];

  const handleDurationSelect = (value: string | null) => {
    setSelectedDuration(value);
    onValueChange({ duration: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duration</Text>
      <View style={styles.durationsContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration.value || "any"}
            style={[
              styles.durationButton,
              selectedDuration === duration.value && styles.selectedButton,
            ]}
            onPress={() => handleDurationSelect(duration.value)}
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === duration.value && styles.selectedText,
              ]}
            >
              {duration.label}
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
  durationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  durationText: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#fff",
  },
}); 