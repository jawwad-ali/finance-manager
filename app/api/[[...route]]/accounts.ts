import { db } from "@/db/drizzle"
import { accounts, insertAccountsSchema } from "@/db/schema"
import { Hono } from "hono"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { eq } from "drizzle-orm"
import { zValidator } from "@hono/zod-validator"
import { createId } from '@paralleldrive/cuid2';

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        async (c) => {
            // Get current user info
            const auth = getAuth(c)

            // Handling Error
            if (!auth?.userId) {
                return c.json({
                    error: "Unathorized"
                }, 401)
            }

            // Fetching accounts from db through drizzle
            const data = await db
                .select({
                    id: accounts.id,
                    name: accounts.name,
                })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId)) // Returning accounts associated with this accounts

            return c.json({ data })
        })


    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertAccountsSchema.pick({
            name: true,
        })),
        async (c) => {
            // Get current user info
            const auth = getAuth(c)
            const values = c.req.valid("json")

            // Handling Error
            if (!auth?.userId) {
                return c.json({
                    error: "Unathorized"
                }, 401)
            }

            // Inserting data to database
            const [data] = await db
                .insert(accounts)
                .values({
                    id: createId(), 
                    userId: auth.userId,
                    ...values,
                })
                .returning()

            return c.json({ data: data })
        }
    )

export default app