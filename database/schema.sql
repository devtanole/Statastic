set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "fullName" text NOT NULL,
  "username" text UNIQUE NOT NULL,
  "hashedPassword" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

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

CREATE TABLE "fightRecords" (
  "fightId" serial PRIMARY KEY,
  "fighterId" int NOT NULL,
  "date" date,
  "outcome" varchar NOT NULL,
  "method" varchar,
  "promotion" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "measurements" (
  "measurementId" serial PRIMARY KEY,
  "fighterId" int NOT NULL,
  "height" decimal NOT NULL,
  "weight" decimal NOT NULL,
  "dateRecorded" date NOT NULL
);

ALTER TABLE "fightRecords" ADD FOREIGN KEY ("fighterId") REFERENCES "fighters" ("fighterId");

ALTER TABLE "measurements" ADD FOREIGN KEY ("fighterId") REFERENCES "fighters" ("fighterId");
