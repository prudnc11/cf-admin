import { useState, useRef, useEffect } from "react"
import { IconChevronDown, IconCheck, type Icon } from "@tabler/icons-react"

type FilterOption = {
  label: string
  value: string
}

type FilterDropdownProps = {
  label: string
  icon?: Icon
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  allLabel?: string
}

export function FilterDropdown({ label, icon: Icon, options, value, onChange, allLabel }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const displayLabel = value === "all" ? (allLabel ?? label) : options.find((o) => o.value === value)?.label ?? label
  const isFiltered = value !== "all"

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 h-9 px-3 rounded-full text-[14px] leading-[20px] font-normal transition-colors ${
          isFiltered
            ? "bg-[#D4F5D0] text-[#1A5514]"
            : "bg-[#EDF0E6] text-[#161D14] hover:bg-[#E1E4DA]"
        }`}
      >
        {Icon && <Icon className="size-4" />}
        {displayLabel}
        <IconChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-[12px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1 z-50 max-h-[320px] overflow-y-auto">
          <button
            onClick={() => { onChange("all"); setOpen(false) }}
            className="flex items-center gap-2 w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]"
          >
            <span className="flex-1">{allLabel ?? label}</span>
            {value === "all" && <IconCheck className="size-4 text-[#36B92E]" />}
          </button>
          <div className="h-px bg-[#E5E8DF] mx-2" />
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]"
            >
              <span className="flex-1">{opt.label}</span>
              {value === opt.value && <IconCheck className="size-4 text-[#36B92E]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Date range presets
export const DATE_OPTIONS: FilterOption[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "This year", value: "year" },
]

// Utility: check if a date string falls within a range
export function isWithinDateRange(dateStr: string, range: string): boolean {
  if (range === "all") return true
  const now = new Date()
  let cutoff: Date
  switch (range) {
    case "7d": cutoff = new Date(now.getTime() - 7 * 86400000); break
    case "30d": cutoff = new Date(now.getTime() - 30 * 86400000); break
    case "90d": cutoff = new Date(now.getTime() - 90 * 86400000); break
    case "year": cutoff = new Date(now.getFullYear(), 0, 1); break
    default: return true
  }
  const parsed = new Date(dateStr)
  return !isNaN(parsed.getTime()) && parsed >= cutoff
}
