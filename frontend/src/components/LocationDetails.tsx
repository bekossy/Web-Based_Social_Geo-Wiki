"use client"

import {useMemo, useRef, useState} from "react"
import {ScrollArea} from "./ui/scroll-area"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs"
import Image from "next/image"
import {
    Building2,
    Camera,
    Globe,
    ImageIcon,
    Info,
    Loader2,
    Minus,
    Navigation,
    Plus,
    Send,
    X,
} from "lucide-react"
import {Button} from "./ui/button"
import {Textarea} from "./ui/textarea"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {createMappin, deleteMappin} from "@/services/mappins"
import {useAuth} from "@/contexts/AuthContext"
import {Mappins} from "@/services/mappins/types"
import {MappinPosts} from "@/services/posts/types"
import UserAvatar from "./UserAvatar"
import {createMappinPosts} from "@/services/posts"

interface LocationDetailsProps {
    locationFeatureInfo: SearchBoxFeatureSuggestion
    selectedMappinLocation: Mappins | undefined
    fetchAllMappins: () => Promise<void>
    selectedMappinPosts: MappinPosts[]
    fetchSelectedMappinPosts: () => Promise<void>
}

const LocationDetails = ({
    locationFeatureInfo,
    selectedMappinLocation,
    fetchAllMappins,
    selectedMappinPosts,
    fetchSelectedMappinPosts,
}: LocationDetailsProps) => {
    const {user} = useAuth()
    const [selectedTab, setSelectedTab] = useState("overview")
    const [newPost, setNewPost] = useState("")
    const [selectedImages, setSelectedImages] = useState<File[]>([]) // Store images as files
    const [imagePreviews, setImagePreviews] = useState<string[]>([]) // Store preview URLs

    const fileInputRef = useRef<HTMLInputElement>(null)

    const locationData = useMemo(() => locationFeatureInfo.properties || {}, [locationFeatureInfo])

    const [isAddingPinLoading, setIsAddingPinLoading] = useState(false)
    const [isRemovingPinLoading, setIsRemovingPinLoading] = useState(false)

    const [isAddingPostLoading, setIsAddingPostLoading] = useState(false)

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const fileArray = Array.from(files).slice(0, 4)
            setSelectedImages(fileArray)

            const previews = fileArray.map((file) => URL.createObjectURL(file))
            setImagePreviews(previews)
        }
    }

    const isPinned = useMemo(() => !!selectedMappinLocation, [selectedMappinLocation])

    const canRemovePin = useMemo(() => {
        return isPinned && selectedMappinLocation?.userId._id === user?.userId
    }, [selectedMappinLocation, user, isPinned])

    const handleAddLocationPin = async () => {
        if (isAddingPinLoading || isPinned) return

        setIsAddingPinLoading(true)
        try {
            await createMappin({
                mapboxId: locationData.mapbox_id,
                latitude: locationData.coordinates.latitude,
                longitude: locationData.coordinates.longitude,
            })
            await fetchAllMappins()
        } catch (error) {
            console.error("Failed to add location pin:", error)
        } finally {
            setIsAddingPinLoading(false)
        }
    }

    const handleRemoveLocationPin = async () => {
        if (isRemovingPinLoading || !selectedMappinLocation?._id) return

        setIsRemovingPinLoading(true)
        try {
            await deleteMappin({
                mappinId: selectedMappinLocation?._id,
            })
            await fetchAllMappins()
        } catch (error) {
            console.error("Failed to add location pin:", error)
        } finally {
            setIsRemovingPinLoading(false)
        }
    }

    const handleSubmitPost = async () => {
        if (isAddingPostLoading || !selectedMappinLocation?._id) return

        try {
            setIsAddingPostLoading(true)

            const formData = new FormData()
            formData.append("content", newPost)
            formData.append("mappinId", selectedMappinLocation._id)

            selectedImages.forEach((image) => {
                formData.append("images", image)
            })

            await createMappinPosts(formData)

            await fetchSelectedMappinPosts()
        } catch (error) {
            console.error(error)
        } finally {
            setIsAddingPostLoading(false)
            setNewPost("")
            setSelectedImages([])
            setImagePreviews([])
        }
    }

    return (
        <>
            <div className="mt-2 mb-4">
                {!isPinned && (
                    <Button
                        className="w-full gap-2"
                        onClick={handleAddLocationPin}
                        disabled={isAddingPinLoading}
                    >
                        {isAddingPinLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        Pin Location
                    </Button>
                )}
                {canRemovePin && (
                    <Button
                        variant={"destructive"}
                        className="w-full gap-2"
                        onClick={handleRemoveLocationPin}
                        disabled={isRemovingPinLoading}
                    >
                        {isRemovingPinLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Minus className="h-4 w-4" />
                        )}
                        Remove Pin
                    </Button>
                )}
            </div>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger disabled={!isPinned} value="posts">
                        Posts
                    </TabsTrigger>
                </TabsList>
                <ScrollArea>
                    <TabsContent value="overview">
                        <div className="space-y-6">
                            {!isPinned && (
                                <>
                                    <div className="rounded-lg flex border bg-muted/50 p-4 text-center">
                                        <Info className="text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Pin this location to enable community posts and share
                                            your experiences
                                        </p>
                                    </div>
                                </>
                            )}
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
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {imagePreviews.map((image, index) => (
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
                                        disabled={!newPost || isAddingPostLoading}
                                        size="sm"
                                        className="gap-2"
                                        onClick={handleSubmitPost}
                                    >
                                        {isAddingPostLoading ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
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
                            {selectedMappinPosts.length > 0
                                ? selectedMappinPosts.map((post) => (
                                      <div
                                          key={post._id}
                                          className="rounded-lg border bg-card p-4 space-y-3"
                                      >
                                          <div className="flex items-start gap-3">
                                              <UserAvatar
                                                  color={post.userId.color}
                                                  username={post.userId.username}
                                              />
                                              <div className="flex-1">
                                                  <div className="flex items-center justify-between">
                                                      <div>
                                                          <p className="font-medium">
                                                              {post.userId.username}
                                                          </p>
                                                          <p className="text-sm text-muted-foreground">
                                                              @{post.userId.username}
                                                          </p>
                                                      </div>
                                                      <p className="text-sm text-muted-foreground">
                                                          2 hours ago
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
                                                                          src={image.url}
                                                                          alt={`${[
                                                                              post.userId.username,
                                                                          ]} post`}
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
                                  ))
                                : "No comments"}
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </>
    )
}

export default LocationDetails
