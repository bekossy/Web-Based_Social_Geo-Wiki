"use client"

import {createContext, useContext, useEffect, useState} from "react"
import axios from "@/lib/axiosConfig"

interface User {
    userId: string
    username: string
    color: string
}

interface AuthContextType {
    user: User | null
    login: (username: string, password: string) => Promise<void>
    register: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {data} = await axios.get("/user/showCurrentUser")
                setUser(data.user)
            } catch {
                setUser(null)
            }
        }

        fetchUser()
    }, [])

    const login = async (username: string, password: string) => {
        await axios.post("/auth/signin", {username, password})
        const {data} = await axios.get("/user/showCurrentUser")
        setUser(data.user)
    }

    const register = async (username: string, password: string) => {
        await axios.post("/auth/signup", {username, password})
        const {data} = await axios.get("/user/showCurrentUser")
        setUser(data.user)
    }

    const logout = async () => {
        await axios.get("/auth/signout")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
