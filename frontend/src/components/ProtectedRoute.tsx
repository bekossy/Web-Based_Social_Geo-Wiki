"use client"

import {useAuth} from "@/contexts/AuthContext"
import {useRouter} from "next/navigation"
import {ReactNode, useEffect} from "react"
import LoadingSpinner from "./ui/loading-spinner"

const ProtectedRoute = ({children}: {children: ReactNode}) => {
    const {user, loading} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/login")
        }
    }, [user, loading, router])

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size={32} className="text-muted-foreground" />
            </div>
        )
    }

    return <div>{children}</div>
}

export default ProtectedRoute
