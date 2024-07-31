import { config } from "dotenv"
import { neon,Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator" 

config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL!) 
const db = drizzle(sql)
// const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
// const db = drizzle(pool) 

const main = async () => {
    try {
        await migrate(db, { migrationsFolder: "drizzle" })
    }
    catch (err) {
        console.error(err)
        process.exit(1)
    }
}

main()