import type { InferSelectModel } from "drizzle-orm";
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
  locale: varchar({ length: 10 }).notNull().default("en-US"),
  googleId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
});

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  account_id: uuid().references(() => accountsTable.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id: varchar({ length: 255 }).primaryKey(),
  user_id: uuid()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp().notNull().defaultNow(),
  expires_at: timestamp({ withTimezone: true, mode: "date" }).notNull(),
});

export const roomsTable = pgTable("rooms", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  headline: varchar({ length: 255 }).notNull().default(""),
  description: varchar({ length: 500 }).notNull().default(""),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  account_id: uuid()
    .references(() => accountsTable.id, { onDelete: "cascade" })
    .notNull(),
  status: roomStatusEnum().notNull().default("private"),
  slug: varchar({ length: 255 }).notNull(),
});

export const choicesTable = pgTable("choices", {
  id: uuid().primaryKey().defaultRandom(),
  room_id: uuid()
    .references(() => roomsTable.id, { onDelete: "cascade" })
    .notNull(),
  account_id: uuid()
    .references(() => accountsTable.id, { onDelete: "cascade" })
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
      .references(() => roomsTable.id, { onDelete: "cascade" })
      .notNull(),
    user_id: uuid()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    created_at: timestamp().notNull().defaultNow(),
    has_voted: boolean().notNull().default(false),
  },
  (table) => [{ pk: primaryKey({ columns: [table.room_id, table.user_id] }) }]
);

export const votesTable = pgTable(
  "votes",
  {
    user_id: uuid()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    room_id: uuid()
      .references(() => roomsTable.id, { onDelete: "cascade" })
      .notNull(),
    choice_id: uuid()
      .references(() => choicesTable.id, { onDelete: "cascade" })
      .notNull(),
    created_at: timestamp().notNull().defaultNow(),
    rank: integer().notNull(),
  },
  (table) => [{ pk: primaryKey({ columns: [table.user_id, table.choice_id] }) }]
);

export const resultsTable = pgTable(
  "results",
  {
    room_id: uuid()
      .references(() => roomsTable.id, { onDelete: "cascade" })
      .notNull(),
    choice_id: uuid()
      .references(() => choicesTable.id, { onDelete: "cascade" })
      .notNull(),
    points: integer().notNull(),
  },
  (table) => [{ pk: primaryKey({ columns: [table.room_id, table.choice_id] }) }]
);

export type Account = InferSelectModel<typeof accountsTable>;
export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type Room = InferSelectModel<typeof roomsTable>;
export type Choice = InferSelectModel<typeof choicesTable>;
export type RoomUser = InferSelectModel<typeof roomUsersTable>;
export type Vote = InferSelectModel<typeof votesTable>;
export type Result = InferSelectModel<typeof resultsTable>;
