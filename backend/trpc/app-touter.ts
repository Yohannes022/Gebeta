import { router } from "./create-context";
import hiProcedure  from "./routes/example/hi/route";
import { loginProcedure, verifyOtpProcedure } from "./routes/auth/login/login";
import { 
  addCommentProcedure, 
  deleteCommentProcedure, 
  getCommentsProcedure 
} from "./routes/recipes/comments"; // Make sure this file exists: backend/trpc/routes/recipes/comments.ts
import { 
  addRatingProcedure, 
  getRatingsProcedure, 
  getUserRatingProcedure 
} from "./routes/recipes/ratings";

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  auth: router({
    login: loginProcedure,
    verifyOtp: verifyOtpProcedure,
  }),
  recipes: router({
    comments: router({
      add: addCommentProcedure,
      delete: deleteCommentProcedure,
      getAll: getCommentsProcedure,
    }),
    ratings: router({
      add: addRatingProcedure,
      getAll: getRatingsProcedure,
      getUserRating: getUserRatingProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;