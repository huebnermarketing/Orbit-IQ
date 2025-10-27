export const useApiFetch = async <T = any>(
  url: string,
  options: any = {}
): Promise<T> => {
  const config = useRuntimeConfig()
  const token = import.meta.client ? localStorage.getItem('token') : null

  try {
    const data = await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      headers: {
        Accept: 'application/json',
        ...(options.body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      onRequest({ options }) {
        if (import.meta.dev) console.log('[useApiFetch] →', options.method || 'GET', url)
      },
      onResponse({ response }) {
        if (import.meta.dev) console.log('[useApiFetch] ←', response.status, url)
      },
      onResponseError({ response }) {
        if (response.status === 401 && import.meta.client) {
          if (!url.includes('/auth/login')) {
            localStorage.removeItem('token')
            navigateTo('/auth/login')
          }
        }
      },
      ...options,
    })
    return data
  } catch (err) {
    console.error('[useApiFetch] Error:', err)
    throw err
  }
}
