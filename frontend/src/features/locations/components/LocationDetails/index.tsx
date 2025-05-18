"use client"

import {useMemo, useRef, useState} from "react"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

import {createMappin, deleteMappin} from "@/services/mappins"
import {useAuth} from "@/contexts/AuthContext"

import {createMappinPosts} from "@/services/posts"
import {LocationDetailsProps} from "./types"
import PostsSection from "./PostsSection"
import OverviewSection from "./OverviewSection"
import {createBookmark, deleteBookmark, getUserBookmarks} from "@/services/bookmark"
import {useToast} from "@/hooks/use-toast"

const LocationDetails = ({
    locationFeatureInfo,
    selectedMappinLocation,
    fetchAllMappins,
    selectedMappinPosts,
    fetchSelectedMappinPosts,
    bookmarks,
}: LocationDetailsProps) => {
    const {toast} = useToast()
    const {user} = useAuth()
    const [selectedTab, setSelectedTab] = useState("overview")
    const [newPost, setNewPost] = useState("")
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const locationData = useMemo(() => locationFeatureInfo.properties || {}, [locationFeatureInfo])

    const [isAddingPinLoading, setIsAddingPinLoading] = useState(false)
    const [isRemovingPinLoading, setIsRemovingPinLoading] = useState(false)

    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

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
    const selectedMappinBookmark = useMemo(
        () =>
            bookmarks.find(
                (bookmark) => bookmark.mapboxId === locationFeatureInfo.properties.mapbox_id,
            ),
        [bookmarks, locationFeatureInfo],
    )

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
            toast({
                title: "Location pin added successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Failed to add location pin:", error)
            toast({
                title: "Failed to add location pin",
                variant: "destructive",
            })
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
            toast({
                title: "Location pin removed successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Failed to remove location pin:", error)
            toast({
                title: "Failed to remove location pin",
                variant: "destructive",
            })
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
            toast({
                title: "Post added successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Failed to add post:", error)
            toast({
                title: "Failed to add post",
                variant: "destructive",
            })
        } finally {
            setIsAddingPostLoading(false)
            setNewPost("")
            setSelectedImages([])
            setImagePreviews([])
        }
    }

    const handleBookmarkLocation = async () => {
        if (isBookmarkLoading) return
        try {
            setIsBookmarkLoading(true)
            await createBookmark({
                mapboxId: locationFeatureInfo.properties.mapbox_id,
            })
            await getUserBookmarks()
            await fetchAllMappins()
            toast({
                title: "Location bookmarked successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Failed to bookmark location:", error)
            toast({
                title: "Failed to bookmark location",
                variant: "destructive",
            })
        } finally {
            setIsBookmarkLoading(false)
        }
    }

    const handleUnbookmarkLocation = async () => {
        if (!selectedMappinBookmark || isBookmarkLoading) return
        try {
            setIsBookmarkLoading(true)
            await deleteBookmark({
                bookmarkId: selectedMappinBookmark._id,
            })
            await getUserBookmarks()
            await fetchAllMappins()
            toast({
                title: "Location unbookmarked successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Failed to unbookmark location:", error)
            toast({
                title: "Failed to unbookmark location",
                variant: "destructive",
            })
        } finally {
            setIsBookmarkLoading(false)
        }
    }

    return (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger disabled={!isPinned} value="posts">
                    Posts
                </TabsTrigger>
            </TabsList>
            <ScrollArea>
                <TabsContent value="overview">
                    <OverviewSection
                        isPinned={isPinned}
                        isAddingPinLoading={isAddingPinLoading}
                        isRemovingPinLoading={isRemovingPinLoading}
                        canRemovePin={canRemovePin}
                        handleAddLocationPin={handleAddLocationPin}
                        handleRemoveLocationPin={handleRemoveLocationPin}
                        handleBookmarkLocation={handleBookmarkLocation}
                        handleUnbookmarkLocation={handleUnbookmarkLocation}
                        isBookmarkLoading={isBookmarkLoading}
                        locationData={locationData}
                        isBookmarked={!!selectedMappinBookmark}
                    />
                </TabsContent>
                <TabsContent value="posts">
                    <PostsSection
                        isAddingPostLoading={isAddingPostLoading}
                        handleImageSelect={handleImageSelect}
                        handleSubmitPost={handleSubmitPost}
                        selectedMappinPosts={selectedMappinPosts}
                        setNewPost={setNewPost}
                        setSelectedImages={setSelectedImages}
                        imagePreviews={imagePreviews}
                        newPost={newPost}
                        fileInputRef={fileInputRef}
                        fetchSelectedMappinPosts={fetchSelectedMappinPosts}
                    />
                </TabsContent>
            </ScrollArea>
        </Tabs>
    )
}

export default LocationDetails
