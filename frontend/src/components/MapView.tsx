"use client"

import {RefObject, useState} from "react"
import Map, {
    FullscreenControl,
    GeolocateControl,
    MapRef,
    Marker,
    NavigationControl,
    ScaleControl,
} from "react-map-gl"

type MapViewProps = {
    mapRef: RefObject<MapRef | null>
}

const MapView = ({mapRef}: MapViewProps) => {
    const [coordinates, setCoordinates] = useState({long: 0, lat: 0})

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
            <Marker
                latitude={coordinates.lat}
                longitude={coordinates.long}
                draggable
                onDragEnd={(e) => {
                    setCoordinates({long: e.lngLat.lng, lat: e.lngLat.lat})
                }}
            />

            <ScaleControl />
        </Map>
    )
}

export default MapView
