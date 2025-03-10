import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const citizenshipApplications = pgTable('citizenship_applications', {
  id: uuid('id').defaultRandom().primaryKey(), // Generates UUID
  twitter_id: text('twitter_id').notNull().unique(),
  twitter_name: text('twitter_name').unique(),
  twitter_username: text('twitter_username'),
  twitter_profile_picture: text('twitter_profile_picture'),
  ticket_number: text('ticket_number').unique().notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending'),
  status_remark: text('status_remark'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
