import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import "mapbox-gl/dist/mapbox-gl.css"
import {AuthProvider} from "@/contexts/AuthContext"

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Social Geo-Wiki | Collaborative Mapping Platform",
    description:
        "A web-based mapping platform that allows users to collaboratively annotate locations with comments, images, and tags. Built with Next.js, Express, MongoDB, and Mapbox.",
    keywords: [
        "Geo-Wiki",
        "Crowdsourced Mapping",
        "Mapbox",
        "OpenStreetMap",
        "Community Mapping",
        "Participatory GIS",
        "Geolocation",
        "Collaborative Maps",
    ],
    authors: [{name: "Kaosisochukwu Bruno Ezealigo", url: "https://kaosiso-ezealigo.netlify.app/"}],
    creator: "Kaosisochukwu Bruno Ezealigo",
    robots: "index, follow",
    openGraph: {
        title: "Social Geo-Wiki | Collaborative Mapping Platform",
        description:
            "A web-based mapping platform that allows users to collaboratively annotate locations with comments, images, and tags. Built with Next.js, Express, MongoDB, and Mapbox.",
        url: "https://web-based-social-geo-wiki.vercel.app/",
        siteName: "Social Geo-Wiki",
        images: [
            {
                url: "/social_geo-wiki.png",
                width: 1200,
                height: 630,
                alt: "Social Geo-Wiki",
            },
        ],
        type: "website",
    },
    twitter: {
        title: "Social Geo-Wiki | Collaborative Mapping Platform",
        description:
            "A web-based mapping platform that allows users to collaboratively annotate locations with comments, images, and tags. Built with Next.js, Express, MongoDB, and Mapbox.",
        card: "summary_large_image",
        images: [
            {
                url: "/social_geo-wiki.png",
                width: 1200,
                height: 630,
                alt: "Social Geo-Wiki",
            },
        ],
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} antialiased`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
