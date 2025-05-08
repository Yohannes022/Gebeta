import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bookmark,
  ChevronLeft,
  Clock,
  Edit,
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Share2,
  Star,
  Trash2,
  Users,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import CategoryPill from "@/components/CategoryPill";
import { useAuthStore } from "@/store/authStore";
import { useRecipeStore } from "@/store/recipeStore";

type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { recipes, toggleLike, toggleSave, deleteRecipe, rateRecipe, addComment, getComments } = useRecipeStore();
  const { user } = useAuthStore();
  const [showOptions, setShowOptions] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef<TextInput>(null);

  const recipe = recipes.find((r) => r.id === id);
  const comments = recipe ? getComments(recipe.id) : [];

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Text style={{fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#000000",}}>Recipe not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.id === recipe.authorId;
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing recipe for ${recipe.title} on Ethiopian Recipe Share!`,
        title: recipe.title,
      });
    } catch (error) {
      console.error("Error sharing recipe:", error);
    }
  };

  const handleEdit = () => {
    setShowOptions(false);
    router.push(`/edit-recipe/${recipe.id}`);
  };

  const handleDelete = () => {
    setShowOptions(false);
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteRecipe(recipe.id);
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleRate = (rating: number) => {
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to rate recipes",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => router.push("/(auth)"),
          },
        ]
      );
      return;
    }

    setUserRating(rating);
    rateRecipe(recipe.id, rating);
    
    Alert.alert(
      "Thank You!",
      `You rated this recipe ${rating} stars!`,
      [{ text: "OK" }]
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to comment on recipes",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => router.push("/(auth)"),
          },
        ]
      );
      return;
    }

    addComment(recipe.id, commentText);
    setCommentText("");
    setShowComments(true);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => interactive && handleRate(star)}
            disabled={!interactive}
          >
            <Star
              size={interactive ? 32 : 16}
              color={"#D9A566"}
              fill={star <= rating ? "#D9A566" : "none"}
              style={{ marginRight: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: item.userAvatar }}
        style={styles.commentAvatar}
        contentFit="cover"
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{item.userName}</Text>
          <Text style={styles.commentDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moreIconButton}
            onPress={() => setShowOptions(!showOptions)}
          >
            <MoreVertical size={24} color={"#FFFFFF"} />
          </TouchableOpacity>

          {showOptions && isOwner && (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleEdit}
              >
                <Edit size={20} color={"#2D2D2D"} />
                <Text style={styles.optionText}>Edit Recipe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleDelete}
              >
                <Trash2 size={20} color={"#E53935"} />
                <Text style={[styles.optionText, { color: "#ED4956" }]}>
                  Delete Recipe
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{recipe.title}</Text>
            <View style={styles.authorContainer}>
              <Image
                source={{ uri: recipe.authorAvatar }}
                style={styles.authorAvatar}
              />
              <Text style={styles.authorName}>{recipe.authorName}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            {renderStars(recipe.rating || 0)}
            <Text style={styles.ratingText}>
              {recipe.rating ? recipe.rating.toFixed(1) : "No ratings"} ({recipe.ratingCount || 0} ratings)
            </Text>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={"#8A8A8A"} />
              <Text style={styles.metaText}>{totalTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color={"#8A8A8A"} />
              <Text style={styles.metaText}>{recipe.servings} servings</Text>
            </View>
            <View style={styles.metaDifficulty}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLike(recipe.id)}
            >
              <Heart
                size={20}
                color={recipe.isLiked ? "#3E7EA6" : "#8A8A8A"}
                fill={recipe.isLiked ? "#3E7EA6" : "none"}
              />
              <Text
                style={[
                  styles.actionText,
                  recipe.isLiked && { color: "#3E7EA6" },
                ]}
              >
                {recipe.likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleSave(recipe.id)}
            >
              <Bookmark
                size={20}
                color={recipe.isSaved ? "#D9A566" : "#8A8A8A"}
                fill={recipe.isSaved ? "#D9A566" : "none"}
              />
              <Text
                style={[
                  styles.actionText,
                  recipe.isSaved && { color: "#D9A566" },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={"#8A8A8A"} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowComments(!showComments)}
            >
              <MessageCircle size={20} color={"#8A8A8A"} />
              <Text style={styles.actionText}>
                {comments.length > 0 ? comments.length : "Comment"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          {recipe.region && (
            <View style={styles.regionContainer}>
              <Text style={styles.regionLabel}>Region:</Text>
              <Text style={styles.regionText}>{recipe.region}</Text>
            </View>
          )}

          <View style={styles.tagsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScrollContent}
            >
              {recipe.tags.map((tag) => (
                <CategoryPill
                  key={tag}
                  title={tag}
                  onPress={() => {}}
                  selected={false}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.rateRecipeContainer}>
            <Text style={styles.rateRecipeTitle}>Rate this recipe</Text>
            {renderStars(userRating, true)}
          </View>

          {showComments && (
            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
              
              <View style={styles.addCommentContainer}>
                <TextInput
                  ref={commentInputRef}
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !commentText.trim() && styles.disabledButton
                  ]}
                  onPress={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  <Send size={20} color={"#FFFFFF"} />
                </TouchableOpacity>
              </View>
              
              {comments.length > 0 ? (
                comments.map((comment) => renderComment({ item: comment }))
              ) : (
                <Text style={styles.noCommentsText}>
                  Be the first to comment on this recipe!
                </Text>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>
                  {ingredient.amount} {ingredient.unit}{" "}
                  <Text style={{ fontWeight: "600" }}>{ingredient.name}</Text>
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.steps.map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step.description}</Text>
                  {step.imageUrl && (
                    <Image
                      source={{ uri: step.imageUrl }}
                      style={styles.stepImage}
                      contentFit="cover"
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backIconButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreIconButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 70,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 24,
    marginLeft: 12,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  authorName: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#8E8E8E",
    marginLeft: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#8E8E8E",
    marginLeft: 6,
  },
  metaDifficulty: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor:
      "#6A8E7F" + "33", // Adding transparency
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    lineHeight: 16,
    color: "#6A8E7F",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    bordercolor: "#DBDBDB",
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    lineHeight: 24,
    marginLeft: 8,
    color: "#8E8E8E",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
  },
  regionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  regionLabel: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "600",
    marginRight: 8,
  },
  regionText: {
    fontSize: 14,
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsScrollContent: {
    paddingBottom: 8,
  },
  rateRecipeContainer: {
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  rateRecipeTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  commentsSection: {
    marginBottom: 24,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    minHeight: 44,
    maxHeight: 100,
    fontSize: 14,
    lineHeight: 24,
  },
  sendButton: {
    position: "absolute",
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundcolor: "#8E8E8E",
  },
  noCommentsText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#8E8E8E",
    textAlign: "center",
    marginVertical: 16,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "600",
  },
  commentDate: {
    fontSize: 11,
    lineHeight: 16,
    color: "#8E8E8E",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 24,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 14,
    lineHeight: 24,
    flex: 1,
  },
  stepItem: {
    flexDirection: "row" as const,
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 4,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 12,
  },
  stepImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginTop: 8,
  },
});
