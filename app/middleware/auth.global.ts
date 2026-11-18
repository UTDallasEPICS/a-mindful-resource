import { authClient } from '../utils/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch)

  const publicRoutes = ['/', '/auth', '/resource', '/home']
  const isPublic = publicRoutes.includes(to.path) || to.path.startsWith('/guides/')

  if (session.value) {
    // logged in: keep them off the login page
    if (to.path === '/auth') {
      return navigateTo('/resource')
    }
  } else {
    // logged out: only public pages are allowed
    if (!isPublic) {
      return navigateTo('/auth')
    }
  }
})
