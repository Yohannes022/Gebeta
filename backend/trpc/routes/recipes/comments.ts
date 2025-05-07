import { z } from "zod";
import { protectedProcedure } from "../../create-context";

// Define the add comment input schema
const addCommentSchema = z.object({
  recipeId: z.string(),
  content: z.string().min(1, "Comment cannot be empty"),
});

// Define the delete comment input schema
const deleteCommentSchema = z.object({
  recipeId: z.string(),
  commentId: z.string(),
});

// Add comment procedure
export const addCommentProcedure = protectedProcedure
  .input(addCommentSchema)
  .mutation(async ({ input, ctx }) => {
    // In a real app, this would:
    // 1. Validate the user is authenticated
    // 2. Add the comment to the database
    // 3. Return the created comment

    // For demo purposes, we'll just return a mock comment
    const newComment = {
      id: `comment-${Date.now()}`,
      recipeId: input.recipeId,
      userId: ctx.user.id,
      userName: ctx.user.name,
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
      content: input.content,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      comment: newComment,
    };
  });

// Delete comment procedure
export const deleteCommentProcedure = protectedProcedure
  .input(deleteCommentSchema)
  .mutation(async ({ input, ctx }) => {
    // In a real app, this would:
    // 1. Validate the user is authenticated
    // 2. Check if the user is the comment owner or has admin rights
    // 3. Delete the comment from the database

    // For demo purposes, we'll just return success
    return {
      success: true,
      message: "Comment deleted successfully",
    };
  });

// Get comments procedure
export const getCommentsProcedure = protectedProcedure
  .input(z.object({ recipeId: z.string() }))
  .query(async ({ input }) => {
    // In a real app, this would:
    // 1. Fetch comments for the recipe from the database
    // 2. Return the comments

    // For demo purposes, we'll just return mock comments
    const mockComments = [
      {
        id: "comment-1",
        recipeId: input.recipeId,
        userId: "user-1",
        userName: "John Doe",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
        content: "This recipe is amazing! I tried it last weekend and my family loved it.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "comment-2",
        recipeId: input.recipeId,
        userId: "user-2",
        userName: "Jane Smith",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
        content: "I added a bit more berbere spice and it turned out perfect!",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ];

    return {
      success: true,
      comments: mockComments,
    };
  });