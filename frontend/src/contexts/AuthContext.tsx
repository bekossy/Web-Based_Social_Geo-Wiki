"use client"

import {createContext, useCallback, useContext, useEffect, useState} from "react"
import axios from "@/lib/axiosConfig"

interface User {
    userId: string
    username: string
    color: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (username: string, password: string) => Promise<void>
    register: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true)
            const {data} = await axios.get("/user/showCurrentUser")
            setUser(data.user)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const login = async (username: string, password: string) => {
        await axios.post("/auth/signin", {username, password})
        await fetchUser()
    }

    const register = async (username: string, password: string) => {
        await axios.post("/auth/signup", {username, password})
        await fetchUser()
    }

    const logout = async () => {
        await axios.get("/auth/signout")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, login, logout, register, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
