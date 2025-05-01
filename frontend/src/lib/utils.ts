import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatTime = (time: string) => {
    return time?.length === 4 ? `${time.slice(0, 2)}:${time.slice(2)}` : time
}

export const formatSmartDate = (date: string | Date) => {
    const now = dayjs()
    const inputDate = dayjs(date)
    const diffSeconds = now.diff(inputDate, "second")
    const diffMinutes = now.diff(inputDate, "minute")
    const diffHours = now.diff(inputDate, "hour")
    const diffDays = now.diff(inputDate, "day")

    if (diffSeconds < 60) return "just now"
    if (diffMinutes < 60) return `${diffMinutes}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return inputDate.format("ddd")
    if (diffDays < 365) return inputDate.format("MMM D")
    return inputDate.format("MMM D, YYYY")
}
