"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {useAuth} from "@/contexts/AuthContext"
import LoginForm from "@/features/auth/components/LoginForm"
import AuthHeader from "@/features/auth/common/AuthHeader"
import AuthFooter from "@/features/auth/common/AuthFooter"

export default function LoginPage() {
    const formSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()
    const {login} = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setErrorMessage("")
        try {
            await login(values.username.toLowerCase(), values.password)
            router.replace("/")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response.data.msg) {
                setErrorMessage(error.response.data.msg)
            } else {
                setErrorMessage(error.message || "Invalid username or password")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 p-8">
            <AuthHeader title="Welcome back" description="Sign in to your account to continue" />

            <LoginForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
                formSchema={formSchema}
            />

            <AuthFooter text={`Don't have an account?`} link="/signup" btnText="Sign up" />
        </div>
    )
}
