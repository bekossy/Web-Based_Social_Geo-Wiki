import Image from "next/image"
import MarkerIcon from "@/assets/marker.svg"

interface MakiIconProps {
    iconName: string
    width?: number
    height?: number
}

const MakiIcon = ({iconName, width = 15, height = 15}: MakiIconProps) => {
    const iconUrl = `https://raw.githubusercontent.com/mapbox/maki/main/icons/${iconName}.svg`
    const fallbackUrl = MarkerIcon.src

    return (
        <Image
            src={iconUrl}
            alt={iconName}
            width={width}
            height={height}
            priority
            onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = fallbackUrl
            }}
        />
    )
}

export default MakiIcon
