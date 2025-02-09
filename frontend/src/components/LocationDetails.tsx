"use client"

import {useMemo, useRef, useState} from "react"
import {ScrollArea} from "./ui/scroll-area"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs"
import Image from "next/image"
import {Building2, Camera, Globe, ImageIcon, Navigation, Send, X} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar"
import {Button} from "./ui/button"
import {Textarea} from "./ui/textarea"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"

interface LocationDetailsProps {
    locationFeatureInfo: SearchBoxFeatureSuggestion
}

const LocationDetails = ({locationFeatureInfo}: LocationDetailsProps) => {
    const [selectedTab, setSelectedTab] = useState("overview")
    const [newPost, setNewPost] = useState("")
    const [selectedImages, setSelectedImages] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const locationData = useMemo(() => locationFeatureInfo.properties || {}, [locationFeatureInfo])

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
            setSelectedImages((prev) => [...prev, ...newImages])
        }
    }

    const MOCK_POSTS = [
        {
            id: 1,
            author: {
                name: "Sarah Chen",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                username: "@sarahc",
            },
            content:
                "Just visited this amazing place! The architecture is breathtaking and the local food scene is incredible. Would definitely recommend spending at least a full day here.",
            images: [
                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
                "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
            ],
            date: "2 hours ago",
            likes: 24,
            replies: 3,
        },
        {
            id: 2,
            author: {
                name: "Marcus Rodriguez",
                avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
                username: "@mrodriguez",
            },
            content:
                "Pro tip: Visit early in the morning to avoid the crowds. The sunrise view from here is absolutely stunning! Don't forget to check out the local cafes nearby.",
            images: ["https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=800"],
            date: "1 day ago",
            likes: 156,
            replies: 12,
        },
        {
            id: 3,
            author: {
                name: "Emma Wilson",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
                username: "@emmaw",
            },
            content:
                "Found this hidden gem! The local market here is a must-visit. So many unique items and the people are incredibly friendly.",
            date: "2 days ago",
            likes: 89,
            replies: 7,
        },
    ]

    return (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>
            <ScrollArea>
                <TabsContent value="overview">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 animate-pulse text-muted-foreground" />
                                </div>
                                <div className="relative w-full h-full">
                                    <Image
                                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Photo by Drew Beamer"
                                        fill
                                        className="object-cover transition-opacity duration-300"
                                        sizes="(max-width: 768px) 100vw, 800px"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Location Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p className="text-sm text-muted-foreground">
                                            {locationData.full_address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Region</p>
                                        <p className="text-sm text-muted-foreground">
                                            {locationData.place_formatted}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Country</p>
                                        <p className="text-sm text-muted-foreground">
                                            {locationData.context.country?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Coordinates</h3>
                            <p className="text-sm text-muted-foreground">
                                Latitude: {locationData.coordinates.latitude.toFixed(6)}
                                <br />
                                Longitude: {locationData.coordinates.longitude.toFixed(6)}
                            </p>
                        </div>
                        <div className="pt-4">
                            <Button
                                className="w-full"
                                onClick={() => {
                                    window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${locationData.coordinates.latitude},${locationData.coordinates.longitude}`,
                                        "_blank"
                                    )
                                }}
                            >
                                Open in Google Maps
                            </Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="posts">
                    <div className="space-y-4">
                        <div className="rounded-lg border bg-card p-4">
                            <Textarea
                                placeholder="Share your experience about this place..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                className="mb-3"
                            />
                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {selectedImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square rounded-md overflow-hidden group"
                                        >
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={image}
                                                    alt="Selected"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                />
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setSelectedImages((prev) =>
                                                        prev.filter((_, i) => i !== index)
                                                    )
                                                }
                                                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Add Photos
                                </Button>
                                <Button
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => {
                                        // Mock post submission
                                        setNewPost("")
                                        setSelectedImages([])
                                    }}
                                >
                                    <Send className="h-4 w-4" />
                                    Post
                                </Button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                            />
                        </div>
                        {MOCK_POSTS.map((post) => (
                            <div key={post.id} className="rounded-lg border bg-card p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                        />
                                        <AvatarFallback>
                                            {post.author.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{post.author.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {post.author.username}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {post.date}
                                            </p>
                                        </div>
                                        <p className="mt-2 text-sm">{post.content}</p>
                                        {post.images && post.images.length > 0 && (
                                            <div
                                                className={`mt-3 grid gap-2 ${
                                                    post.images.length > 1
                                                        ? "grid-cols-2"
                                                        : "grid-cols-1"
                                                }`}
                                            >
                                                {post.images.map((image, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative aspect-square rounded-md overflow-hidden"
                                                    >
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={image}
                                                                alt="Post"
                                                                fill
                                                                className="object-cover"
                                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </ScrollArea>
        </Tabs>
    )
}

export default LocationDetails
