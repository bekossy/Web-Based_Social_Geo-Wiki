export interface AllCategoryListResponse {
    version: string
    attribution: string
    listItems: CategoryListResponse[]
}

export interface CategoryListResponse {
    canonical_id: string
    name: string
    icon: string
}
