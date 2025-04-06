import {dayMap} from "@/lib/constants"
import {formatTime} from "@/lib/utils"

interface RenderOpeningHoursProps {
    open_hours: {
        weekday_text: string[]
        periods: {
            open: {day: number; time: string}
            close?: {day: number; time: string}
        }[]
    }
}

export const renderOpeningHours = ({open_hours}: RenderOpeningHoursProps) => {
    if (!open_hours) return null

    if (open_hours.weekday_text) {
        return open_hours.weekday_text.map((text: string, idx: number) => <li key={idx}>{text}</li>)
    }

    return open_hours.periods?.map(
        (
            period: {
                open: {day: number; time: string}
                close?: {day: number; time: string}
            },
            idx: number
        ) => {
            const openDay = dayMap[period.open.day]
            const openTime = formatTime(period.open.time)
            const closeTime = period.close ? formatTime(period.close.time) : "Open 24 hours"

            return (
                <li key={idx}>
                    {openDay}: {openTime} - {closeTime}
                </li>
            )
        }
    )
}
