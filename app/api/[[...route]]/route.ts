import { Hono } from "hono";
import { handle } from "hono/vercel"

import accounts from "./accounts";
import { HTTPException } from "hono/http-exception";

export const runtime = 'edge'
const app = new Hono().basePath('/api')

app.onError((err, c) => {
    if (err instanceof HTTPException) { 
        return err.getResponse()
    } 
    return c.json("Internal Error", 500)
}) 

// Declaring Routes  
const routes = app
    .route("/accounts", accounts)

export const GET = handle(app);

// Generating RPC types
export type AppType = typeof routes;