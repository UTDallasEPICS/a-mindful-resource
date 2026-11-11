import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import nodemailer from 'nodemailer'
import { db } from './db'
import { env } from './env'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url, token }) {
      const verificationUrl = url.includes('/api/auth/verify-email')
        ? url
        : `${env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${encodeURIComponent('/')}`

      try {
        const transporter = nodemailer.createTransport({
          host: env.EMAIL_HOST || 'localhost',
          port: 587,
          secure: false,
          auth: {
            user: env.EMAIL_USER || '',
            pass: (env.EMAIL_PASS || '').replace(/\s+/g, ''),
          },
        })

        await transporter.sendMail({
          from: `"A Mindful Resource" <${env.EMAIL_FROM || env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Verify your email - A Mindful Resource',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1b3d2f;">
              <h2 style="color: #1b3d2f; font-family: Georgia, serif;">Welcome to A Mindful Resource</h2>
              <p>Hello ${user.name || 'there'},</p>
              <p>Thank you for creating an account. Please verify your email address by clicking the button below:</p>
              <p style="margin: 28px 0;">
                <a href="${verificationUrl}" style="background-color: #244e3d; color: #fbf7ee; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Verify Email</a>
              </p>
              <p style="color: #5c6761; font-size: 13px;">If the button does not work, copy and paste this URL into your browser:</p>
              <p style="color: #5c6761; font-size: 13px; word-break: break-all;"><a href="${verificationUrl}">${verificationUrl}</a></p>
              <p style="color: #8a968f; font-size: 12px; margin-top: 32px; border-top: 1px solid #e1e7e4; pt-4;">If you did not sign up for A Mindful Resource, you can safely ignore this email.</p>
            </div>
          `,
        })
        console.log(`[auth] Verification email successfully sent to ${user.email}`)
      } catch (err) {
        console.warn(`[auth] Could not deliver email via SMTP (${err instanceof Error ? err.message : err}). Verification link: ${verificationUrl}`)
      }
    },
  },
  user: {
    additionalFields: {
      // input: false so clients can't make themselves admin on sign-up
      role: { type: 'string', required: false, defaultValue: 'user', input: false },
    },
  },
})

