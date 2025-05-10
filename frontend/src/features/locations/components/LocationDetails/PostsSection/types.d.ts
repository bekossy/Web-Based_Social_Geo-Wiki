import {MappinPosts} from "@/services/posts/types"
import {Dispatch, RefObject, SetStateAction} from "react"

export interface PostsSectionProps {
    newPost: string
    fileInputRef: RefObject<HTMLInputElement | null>
    handleSubmitPost: () => Promise<void>
    setNewPost: Dispatch<SetStateAction<string>>
    imagePreviews: string[]
    setSelectedImages: Dispatch<SetStateAction<File[]>>
    handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
    isAddingPostLoading: boolean
    selectedMappinPosts: MappinPosts[]
    fetchSelectedMappinPosts: () => Promise<void>
}
