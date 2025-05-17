import {Marker} from "react-map-gl"

type CustomMarkerProps = {
    latitude: number
    longitude: number
    onClick: () => void
    username: string
    color: string
}

const CustomMarker = ({latitude, longitude, onClick, username, color}: CustomMarkerProps) => {
    const initials = username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <Marker latitude={latitude} longitude={longitude} onClick={onClick}>
            <div
                onClick={onClick}
                className="cursor-pointer group relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-transform hover:scale-110"
                style={{
                    backgroundColor: color,
                }}
            >
                <span className="text-white font-semibold">{initials}</span>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[inherit] z-[-1]" />
            </div>
        </Marker>
    )
}

export default CustomMarker
