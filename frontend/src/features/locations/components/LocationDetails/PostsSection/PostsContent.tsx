import {MappinPosts} from "@/services/posts/types"
import Image from "next/image"
import React from "react"

const PostsContent = ({post}: {post: MappinPosts}) => {
    return (
        <div className="flex flex-col">
            <p className="text-sm">{post.content}</p>
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
    )
}

export default PostsContent
