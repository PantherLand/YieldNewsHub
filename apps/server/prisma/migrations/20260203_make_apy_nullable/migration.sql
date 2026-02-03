-- Make APY nullable so we can include CeFi opportunities even when the exact APY is unavailable.
ALTER TABLE "ApyOpportunity" ALTER COLUMN "apy" DROP NOT NULL;
