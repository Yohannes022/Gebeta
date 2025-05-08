import { Minus, Plus, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 

import { MenuItem } from "@/types/restaurant";

interface CartItemProps {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onUpdateInstructions?: (instructions: string) => void;
}

export default function CartItem({
  menuItem,
  quantity,
  specialInstructions,
  onUpdateQuantity,
  onRemove,
  onUpdateInstructions,
}: CartItemProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleIncrement = () => {
    onUpdateQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(quantity - 1);
    } else {
      onRemove();
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.quantity}>{quantity}x</Text>
          <Text style={styles.name}>{menuItem.name}</Text>
        </View>
        <Text style={styles.price}>{menuItem.price * quantity} Birr</Text>
      </View>
      
      {specialInstructions && (
        <Text style={styles.instructions}>
          Note: {specialInstructions}
        </Text>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.instructionsButton}
          onPress={toggleInstructions}
        >
          <Text style={styles.instructionsButtonText}>
            {specialInstructions ? "Edit Note" : "Add Note"}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleDecrement}
          >
            {quantity === 1 ? (
              <Trash2 size={16} color={"#E53935"} />
            ) : (
              <Minus size={16} color={"#2D2D2D"} />
            )}
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleIncrement}
          >
            <Plus size={16} color={"#2D2D2D"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: "row",
    flex: 1,
    marginRight: 8,
  },
  quantity: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    fontWeight: "600",
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    fontWeight: "600",
  },
  instructions: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    color: "#8E8E8E",
    marginBottom: 12,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  instructionsButton: {
    paddingVertical: 6,
  },
  instructionsButtonText: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    fontWeight: "500",
    // color: "#3E7EA6",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
});
