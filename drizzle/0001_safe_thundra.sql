-- ALTER TABLE "accounts" ADD COLUMN "plaid_id" text NOT NULL;
ALTER TABLE "accounts" ALTER COLUMN "plaid_id" DROP NOT NULL;