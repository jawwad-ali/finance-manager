import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from "zod"

// Account Schema
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    plaidId: text("plaid_id"),
});

// Create a schema to validate insert operations for 'accounts' table
export const insertAccountsSchema = createInsertSchema(accounts)

// Categories Schema
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    plaidId: text("plaid_id"),
});

// Create a schema to validate insert operations for 'categories' table
export const insertCategorySchema = createInsertSchema(categories)


// Transactions 
export const transactions = pgTable("transactions", {
    id: text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    date: timestamp("date", { mode: "date" }).notNull(),
    notes: text("notes"),

    accountId: text("account_id").references(() => accounts.id, {
        // onDelete: "cascade" will delete all the transactions if the account is deleted of a partiular id. 
        onDelete: "cascade",
    }).notNull(),

    categoryId: text("category_id").references(() => categories.id, {
        // onDelete: "set null" will `NOT` delete the categories if the account is deleted of a partiular id. 
        onDelete: "set null"
    }),

    // userId: text("user_id").notNull(),
    // plaidId: text("plaid_id"),
});

export const insertTransactionsSchema = createInsertSchema(transactions, {
    date: z.coerce.date(), // Convert the date string to a Date object
})

// Relationships
// One `accounts` can have many `transactions`
export const accountsRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}));

// One `categories` can have many `transactions`
export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}));

// only one `account` can be associated with `transactions`
export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));