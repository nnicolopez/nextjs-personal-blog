import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Server-only: DATABASE_URL has no NEXT_PUBLIC_ prefix, so it never reaches the browser
export const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
export * from "./schema";
