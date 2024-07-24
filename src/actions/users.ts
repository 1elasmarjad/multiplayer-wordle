"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { env } from "~/env";

const cookieKey = "multiplayer_wordle_id";

/**
 * Checks the requesters cookies for a user ID
 * @returns The user ID if it exists, otherwise undefined
 */
export async function getUserId(opts: {
  createIfNotExists: boolean;
}): Promise<string | null> {
  const cookieValue = cookies().get(cookieKey)?.value;

  if (!opts.createIfNotExists && !cookieValue) {
    return null;
  }

  if (cookieValue) {
    return cookieValue;
  }

  return await handoutUserId();
}

/**
 * Gives the requester a user ID
 * @param userId The user ID to set
 */
export async function handoutUserId(): Promise<string> {
  const generatedUUID = randomUUID();
  cookies().set(cookieKey, generatedUUID, {
    secure: env.NODE_ENV === "production",
  });
  return generatedUUID;
}
