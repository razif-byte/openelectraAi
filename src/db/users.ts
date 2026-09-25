import { db } from './index.ts';
import { users, downloads, activityLogs, workspaceNotes } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string, role: string = 'user') {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || '',
        role,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          name: name || '',
          role,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Failed to synchronize user to database.', { cause: error });
  }
}

export async function recordDownloadLog(data: {
  appId: string;
  appName: string;
  category?: string;
  userEmail?: string;
  isAdminDownload?: boolean;
  downloadUrl?: string;
  fileSize?: string;
}) {
  try {
    const result = await db.insert(downloads).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database recordDownloadLog failed:', error);
    return null;
  }
}

export async function recordActivityLog(adminEmail: string, action: string, details: string) {
  try {
    const result = await db.insert(activityLogs).values({
      adminEmail,
      action,
      details,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Database recordActivityLog failed:', error);
    return null;
  }
}

export async function getRecentActivityLogs(limit: number = 50) {
  try {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  } catch (error) {
    console.error('Database getRecentActivityLogs failed:', error);
    return [];
  }
}

export async function getWorkspaceNotes(userEmail: string) {
  try {
    return await db.select().from(workspaceNotes).where(eq(workspaceNotes.userEmail, userEmail)).orderBy(desc(workspaceNotes.createdAt));
  } catch (error) {
    console.error('Database getWorkspaceNotes failed:', error);
    return [];
  }
}

export async function saveWorkspaceNote(data: {
  userEmail: string;
  title: string;
  content: string;
  category?: string;
  keepSynced?: boolean;
  sheetId?: string;
  driveFileId?: string;
}) {
  try {
    const result = await db.insert(workspaceNotes).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Database saveWorkspaceNote failed:', error);
    throw new Error('Failed to save note to database.', { cause: error });
  }
}
