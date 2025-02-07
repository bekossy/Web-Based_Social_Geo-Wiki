import Image from "next/image"

const MakiIcon: React.FC<{iconName: string}> = ({iconName}) => {
    const iconUrl = `https://raw.githubusercontent.com/mapbox/maki/main/icons/${iconName}.svg`

    return <Image src={iconUrl} alt={iconName} width={20} height={20} priority />
}

export default MakiIcon
