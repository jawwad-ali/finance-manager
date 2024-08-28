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

    // Getting a field by an id
    .get("/:id",
        zValidator("param",
            z.object({
                id: z.string().optional()
            })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({
                    error: "Id is Required"
                }, 400)
            }
            if (!auth?.userId) {
                return c.json({ error: "Unathorized" }, 401)
            }

            const [data] = await db.select({
                id: accounts.id,
                name: accounts.name
            })
                .from(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id)
                    )
                )
            if (!data) {
                return c.json({ error: "Not Found" }, 404)
            }
            return c.json({ data }, 200)
        }
    )

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

    // bulk-delete
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

    .patch("/:id",
        clerkMiddleware(),
        // Validating the id
        zValidator("param",
            z.object({
                id: z.string().optional()
            })
        ),
        // Validating the json obj
        zValidator(
            "json",
            insertAccountsSchema.pick({
                name: true
            })
        ),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")
            const values = c.req.valid("json")

            if (!id) {
                return c.json({
                    error: "Id is Required"
                }, 400)
            }
            if (!auth?.userId) {
                return c.json({
                    error: "Unathorized"
                }, 401)
            }

            const [data] = await db
                .update(accounts)
                .set(values)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id)
                    )
                )
                .returning()
            if (!data) {
                return c.json({ error: "Not Found" }, 404)
            }
            return c.json({ data })
        }
    )

    .delete("/:id",
        clerkMiddleware(),
        // Validating the id
        zValidator("param",
            z.object({
                id: z.string().optional()
            })
        ),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({
                    error: "Id is Required"
                }, 400)
            }
            if (!auth?.userId) {
                return c.json({
                    error: "Unathorized"
                }, 401)
            }

            const [data] = await db
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(accounts.id, id)
                    )
                )
                .returning()
            if (!data) {
                return c.json({ error: "Not Found" }, 404)
            }
            return c.json({ data })
        }
    )

export default app