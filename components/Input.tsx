import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
 


interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  maxLength,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          multiline && styles.multiline,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={"#8A8A8A"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color={"#8A8A8A"} />
            ) : (
              <Eye size={20} color={"#8A8A8A"} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    fontWeight: "500",
    // marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    bordercolor: "#DBDBDB",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  input: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // color: "#000000",
  },
  multiline: {
    minHeight: 100,
  },
  multilineInput: {
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#E53935",
  },
  errorText: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    marginTop: 4,
    // color: "#E53935",
  },
  eyeIcon: {
    padding: 10,
  },
});
