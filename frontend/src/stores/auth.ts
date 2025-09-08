import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import { authApi } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const initialize = async () => {
    if (initialized.value) return
    
    const savedToken = localStorage.getItem('token')
    const tokenExpiresAt = localStorage.getItem('token_expires_at')
    console.log('Initializing auth store, saved token:', savedToken ? 'exists' : 'none')
    
    // Check if token is expired
    if (savedToken && tokenExpiresAt) {
      const expirationDate = new Date(tokenExpiresAt)
      if (expirationDate <= new Date()) {
        console.log('Token has expired, clearing auth data')
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('token_expires_at')
        localStorage.removeItem('remember_me')
        authApi.clearAuthToken()
        initialized.value = true
        return
      }
    }
    
    if (savedToken) {
      token.value = savedToken
      try {
        // Set the token in axios headers
        authApi.setAuthToken(savedToken)
        // Fetch user profile to verify token is still valid
        const response = await authApi.getProfile()
        user.value = response.user
        console.log('Auth initialization successful, user:', response.user)
      } catch (error) {
        // Token is invalid, clear it
        console.error('Token validation failed:', error)
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('token_expires_at')
        localStorage.removeItem('remember_me')
        authApi.clearAuthToken()
      }
    }
    initialized.value = true
    console.log('Auth store initialized, isAuthenticated:', isAuthenticated.value)
  }

  const login = async (email: string, password: string, mfaCode?: string, remember?: boolean) => {
    loading.value = true
    try {
      const response = await authApi.login(email, password, mfaCode, remember)
      console.log('Login response:', response)
      
      // If MFA is required, return the response without setting token
      if (response.mfa_required) {
        return response
      }
      
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      
      // Store token expiration info if provided
      if (response.expires_at) {
        localStorage.setItem('token_expires_at', response.expires_at)
      }
      if (response.remember !== undefined) {
        localStorage.setItem('remember_me', response.remember.toString())
      }
      
      authApi.setAuthToken(response.token)
      console.log('Login successful, token saved, user:', response.user, 'expires_at:', response.expires_at)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    loading.value = true
    try {
      const response = await authApi.register(userData)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      authApi.setAuthToken(response.token)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('token_expires_at')
      localStorage.removeItem('remember_me')
      authApi.clearAuthToken()
    }
  }

  const updateUser = (userData: User) => {
    user.value = userData
  }

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    updateUser
  }
})
