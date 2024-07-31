import { pgTable, PgTable, serial, text } from "drizzle-orm/pg-core";

// Account Schema
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    plaidId: text("plaid_id").notNull(),
});

// 2.10.50