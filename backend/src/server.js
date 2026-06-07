import app from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`StockWise API running on http://localhost:${env.port}/api`);
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
