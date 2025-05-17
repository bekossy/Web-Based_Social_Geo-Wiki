import React from "react"
import {Avatar, AvatarFallback} from "./ui/avatar"
import {cn} from "@/lib/utils"

type UserAvatarProps = {
    username: string
    color: string
    className?: string
    size?: "sm" | "md" | "lg"
}

const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
}

const UserAvatar = ({username, color, className = "", size = "md"}: UserAvatarProps) => {
    const initials = username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <Avatar className={cn(`rounded-full ${sizeClasses[size]} ${className}`)}>
            <AvatarFallback
                className="rounded-full text-white font-bold flex items-center justify-center"
                style={{backgroundColor: color}}
            >
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
