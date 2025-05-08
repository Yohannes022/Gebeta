import { Send, User as UserIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";


type Message = {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your Ethiopian cuisine assistant. Ask me anything about Ethiopian food, recipes, or restaurants!",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const formattedMessages = messages
        .filter((msg) => msg.role !== "system" || msg.id === "welcome")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      formattedMessages.push({
        role: "user",
        content: inputText.trim(),
      });

      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an Ethiopian cuisine expert assistant. Provide helpful, accurate information about Ethiopian food, recipes, cooking techniques, ingredients, restaurants, and cultural food traditions. Keep responses concise and focused on Ethiopian cuisine.",
            },
            ...formattedMessages,
          ],
        }),
      });

      const data = await response.json();
      
      if (data.completion) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.completion,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process your request. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        <View style={styles.avatarContainer}>
          {isUser ? (
            <View style={styles.userAvatar}>
              <UserIcon size={16} color={"#FFFFFF"} />
            </View>
          ) : (
            <View style={styles.botAvatar}>
              <Text style={styles.botAvatarText}>🍲</Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.botMessageBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.content}
          </Text>
          <Text
            style={[styles.timestamp, isUser && styles.userTimestamp]}
          >
            {item.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ethiopian Cuisine Assistant</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={"#3E7EA6"} size="small" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about Ethiopian cuisine..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={20} color={"#FFFFFF"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5F0",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F9F5F0",
    borderBottomWidth: 1,
    borderBottomcolor: "#DBDBDB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "100%",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginHorizontal: 8,
    alignSelf: "flex-end",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F9F5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D9A566",
    justifyContent: "center",
    alignItems: "center",
  },
  botAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  userMessageBubble: {
    backgroundColor: "#F9F5F0",
    borderBottomRightRadius: 4,
  },
  botMessageBubble: {
    backgroundColor: "#F9F5F0",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 12,
    lineHeight: 16,
    color: "#8A8A8A",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "#FFFFFF" + "99",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#F9F5F0",
    borderRadius: 16,
    alignSelf: "flex-start",
    marginLeft: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8A8A8A",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F9F5F0",
    borderTopWidth: 1,
    borderTopcolor: "#DBDBDB",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    maxHeight: 100,
    fontSize: 16,
    lineHeight: 24,
  },
  sendButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9F5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#8A8A8A",
  },
});
