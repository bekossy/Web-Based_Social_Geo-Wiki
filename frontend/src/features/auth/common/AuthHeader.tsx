import React from "react"

const AuthHeader = ({title, description}: {title: string; description: string}) => {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
    )
}

export default AuthHeader
