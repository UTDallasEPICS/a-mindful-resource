import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'

export const userRoles = ['user', 'admin'] as const
export const villageRoles = ['wellness', 'coach', 'faith_leader', 'clinician'] as const
export const contactMethods = ['email', 'phone'] as const
export const villageAvailabilities = ['available', 'unavailable'] as const
export const applicationStatuses = ['pending', 'approved', 'rejected'] as const

export const user = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  role: text('role', { enum: userRoles }).notNull().default('user'),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const session = sqliteTable(
  'session',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
)

export const account = sqliteTable(
  'account',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
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

//village member profile, extends user 1:1 (name, email, phone, password live on user/account)
export const villageMember = sqliteTable(
  'village_member',
  {
    userId: text('userId')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    phoneNumber: text('phoneNumber'),
    credentials: text('credentials'),
    organization: text('organization'),
    city: text('city'),
    preferredContactMethod: text('preferredContactMethod', { enum: contactMethods }),
    website: text('website'),
    reasonForJoining: text('reasonForJoining'),
    availability: text('availability', { enum: villageAvailabilities })
      .notNull()
      .default('available'),
    //admin verification of the application
    applicationStatus: text('applicationStatus', { enum: applicationStatuses })
      .notNull()
      .default('pending'),
    reviewedBy: text('reviewedBy').references(() => user.id, { onDelete: 'set null' }),
    reviewedAt: integer('reviewedAt', { mode: 'timestamp' }),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('village_member_applicationStatus_idx').on(table.applicationStatus)]
)

//a member can hold multiple roles (at least one is required, enforced at the api layer)
export const villageMemberRole = sqliteTable(
  'village_member_role',
  {
    userId: text('userId')
      .notNull()
      .references(() => villageMember.userId, { onDelete: 'cascade' }),
    role: text('role', { enum: villageRoles }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.role] }),
    index('village_member_role_role_idx').on(table.role),
  ]
)

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  villageMember: one(villageMember, { fields: [user.id], references: [villageMember.userId] }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))

export const villageMemberRelations = relations(villageMember, ({ one, many }) => ({
  user: one(user, { fields: [villageMember.userId], references: [user.id] }),
  reviewer: one(user, { fields: [villageMember.reviewedBy], references: [user.id] }),
  roles: many(villageMemberRole),
}))

export const villageMemberRoleRelations = relations(villageMemberRole, ({ one }) => ({
  villageMember: one(villageMember, {
    fields: [villageMemberRole.userId],
    references: [villageMember.userId],
  }),
}))

export const selectUserSchema = createSelectSchema(user)
export const insertUserSchema = createInsertSchema(user)
export const selectSessionSchema = createSelectSchema(session)
export const insertSessionSchema = createInsertSchema(session)
export const selectAccountSchema = createSelectSchema(account)
export const insertAccountSchema = createInsertSchema(account)
export const selectVerificationSchema = createSelectSchema(verification)
export const insertVerificationSchema = createInsertSchema(verification)
export const selectVillageMemberSchema = createSelectSchema(villageMember)
export const insertVillageMemberSchema = createInsertSchema(villageMember)
export const selectVillageMemberRoleSchema = createSelectSchema(villageMemberRole)
export const insertVillageMemberRoleSchema = createInsertSchema(villageMemberRole)

// Events table
export const events = sqliteTable('events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  title: text('title').notNull(),
  description: text('description'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  location: text('location').notNull(),
  status: text('status', { enum: ['Draft', 'Published'] })
    .notNull()
    .default('Draft'),
  eventbriteUrl: text('eventbriteUrl'),

  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Event validation schemas
export const selectEventSchema = createSelectSchema(events)
export const insertEventSchema = createInsertSchema(events)
