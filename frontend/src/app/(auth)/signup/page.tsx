"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {useAuth} from "@/contexts/AuthContext"
import SignupForm from "@/features/auth/components/SignupForm"
import AuthHeader from "@/features/auth/common/AuthHeader"
import AuthFooter from "@/features/auth/common/AuthFooter"

export default function SignUpPage() {
    const formSchema = z
        .object({
            username: z.string().min(3, "Username must be at least 3 characters"),
            password: z.string().min(6, "Password must be at least 6 characters"),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        })
    const {register} = useAuth()
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setErrorMessage("")
        try {
            await register(values.username.toLowerCase(), values.password)
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
            <AuthHeader title="Create an account" description="Sign up to get started" />

            <SignupForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
                formSchema={formSchema}
            />

            <AuthFooter text="Already have an account?" link="/login" btnText="Sign in" />
        </div>
    )
}
