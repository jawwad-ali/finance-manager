import { db } from "@/db/drizzle"
import { transactions, insertTransactionsSchema, categories, accounts } from "@/db/schema"
import { Hono } from "hono"
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"
import { zValidator } from "@hono/zod-validator"
import { createId } from '@paralleldrive/cuid2';
import { z } from "zod"
import { parse, subDays } from "date-fns"

const app = new Hono()
    .get(
        "/",
        zValidator("query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional()
            })
        ),
        clerkMiddleware(),
        async (c) => {
            // Get current user info
            const auth = getAuth(c)
            const { accountId, from, to } = c.req.valid("query")

            // Getting the data of only past 30 days
            const defaultTo = new Date() // Current date
            const defaultFrom = subDays(defaultTo, 30) // Past 30 days from the current date

            // Starting Date
            const startDate = from
                ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom

            // End Date
            const endDate = to
                ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo

            // Handling Error
            if (!auth?.userId) {
                return c.json({
                    error: "Unathorized"
                }, 401)
            }

            // Fetching categories from db through drizzle
            const data = await db
                .select({
                    id: transactions.id,
                    date: transactions.date,
                    category: categories.name,
                    categoryId: transactions.categoryId,
                    payee: transactions.payee,
                    amount: transactions.amount,
                    accountId: transactions.accountId,
                    notes: transactions.notes,
                    account: accounts.name
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .leftJoin(categories, eq(transactions.categoryId, categories.id))
                .where(
                    and(
                        accountId ? eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate)
                    )
                )
                .orderBy(desc(transactions.date))

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
                id: transactions.id,
                date: transactions.date,
                categoryId: transactions.categoryId,
                payee: transactions.payee,
                amount: transactions.amount,
                accountId: transactions.accountId,
                notes: transactions.notes,
            })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(transactions.id, id),
                        eq(accounts.userId, auth.userId)
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
        zValidator("json", insertTransactionsSchema.omit({
            id: true,
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
                .insert(transactions)
                .values({
                    id: createId(),
                    ...values,
                })
                .returning()

            return c.json({ data: data })
        }
    )

    // bulk-create
    .post("/bulk-create",
        clerkMiddleware(),
        zValidator("json", z.array(
            insertTransactionsSchema.omit({
                id: true,
            })
        )),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({
                    error: "Unathorized"
                }, 401)
            }

            const data = await db
                .insert(transactions)
                .values(
                    values.map((value) => ({
                        id: createId(),
                        ...value
                    }))
                )
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

            const transactionsToDelete = db.$with(
                "transactions_to_delete"
            ).as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            inArray(transactions.id, values.ids),
                            eq(accounts.userId, auth.userId)
                        )
                    )
            )

            const deleted = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({
                    id: transactions.id
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
            insertTransactionsSchema.omit({
                id: true
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

            const transactionsToUpdate = db.$with(
                "transactions_to_update"
            ).as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            eq(accounts.userId, auth.userId)
                        )
                    )
            )

            const [data] = await db
                .with(transactionsToUpdate)
                .update(transactions)
                .set(values)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
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

            const transactionsToDelete = db.$with(
                "transactions_to_delete"
            ).as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(
                        and(
                            eq(accounts.userId, auth.userId)
                        )
                    )
            )

            const [data] = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({
                    id: transactions.id
                })

            if (!data) {
                return c.json({ error: "Not Found" }, 404)
            }
            return c.json({ data })
        }
    )

export default app