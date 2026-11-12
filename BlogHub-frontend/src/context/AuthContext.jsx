/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bloghub_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Verify authentication with backend on mount
  useEffect(() => {
    let isMounted = true

    const verifySession = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        })
        if (isMounted && response.data?.user) {
          setUser(response.data.user)
          localStorage.setItem('bloghub_user', JSON.stringify(response.data.user))
        }
      } catch {
        // If session expired or unauthenticated, clear local cache
        if (isMounted) {
          setUser(null)
          localStorage.removeItem('bloghub_user')
        }
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [])

  const login = async (identifier, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const isEmail = identifier.includes('@')
      const payload = isEmail
        ? { email: identifier.trim(), password }
        : { username: identifier.trim(), password }

      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload, {
        withCredentials: true,
      })

      const userData = response.data?.user
      setUser(userData)
      if (userData) {
        localStorage.setItem('bloghub_user', JSON.stringify(userData))
      }
      return { success: true, user: userData }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Login failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username, email, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          username: username.trim(),
          email: email.trim(),
          password,
        },
        { withCredentials: true }
      )

      // Automatically log the user in after successful registration
      const loginResult = await login(email, password)
      if (loginResult.success) {
        return { success: true, user: loginResult.user }
      }

      return { success: true, user: response.data?.user }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bloghub_user')
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    setError,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
