import React from "react"
import {Avatar, AvatarFallback} from "./ui/avatar"

const UserAvatar = ({color, username}: {color: string; username: string}) => {
    return (
        <Avatar className="h-10 w-10 rounded-full">
            <AvatarFallback
                className={`rounded-full text-white font-bold`}
                style={{backgroundColor: color}}
            >
                {username}
            </AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
