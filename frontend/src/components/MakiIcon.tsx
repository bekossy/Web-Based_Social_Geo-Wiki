import Image from "next/image"

interface MakiIconProps {
    iconName: string
    width?: number
    height?: number
}

const MakiIcon = ({iconName, width = 15, height = 15}: MakiIconProps) => {
    const iconUrl = `https://raw.githubusercontent.com/mapbox/maki/main/icons/${iconName}.svg`

    return <Image src={iconUrl} alt={iconName} width={width} height={height} priority />
}

export default MakiIcon
