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

// Define a route for the root URL with GET method
app
    .get('/', 
        // Middleware for authentication
        clerkMiddleware(), 
        (c) => {
            // Retrieve authentication information from the request context
            const auth = getAuth(c);

            // Check if the user is authenticated
            if (!auth?.userId) {
                // Respond with an error if the user is not authenticated
                return c.json({
                    error: "Unauthorized"
                });
            }
            // Respond with a welcome message and the authenticated user's ID
            return c.json({ 
                message: 'Hello HonoJS!', 
                userId: auth?.userId 
            });
        }
    );

export const GET = handle(app);

// 1.10.50