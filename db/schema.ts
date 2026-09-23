import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * MVP schema: one user has one page, one page has many sections.
 * See docs/DATABASE.md for the design notes.
 */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Google account email, the identity Auth.js gives us
  email: text("email").notNull().unique(),
  // For the public URL (yourdomain.com/username)
  username: text("username").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SocialLinks = Partial<Record<"linkedin" | "github" | "instagram", string>>;

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  // Basic info
  fullName: text("full_name").notNull(),
  bio: text("bio").notNull().default(""),
  avatarUrl: text("avatar_url"),
  socialLinks: jsonb("social_links").$type<SocialLinks>().notNull().default({}),

  // Publishing
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const sections = pgTable(
  "sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),

    // Section type, e.g. "about", "projects", "skills"
    type: text("type").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull().default(""),
    order: integer("order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (t) => [index("sections_page_order").on(t.pageId, t.order)],
);
