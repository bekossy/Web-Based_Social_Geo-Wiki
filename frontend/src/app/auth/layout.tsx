"use client"

import {useAuth} from "@/contexts/AuthContext"
import {useRouter} from "next/navigation"
import {useEffect} from "react"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const {user, loading} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            router.replace("/")
        }
    }, [user, loading, router])

    return <div>{children}</div>
}
