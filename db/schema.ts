import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';

// Account Schema
export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),  
    plaidId: text("plaid_id"), 
});

// Create a schema to validate insert operations for 'accounts' table
export const insertAccountsSchema = createInsertSchema(accounts)