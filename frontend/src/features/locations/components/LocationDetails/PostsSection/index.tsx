import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import UserAvatar from "@/components/UserAvatar"
import {Camera, Loader2, Send, X} from "lucide-react"
import Image from "next/image"
import React from "react"
import NoPostsView from "./NoPostsView"
import {PostsSectionProps} from "./types"

const PostsSection = ({
    newPost,
    setNewPost,
    setSelectedImages,
    fileInputRef,
    handleSubmitPost,
    handleImageSelect,
    imagePreviews,
    isAddingPostLoading,
    selectedMappinPosts,
}: PostsSectionProps) => {
    return (
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
                                            prev.filter((_, i) => i !== index),
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
            {selectedMappinPosts.length > 0 ? (
                selectedMappinPosts.map((post) => (
                    <div key={post._id} className="rounded-lg border bg-card p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <UserAvatar color={post.userId.color} username={post.userId.username} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{post.userId.username}</p>
                                        <p className="text-sm text-muted-foreground">
                                            @{post.userId.username}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                                </div>
                                <p className="mt-2 text-sm">{post.content}</p>
                                {post.images && post.images.length > 0 && (
                                    <div
                                        className={`mt-3 grid gap-2 ${
                                            post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
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
                                                        alt={`${[post.userId.username]} post`}
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
            ) : (
                <NoPostsView />
            )}
        </div>
    )
}

export default PostsSection
