-- Set warnings (optional, harmless)
SET client_min_messages TO warning;

-- WARNING: Drops all tables in the public schema
DROP SCHEMA IF EXISTS "public" CASCADE;
CREATE SCHEMA "public";

-- Users table
CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "fullName" text NOT NULL,
  "username" text UNIQUE NOT NULL,
  "hashedPassword" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Fighters table
CREATE TABLE "fighters" (
  "fighterId" serial PRIMARY KEY,
  "firstName" text NOT NULL,
  "lastName" text NOT NULL,
  "dob" date NOT NULL,
  "finishes" integer,
  "weightMisses" integer,
  "pullOuts" integer,
  "notes" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Fight Records table (cascades on fighter deletion)
CREATE TABLE "fightRecords" (
  "fightId" serial PRIMARY KEY,
  "fighterId" int NOT NULL,
  "date" date,
  "outcome" varchar NOT NULL,
  "method" varchar,
  "promotion" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_fighter
    FOREIGN KEY ("fighterId")
    REFERENCES "fighters" ("fighterId")
    ON DELETE CASCADE
);

-- Measurements table (cascades on fighter deletion)
CREATE TABLE "measurements" (
  "measurementId" serial PRIMARY KEY,
  "fighterId" int NOT NULL,
  "height" decimal NOT NULL,
  "weight" decimal NOT NULL,
  "dateRecorded" date NOT NULL,
  CONSTRAINT fk_measure_fighter
    FOREIGN KEY ("fighterId")
    REFERENCES "fighters" ("fighterId")
    ON DELETE CASCADE
);
