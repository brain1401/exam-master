import "server-only";

const temp = process.env.PASSWORD_HASH_KEY;

if (!temp) {
  throw new Error("PASSWORD_HASH_KEY is not set");
}

export const hashKey = temp;
