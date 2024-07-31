import { defineConfig } from 'drizzle-kit';
import { config } from "dotenv"

config({
    path:".env.local"
})

export default defineConfig({
    schema: './db/schema.ts',
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
        host: process.env.DB_HOST!,
        database: process.env.DB_NAME!,
    },
    verbose: true,
    strict: true
});