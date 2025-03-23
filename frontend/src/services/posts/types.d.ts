export interface MappinPosts {
    content: string
    mappinId: string
    createdAt: string
    updatedAt: string
    images: string[]
    userId: {
        createdAt: string
        username: string
        color: string
        _id: string
    }
    _id: string
}
