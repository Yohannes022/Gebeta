import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Platform
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Plus,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Camera,
  Check,
  Truck
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import Layout from "@/constants/layout";
import { categories } from "@/mocks/categories";

export default function CreateExperienceScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [includes, setIncludes] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([]);
  const [isDeliverable, setIsDeliverable] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddInclude = () => {
    setIncludes([...includes, ""]);
  };

  const handleIncludeChange = (text: string, index: number) => {
    const newIncludes = [...includes];
    newIncludes[index] = text;
    setIncludes(newIncludes);
  };

  const handleRemoveInclude = (index: number) => {
    if (includes.length > 1) {
      const newIncludes = [...includes];
      newIncludes.splice(index, 1);
      setIncludes(newIncludes);
    }
  };

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
}

//   const handleSubmit = () => {
//     // Validate form
//     if (!title || !description || !price || !duration || !maxGuests || !location || !category || images.length === 0)
