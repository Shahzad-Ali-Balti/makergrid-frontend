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
  refreshUser: () => void
  subscriptionType: string | null
  totalCredits: string | number // State to hold total credits
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<string>("0")
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null)
  const [totalCredits, setTotalCredits] = useState<string | number>('100') // State to hold total credits
  const [, setLocation] = useLocation()

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      const current_subcription= JSON.parse(storedUser).subscription_type
      console.log('subscription type is ',current_subcription)
      if(current_subcription === 'maker'){
        setSubscriptionType('Maker')
      }else if (current_subcription==='artisan'){
        setSubscriptionType('Artisan')
      }else{
        setSubscriptionType('Free')
      }

      creditsCount()
      console.log("User loaded from localStorage:", JSON.parse(storedUser))
      
    }

    setLoading(false)
    setLogoutHandler(() => logout)
  }, [])

  useEffect(() => {

    if (subscriptionType === "Artisan") {
        setTotalCredits("Unlimited")
      }else if (subscriptionType === "Maker") {
        setTotalCredits('500')
      }
  },[subscriptionType,credits])

  const creditsCount = async () => {
    try {
      const res = await axiosInstance.get("/api/accounts/credits/")
      const creditValue = res.data?.credits || "0"
      console.log("Credits fetched:", creditValue)
      if (creditValue >= 999990) {
        setCredits('Unlimited');  // If credit value is greater than or equal to 999990, return "Unlimited"
      } else {
        setCredits(creditValue.toString());  // Otherwise, set the credits state to the fetched value
      }
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
        refreshUser,
        subscriptionType,
        totalCredits
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
