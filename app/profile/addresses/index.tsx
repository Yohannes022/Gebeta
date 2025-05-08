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
 
import AddressCard from "@/components/AddressCard";

import { useProfileStore } from "@/store/profileStore";

export default function AddressesScreen() {
  const router = useRouter();
  const { addresses, deleteAddress, setDefaultAddress } = useProfileStore();

  const handleAddAddress = () => {
    router.push("/profile/addresses/add");
  };

  const handleEditAddress = (id: string) => {
    router.push(`/profile/addresses/edit/${id}`);
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteAddress(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
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
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Plus size={20} color={"#3E7EA6"} />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>
        
        {addresses.length > 0 ? (
          <View style={styles.addressesContainer}>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => handleEditAddress(address.id)}
                onDelete={() => handleDeleteAddress(address.id)}
                onSelect={() => handleSetDefault(address.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No addresses yet</Text>
            <Text style={styles.emptyText}>
              Add your delivery addresses to make checkout faster
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
    insetBlockEnd: 10,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#3E7EA6",
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 24,
    // color: "#3E7EA6",
    fontWeight: "600",
    marginLeft: 8,
  },
  addressesContainer: {
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
    fontSize: 14,
    color: "#000000",
    lineHeight: 24,
    // color: "#8E8E8E",
    textAlign: "center",
  },
});