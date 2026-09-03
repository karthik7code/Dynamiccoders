import { db } from './index.ts';
import { users, citizens, applications, eligibilityAnalyses } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, fullName?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        fullName: fullName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(fullName ? { fullName } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Database user sync failed. Please try again later.', { cause: error });
  }
}

export async function getUserCitizens(userId: number) {
  try {
    return await db.select().from(citizens).where(eq(citizens.userId, userId));
  } catch (error) {
    console.error('Database getUserCitizens failed:', error);
    throw new Error('Failed to retrieve citizen records.', { cause: error });
  }
}

export async function saveCitizenDbRecord(userId: number, citizenData: typeof citizens.$inferInsert) {
  try {
    const result = await db.insert(citizens)
      .values({
        ...citizenData,
        userId,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database saveCitizenDbRecord failed:', error);
    throw new Error('Failed to save citizen database record.', { cause: error });
  }
}

export async function getUserApplications(userId: number) {
  try {
    return await db.select().from(applications).where(eq(applications.userId, userId));
  } catch (error) {
    console.error('Database getUserApplications failed:', error);
    throw new Error('Failed to retrieve scheme applications.', { cause: error });
  }
}

export async function saveApplicationDbRecord(userId: number, appData: typeof applications.$inferInsert) {
  try {
    const result = await db.insert(applications)
      .values({
        ...appData,
        userId,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database saveApplicationDbRecord failed:', error);
    throw new Error('Failed to save scheme application.', { cause: error });
  }
}
