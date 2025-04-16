import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { X } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import GuestCounter from "./GuestCounter";

interface GuestPickerProps {
  visible: boolean;
  onClose: () => void;
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  maxGuests: number;
}

export default function GuestPicker({
  visible,
  onClose,
  guestCount,
  onGuestCountChange,
  maxGuests,
}: GuestPickerProps) {
  const [tempGuestCount, setTempGuestCount] = React.useState(guestCount);

  React.useEffect(() => {
    setTempGuestCount(guestCount);
  }, [guestCount, visible]);

  const handleIncrement = () => {
    if (tempGuestCount < maxGuests) {
      setTempGuestCount(tempGuestCount + 1);
    }
  };

  const handleDecrement = () => {
    if (tempGuestCount > 1) {
      setTempGuestCount(tempGuestCount - 1);
    }
  };

  const handleApply = () => {
    onGuestCountChange(tempGuestCount);
    onClose();
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
            <Text style={styles.title}>Number of Guests</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>
              This experience allows up to {maxGuests} guests
            </Text>
            
            <View style={styles.counterContainer}>
              <GuestCounter
                count={tempGuestCount}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
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
    height: "40%",
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
  content: {
    flex: 1,
    padding: Layout.spacing.l,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.lightText,
    marginBottom: Layout.spacing.xl,
  },
  counterContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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