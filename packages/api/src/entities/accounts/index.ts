import { eq } from "drizzle-orm";

import { db } from "../../db";
import type { Account, User } from "../../db/schema";
import { accountsTable, usersTable } from "../../db/schema";

export const getAccountById = async (id: string): Promise<Account | null> => {
  const [account] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.id, id));
  return account;
};

export const getAccountByGoogleId = async (
  googleId: string
): Promise<
  { account: Account; user: User } | { account: null; user: null }
> => {
  const [account] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.googleId, googleId));

  if (account) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.account_id, account.id));

    return { account, user };
  }

  return { account: null, user: null };
};

export const createAccount = async (googleUserId: string, name: string) => {
  const [account] = await db
    .insert(accountsTable)
    .values({
      googleId: googleUserId,
      name,
    })
    .returning();

  const [user] = await db
    .insert(usersTable)
    .values({
      account_id: account.id,
    })
    .returning();

  return { account, user };
};
