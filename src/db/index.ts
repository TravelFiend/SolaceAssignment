import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("No DATABASE_URL found. Connection to DB failed.");
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient, { schema });
  return db;
};

export default setup();
