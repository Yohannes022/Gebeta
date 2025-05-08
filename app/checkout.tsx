import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { CreditCard, MapPin, Share2, Smartphone } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import AddressCard from "@/components/AddressCard";
import Button from "@/components/Button";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import { useCartStore } from "@/store/cartStore";
import { useProfileStore } from "@/store/profileStore";

export default function CheckoutScreen() {
  const router = useRouter();
  const { 
    cartItems, 
    getCartSubtotal, 
    getDeliveryFee, 
    getTax, 
    createOrder,
    restaurantId,
    isLoading
  } = useCartStore();
  
  const { addresses, paymentMethods } = useProfileStore();
  
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(a => a.isDefault)?.id || addresses[0]?.id
  );
  
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
    paymentMethods.find(p => p.isDefault)?.id || paymentMethods[0]?.id
  );
  
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [isCustomTip, setIsCustomTip] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  
  const subtotal = getCartSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = subtotal + deliveryFee + tax + (isCustomTip ? parseFloat(customTip || "0") : tip);
  
  const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPaymentMethodId);
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      Alert.alert("Error", "Please select a delivery address");
      return;
    }
    
    if (!selectedPaymentMethodId) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }
    
    try {
      const order = createOrder(
        selectedPaymentMethod?.type || "cash",
        selectedAddressId,
        isCustomTip ? parseFloat(customTip || "0") : tip
      );
      
      router.replace(`/order/${order.id}`);
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };

  const handleTipSelection = (amount: number) => {
    setTip(amount);
    setIsCustomTip(false);
  };

  const handleCustomTip = () => {
    setIsCustomTip(true);
    setTip(0);
  };

  const handleAddAddress = () => {
    router.push(`/profile/addresses/add`);
  };

  const handleAddPaymentMethod = () => {
    router.push(`/profile/payment/add`);
  };

  const generateReceiptHTML = () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px dashed #ccc;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #5C3C10;
              margin-bottom: 5px;
            }
            .receipt-title {
              font-size: 18px;
              color: #666;
            }
            .info {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .items {
              margin-bottom: 20px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .item-name {
              flex: 1;
            }
            .item-qty {
              width: 50px;
              text-align: center;
            }
            .item-price {
              width: 80px;
              text-align: right;
            }
            .summary {
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .total {
              font-weight: bold;
              font-size: 18px;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px dashed #ccc;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Habesha Cuisine</div>
            <div class="receipt-title">Order Receipt</div>
          </div>
          
          <div class="info">
            <div class="info-row">
              <span>Date:</span>
              <span>${date}</span>
            </div>
            <div class="info-row">
              <span>Time:</span>
              <span>${time}</span>
            </div>
            <div class="info-row">
              <span>Payment Method:</span>
              <span>${selectedPaymentMethod?.type || 'N/A'}</span>
            </div>
          </div>
          
          <div class="items">
            <h3>Order Items</h3>
            ${cartItems.map(item => `
              <div class="item">
                <div class="item-name">${item.name}</div>
                <div class="item-qty">x${item.quantity}</div>
                <div class="item-price">${item.price * item.quantity} Birr</div>
              </div>
            `).join('')}
          </div>
          
          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)} Birr</span>
            </div>
            <div class="summary-row">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)} Birr</span>
            </div>
            <div class="summary-row">
              <span>Tax (15%):</span>
              <span>${tax.toFixed(2)} Birr</span>
            </div>
            <div class="summary-row">
              <span>Driver Tip:</span>
              <span>${(isCustomTip ? parseFloat(customTip || "0") : tip).toFixed(2)} Birr</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)} Birr</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your order!</p>
            <p>Habesha Cuisine - Authentic Ethiopian Food</p>
          </div>
        </body>
      </html>
    `;
  };

  const generateAndShareReceipt = async () => {
    if (Platform.OS === 'web') {
      Alert.alert("Not Available", "Receipt download is not available on web.");
      return;
    }
    
    try {
      setIsGeneratingReceipt(true);
      
      const html = generateReceiptHTML();
      const { uri } = await Print.printToFileAsync({ html });
      
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri);
      } else {
        const pdfName = `receipt-${Date.now()}.pdf`;
        const destinationUri = FileSystem.documentDirectory + pdfName;
        
        await FileSystem.moveAsync({
          from: uri,
          to: destinationUri,
        });
        
        await Sharing.shareAsync(destinationUri);
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
      Alert.alert("Error", "Failed to generate receipt. Please try again.");
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#3E7EA6"} />
        <Text style={styles.loadingText}>Processing your order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MapPin size={20} color={"#3E7EA6"} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <TouchableOpacity onPress={handleAddAddress}>
              <Text style={styles.addText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          
          {addresses.length > 0 ? (
            <View style={styles.addressesContainer}>
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  selected={address.id === selectedAddressId}
                  onSelect={() => setSelectedAddressId(address.id)}
                  showActions={false}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No addresses found</Text>
              <Button
                title="Add Address"
                onPress={handleAddAddress}
                variant="outline"
                size="small"
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              {selectedPaymentMethod?.type === "card" ? (
                <CreditCard size={20} color={"#3E7EA6"} />
              ) : (
                <Smartphone size={20} color={"#3E7EA6"} />
              )}
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <TouchableOpacity onPress={handleAddPaymentMethod}>
              <Text style={styles.addText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          
          {paymentMethods.length > 0 ? (
            <View style={styles.paymentMethodsContainer}>
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  selected={method.id === selectedPaymentMethodId}
                  onSelect={() => setSelectedPaymentMethodId(method.id)}
                  showActions={false}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No payment methods found</Text>
              <Button
                title="Add Payment Method"
                onPress={handleAddPaymentMethod}
                variant="outline"
                size="small"
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tip Driver</Text>
          <View style={styles.tipContainer}>
            {[0, 20, 30, 50].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.tipButton,
                  !isCustomTip && tip === amount && styles.selectedTipButton,
                ]}
                onPress={() => handleTipSelection(amount)}
              >
                <Text
                  style={[
                    styles.tipButtonText,
                    !isCustomTip && tip === amount && styles.selectedTipText,
                  ]}
                >
                  {amount === 0 ? "No Tip" : `${amount} Birr`}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[
                styles.tipButton,
                isCustomTip && styles.selectedTipButton,
              ]}
              onPress={handleCustomTip}
            >
              <Text
                style={[
                  styles.tipButtonText,
                  isCustomTip && styles.selectedTipText,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
          
          {isCustomTip && (
            <View style={styles.customTipContainer}>
              <TextInput
                style={styles.customTipInput}
                placeholder="Enter tip amount"
                placeholderTextColor={"#8A8A8A"}
                keyboardType="numeric"
                value={customTip}
                onChangeText={setCustomTip}
              />
              <Text style={styles.currencyText}>Birr</Text>
            </View>
          )}
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal.toFixed(2)} Birr</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{deliveryFee.toFixed(2)} Birr</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (15%)</Text>
            <Text style={styles.summaryValue}>{tax.toFixed(2)} Birr</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Driver Tip</Text>
            <Text style={styles.summaryValue}>
              {(isCustomTip ? parseFloat(customTip || "0") : tip).toFixed(2)} Birr
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} Birr</Text>
          </View>
          
          {Platform.OS !== 'web' && (
            <TouchableOpacity 
              style={styles.receiptButton}
              onPress={generateAndShareReceipt}
              disabled={isGeneratingReceipt}
            >
              {isGeneratingReceipt ? (
                <ActivityIndicator size="small" color={"#3E7EA6"} />
              ) : (
                <>
                  <Share2 size={16} color={"#3E7EA6"} />
                  <Text style={styles.receiptButtonText}>Generate Receipt</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    color: "#8E8E8E",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginLeft: 8,
  },
  addText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3E7EA6",
    fontWeight: "600",
  },
  addressesContainer: {
    marginTop: 8,
  },
  paymentMethodsContainer: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8E8E8E",
    marginBottom: 12,
  },
  emptyButton: {
    minWidth: 150,
  },
  tipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  tipButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    bordercolor: "#DBDBDB",
  },
  selectedTipButton: {
    backgroundColor: "#FFFFFF" + "20", // 20% opacity
    borderColor: "#3E7EA6",
  },
  tipButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  selectedTipText: {
    color: "#3E7EA6",
    fontWeight: "600",
  },
  customTipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  customTipInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  currencyText: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 12,
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    margin: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8E8E8E",
  },
  summaryValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E7EA6",
  },
  receiptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#3E7EA6",
    borderRadius: 8,
    backgroundColor: "#FFFFFF" + "10",
  },
  receiptButtonText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#3E7EA6",
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
  },
});
