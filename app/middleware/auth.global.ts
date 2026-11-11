import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  // Public sections that visitors can access without logging in.
  // Matches the section root and everything under it, with or without a trailing slash.
  const publicPrefixes = ['/events', '/about', '/programs']
  const path = to.path.replace(/\/+$/, '') || '/'

  if (publicPrefixes.some((p) => path === p || path.startsWith(p + '/'))) {
    return
  }

  const { data: session } = await authClient.useSession(useFetch)

  if (session.value) {
    if (to.path === '/auth') {
      return navigateTo('/')
    }
  } else {
    if (to.path !== '/auth') {
      return navigateTo('/auth')
    }
  }
})
