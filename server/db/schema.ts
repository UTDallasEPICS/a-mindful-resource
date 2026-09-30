import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'

export const user = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text('type').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  phoneNumber: text('phoneNumber', { length: 10 }).notNull().unique(),
  password: text('password', { length: 255 }).notNull(),
})

export const services = sqliteTable(
  'services',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    phoneNumber: text('phoneNumber', { length: 10 }).notNull().unique(),
    name: text('name').notNull(),
    URL: text('URL'),
    email: text('email'),
    description: text('description').notNull(),
    operatingHours: text('operatingHours').notNull(),
    license_credentials: text('license_credentials').notNull(),
    // availability is waitlist only/yes/limited avail/not at this time
    availability: text('availability').notNull(),
    insuranceAccepted: integer('insuranceAccepted', { mode: 'boolean' }).default(false),
    lowCost: integer('lowCost', { mode: 'boolean' }).default(false),
    virtual: integer('virtual', { mode: 'boolean' }).default(false),
  }
  //(table) => [index('session_userId_idx').on(table.userId)]
)

export const location = sqliteTable(
  'location',
  {,
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    serviceId: text('serviceId')
      .notNull().primaryKey()
      .references(() => services.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
)

export const verification = sqliteTable(
  'verification',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))

export const selectUserSchema = createSelectSchema(user)
export const insertUserSchema = createInsertSchema(user)
export const selectSessionSchema = createSelectSchema(session)
export const insertSessionSchema = createInsertSchema(session)
export const selectAccountSchema = createSelectSchema(account)
export const insertAccountSchema = createInsertSchema(account)
export const selectVerificationSchema = createSelectSchema(verification)
export const insertVerificationSchema = createInsertSchema(verification)
