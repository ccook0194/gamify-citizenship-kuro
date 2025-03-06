import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const citizenshipApplications = pgTable('citizenship_applications', {
  id: uuid('id').defaultRandom().primaryKey(), // Generates UUID
  twitter_id: varchar('twitter_id', { length: 50 }).notNull(),
  twitter_name: text('twitter_name').notNull(),
  ticket_number: varchar('ticket_number', { length: 50 }).notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
