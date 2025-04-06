import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatTime = (time: string) => {
    return time?.length === 4 ? `${time.slice(0, 2)}:${time.slice(2)}` : time
}
