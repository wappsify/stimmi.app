import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roomStatusEnum = pgEnum("room_status", [
  "private",
  "open",
  "results",
]);

export const accountsTable = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom(),
  locale: varchar({ length: 10 }).notNull().default("en"),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  account_id: uuid()
    .references(() => accountsTable.id)
    .unique(),
  created_at: timestamp().notNull().defaultNow(),
});

export const roomsTable = pgTable("rooms", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  headline: varchar({ length: 255 }).notNull().default(""),
  description: varchar({ length: 500 }).notNull().default(""),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  account_id: uuid()
    .references(() => accountsTable.id)
    .notNull(),
  status: roomStatusEnum().notNull().default("private"),
  slug: varchar({ length: 255 }).notNull(),
});

export const choicesTable = pgTable("choices", {
  id: uuid().primaryKey().defaultRandom(),
  room_id: uuid()
    .references(() => roomsTable.id)
    .notNull(),
  account_id: uuid()
    .references(() => accountsTable.id)
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 500 }).notNull().default(""),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const roomUsersTable = pgTable(
  "room_users",
  {
    room_id: uuid()
      .references(() => roomsTable.id)
      .notNull(),
    user_id: uuid()
      .references(() => usersTable.id)
      .notNull(),
    created_at: timestamp().notNull().defaultNow(),
    has_voted: boolean().notNull().default(false),
  },
  (table) => [{ pk: primaryKey({ columns: [table.room_id, table.user_id] }) }],
);

export const votesTable = pgTable(
  "votes",
  {
    user_id: uuid()
      .references(() => usersTable.id)
      .notNull(),
    room_id: uuid()
      .references(() => roomsTable.id)
      .notNull(),
    choice_id: uuid()
      .references(() => choicesTable.id)
      .notNull(),
    created_at: timestamp().notNull().defaultNow(),
    rank: integer().notNull(),
  },
  (table) => [
    { pk: primaryKey({ columns: [table.user_id, table.choice_id] }) },
  ],
);

export const resultsTable = pgTable(
  "results",
  {
    room_id: uuid()
      .references(() => roomsTable.id)
      .notNull(),
    choice_id: uuid()
      .references(() => choicesTable.id)
      .notNull(),
    points: integer().notNull(),
  },
  (table) => [
    { pk: primaryKey({ columns: [table.room_id, table.choice_id] }) },
  ],
);
