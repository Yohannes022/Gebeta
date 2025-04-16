import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";

interface GuestCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function GuestCounter({
  count,
  onIncrement,
  onDecrement,
}: GuestCounterProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, count <= 1 && styles.disabledButton]}
        onPress={onDecrement}
        disabled={count <= 1}
      >
        <Minus
          size={20}
          color={count <= 1 ? Colors.inactive : Colors.text}
        />
      </TouchableOpacity>
      <Text style={styles.count}>{count}</Text>
      <TouchableOpacity style={styles.button} onPress={onIncrement}>
        <Plus size={20} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    borderColor: Colors.inactive,
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginHorizontal: Layout.spacing.l,
  },
});