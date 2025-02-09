import Image from "next/image"
import {Clock, ExternalLink, Navigation} from "lucide-react"
import {Button} from "./ui/button"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import {Dispatch, SetStateAction} from "react"

interface MapPopupProps {
    locationInfo: SearchBoxFeatureSuggestion
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
}

const MapPopup = ({locationInfo, setIsDrawerOpen}: MapPopupProps) => {
    return (
        <div className="p-3 shadow-lg rounded-xl w-full">
            <div className="relative w-full h-40 overflow-hidden rounded-lg">
                <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Photo by Drew Beamer"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="my-4 flex flex-col gap-3">
                <div className="flex items-start gap-2">
                    <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground font-medium">
                        {locationInfo.properties.name}
                    </p>
                </div>
                <div className="flex items-start gap-2">
                    <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground font-medium">Location</p>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                        Best time to visit: <span className="font-semibold">Morning</span>
                    </p>
                </div>
            </div>

            <Button
                className="view-more w-full gap-2 rounded-lg transition-all"
                variant="secondary"
                onClick={() => setIsDrawerOpen(true)}
            >
                View Location
                <ExternalLink className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default MapPopup
