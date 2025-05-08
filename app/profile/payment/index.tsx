import { useRouter } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
 
import PaymentMethodCard from "@/components/PaymentMethodCard";

import { useProfileStore } from "@/store/profileStore";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { paymentMethods, deletePaymentMethod, setDefaultPaymentMethod } = useProfileStore();

  const handleAddPaymentMethod = () => {
    router.push("/profile/payment/add");
  };

  const handleEditPaymentMethod = (id: string) => {
    router.push(`/profile/payment/edit/${id}`);
  };

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to delete this payment method?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deletePaymentMethod(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={"#2D2D2D"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
        >
          <Plus size={20} color={"#3E7EA6"} />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
        
        {paymentMethods.length > 0 ? (
          <View style={styles.methodsContainer}>
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onEdit={() => handleEditPaymentMethod(method.id)}
                onDelete={() => handleDeletePaymentMethod(method.id)}
                onSelect={() => handleSetDefault(method.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No payment methods yet</Text>
            <Text style={styles.emptyText}>
              Add your payment methods to make checkout faster
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
  },
  scrollContent: {
    padding: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3E7EA6",
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // color: "#3E7EA6",
    fontWeight: "600",
    marginLeft: 8,
  },
  methodsContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    // color: "#8E8E8E",
    textAlign: "center",
  },
});

