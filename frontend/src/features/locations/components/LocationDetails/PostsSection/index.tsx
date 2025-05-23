import {Button} from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import {CheckCircle2, EllipsisVertical, Flag, MessageSquarePlus, Trash2} from "lucide-react"
import React from "react"
import {PostsSectionProps} from "./types"
import {formatSmartDate} from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useAuth} from "@/contexts/AuthContext"
import {deleteMappinPosts, reportMappinPost} from "@/services/posts"
import PostsContent from "./PostsContent"
import AddPostsSection from "./AddPostsSection"
import EmptyState from "@/components/EmptyState"
import {useToast} from "@/hooks/use-toast"

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
    fetchSelectedMappinPosts,
}: PostsSectionProps) => {
    const {user} = useAuth()
    const {toast} = useToast()
    const [isDeletePostLoading, setIsDeletePostLoading] = React.useState(false)
    const [isReportPostLoading, setIsReportPostLoading] = React.useState(false)

    const handleDeletePost = async (postId: string) => {
        try {
            setIsDeletePostLoading(true)
            await deleteMappinPosts({postId})
            await fetchSelectedMappinPosts()
            toast({
                title: "Post deleted successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Failed to delete post:", error)
            toast({
                title: "Failed to delete post",
                variant: "destructive",
            })
        } finally {
            setIsDeletePostLoading(false)
        }
    }

    const hanldeReportPost = async (postId: string) => {
        try {
            setIsReportPostLoading(true)
            await reportMappinPost({postId})
            await fetchSelectedMappinPosts()
            toast({
                title: "Post reported successfully",
                variant: "success",
            })
        } catch (error) {
            console.error("Failed to report post:", error)
            toast({
                title: "Failed to report post",
                variant: "destructive",
            })
        } finally {
            setIsReportPostLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <AddPostsSection
                handleImageSelect={handleImageSelect}
                handleSubmitPost={handleSubmitPost}
                isAddingPostLoading={isAddingPostLoading}
                imagePreviews={imagePreviews}
                setNewPost={setNewPost}
                setSelectedImages={setSelectedImages}
                fileInputRef={fileInputRef}
                newPost={newPost}
            />

            {selectedMappinPosts.length > 0 ? (
                selectedMappinPosts.map((post) => (
                    <div key={post._id} className="rounded-lg border bg-card p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <UserAvatar color={post.userId.color} username={post.userId.username} />
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{post.userId.username}</p>
                                        <p className="text-sm text-muted-foreground">
                                            @{post.userId.username}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground">
                                            {formatSmartDate(post.createdAt)}
                                        </p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto w-auto"
                                                >
                                                    <EllipsisVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="min-w-[150px]">
                                                {post.userId._id === user?.userId ? (
                                                    <DropdownMenuItem
                                                        disabled={isDeletePostLoading}
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        disabled={
                                                            isReportPostLoading ||
                                                            !user ||
                                                            (Array.isArray(post.reports) &&
                                                                post.reports.includes(user.userId))
                                                        }
                                                        onClick={() => hanldeReportPost(post._id)}
                                                        className={`
                                                        cursor-pointer
                                                        ${
                                                            Array.isArray(post.reports) &&
                                                            user &&
                                                            post.reports.includes(user.userId)
                                                                ? "text-green-600 cursor-not-allowed"
                                                                : ""
                                                        }
                                                    `}
                                                    >
                                                        {user &&
                                                        Array.isArray(post.reports) &&
                                                        post.reports.includes(user.userId) ? (
                                                            <>
                                                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                                                Reported
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Flag className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                Report
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <PostsContent post={post} />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <EmptyState
                    icon={<MessageSquarePlus className="h-12 w-12 text-muted-foreground/30 mb-4" />}
                    title="Be the first to share insights"
                    description="Share your knowledge about this location by creating the first post. Your contribution helps others learn about this place."
                    className="!mt-6"
                />
            )}
        </div>
    )
}

export default PostsSection
