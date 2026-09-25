import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Users table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// App Download Logs
export const downloads = pgTable('downloads', {
  id: serial('id').primaryKey(),
  appId: text('app_id').notNull(),
  appName: text('app_name').notNull(),
  category: text('category'),
  userEmail: text('user_email'),
  isAdminDownload: boolean('is_admin_download').default(false),
  downloadUrl: text('download_url'),
  fileSize: text('file_size'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  adminEmail: text('admin_email').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Google Workspace & Notes (Keep & Sheets records)
export const workspaceNotes = pgTable('workspace_notes', {
  id: serial('id').primaryKey(),
  userEmail: text('user_email').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('general'),
  keepSynced: boolean('keep_synced').default(false),
  sheetId: text('sheet_id'),
  driveFileId: text('drive_file_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
