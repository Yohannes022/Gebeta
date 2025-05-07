import { initTRPC } from '@trpc/server';
import { Context } from 'hono';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  role: string;
}

export interface TRPCContext {
  user?: User;
}

export async function createContext({ req }: { req: Request }): Promise<TRPCContext> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return {};
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as User;
    return { user: decoded };
  } catch (error) {
    return {};
  }
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new Error('Not authenticated');
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  })
);