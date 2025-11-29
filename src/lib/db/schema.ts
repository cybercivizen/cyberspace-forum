import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  profile_picture_url: varchar("profile_picture_url", { length: 500 }), // Add this
  created_at: timestamp("created_at").defaultNow().notNull(),
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
