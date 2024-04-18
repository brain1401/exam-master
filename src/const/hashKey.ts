const temp = process.env.NEXT_PUBLIC_PASSWORD_HASH_KEY;

if (!temp) {
  throw new Error("NEXT_PUBLIC_PASSWORD_HASH_KEY is not set");
}

export const hashKey = temp;
