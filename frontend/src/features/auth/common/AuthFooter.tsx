import Link from "next/link"
import React from "react"

const AuthFooter = ({text, link, btnText}: {text: string; link: string; btnText: string}) => {
    return (
        <div className="text-center text-sm">
            <p className="text-muted-foreground">
                {text}{" "}
                <Link href={link} className="text-primary hover:underline">
                    {btnText}
                </Link>
            </p>
        </div>
    )
}

export default AuthFooter
