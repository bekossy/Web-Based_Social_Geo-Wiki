import {MapPin} from "lucide-react"
import React from "react"

const LocationNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No locations found</h3>
            <p className="text-sm text-muted-foreground">
                Try searching for a different location or adjusting your search terms.
            </p>
        </div>
    )
}

export default LocationNotFound
