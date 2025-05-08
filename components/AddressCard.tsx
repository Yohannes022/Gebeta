import { Check, Edit, MapPin, Trash } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 

import { Address } from "@/types/restaurant";

interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function AddressCard({
  address,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  showActions = true,
}: AddressCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={onSelect}
      disabled={!onSelect}
    >
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <MapPin size={16} color={selected ? "#3E7EA6" : "#8A8A8A"} />
          <Text style={[styles.label, selected && styles.selectedText]}>
            {address.label}
          </Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        
        {selected && (
          <View style={styles.checkCircle}>
            <Check size={14} color={"#FFFFFF"} />
          </View>
        )}
      </View>
      
      <Text style={[styles.address, selected && styles.selectedText]}>
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
      </Text>
      
      <Text style={styles.city}>{address.city}</Text>
      
      {address.instructions && (
        <Text style={styles.instructions}>
          Note: {address.instructions}
        </Text>
      )}
      
      {showActions && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onEdit}
            >
              <Edit size={16} color={"#3E7EA6"} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          
          {onDelete && !address.isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onDelete}
            >
              <Trash size={16} color={"#E53935"} />
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F5F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    bordercolor: "#DBDBDB",
  },
  selectedContainer: {
    borderColor: "#3E7EA6",
    backgroundColor: "#F9F5F0" + "10", // 10% opacity
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    fontWeight: "600",
    marginLeft: 8,
  },
  selectedText: {
    color: "#3E7EA6",
  },
  defaultBadge: {
    backgroundColor: "#D9A566" + "30", // 30% opacity
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    fontWeight: "600",
    // color: "#D9A566",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F9F5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  address: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginBottom: 4,
  },
  city: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginBottom: 8,
    // color: "#8A8A8A",
  },
  instructions: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    fontStyle: "italic",
    // color: "#8A8A8A",
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    color: "#8A8A8A",
    lineHeight: 16,
    marginLeft: 4,
    // color: "#3E7EA6",
  },
  deleteText: {
    color: "#E53935",
  },
});
