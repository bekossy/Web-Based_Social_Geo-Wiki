"use client"

import {Dispatch, SetStateAction, useEffect, useState} from "react"
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
import {Search, Settings, LogOut, Clock, ChevronRight, ArrowLeft, Heart} from "lucide-react"
import MakiIcon from "./MakiIcon"
import {fetchSearchCategory} from "@/services/mapbox"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {type CategoryListResponse} from "@/services/mapbox/types"
import {useAuth} from "@/contexts/AuthContext"
import UserAvatar from "./UserAvatar"
import {useMediaQuery} from "@/hooks/use-media-query"
import {cn} from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"

interface NavigationSidebarProps {
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsNavSidebarOpen: Dispatch<SetStateAction<boolean>>
    setIsLocationDrawerOpen: Dispatch<SetStateAction<boolean>>
    setIsBookmarkDrawerOpen: Dispatch<SetStateAction<boolean>>
    categoryList: CategoryListResponse[]
    handleFetchBookmarkOnClick: () => Promise<void>
}

const RECENT_SEARCHES_KEY = "recentSearches"

export const NavigationSidebar = ({
    categoryList,
    setLocationFeatureInfo,
    setIsNavSidebarOpen,
    setIsLocationDrawerOpen,
    setIsBookmarkDrawerOpen,
    handleFetchBookmarkOnClick,
}: NavigationSidebarProps) => {
    const isDesktop = useMediaQuery("(min-width: 550px)")
    const {user, logout} = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [recentSearches, setRecentSearches] = useState<{name: string; id: string}[]>([])

    useEffect(() => {
        const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY)
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches))
        }
    }, [])

    const saveRecentSearch = (category: {name: string; id: string}) => {
        const updatedSearches = [
            category,
            ...recentSearches.filter((s) => s.id !== category.id),
        ].slice(0, 5)
        setRecentSearches(updatedSearches)
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches))
    }

    const handleSelectedCategory = async (canonicalId: string, categoryName: string) => {
        try {
            const data = await fetchSearchCategory({canonicalId})
            setLocationFeatureInfo(data.features)
            setShowSearch(false)
            setSearchQuery("")
            setIsNavSidebarOpen(false)
            setIsLocationDrawerOpen(true)
            saveRecentSearch({name: categoryName, id: canonicalId})
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className={cn("p-4 border-b", isDesktop ? "p-4" : "p-2")}>
                <div className="flex items-center gap-3">
                    <UserAvatar color={user?.color || ""} username={user?.username || ""} />
                    <div>
                        <p className="font-medium">{user?.username}</p>
                        <p className="text-sm text-muted-foreground">Explore and share places</p>
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
                        <CommandList className="max-h-none h-full [&>div]:flex [&>div]:flex-col [&>div]:h-full">
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Categories" className="flex-1 overflow-auto">
                                {categoryList
                                    .filter((cat) =>
                                        cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
                                    )
                                    .map((category) => {
                                        return (
                                            <CommandItem
                                                key={category.canonical_id}
                                                onSelect={() => {
                                                    handleSelectedCategory(
                                                        category.canonical_id,
                                                        category.name,
                                                    )
                                                }}
                                                className="gap-4 cursor-pointer"
                                            >
                                                <MakiIcon iconName={category.icon} />
                                                {category.name}
                                            </CommandItem>
                                        )
                                    })}
                            </CommandGroup>
                            {!searchQuery && recentSearches.length > 0 && (
                                <CommandGroup heading="Recent Searches">
                                    {recentSearches.map((search, index) => (
                                        <CommandItem
                                            key={index}
                                            onSelect={() => {
                                                handleSelectedCategory(search.id, search.name)
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Clock className="mr-2 size-4" />
                                            {search.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                ) : (
                    <ScrollArea className="h-full">
                        <div className={cn("space-y-4", isDesktop ? "p-4" : "p-2")}>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setShowSearch(true)}
                            >
                                <Search className="mr-2 size-4" />
                                Search categories...
                            </Button>

                            <div className="space-y-1">
                                <h4 className="text-sm font-medium px-2 text-muted-foreground">
                                    Favorites
                                </h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => {
                                        handleFetchBookmarkOnClick()
                                        setIsBookmarkDrawerOpen(true)
                                        setIsNavSidebarOpen(false)
                                    }}
                                >
                                    <Heart className="mr-2 size-4" />
                                    Saved Places
                                </Button>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-sm font-medium px-2 text-muted-foreground">
                                    Categories
                                </h4>
                                {categoryList.slice(0, 12).map((category) => {
                                    return (
                                        <Button
                                            key={category.canonical_id}
                                            variant="ghost"
                                            className="w-full justify-between group"
                                            onClick={() =>
                                                handleSelectedCategory(
                                                    category.canonical_id,
                                                    category.name,
                                                )
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

            <div className={cn("border-t space-y-2", isDesktop ? "p-4" : "p-2")}>
                <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 size-4" />
                    Settings
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground"
                        >
                            <LogOut className="mr-2 size-4" />
                            Sign Out
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
                            <AlertDialogDescription>
                                You are about to sign out of your account. Any unsaved progress will
                                be lost, and you will need to log in again to access your account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                                onClick={logout}
                            >
                                Sign Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
