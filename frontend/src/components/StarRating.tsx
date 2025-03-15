import {Star} from "lucide-react"
import {cn} from "@/lib/utils"
import {useState} from "react"

interface StarRatingProps {
    maxStars?: number
    value?: number
    onChange?: (rating: number) => void
}

const StarRating = ({maxStars = 5, value = 0, onChange}: StarRatingProps) => {
    const [hovered, setHovered] = useState<number | null>(null)

    return (
        <div className="flex gap-1">
            {[...Array(maxStars)].map((_, index) => {
                const rating = index + 1
                return (
                    <Star
                        key={rating}
                        className={cn("size-4 cursor-pointer transition-colors", {
                            "fill-yellow-400 text-yellow-400": hovered
                                ? rating <= hovered
                                : rating <= value,
                            "fill-gray-300 text-gray-300": hovered
                                ? rating > hovered
                                : rating > value,
                        })}
                        onMouseEnter={() => setHovered(rating)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onChange?.(rating)}
                    />
                )
            })}
        </div>
    )
}

export default StarRating
