import { sqliteTable, text, integer, index, check } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const user = sqliteTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: text('type').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
    phoneNumber: text('phoneNumber', { length: 10 }).notNull().unique(),
    password: text('password', { length: 255 }).notNull(),
  },
  (table) => [
    check(
      'user_phone_digits_check',
      sql`length(${table.phoneNumber}) = 10 AND ${table.phoneNumber} GLOB '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'`
    ),
  ]
)

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
  },
  //(table) => [index('session_userId_idx').on(table.userId)]
  (table) => [
    check(
      'services_phone_digits_check',
      sql`length(${table.phoneNumber}) = 10 AND ${table.phoneNumber} GLOB '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'`
    ),
  ]
)

export const location = sqliteTable(
  'location',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    location: text('location').notNull(),
    serviceId: text('serviceId')
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
  },
  (table) => [index('location_serviceId_idx').on(table.serviceId)]
)

export const specialty = sqliteTable(
  'specialty',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    serviceId: text('serviceId')
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    race: integer('race', { mode: 'boolean' }).default(false),
    gender: integer('gender', { mode: 'boolean' }).default(false),
    lgbtq: integer('lgbtq', { mode: 'boolean' }).default(false),
    youth: integer('youth', { mode: 'boolean' }).default(false),
    adult: integer('adult', { mode: 'boolean' }).default(false),
    anxiety: integer('anxiety', { mode: 'boolean' }).default(false),
    trauma: integer('trauma', { mode: 'boolean' }).default(false),
    couplesCounseling: integer('couplesCounseling', { mode: 'boolean' }).default(false),
  },
  (table) => [index('specialty_serviceId_idx').on(table.serviceId)]
)

// export const userRelations = relations(user, ({ many }) => ({
//   sessions: many(session),
//   accounts: many(account),
// }))

// export const sessionRelations = relations(session, ({ one }) => ({
//   user: one(user, { fields: [session.userId], references: [user.id] }),
// }))

// export const accountRelations = relations(account, ({ one }) => ({
//   user: one(user, { fields: [account.userId], references: [user.id] }),
// }))

// export const selectUserSchema = createSelectSchema(user)
// export const insertUserSchema = createInsertSchema(user)
// export const selectSessionSchema = createSelectSchema(session)
// export const insertSessionSchema = createInsertSchema(session)
// export const selectAccountSchema = createSelectSchema(account)
// export const insertAccountSchema = createInsertSchema(account)
// export const selectVerificationSchema = createSelectSchema(verification)
// export const insertVerificationSchema = createInsertSchema(verification)
