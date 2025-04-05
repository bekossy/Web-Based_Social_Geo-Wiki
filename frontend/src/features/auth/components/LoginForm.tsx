import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {AlertCircle, LogIn} from "lucide-react"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import React from "react"
import {UseFormReturn} from "react-hook-form"
import * as z from "zod"

const LoginForm = ({
    form,
    onSubmit,
    isLoading,
    errorMessage,
    formSchema,
}: {
    form: UseFormReturn<
        {
            username: string
            password: string
        },
        undefined
    >
    onSubmit(values: z.infer<typeof formSchema>): Promise<void>
    isLoading: boolean
    errorMessage: string
    formSchema: z.ZodObject<
        {
            username: z.ZodString
            password: z.ZodString
        },
        "strip",
        z.ZodTypeAny,
        {
            username: string
            password: string
        },
        {
            username: string
            password: string
        }
    >
}) => {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {errorMessage && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-[600]">Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Signing in...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Sign in
                        </div>
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default LoginForm
