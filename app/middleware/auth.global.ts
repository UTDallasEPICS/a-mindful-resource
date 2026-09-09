import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  // Prototype is public — skip authentication completely
  if (to.path === '/prototype') {
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
