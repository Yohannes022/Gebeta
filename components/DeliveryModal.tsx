import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform
} from "react-native";
import { X, MapPin, Clock, CreditCard, Truck } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";

interface DeliveryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (address: string, time: string) => void;
  estimatedTime: number;
  price: number;
}

export default function DeliveryModal({
  visible,
  onClose,
  onConfirm,
  estimatedTime,
  price
}: DeliveryModalProps) {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);

  const deliveryFee = 5;
  const totalPrice = price + deliveryFee;
  const estimatedDeliveryTime = (estimatedTime)-(estimatedTime + 10);

  const handleConfirm = () => {
    if (!address.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onConfirm(address, estimatedDeliveryTime.toString());
      setAddress("");
    }, 1000);
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
            <Text style={styles.title}>Order Delivery</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color={Colors.lightText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your delivery address"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estimated Delivery Time</Text>
              <View style={styles.infoBox}>
                <Clock size={20} color={Colors.text} />
                <Text style={styles.infoText}>{estimatedDeliveryTime}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === "card" && styles.selectedPaymentOption,
                  ]}
                  onPress={() => setPaymentMethod("card")}
                >
                  <CreditCard size={20} color={paymentMethod === "card" ? Colors.background : Colors.text} />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === "card" && styles.selectedPaymentOptionText,
                    ]}
                  >
                    Credit Card
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === "cash" && styles.selectedPaymentOption,
                  ]}
                  onPress={() => setPaymentMethod("cash")}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === "cash" && styles.selectedPaymentOptionText,
                    ]}
                  >
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemText}>Food Price</Text>
                <Text style={styles.summaryItemValue}>${price.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemText}>Delivery Fee</Text>
                <Text style={styles.summaryItemValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryTotal}>
                <Text style={styles.summaryTotalText}>Total</Text>
                <Text style={styles.summaryTotalValue}>${totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!address.trim() || isLoading) && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={!address.trim() || isLoading}
            >
              <Truck size={20} color={Colors.background} style={styles.confirmButtonIcon} />
              <Text style={styles.confirmButtonText}>
                {isLoading ? "Processing..." : "Confirm Order"}
              </Text>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
    paddingHorizontal: Layout.spacing.m,
    backgroundColor: Colors.card,
  },
  inputIcon: {
    marginRight: Layout.spacing.s,
  },
  input: {
    flex: 1,
    paddingVertical: Layout.spacing.m,
    fontSize: 16,
    color: Colors.text,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.highlight,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
  },
  infoText: {
    marginLeft: Layout.spacing.m,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    padding: Layout.spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
  },
  selectedPaymentOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  paymentOptionText: {
    marginLeft: Layout.spacing.s,
    fontSize: 14,
    color: Colors.text,
  },
  selectedPaymentOptionText: {
    color: Colors.background,
    fontWeight: "bold",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Layout.spacing.s,
  },
  summaryItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  summaryItemValue: {
    fontSize: 16,
    color: Colors.text,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Layout.spacing.m,
    paddingTop: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryTotalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  footer: {
    padding: Layout.spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
  confirmButtonIcon: {
    marginRight: Layout.spacing.s,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.background,
  },
});