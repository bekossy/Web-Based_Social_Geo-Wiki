"use client"

import {Dispatch, SetStateAction, useState} from "react"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {Search, Settings, LogOut, Heart, Clock, ChevronRight, ArrowLeft} from "lucide-react"
import {Avatar, AvatarFallback} from "./ui/avatar"
import MakiIcon from "./MakiIcon"
import {fetchSearchCategory} from "@/services/mapbox"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {type CategoryListResponse} from "@/services/mapbox/types"

interface NavigationSidebarProps {
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsNavSidebarOpen: Dispatch<SetStateAction<boolean>>
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
    categoryList: CategoryListResponse[]
}

const CATEGORIES = [
    {
        canonical_id: "restaurant",
        icon: "restaurant",
        name: "Restaurant",
    },
    {
        canonical_id: "shopping_mall",
        icon: "marker",
        name: "Shopping Mall",
    },
    {
        canonical_id: "education",
        icon: "school",
        name: "Education",
    },
    {
        canonical_id: "park",
        icon: "park",
        name: "Park",
    },
    {
        canonical_id: "hotel",
        icon: "lodging",
        name: "Hotel",
    },
    {
        canonical_id: "tourist_attraction",
        icon: "attraction",
        name: "Tourist Attraction",
    },
]

const RECENT_SEARCHES = [
    "Italian Restaurants",
    "Coffee Shops",
    "Parks",
    "Museums",
    "Shopping Malls",
]

export function NavigationSidebar({
    setLocationFeatureInfo,
    setIsNavSidebarOpen,
    setIsDrawerOpen,
}: NavigationSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)

    const handleSelectedCategory = async (canonicalId: string) => {
        try {
            const data = await fetchSearchCategory({canonicalId})
            setLocationFeatureInfo(data.features)
            setShowSearch(false)
            setSearchQuery("")
            setIsNavSidebarOpen(false)
            setIsDrawerOpen(true)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-full">
                        <AvatarFallback className="rounded-full bg-purple-400 text-white font-bold">
                            JD
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">Sign in to save places</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {showSearch ? (
                    <Command className="rounded-lg border-none p-2">
                        <div className="flex items-center">
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                onClick={() => setShowSearch(false)}
                                className="px-2"
                            >
                                <ArrowLeft />
                            </Button>

                            <CommandInput
                                placeholder="Search categories..."
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                            />
                        </div>
                        <CommandList className="max-h-none">
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Categories">
                                {CATEGORIES.filter((cat) =>
                                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((category) => {
                                    return (
                                        <CommandItem
                                            key={category.canonical_id}
                                            onSelect={() => {
                                                handleSelectedCategory(category.canonical_id)
                                            }}
                                            className="gap-4 cursor-pointer"
                                        >
                                            <MakiIcon iconName={category.icon} />
                                            {category.name}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                            {!searchQuery && (
                                <CommandGroup heading="Recent Searches">
                                    {RECENT_SEARCHES.map((search) => (
                                        <CommandItem
                                            key={search}
                                            onSelect={() => {
                                                // onCategorySelect(search);
                                                setShowSearch(false)
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Clock className="mr-2 size-4" />
                                            {search}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                ) : (
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setShowSearch(true)}
                            >
                                <Search className="mr-2 size-4" />
                                Search categories...
                            </Button>

                            <div className="space-y-1">
                                <h4 className="text-sm font-medium px-2">Favorites</h4>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Heart className="mr-2 size-4" />
                                    Saved Places
                                </Button>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-sm font-medium px-2">Categories</h4>
                                {CATEGORIES.map((category) => {
                                    return (
                                        <Button
                                            key={category.canonical_id}
                                            variant="ghost"
                                            className="w-full justify-between group"
                                            onClick={() =>
                                                handleSelectedCategory(category.canonical_id)
                                            }
                                        >
                                            <span className="flex items-center gap-4">
                                                <MakiIcon iconName={category.icon} />
                                                {category.name}
                                            </span>
                                            <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>
                    </ScrollArea>
                )}
            </div>

            <div className="border-t p-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 size-4" />
                    Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
