import { Hono } from "hono";
import { handle } from "hono/vercel"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

export const runtime = 'edge'

const appSchema = z.object({
    test: z.string(),
})

const app = new Hono().basePath('/api')

// GET REQUEST WITH THE clerkMiddleware(). clerkMiddleware is the middleware checks if the user is signedIn 
app
    .get('/', clerkMiddleware(), (c) => {
        const auth = getAuth(c)

        if (!auth?.userId) {
            return c.json({
                error: "Unauthorized"
            })
        }
        return c.json({ message: 'Hello HonoJS!', userId: auth?.userId })
    })

// Dynamic Routes

export const GET = handle(app)
export const POST = handle(app)

// 1.10.50