import * as React from "react"
import { useCarousel } from "@/components/ui/carousel" // ✅ adjust if needed
import { cn } from "@/lib/utils"

type DotProps = {
  index: number
}

export const Dot = ({ index }: DotProps) => {
  const { api } = useCarousel()
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    onSelect()

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <button
      type="button"
      onClick={() => api?.scrollTo(index)}
      className={cn(
        "w-2.5 h-2.5 rounded-full transition-colors duration-300",
        selectedIndex === index
          ? "bg-[--gold-default]"
          : "bg-gray-500/30 hover:bg-gray-500/60"
      )}
      aria-label={`Go to slide ${index + 1}`}
    />
  )
}
