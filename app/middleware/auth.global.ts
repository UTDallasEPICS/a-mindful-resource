import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  // Public pages that visitors can access without logging in
  const publicPages = ['/events', '/events/bro-chill']

  if (publicPages.includes(to.path)) {
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
