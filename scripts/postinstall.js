const { exec } = require("child_process");
require("dotenv/config");

(() => {
  if (process.env.DATABASE_URL === undefined) {
    throw new Error("DATABASE_URL is not defined");
  }

  const command = `drizzle-kit generate:pg --schema=src/db/schema.ts && drizzle-kit push:pg --driver=pg --schema=src/db/schema.ts --connectionString=${process.env.DATABASE_URL}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) console.log(`stdout: ${stdout}`);
    if (stderr) console.log(`stderr: ${stderr}`);
  });
})();
