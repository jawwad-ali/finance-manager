import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { subDays, differenceInDays, parse } from "date-fns"
import { db } from "@/db/drizzle";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono()
    .get("/",
        clerkMiddleware(),
        zValidator(
            "query",
            z.object({
                // Defining query parameters schema/datatype
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c)
            const { from, to, accountId } = c.req.valid("query")
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            // Getting the data of only past 30 days
            const defaultTo = new Date() // Current date
            const defaultFrom = subDays(defaultTo, 30) // Past 30 days from the current date

            // Starting Date
            const startDate = from
                ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom

            // End Date
            const endDate = to
                ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo

            // // HOw many days have user selected
            const periodLength = differenceInDays(endDate, startDate) + 1

            const lastPeriodStartDate = subDays(startDate, periodLength)
            const lastPeriodEndDate = subDays(endDate, periodLength)

            async function fetchFinancialData(userId: string, startDate: Date, endDate: Date) {

                return await db.select({
                    income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                    expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                    remaining: sum(transactions.amount).mapWith(Number),
                })
                    .from(transactions)
                    // Inner Join because transactions belong to `accounts` not to the `user`
                    .innerJoin(accounts,
                        eq(
                            transactions.accountId,
                            accounts.id
                        )
                    )
                    .where(
                        and(
                            accountId ?
                                eq(transactions.accountId, accountId) : undefined,
                            eq(accounts.userId, userId),
                            // Getting the transaction between user selected Dates
                            gte(transactions.date, startDate),
                            lte(transactions.date, endDate)
                        )
                    )

            }

            const [currentPeriod] = await fetchFinancialData(auth.userId, startDate, endDate);
            const [lastPeriod] = await fetchFinancialData(auth.userId, lastPeriodStartDate, lastPeriodEndDate);

            const incomeChange = calculatePercentageChange(
                currentPeriod.income,
                lastPeriod.income
            )
            const expenseChange = calculatePercentageChange(
                currentPeriod.expenses,
                lastPeriod.expenses
            )
            const remainingChange = calculatePercentageChange(
                currentPeriod.remaining,
                lastPeriod.remaining
            )

            // Showing user how much they have spent by category
            const category = await db.select({
                name: categories.name,
                value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
            })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .innerJoin(categories, eq(transactions.categoryId, categories.id))
                .where(
                    and(
                        accountId ?
                            eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        lt(transactions.amount, 0), // larger than
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate)
                    )
                )
                // aggregates by single name. If there is a `travel` category it will only appear once not multiple times.
                .groupBy(categories.name)
                .orderBy(desc(
                    sql`SUM(ABS(${transactions.amount}))`
                ))

            const topCategory = category.slice(0, 3)
            const otherCategory = category.slice(3)
            const otherSum = otherCategory.reduce((acc, curr) => acc + curr.value, 0)

            const finalCategory = topCategory
            if (otherCategory.length > 0) {
                finalCategory.push({
                    name: "Other",
                    value: otherSum
                })
            }

            const activeDays = await db.select({
                date: transactions.date,
                income: sql`SUM(CASE WHEN ${transactions.amount} >=0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
                expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number)
            })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        accountId ?
                            eq(transactions.accountId, accountId) : undefined,
                        eq(accounts.userId, auth.userId),
                        gte(transactions.date, startDate),
                        lte(transactions.date, endDate)
                    )
                )
                .groupBy(transactions.date)
                .orderBy(transactions.date)

            // Graph need to show 30 days data 
            const days = fillMissingDays(
                activeDays,
                startDate,
                endDate
            )

            return c.json({
                data: {
                    remainingAmount: currentPeriod.remaining,
                    remainingChange,
                    incomeAmount: currentPeriod.income,
                    incomeChange,
                    expenseAmount: currentPeriod.expenses,
                    expenseChange,
                    category: finalCategory,
                    days,
                }

            })
        }
    )

export default app;