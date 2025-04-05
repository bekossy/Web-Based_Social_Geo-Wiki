import {useCallback, useRef, useState} from "react"
import {CommandGroup, CommandItem, CommandList, CommandInput} from "@/components/ui/command"
import {Command as CommandPrimitive} from "cmdk"
import {cn} from "@/lib/utils"
import {type SearchBoxSuggestion} from "@mapbox/search-js-core"
import {Skeleton} from "@/components//ui/skeleton"
import {fetchRetrieveSearchResult, fetchSearchSuggestion} from "@/services/mapbox"
import {v4 as uuidv4} from "uuid"
import {MapSearchboxProps} from "./types"

const MapSearchbox = ({
    mapRef,
    disabled = false,
    isLoading = false,
    placeholder = "Find something",
    emptyMessage = "No results",
    setIsLoadingLocationInfo,
    setLocationFeatureInfo,
    setIsLocationDrawerOpen,
    sessionToken,
    setSessionToken,
}: MapSearchboxProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [searchBoxValue, setSearchBoxValue] = useState<SearchBoxSuggestion | null>(null)
    const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([])

    const [isOpen, setOpen] = useState(false)
    const [selected, setSelected] = useState<SearchBoxSuggestion>(
        searchBoxValue as SearchBoxSuggestion
    )
    const [searchBoxInput, setSearchBoxInput] = useState<string>(searchBoxValue?.name || "")

    const handleInputChange = async (value: string) => {
        setSearchBoxInput(value)

        if (value) {
            try {
                if (!searchBoxInput) {
                    setSessionToken(uuidv4())
                }

                const response = await fetchSearchSuggestion({
                    session_token: sessionToken,
                    searchValue: value,
                })
                setSuggestions(response.suggestions || [])
            } catch (error) {
                console.error("Error fetching suggestions:", error)
            }
        }
    }

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (!input) {
                return
            }

            // Keep the options displayed when the user is typing
            if (!isOpen && searchBoxInput) {
                setOpen(true)
            }

            // This is not a default behaviour of the <input /> field
            if (event.key === "Enter" && input.value !== "") {
                const optionToSelect = suggestions.find((option) => option.name === input.value)
                if (optionToSelect) {
                    setSelected(optionToSelect)
                    setSearchBoxValue(optionToSelect)
                }
            }

            if (event.key === "Escape") {
                input.blur()
            }
        },
        [isOpen, searchBoxInput, suggestions]
    )

    const handleBlur = useCallback(() => {
        setOpen(false)
        setSearchBoxInput(selected?.name || "")
    }, [selected])

    const handleSelectOption = useCallback(
        async (selectedOption: SearchBoxSuggestion) => {
            setSearchBoxInput(selectedOption.name)

            setSelected(selectedOption)
            setSearchBoxValue(selectedOption)

            if (selectedOption.mapbox_id) {
                try {
                    setIsLoadingLocationInfo(true)
                    const response = await fetchRetrieveSearchResult({
                        session_token: sessionToken,
                        mapboxId: selectedOption.mapbox_id,
                    })

                    const [longitude, latitude] = response.features[0].geometry.coordinates
                    mapRef.current?.flyTo({
                        center: [longitude, latitude],
                        zoom: 14,
                        essential: true,
                    })

                    setLocationFeatureInfo(response.features)
                    setIsLocationDrawerOpen(true)
                } catch (error) {
                    console.error("Error fetching suggestions:", error)
                } finally {
                    setIsLoadingLocationInfo(false)
                }
            }

            setTimeout(() => {
                inputRef?.current?.blur()
            }, 0)
        },
        [
            mapRef,
            setIsLocationDrawerOpen,
            setIsLoadingLocationInfo,
            setLocationFeatureInfo,
            sessionToken,
        ]
    )

    return (
        <CommandPrimitive onKeyDown={handleKeyDown}>
            <div className="bg-white rounded-lg border border-input">
                <CommandInput
                    ref={inputRef}
                    value={searchBoxInput}
                    onValueChange={isLoading ? undefined : handleInputChange}
                    onBlur={handleBlur}
                    onFocus={() => searchBoxInput && setOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="text-base bg-white"
                />
            </div>
            <div className="relative mt-1">
                <div
                    className={cn(
                        "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none",
                        isOpen ? "block" : "hidden"
                    )}
                >
                    <CommandList className="rounded-lg ring-1 ring-slate-200">
                        {isLoading ? (
                            <CommandPrimitive.Loading>
                                <div className="p-1">
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            </CommandPrimitive.Loading>
                        ) : null}
                        {suggestions.length > 0 && !isLoading ? (
                            <CommandGroup heading="Suggestions">
                                {suggestions.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.mapbox_id}
                                            value={option.name}
                                            onMouseDown={(event) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                            }}
                                            onSelect={() => handleSelectOption(option)}
                                            className={cn(
                                                "flex flex-col w-full items-start gap-2 cursor-pointer"
                                            )}
                                        >
                                            <div className="flex flex-col">
                                                <div className="font-bold">{option.name}</div>
                                                <div className="capitalize">
                                                    {option.full_address
                                                        ? option.full_address
                                                        : option.feature_type}
                                                </div>
                                            </div>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        ) : null}
                        {!isLoading ? (
                            <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                                {emptyMessage}
                            </CommandPrimitive.Empty>
                        ) : null}
                    </CommandList>
                </div>
            </div>
        </CommandPrimitive>
    )
}

export default MapSearchbox
