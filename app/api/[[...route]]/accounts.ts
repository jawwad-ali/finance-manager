import { db } from "@/db/drizzle"
import { accounts, insertAccountsSchema } from "@/db/schema"
import { Hono } from "hono"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { and, eq, inArray } from "drizzle-orm"
import { zValidator } from "@hono/zod-validator"
import { createId } from '@paralleldrive/cuid2';
import { z } from "zod"

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

    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator("json",
            z.object({
                ids: z.array(z.string())
            })
        ),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({
                    error: "Unathorized"
                }, 401)
            }

            const deleted = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        inArray(accounts.id, values.ids)
                    )
                ).returning({
                    id: accounts.id
                })
            return c.json({ data: `${deleted} deleted` })
        }
    )

export default app