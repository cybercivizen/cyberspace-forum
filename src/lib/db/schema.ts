import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Enum for friendship status
export const friendshipStatusEnum = pgEnum("friendship_status", [
  "pending",
  "accepted",
  "blocked",
]);

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth", { mode: "date" }).notNull(),
  profile_picture_url: varchar("profile_picture_url", { length: 500 }),
  rolesId: integer("roles_id")
    .references(() => roles.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 500 }).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  picture_url: varchar("picture_url", { length: 500 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  friendId: integer("friend_id")
    .references(() => users.id)
    .notNull(),
  status: friendshipStatusEnum("status").notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const userGroups = pgTable("user_groups", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  groupId: integer("group_id")
    .references(() => groups.id)
    .notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.rolesId],
    references: [roles.id],
  }),
  messages: many(messages),
  userGroups: many(userGroups),
  friendshipsInitiated: many(friendships, { relationName: "user" }),
  friendshipsReceived: many(friendships, { relationName: "friend" }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  userGroups: many(userGroups),
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, {
    fields: [friendships.userId],
    references: [users.id],
    relationName: "user",
  }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
    relationName: "friend",
  }),
}));

export const userGroupsRelations = relations(userGroups, ({ one }) => ({
  user: one(users, {
    fields: [userGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [userGroups.groupId],
    references: [groups.id],
  }),
}));
