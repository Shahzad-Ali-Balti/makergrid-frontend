import { createContext, useState, useEffect, ReactNode } from "react"
import { useLocation } from "wouter"
import { setLogoutHandler } from "@/lib/axiosInstance"
import axiosInstance from "@/lib/axiosInstance"

type User = {
  id: string
  email: string
  username?: string
  tokens?: number
  subscription_type?: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  loading: boolean
  credits: string
  isAuthenticated: boolean;
  creditsCount: () => Promise<void>
  refreshAccessToken: () => Promise<string | null>
  refreshUser:() => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<string>("0")
  const [, setLocation] = useLocation()

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      creditsCount()
    }

    setLoading(false)
    setLogoutHandler(() => logout)
  }, [])

  const creditsCount = async () => {
    try {
      const res = await axiosInstance.get("/api/accounts/credits/")
      const creditValue = res.data?.credits || "0"
      setCredits(creditValue.toString())
    } catch (err) {
      console.error("Failed to fetch credits", err)
      setCredits("0")
    }
  }

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await axiosInstance.post("/api/accounts/refresh/")
      const newAccessToken = res.data?.access
      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken)
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`
        return newAccessToken
      }
      return null
    } catch (err) {
      console.error("Token refresh failed", err)
      localStorage.clear()
      return null
    }
  }

  const login = async (user: User, token: string) => {
    setUser(user)
    setToken(token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("access_token", token)
    localStorage.setItem("user", JSON.stringify(user))
    creditsCount()
  }

  const logout = async () => {
    setUser(null)
    setToken(null)
    localStorage.clear()
    setCredits("0")
    setLocation("/login")
  }

  const refreshUser = async () => {
    const res = await axiosInstance.get("/api/accounts/me/");
    localStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        credits,
        isAuthenticated: !!user,
        creditsCount,
        refreshAccessToken,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
