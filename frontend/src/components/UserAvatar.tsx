import React from "react"
import {Avatar, AvatarFallback} from "./ui/avatar"
import {cn} from "@/lib/utils"

type UserAvatarProps = {
    username: string
    color: string
    className?: string
}

const UserAvatar = ({username, color, className = ""}: UserAvatarProps) => {
    const initials = username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <Avatar className={cn(`rounded-full ${className}`)}>
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
