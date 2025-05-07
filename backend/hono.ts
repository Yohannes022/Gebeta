
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-touter";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 86400,
}));

app.use("/trpc/*", trpcServer({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    console.error(`Error in tRPC handler ${path}:`, error);
  },
}));

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default {
  port: 5000,
  fetch: app.fetch,
};
