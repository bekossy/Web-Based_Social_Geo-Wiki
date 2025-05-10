import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Camera, Loader2, Send, X} from "lucide-react"
import Image from "next/image"
import React from "react"

interface AddPostsSectionProps {
    setNewPost: (value: React.SetStateAction<string>) => void
    newPost: string
    imagePreviews: string[]
    setSelectedImages: (value: React.SetStateAction<File[]>) => void
    isAddingPostLoading: boolean
    handleSubmitPost: () => Promise<void>
    fileInputRef: React.RefObject<HTMLInputElement | null>
    handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const AddPostsSection = ({
    setNewPost,
    newPost,
    setSelectedImages,
    imagePreviews,
    isAddingPostLoading,
    handleSubmitPost,
    fileInputRef,
    handleImageSelect,
}: AddPostsSectionProps) => {
    return (
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
                                    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
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
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
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
    )
}

export default AddPostsSection
