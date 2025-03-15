import User from "../models/user.model"

export const generateUniqueColor = async (): Promise<string> => {
    const allUsers = await User.find({}, "color")
    const usedColors = new Set(allUsers.map((user) => user.color))

    let color: string
    do {
        const hue = Math.floor(Math.random() * 360)
        color = `hsl(${hue},70%,50%)`
    } while (usedColors.has(color))

    return color
}
