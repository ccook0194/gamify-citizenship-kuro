import { pgTable, text, varchar, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { citizenshipApplications } from './citizenshipSchema';

export const mayorChats = pgTable('mayor_chats', {
  id: uuid('id').defaultRandom().primaryKey(),
  twitter_id: text('twitter_id')
    .notNull()
    .references(() => citizenshipApplications.twitter_id, { onDelete: 'cascade' }),
  messages: jsonb('messages').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
