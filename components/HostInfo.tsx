import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity 
} from "react-native";
import { Star, MessageCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { Host } from "@/types";

interface HostInfoProps {
  host: Host;
}

export default function HostInfo({ host }: HostInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: host.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{host.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.rating} fill={Colors.rating} />
            <Text style={styles.rating}>
              {host.rating.toFixed(1)} · {host.reviewCount} reviews
            </Text>
          </View>
          {host.isSuperhost && (
            <View style={styles.superhostBadge}>
              <Text style={styles.superhostText}>Superhost</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.description}>{host.description}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{host.responseRate}%</Text>
          <Text style={styles.statLabel}>Response rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{host.responseTime}</Text>
          <Text style={styles.statLabel}>Response time</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.contactButton}>
        <MessageCircle size={20} color={Colors.text} />
        <Text style={styles.contactButtonText}>Contact Host</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.l,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    marginBottom: Layout.spacing.m,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Layout.spacing.m,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.text,
  },
  superhostBadge: {
    backgroundColor: Colors.highlight,
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.small,
    alignSelf: "flex-start",
  },
  superhostText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: Layout.spacing.l,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: Layout.spacing.l,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
  },
  contactButtonText: {
    marginLeft: Layout.spacing.s,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
});