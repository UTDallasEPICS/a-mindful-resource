import { db } from '../../utils/db'
import { villageMember, villageMemberRole, villageRoles, contactMethods, villageAvailabilities } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const applySchema = z.object({
  roles: z.array(z.enum(villageRoles)).min(1, 'Select at least one role'),
  credentials: z.string().trim().optional().nullable(),
  organization: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  phoneNumber: z.string().trim().optional().nullable(),
  preferredContactMethod: z.enum(contactMethods).default('email'),
  website: z.string().trim().optional().nullable(),
  availability: z.enum(villageAvailabilities).default('available'),
  reasonForJoining: z.string().trim().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'You must be logged in to apply' })
  }

  const body = await readBody(event)
  const parsed = applySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message || 'Invalid application data',
    })
  }

  const data = parsed.data

  // Check if an application already exists
  const existing = await db.query.villageMember.findFirst({
    where: eq(villageMember.userId, user.id),
  })

  if (existing) {
    await db
      .update(villageMember)
      .set({
        phoneNumber: data.phoneNumber || null,
        credentials: data.credentials || null,
        organization: data.organization || null,
        city: data.city || null,
        preferredContactMethod: data.preferredContactMethod,
        website: data.website || null,
        availability: data.availability,
        reasonForJoining: data.reasonForJoining || null,
        applicationStatus: 'pending',
        updatedAt: new Date(),
      })
      .where(eq(villageMember.userId, user.id))
  } else {
    await db.insert(villageMember).values({
      userId: user.id,
      phoneNumber: data.phoneNumber || null,
      credentials: data.credentials || null,
      organization: data.organization || null,
      city: data.city || null,
      preferredContactMethod: data.preferredContactMethod,
      website: data.website || null,
      availability: data.availability,
      reasonForJoining: data.reasonForJoining || null,
      applicationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // Replace roles
  await db.delete(villageMemberRole).where(eq(villageMemberRole.userId, user.id))
  for (const role of data.roles) {
    await db.insert(villageMemberRole).values({
      userId: user.id,
      role,
    })
  }

  return {
    success: true,
    message: 'Application submitted successfully',
  }
})

