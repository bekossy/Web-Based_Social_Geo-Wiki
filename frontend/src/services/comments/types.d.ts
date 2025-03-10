export interface MappinComments {
    title: string
    description: string
    rating: number
    mappinId: string
    createdAt: string
    updatedAt: string
    userId: {
        createdAt: string
        username: string
        _id: string
    }
    _id: string
}
