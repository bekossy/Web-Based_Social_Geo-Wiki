export interface AllCategoryListResponse {
    version: string
    attribution: string
    list_items: CategoryListResponse[]
}

export interface CategoryListResponse {
    canonical_id: string
    name: string
    icon: string
}
