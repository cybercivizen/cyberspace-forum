import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth", { mode: "date" }).notNull(),
  rolesId: integer("roles_id")
    .references(() => roles.id)
    .notNull(),
});

export const roles = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull().unique(),
});

export const messages = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: varchar({ length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.rolesId],
    references: [roles.id],
  }),
  many: many(messages),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
