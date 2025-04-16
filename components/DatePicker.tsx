import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  availableDates: string[];
  selectedDate: string | null;
}

export default function DatePicker({
  visible,
  onClose,
  onSelectDate,
  availableDates,
  selectedDate,
}: DatePickerProps) {
  const handleSelectDate = (date: string) => {
    onSelectDate(date);
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
            <Text style={styles.title}>Select a Date</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.dateList}>
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateItem,
                  selectedDate === date && styles.selectedDateItem,
                ]}
                onPress={() => handleSelectDate(date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === date && styles.selectedDateText,
                  ]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    height: "60%",
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
  dateList: {
    padding: Layout.spacing.l,
  },
  dateItem: {
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedDateItem: {
    backgroundColor: Colors.highlight,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedDateText: {
    fontWeight: "bold",
    color: Colors.primary,
  },
});