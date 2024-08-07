import { Hono } from "hono";
import { handle } from "hono/vercel"

import accounts from "./accounts";
import categories from "./categories";

export const runtime = 'edge'
const app = new Hono().basePath('/api')

// Declaring Routes  
const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories)

// Methods
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// Generating RPC types
export type AppType = typeof routes;