import { authClient } from '../utils/auth-client'

// pages that don't require a session
const PUBLIC_PAGES = [
  '/',
  '/auth',
  '/village',
  '/the-village',
  '/about',
  '/programs',
  '/events',
  '/resources',
  '/donate',
]

export default defineNuxtRouteMiddleware(async (to) => {
  // Public sections that visitors can access without logging in.
  // Matches the section root and everything under it, with or without a trailing slash.
  const publicPrefixes = ['/events', '/about', '/programs']
  const path = to.path.replace(/\/+$/, '') || '/'

  if (publicPrefixes.some((p) => path === p || path.startsWith(p + '/'))) {
    return
  }

  const { data: session } = await authClient.useSession(useFetch)

  const isPublic = PUBLIC_PAGES.some(
    (p) => to.path === p || to.path.startsWith(`${p}/`)
  )

  if (session.value) {
    if (to.path === '/auth') {
      const redirect = (to.query.redirect as string) || '/'
      return navigateTo(redirect)
    }
  } else {
    if (!isPublic) {
      return navigateTo({
        path: '/auth',
        query: to.path !== '/' ? { redirect: to.fullPath } : undefined,
      })
    }
  }
})
