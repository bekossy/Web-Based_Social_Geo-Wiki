"use client"

import {useAuth} from "@/contexts/AuthContext"
import {useRouter} from "next/navigation"
import {ReactNode, useEffect} from "react"

const ProtectedRoute = ({children}: {children: ReactNode}) => {
    const {user, loading} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/auth/login")
        }
    }, [user, loading, router])

    if (loading || !user) return <div>Loading...</div>

    return <div>{children}</div>
}

export default ProtectedRoute
