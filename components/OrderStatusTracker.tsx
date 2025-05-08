import { Bike, Check, ChefHat, Clock, Package } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
 

import { Order } from "@/types/restaurant";

interface OrderStatusTrackerProps {
  status: Order["status"];
}

export default function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const statuses: Array<{
    key: Order["status"];
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      key: "confirmed",
      label: "Confirmed",
      icon: <Check size={20} color={"#FFFFFF"} />,
    },
    {
      key: "preparing",
      label: "Preparing",
      icon: <ChefHat size={20} color={"#FFFFFF"} />,
    },
    {
      key: "out-for-delivery",
      label: "On the way",
      icon: <Bike size={20} color={"#FFFFFF"} />,
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: <Package size={20} color={"#FFFFFF"} />,
    },
  ];

  const getCurrentStatusIndex = () => {
    if (status === "pending") return -1;
    if (status === "cancelled") return -1;
    return statuses.findIndex(s => s.key === status);
  };

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <View style={styles.container}>
      {status === "pending" && (
        <View style={styles.pendingContainer}>
          <View style={styles.pendingIconContainer}>
            <Clock size={24} color={"#D9A566"} />
          </View>
          <Text style={styles.pendingText}>
            Waiting for restaurant to confirm your order...
          </Text>
        </View>
      )}

      {status === "cancelled" && (
        <View style={styles.cancelledContainer}>
          <Text style={styles.cancelledText}>
            This order has been cancelled
          </Text>
        </View>
      )}

      {status !== "pending" && status !== "cancelled" && (
        <>
          <View style={styles.stepsContainer}>
            {statuses.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <React.Fragment key={step.key}>
                  {index > 0 && (
                    <View
                      style={[
                        styles.connector,
                        isCompleted && styles.completedConnector,
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.step,
                      isCompleted && styles.completedStep,
                      isCurrent && styles.currentStep,
                    ]}
                  >
                    {step.icon}
                  </View>
                </React.Fragment>
              );
            })}
          </View>

          <View style={styles.labelsContainer}>
            {statuses.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <View key={step.key} style={styles.labelContainer}>
                  <Text
                    style={[
                      styles.label,
                      isCompleted && styles.completedLabel,
                      isCurrent && styles.currentLabel,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  pendingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9A566" + "20", // 20% opacity
    padding: 16,
    borderRadius: 12,
  },
  pendingIconContainer: {
    marginRight: 12,
  },
  pendingText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    flex: 1,
    // color: "#D9A566",
  },
  cancelledContainer: {
    backgroundColor: "#E53935" + "20", // 20% opacity
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelledText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    fontWeight: "500",
    // color: "#E53935",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    bordercolor: "#DBDBDB",
  },
  completedStep: {
    backgroundColor: "#F9F5F0",
    borderColor: "#3E7EA6",
  },
  currentStep: {
    borderColor: "#3E7EA6",
    borderWidth: 3,
  },
  connector: {
    flex: 1,
    height: 3,
    backgroundcolor: "#DBDBDB",
  },
  completedConnector: {
    backgroundColor: "#F9F5F0",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelContainer: {
    width: 80,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    textAlign: "center",
    // color: "#8E8E8E",
  },
  completedLabel: {
    color: "#000000",
    fontWeight: "500",
  },
  currentLabel: {
    color: "#3E7EA6",
    fontWeight: "600",
  },
});
