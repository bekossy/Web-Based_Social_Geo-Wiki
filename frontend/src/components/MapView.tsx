"use client"

import {fetchIpDetails} from "@/services"
import {Dispatch, Fragment, RefObject, SetStateAction, useEffect, useState} from "react"
import Map, {
    FullscreenControl,
    GeolocateControl,
    MapRef,
    Marker,
    NavigationControl,
    Popup,
    ScaleControl,
} from "react-map-gl"
import {type SearchBoxFeatureSuggestion} from "@mapbox/search-js-core"
import MapPopup from "./MapPopup"
import {fetchRetrieveSearchResult} from "@/services/mapbox"
import {Mappins} from "@/services/mappins/types"
import UserAvatar from "./UserAvatar"

type MapViewProps = {
    mapRef: RefObject<MapRef | null>
    setIsLoadingLocationInfo: Dispatch<SetStateAction<boolean>>
    setLocationFeatureInfo: Dispatch<SetStateAction<SearchBoxFeatureSuggestion[]>>
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
    sessionToken: string
    mappins: Mappins[]
}

const MapView = ({
    mapRef,
    setIsLoadingLocationInfo,
    setLocationFeatureInfo,
    setIsDrawerOpen,
    sessionToken,
    mappins,
}: MapViewProps) => {
    const [coordinates, setCoordinates] = useState({long: 0, lat: 0})
    const [currentLocation, setCurrentLocation] = useState("")
    const [locationData, setLocationData] = useState<SearchBoxFeatureSuggestion | null>(null)

    useEffect(() => {
        if (!coordinates.lat && !coordinates.long) {
            const fetchUserCoordinates = async () => {
                try {
                    const data = await fetchIpDetails()
                    mapRef.current?.flyTo({center: [data.longitude, data.latitude]})
                    setCoordinates({long: data.longitude, lat: data.latitude})
                } catch (error) {
                    console.error(error)
                }
            }

            fetchUserCoordinates()
        }
    }, [])

    const handleMarkClick = async (mapboxId: string, pinId: string) => {
        try {
            setIsLoadingLocationInfo(true)
            const data = await fetchRetrieveSearchResult({mapboxId, session_token: sessionToken})
            setLocationData(data.features[0])
            setCurrentLocation(pinId)
            setLocationFeatureInfo(data.features)
            setIsLoadingLocationInfo(false)
        } catch (error) {
            console.error(error)
            setIsLoadingLocationInfo(false)
        }
    }

    return (
        <Map
            ref={mapRef}
            initialViewState={{zoom: 13, ...coordinates}}
            style={{width: "100%", height: "100%"}}
            mapStyle="mapbox://styles/mapbox/standard"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            attributionControl={false}
        >
            <NavigationControl position="bottom-right" />
            <FullscreenControl position="bottom-right" />
            <GeolocateControl position="bottom-right" trackUserLocation />

            {mappins.map((pin) => {
                return (
                    <Fragment key={pin._id}>
                        <Marker
                            latitude={pin.latitude}
                            longitude={pin.longitude}
                            onClick={() => handleMarkClick(pin.mapboxId, pin._id)}
                            color="red"
                        >
                            <UserAvatar color={pin.userId.color} username={pin.userId.username} />
                        </Marker>
                        {!!locationData && pin._id === currentLocation && (
                            <Popup
                                latitude={pin.latitude}
                                longitude={pin.longitude}
                                offset={25}
                                closeButton={false}
                                className="z-10 min-w-[270px] !rounded-lg"
                                anchor="right"
                                onClose={() => setCurrentLocation("")}
                            >
                                <MapPopup
                                    locationInfo={locationData}
                                    setIsDrawerOpen={setIsDrawerOpen}
                                />
                            </Popup>
                        )}
                    </Fragment>
                )
            })}

            <ScaleControl />
        </Map>
    )
}

export default MapView
