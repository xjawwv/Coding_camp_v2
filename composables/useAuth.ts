export type AuthUser = { id: string; name: string; email: string }

export function useAuth() {
  const user = useState<AuthUser | null>('user', () => null)
  const loaded = useState('auth-loaded', () => false)

  async function loadUser() {
    if (loaded.value) return user.value
    try {
      const result = await $fetch<{ user: AuthUser | null }>('/api/auth/me')
      user.value = result.user
    } catch {
      user.value = null
    } finally {
      loaded.value = true
    }
    return user.value
  }

  async function requireLogin(destination: string) {
    const currentUser = await loadUser()
    if (currentUser) return navigateTo(destination)
    return navigateTo({ path: '/login', query: { redirect: destination } })
  }

  return { user, loadUser, requireLogin }
}
