-- This migration is a safety net: if the initial migration was mistakenly recorded as applied
-- (or shipped empty), we ensure required tables/enums exist.

-- enums
DO $$ BEGIN
  CREATE TYPE "SourceKind" AS ENUM ('RSS','API');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "AssetKind" AS ENUM ('STABLECOIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- tables
CREATE TABLE IF NOT EXISTS "NewsSource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "kind" "SourceKind" NOT NULL,
  "url" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NewsSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "NewsItem" (
  "id" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3),
  "summary" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "score" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- FK + uniques
DO $$ BEGIN
  ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "NewsSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE UNIQUE INDEX "NewsItem_url_key" ON "NewsItem"("url");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "ApySource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ApySource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ApyOpportunity" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "chain" TEXT,
  "symbol" TEXT NOT NULL,
  "assetKind" "AssetKind" NOT NULL DEFAULT 'STABLECOIN',
  "apy" DOUBLE PRECISION NOT NULL,
  "tvlUsd" DOUBLE PRECISION,
  "url" TEXT,
  "riskNote" TEXT,
  "source" TEXT,
  "externalId" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApyOpportunity_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  CREATE UNIQUE INDEX "ApyOpportunity_externalId_key" ON "ApyOpportunity"("externalId");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "TelegramIntegration" (
  "id" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "botToken" TEXT NOT NULL,
  "chatId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TelegramIntegration_pkey" PRIMARY KEY ("id")
);
