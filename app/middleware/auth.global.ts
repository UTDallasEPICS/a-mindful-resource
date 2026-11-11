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
