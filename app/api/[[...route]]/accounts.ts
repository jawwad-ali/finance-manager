import { db } from "@/db/drizzle"
import { accounts } from "@/db/schema"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { eq } from "drizzle-orm"

const app = new Hono()
    .get( 
        "/", 
        clerkMiddleware(),
        async (c) => {
            // Get current user info
            const auth = getAuth(c)

            // Handling Error
            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: "Please Login" }, 401)
                })
            }

            // Fetching accounts from db through drizzle
            const data = await db
                .select({
                    id: accounts.id,
                    name: accounts.name,
                })
                .from(accounts)
                .where(eq(accounts.id, auth.userId)) // Returning accounts associated with this accounts

            return c.json({ data })
        })

export default app