import { useState, useEffect, Fragment } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
  IconCalendar,
  IconWorld,
  IconFileText,
  IconClipboardCheck,
  IconClock,
  IconPlayerPlay,
  IconLoader,
  IconCircleCheck,
  IconX,
  IconCheck,
  IconPlus,
  IconAlertTriangle,
  IconTrash,
  IconUser,
  IconPackage,
  IconMapPin,
  IconCash,
  IconPlant,
  IconListDetails,
  IconTimeline,
  IconDownload,
  IconArrowBack,
} from "@tabler/icons-react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"

// --- Types ---

type SalesSupplyRequestStatus =
  | "draft"
  | "pending-receipt"
  | "received"
  | "pending-approval"
  | "active"
  | "in-progress"
  | "completed"
  | "cancelled"

type AuditEntry = {
  action: string
  by: string
  role: string
  timestamp: string
}

type SalesSupplyRequest = {
  id: string
  crop: string
  variety: string
  quantity: string
  unit: string
  region: string
  budget: string
  aggregationWindow: string
  status: SalesSupplyRequestStatus
  createdBy: string
  createdDate: string
  notes: string
  linkedBuyerRequestId: string
  draftExpiresAt?: string // ISO date for draft deletion timer
  audit: AuditEntry[]
}

// --- Mock Data ---

const now = new Date()
const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString()
const expired = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()

const initialRequests: SalesSupplyRequest[] = [
  {
    id: "SSR-2026-001", crop: "Rice", variety: "Jasmine", quantity: "200", unit: "MT", region: "Volta Region",
    budget: "GHS 1,200,000", aggregationWindow: "Jul 1 - Aug 30, 2026", status: "active",
    createdBy: "Ama Serwaa", createdDate: "15 Jun 2026", notes: "Priority for export contracts",
    linkedBuyerRequestId: "BSR-2026-010",
    audit: [
      { action: "Created", by: "Ama Serwaa", role: "Sales Admin", timestamp: "15 Jun 2026, 09:12 AM" },
      { action: "Submitted", by: "Ama Serwaa", role: "Sales Admin", timestamp: "15 Jun 2026, 09:15 AM" },
      { action: "Received", by: "Kwame Asante", role: "Ops Team", timestamp: "16 Jun 2026, 10:30 AM" },
      { action: "Approved", by: "Director Mensah", role: "Ops Manager", timestamp: "17 Jun 2026, 02:00 PM" },
      { action: "Activated", by: "Director Mensah", role: "Ops Manager", timestamp: "17 Jun 2026, 02:01 PM" },
    ],
  },
  {
    id: "SSR-2026-002", crop: "Cocoa", variety: "Amelonado", quantity: "150", unit: "MT", region: "Ashanti Region",
    budget: "GHS 2,400,000", aggregationWindow: "Jul 15 - Sep 15, 2026", status: "in-progress",
    createdBy: "Ama Serwaa", createdDate: "14 Jun 2026", notes: "",
    linkedBuyerRequestId: "BSR-2026-008",
    audit: [
      { action: "Created", by: "Ama Serwaa", role: "Sales Admin", timestamp: "14 Jun 2026, 11:00 AM" },
      { action: "Submitted", by: "Ama Serwaa", role: "Sales Admin", timestamp: "14 Jun 2026, 11:05 AM" },
      { action: "Received", by: "Yaw Darko", role: "Ops Team", timestamp: "15 Jun 2026, 09:00 AM" },
      { action: "Approved", by: "Director Mensah", role: "Ops Manager", timestamp: "16 Jun 2026, 01:00 PM" },
    ],
  },
  {
    id: "SSR-2026-003", crop: "Maize", variety: "Yellow Maize", quantity: "500", unit: "MT", region: "Brong-Ahafo Region",
    budget: "GHS 800,000", aggregationWindow: "Aug 1 - Oct 31, 2026", status: "received",
    createdBy: "Kofi Boateng", createdDate: "20 Jun 2026", notes: "Local market supply",
    linkedBuyerRequestId: "BSR-2026-015",
    audit: [
      { action: "Created", by: "Kofi Boateng", role: "Sales Admin", timestamp: "20 Jun 2026, 08:30 AM" },
      { action: "Submitted", by: "Kofi Boateng", role: "Sales Admin", timestamp: "20 Jun 2026, 08:35 AM" },
      { action: "Received", by: "Kwame Asante", role: "Ops Team", timestamp: "21 Jun 2026, 10:00 AM" },
    ],
  },
  {
    id: "SSR-2026-004", crop: "Shea", variety: "Shea Nuts", quantity: "100", unit: "MT", region: "Northern Region",
    budget: "GHS 600,000", aggregationWindow: "Jul 1 - Sep 30, 2026", status: "pending-receipt",
    createdBy: "Ama Serwaa", createdDate: "25 Jun 2026", notes: "Export grade required",
    linkedBuyerRequestId: "BSR-2026-020",
    audit: [
      { action: "Created", by: "Ama Serwaa", role: "Sales Admin", timestamp: "25 Jun 2026, 10:00 AM" },
      { action: "Submitted", by: "Ama Serwaa", role: "Sales Admin", timestamp: "25 Jun 2026, 10:05 AM" },
    ],
  },
  {
    id: "SSR-2026-005", crop: "Cashew", variety: "Raw Cashew Nuts", quantity: "80", unit: "MT", region: "Bono East Region",
    budget: "GHS 1,500,000", aggregationWindow: "Aug 1 - Nov 30, 2026", status: "pending-receipt",
    createdBy: "Kofi Boateng", createdDate: "26 Jun 2026", notes: "",
    linkedBuyerRequestId: "BSR-2026-022",
    audit: [
      { action: "Created", by: "Kofi Boateng", role: "Sales Admin", timestamp: "26 Jun 2026, 02:00 PM" },
      { action: "Submitted", by: "Kofi Boateng", role: "Sales Admin", timestamp: "26 Jun 2026, 02:10 PM" },
    ],
  },
  {
    id: "SSR-2026-006", crop: "Sorghum", variety: "Red Sorghum", quantity: "300", unit: "MT", region: "Upper East Region",
    budget: "GHS 450,000", aggregationWindow: "Sep 1 - Nov 30, 2026", status: "draft",
    createdBy: "Ama Serwaa", createdDate: "28 Jun 2026", notes: "",
    linkedBuyerRequestId: "BSR-2026-025",
    draftExpiresAt: in2Days,
    audit: [
      { action: "Created", by: "Ama Serwaa", role: "Sales Admin", timestamp: "28 Jun 2026, 03:00 PM" },
    ],
  },
  {
    id: "SSR-2026-007", crop: "Cassava", variety: "Cassava Chips", quantity: "400", unit: "MT", region: "Eastern Region",
    budget: "GHS 520,000", aggregationWindow: "Jul 15 - Oct 15, 2026", status: "draft",
    createdBy: "Kofi Boateng", createdDate: "29 Jun 2026", notes: "Partial fill from existing stock",
    linkedBuyerRequestId: "BSR-2026-028",
    draftExpiresAt: in1Day,
    audit: [
      { action: "Created", by: "Kofi Boateng", role: "Sales Admin", timestamp: "29 Jun 2026, 09:00 AM" },
    ],
  },
  {
    id: "SSR-2026-008", crop: "Groundnut", variety: "Chinese Groundnut", quantity: "180", unit: "MT", region: "Northern Region",
    budget: "GHS 360,000", aggregationWindow: "Aug 1 - Oct 31, 2026", status: "completed",
    createdBy: "Ama Serwaa", createdDate: "01 May 2026", notes: "",
    linkedBuyerRequestId: "BSR-2026-003",
    audit: [
      { action: "Created", by: "Ama Serwaa", role: "Sales Admin", timestamp: "01 May 2026, 08:00 AM" },
      { action: "Submitted", by: "Ama Serwaa", role: "Sales Admin", timestamp: "01 May 2026, 08:05 AM" },
      { action: "Received", by: "Kwame Asante", role: "Ops Team", timestamp: "02 May 2026, 09:00 AM" },
      { action: "Approved", by: "Director Mensah", role: "Ops Manager", timestamp: "03 May 2026, 11:00 AM" },
      { action: "Completed", by: "System", role: "System", timestamp: "30 Jun 2026, 06:00 PM" },
    ],
  },
  {
    id: "SSR-2026-009", crop: "Soybean", variety: "TGX Soybean", quantity: "90", unit: "MT", region: "Savannah Region",
    budget: "GHS 270,000", aggregationWindow: "Jul 1 - Sep 30, 2026", status: "cancelled",
    createdBy: "Kofi Boateng", createdDate: "05 Jun 2026", notes: "Withdrawn - buyer cancelled sourcing request",
    linkedBuyerRequestId: "BSR-2026-005",
    audit: [
      { action: "Created", by: "Kofi Boateng", role: "Sales Admin", timestamp: "05 Jun 2026, 10:00 AM" },
      { action: "Submitted", by: "Kofi Boateng", role: "Sales Admin", timestamp: "05 Jun 2026, 10:05 AM" },
      { action: "Withdrawn", by: "Kofi Boateng", role: "Sales Admin", timestamp: "06 Jun 2026, 08:00 AM" },
    ],
  },
]

// --- Constants ---

const crops = ["Rice", "Cocoa", "Maize", "Shea", "Cashew", "Sorghum", "Cassava", "Yam", "Millet", "Groundnut", "Soybean", "Cowpea"]
const regions = ["Volta Region", "Ashanti Region", "Brong-Ahafo Region", "Northern Region", "Upper East Region", "Upper West Region", "Eastern Region", "Bono Region", "Savannah Region", "Bono East Region"]
const units = ["MT", "KG", "Bags"]

const tabItems = [
  { label: "All" },
  { label: "Draft" },
  { label: "Pending Receipt" },
  { label: "Received" },
  { label: "Active" },
  { label: "In Progress" },
  { label: "Completed" },
  { label: "Cancelled" },
]

const tabIcons: Record<string, typeof IconClipboardCheck> = {
  "All": IconClipboardCheck,
  "Draft": IconFileText,
  "Pending Receipt": IconClock,
  "Received": IconCheck,
  "Active": IconPlayerPlay,
  "In Progress": IconLoader,
  "Completed": IconCircleCheck,
  "Cancelled": IconX,
}

const statusToTab: Record<SalesSupplyRequestStatus, string> = {
  "draft": "Draft",
  "pending-receipt": "Pending Receipt",
  "received": "Received",
  "pending-approval": "Received",
  "active": "Active",
  "in-progress": "In Progress",
  "completed": "Completed",
  "cancelled": "Cancelled",
}

// --- Helpers ---

function statusLabel(s: SalesSupplyRequestStatus): string {
  const map: Record<SalesSupplyRequestStatus, string> = {
    "draft": "Draft",
    "pending-receipt": "Pending Receipt",
    "received": "Received",
    "pending-approval": "Pending Approval",
    "active": "Active",
    "in-progress": "In Progress",
    "completed": "Completed",
    "cancelled": "Cancelled",
  }
  return map[s]
}

function statusColor(s: SalesSupplyRequestStatus): "green" | "blue" | "red" | "warning" {
  switch (s) {
    case "active": case "completed": return "green"
    case "in-progress": case "received": case "pending-approval": return "blue"
    case "cancelled": return "red"
    default: return "warning"
  }
}

function getDraftTimeRemaining(expiresAt?: string): string {
  if (!expiresAt) return ""
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return "Expired"
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  if (days > 0) return `${days}d ${remainingHours}h remaining`
  if (hours > 0) return `${hours}h remaining`
  const minutes = Math.floor(diff / (1000 * 60))
  return `${minutes}m remaining`
}

function getDraftTimeUrgency(expiresAt?: string): "normal" | "warning" | "danger" {
  if (!expiresAt) return "normal"
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return "danger"
  if (diff < 24 * 60 * 60 * 1000) return "danger"
  if (diff < 48 * 60 * 60 * 1000) return "warning"
  return "normal"
}

// --- Components ---

function StatusBadge({ label, color }: { label: string; color: "green" | "blue" | "red" | "warning" }) {
  const styles = {
    green: { bg: "#D4F5D0", text: "#1A5514", dot: "#1A5514" },
    blue: { bg: "#D5E6FD", text: "#00439E", dot: "#00439E" },
    red: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
    warning: { bg: "#FEF0D8", text: "#995917", dot: "#995917" },
  }
  const s = styles[color]
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]" style={{ background: s.bg }}>
      <span className="size-[5px] rounded-full" style={{ background: s.dot }} />
      <span className="text-[12px] leading-[18px] font-normal" style={{ color: s.text }}>{label}</span>
    </span>
  )
}

function DraftCountdown({ expiresAt }: { expiresAt?: string }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const remaining = getDraftTimeRemaining(expiresAt)
  const urgency = getDraftTimeUrgency(expiresAt)
  if (!remaining) return null

  const colors = {
    normal: { bg: "#EDF0E6", text: "#525C4E", icon: "#525C4E" },
    warning: { bg: "#FEF0D8", text: "#995917", icon: "#995917" },
    danger: { bg: "#FEE2E2", text: "#DC2626", icon: "#DC2626" },
  }
  const c = colors[urgency]

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]" style={{ background: c.bg }}>
      {urgency === "danger" ? (
        <IconAlertTriangle className="size-3" style={{ color: c.icon }} />
      ) : (
        <IconClock className="size-3" style={{ color: c.icon }} />
      )}
      <span className="text-[11px] leading-[16px] font-bold" style={{ color: c.text }}>{remaining}</span>
    </span>
  )
}

// --- Request Card ---

function RequestCard({
  request,
  onOpen,
  onSubmit,
  onWithdraw,
}: {
  request: SalesSupplyRequest
  onOpen: () => void
  onSubmit: () => void
  onWithdraw: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="p-4 rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 cursor-pointer hover:outline-[#36B92E] transition-colors" onClick={onOpen}>
      <div className="flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] outline outline-1 outline-white shrink-0">
            <span className="text-[16px] leading-[24px] font-bold text-[#CEFFEB]">{request.crop.charAt(0)}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">
                {request.crop} &bull; {request.id}
              </span>
              <StatusBadge label={statusLabel(request.status)} color={statusColor(request.status)} />
              {request.status === "draft" && <DraftCountdown expiresAt={request.draftExpiresAt} />}
            </div>
            <p className="text-[12px] leading-[18px] font-normal text-[#71786C]">
              {request.variety} <span className="font-bold"> &bull; </span>
              {request.quantity} {request.unit} <span className="font-bold"> &bull; </span>
              {request.region}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] leading-[18px] text-[#525C4E]">BSR: {request.linkedBuyerRequestId}</span>
          <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}>
            {expanded ? (
              <IconChevronUp className="size-5 text-[#161D14]" />
            ) : (
              <IconChevronDown className="size-5 text-[#161D14]" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="flex flex-col gap-2 px-2 py-3 bg-[#F7FAF6] rounded-[6px]">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[12px] leading-[18px]">
              <span className="text-[#525C4E]">Created by: <span className="font-bold text-[#161D14]">{request.createdBy}</span></span>
              <span className="text-[#525C4E]">Created: <span className="font-bold text-[#161D14]">{request.createdDate}</span></span>
              <span className="text-[#525C4E]">Budget: <span className="font-bold text-[#161D14]">{request.budget}</span></span>
              <span className="text-[#525C4E]">Window: <span className="font-bold text-[#161D14]">{request.aggregationWindow}</span></span>
              <span className="text-[#525C4E]">Buyer Request: <span className="font-bold text-[#161D14]">{request.linkedBuyerRequestId}</span></span>
            </div>
            {request.notes && (
              <p className="text-[12px] leading-[18px] text-[#525C4E] mt-1">
                Notes: <span className="text-[#161D14]">{request.notes}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {request.status === "draft" && (
              <button
                onClick={(e) => { e.stopPropagation(); onSubmit() }}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#36B92E] text-white text-[13px] leading-[18px] font-bold hover:bg-[#5EC758] transition-colors"
              >
                Submit
                <IconChevronRight className="size-3.5" />
              </button>
            )}
            {request.status === "pending-receipt" && (
              <button
                onClick={(e) => { e.stopPropagation(); onWithdraw() }}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[13px] leading-[18px] font-bold hover:bg-[#FEE2E2] transition-colors"
              >
                <IconArrowBack className="size-3.5" />
                Withdraw
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// --- Create/Edit Modal ---

function CreateRequestModal({
  open,
  onClose,
  onSaveDraft,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSaveDraft: (data: Omit<SalesSupplyRequest, "id" | "status" | "audit" | "createdDate" | "draftExpiresAt">) => void
  onSubmit: (data: Omit<SalesSupplyRequest, "id" | "status" | "audit" | "createdDate" | "draftExpiresAt">) => void
}) {
  const [crop, setCrop] = useState("")
  const [variety, setVariety] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("MT")
  const [region, setRegion] = useState("")
  const [budget, setBudget] = useState("")
  const [windowStart, setWindowStart] = useState("")
  const [windowEnd, setWindowEnd] = useState("")
  const [notes, setNotes] = useState("")
  const [linkedBuyerRequestId, setLinkedBuyerRequestId] = useState("")
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [attempted, setAttempted] = useState(false)

  const requiredFields = { crop, variety, quantity, region, linkedBuyerRequestId, windowStart, windowEnd }

  const validate = () => {
    const newErrors: Record<string, boolean> = {}
    if (!crop) newErrors.crop = true
    if (!variety) newErrors.variety = true
    if (!quantity) newErrors.quantity = true
    if (!region) newErrors.region = true
    if (!linkedBuyerRequestId) newErrors.linkedBuyerRequestId = true
    if (!windowStart) newErrors.windowStart = true
    if (!windowEnd) newErrors.windowEnd = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getData = () => ({
    crop,
    variety,
    quantity,
    unit,
    region,
    budget: budget ? `GHS ${budget}` : "",
    aggregationWindow: windowStart && windowEnd ? `${windowStart} - ${windowEnd}` : "",
    notes,
    linkedBuyerRequestId,
    createdBy: "Ama Serwaa",
  })

  const resetForm = () => {
    setCrop(""); setVariety(""); setQuantity(""); setUnit("MT"); setRegion("")
    setBudget(""); setWindowStart(""); setWindowEnd(""); setNotes("")
    setLinkedBuyerRequestId(""); setErrors({}); setAttempted(false)
  }

  const handleSubmit = () => {
    setAttempted(true)
    if (!validate()) return
    onSubmit(getData())
    resetForm()
  }

  const handleSaveDraft = () => {
    onSaveDraft(getData())
    resetForm()
  }

  const inputClass = (field: string) =>
    `w-full h-10 px-3 rounded-lg outline outline-1 bg-white text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] focus:outline-[#36B92E] ${
      attempted && errors[field] ? "outline-[#DC2626]" : "outline-[#E5E8DF]"
    }`
  const labelClass = "text-[14px] leading-[20px] font-bold text-[#161D14]"
  const errorClass = "text-[12px] leading-[16px] text-[#DC2626] mt-0.5"

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()}>
      <ModalContent>
        <ModalHeader title="Create Supply Request" onClose={onClose} />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Linked Buyer Sourcing Request *</label>
              <input value={linkedBuyerRequestId} onChange={(e) => setLinkedBuyerRequestId(e.target.value)} placeholder="e.g. BSR-2026-030" className={inputClass("linkedBuyerRequestId")} />
              {attempted && errors.linkedBuyerRequestId && <span className={errorClass}>This field is required</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Crop *</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputClass("crop")}>
                  <option value="">Select crop</option>
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {attempted && errors.crop && <span className={errorClass}>This field is required</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Variety *</label>
                <input value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g. Jasmine" className={inputClass("variety")} />
                {attempted && errors.variety && <span className={errorClass}>This field is required</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Quantity *</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className={inputClass("quantity")} />
                {attempted && errors.quantity && <span className={errorClass}>This field is required</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass("")}>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Target Sourcing Region *</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass("region")}>
                  <option value="">Select region</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {attempted && errors.region && <span className={errorClass}>This field is required</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Estimated Budget / Price per unit</label>
                <div className="flex items-center">
                  <span className="h-10 px-3 flex items-center rounded-l-lg bg-[#EDF0E6] outline outline-1 outline-[#E5E8DF] text-[14px] text-[#525C4E]">GHS</span>
                  <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0.00" className={`${inputClass("")} rounded-l-none`} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Aggregation Window Start *</label>
                <input type="date" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} className={inputClass("windowStart")} />
                {attempted && errors.windowStart && <span className={errorClass}>This field is required</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Aggregation Window End *</label>
                <input type="date" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} className={inputClass("windowEnd")} />
                {attempted && errors.windowEnd && <span className={errorClass}>This field is required</span>}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} className="w-full px-3 py-2 rounded-lg outline outline-1 outline-[#E5E8DF] bg-white text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] focus:outline-[#36B92E] resize-none" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" size="md" shape="rect" onClick={handleSaveDraft}>
            <IconFileText className="size-4" />
            Save as Draft
          </Button>
          <Button type="button" size="md" shape="rect" onClick={handleSubmit}>
            Submit Request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// --- Withdraw Confirmation Modal ---

function WithdrawModal({
  open,
  request,
  onClose,
  onConfirm,
}: {
  open: boolean
  request: SalesSupplyRequest | null
  onClose: () => void
  onConfirm: () => void
}) {
  if (!request) return null

  const canWithdraw = request.status === "pending-receipt"

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()}>
      <ModalContent className="!w-[480px]">
        <ModalHeader title="Withdraw Supply Request" onClose={onClose} />
        <ModalBody>
          {canWithdraw ? (
            <div className="flex flex-col gap-4 pb-4">
              <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[#FEF0D8]">
                <IconAlertTriangle className="size-5 text-[#995917] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] leading-[20px] font-bold text-[#995917]">Are you sure?</span>
                  <span className="text-[13px] leading-[18px] text-[#995917]">
                    This will cancel request <strong>{request.id}</strong> and remove it from the Ops team's queue. This action cannot be undone.
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-[13px] leading-[18px]">
                <span className="text-[#525C4E]">Crop: <span className="font-bold text-[#161D14]">{request.crop} ({request.variety})</span></span>
                <span className="text-[#525C4E]">Quantity: <span className="font-bold text-[#161D14]">{request.quantity} {request.unit}</span></span>
                <span className="text-[#525C4E]">Region: <span className="font-bold text-[#161D14]">{request.region}</span></span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[#FEE2E2] mb-4">
              <IconX className="size-5 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[14px] leading-[20px] font-bold text-[#DC2626]">Withdrawal blocked</span>
                <span className="text-[13px] leading-[18px] text-[#DC2626]">
                  This request has already been marked as <strong>Received</strong> by the Ops team and is currently in review. You can no longer withdraw it.
                </span>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" size="md" shape="rect" onClick={onClose}>
            {canWithdraw ? "Cancel" : "Close"}
          </Button>
          {canWithdraw && (
            <Button type="button" variant="destructive" size="md" shape="rect" onClick={onConfirm}>
              <IconArrowBack className="size-4" />
              Withdraw Request
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// --- Detail View ---

function DetailView({
  request,
  onBack,
  onSubmit,
  onWithdraw,
}: {
  request: SalesSupplyRequest
  onBack: () => void
  onSubmit: () => void
  onWithdraw: () => void
}) {
  const [activeTab, setActiveTab] = useState<"details" | "audit">("details")

  const steps = [
    { key: "draft", label: "Draft" },
    { key: "pending-receipt", label: "Pending Receipt" },
    { key: "received", label: "Received" },
    { key: "active", label: "Active" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ]
  const isCancelled = request.status === "cancelled"
  const statusIdx = steps.findIndex(s => s.key === request.status)

  return (
    <div className="flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="inline-flex justify-between items-start px-[40px] py-[16px] bg-white border-b border-[#E5E8DF] -mx-[40px]">
        <div className="inline-flex flex-col items-start gap-[4px]">
          <div className="inline-flex items-center gap-[2px] py-[4px]">
            <button onClick={onBack} className="flex items-center gap-[2px] h-[22px] text-[16px] leading-[24px] font-bold text-[#36B92E] hover:text-[#2DA526] transition-colors">
              Supply Requests
            </button>
            <div className="w-[20px] h-[20px] flex items-center justify-center">
              <IconChevronRight className="size-[20px] text-[#73796E]" />
            </div>
            <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">Request details</span>
          </div>
          <div className="inline-flex items-center gap-[4px]">
            <h1 className="text-[28px] leading-[36px] font-bold text-[#161D14]">
              {request.crop} &bull; {request.id}
            </h1>
            <StatusBadge label={statusLabel(request.status)} color={statusColor(request.status)} />
            {request.status === "draft" && <DraftCountdown expiresAt={request.draftExpiresAt} />}
          </div>
        </div>
        <div className="flex items-center gap-[16px]">
          {request.status === "draft" && (
            <Button variant="primary" size="sm" onClick={onSubmit}>
              Submit Request
            </Button>
          )}
          {request.status === "pending-receipt" && (
            <Button variant="destructive" size="sm" onClick={onWithdraw}>
              <IconArrowBack className="size-4" />
              Withdraw
            </Button>
          )}
        </div>
      </div>

      {/* Status Stepper */}
      <div className="inline-flex flex-col items-start gap-[16px] px-[2px] py-[16px] bg-white rounded-[12px] w-full">
        <div className="self-stretch flex flex-col items-start gap-[20px] py-[4px]">
          <div className="self-stretch inline-flex items-center">
            {steps.map((step, i) => (
              <Fragment key={step.key}>
                <div className="w-[80px] inline-flex flex-col items-center gap-[8px]">
                  {isCancelled && i === statusIdx ? (
                    <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#FEE2E2]">
                      <IconX className="size-[16px] text-[#DC2626]" />
                    </div>
                  ) : i < statusIdx || (i === statusIdx && !isCancelled) ? (
                    <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#C9F0D6]">
                      <IconCheck className="size-[16px] text-[#00572D]" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] outline outline-[1.4px] -outline-offset-[1.4px] outline-[#C3C8BC]">
                      <div className="size-[16px] opacity-0" />
                    </div>
                  )}
                  <span
                    className="text-center text-[12px] leading-[18px] font-normal"
                    style={{
                      color: isCancelled && i === statusIdx ? "#DC2626"
                        : i < statusIdx ? "#008744"
                        : i === statusIdx ? "#0063EA"
                        : "#525C4E"
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="flex-[1_1_0] h-[4px] rounded-[1000px]"
                    style={{ background: i < statusIdx ? "#36B92E" : "#E1E4DA" }}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center border-b border-[#E5E8DF] mb-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-1.5 px-4 py-3 text-[14px] leading-[20px] font-bold transition-colors relative ${activeTab === "details" ? "text-[#36B92E]" : "text-[#525C4E] hover:text-[#161D14]"}`}
        >
          <IconListDetails className="size-4" />
          Request details
          {activeTab === "details" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36B92E] rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-1.5 px-4 py-3 text-[14px] leading-[20px] font-bold transition-colors relative ${activeTab === "audit" ? "text-[#36B92E]" : "text-[#525C4E] hover:text-[#161D14]"}`}
        >
          <IconTimeline className="size-4" />
          Audit trail
          {activeTab === "audit" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36B92E] rounded-t-full" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-0">
        <div className="flex-1 pr-8 flex flex-col gap-4">
          {activeTab === "details" ? (
            <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <button className="flex items-center justify-between w-full px-5 py-4 hover:bg-[#F7FAF6] transition-colors">
                <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Request Details</h3>
              </button>
              <div className="flex flex-col px-5 pb-5 border-t border-[#E5E8DF]">
                <InfoRow label="Crop" value={request.crop} />
                <InfoRow label="Variety" value={request.variety} />
                <InfoRow label="Quantity" value={`${request.quantity} ${request.unit}`} />
                <InfoRow label="Region" value={request.region} />
                <InfoRow label="Budget" value={request.budget || "Not specified"} />
                <InfoRow label="Aggregation Window" value={request.aggregationWindow} />
                <InfoRow label="Linked Buyer Request" value={request.linkedBuyerRequestId} />
                {request.notes && <InfoRow label="Notes" value={request.notes} />}
              </div>
            </div>
          ) : (
            <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <div className="px-5 py-4">
                <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Activity Log</h3>
              </div>
              <div className="flex flex-col gap-4 px-5 pb-5 border-t border-[#E5E8DF] pt-4">
                {request.audit.map((entry, i) => {
                  const iconMap: Record<string, { bg: string; icon: typeof IconFileText; color: string }> = {
                    "Created": { bg: "#EDF0E6", icon: IconFileText, color: "#525C4E" },
                    "Submitted": { bg: "#FEF0D8", icon: IconChevronRight, color: "#995917" },
                    "Received": { bg: "#D5E6FD", icon: IconClipboardCheck, color: "#00439E" },
                    "Approved": { bg: "#C9F0D6", icon: IconCheck, color: "#00572D" },
                    "Activated": { bg: "#C9F0D6", icon: IconPlayerPlay, color: "#00572D" },
                    "Withdrawn": { bg: "#FEE2E2", icon: IconArrowBack, color: "#DC2626" },
                    "Completed": { bg: "#C9F0D6", icon: IconCircleCheck, color: "#00572D" },
                  }
                  const cfg = iconMap[entry.action] || iconMap["Created"]
                  const Icon = cfg.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full shrink-0" style={{ background: cfg.bg }}>
                        <Icon className="size-4" style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{entry.action}</span>
                        <span className="text-[12px] leading-[18px] text-[#525C4E]">
                          {entry.timestamp} by {entry.by} ({entry.role})
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="w-px bg-[#E5E8DF] shrink-0" />

        <div className="w-[320px] shrink-0 pl-8">
          <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden sticky top-4">
            <div className="p-4 border-b border-[#E5E8DF]">
              <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Request Summary</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <SummaryRow icon={IconFileText} label="Request ID" value={request.id} />
              <SummaryRow icon={IconPlant} label="Crop" value={request.crop} />
              <SummaryRow icon={IconPackage} label="Variety" value={request.variety} />
              <SummaryRow icon={IconPackage} label="Quantity" value={`${request.quantity} ${request.unit}`} />
              <SummaryRow icon={IconMapPin} label="Region" value={request.region} />
              <SummaryRow icon={IconCalendar} label="Window" value={request.aggregationWindow} />
              <SummaryRow icon={IconUser} label="Created by" value={request.createdBy} />
              <SummaryRow icon={IconClipboardCheck} label="Buyer Request" value={request.linkedBuyerRequestId} />
              <div className="h-px bg-[#E5E8DF]" />
              <div className="flex items-center gap-2">
                <IconCash className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Budget</span>
                <span className="ml-auto text-[16px] leading-[24px] font-bold text-[#36B92E]">{request.budget || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start">
      <span className="w-[269px] shrink-0 py-3 text-[16px] leading-[24px] font-normal text-[#525C4E]">{label}</span>
      <span className="flex-1 py-3 text-[16px] leading-[24px] font-normal text-[#161D14]">{value}</span>
    </div>
  )
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof IconFileText; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-[#525C4E]" />
      <span className="text-[14px] leading-[20px] text-[#525C4E]">{label}</span>
      <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14] text-right">{value}</span>
    </div>
  )
}

// --- Main Page ---

export function SalesAdminSupplyRequestsPage({ onDetailViewChange, initialTab }: { onDetailViewChange?: (v: boolean) => void; initialTab?: string }) {
  const [requests, setRequests] = useState(initialRequests)
  const [activeTab, setActiveTab] = useState(initialTab || "All")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SalesSupplyRequest | null>(null)
  const [withdrawTarget, setWithdrawTarget] = useState<SalesSupplyRequest | null>(null)
  const { toast, showToast, dismissToast } = useToast()

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    onDetailViewChange?.(!!selectedRequest)
  }, [selectedRequest, onDetailViewChange])

  const nextId = () => {
    const nums = requests.map(r => parseInt(r.id.split("-")[2]))
    const max = Math.max(...nums, 0)
    return `SSR-2026-${String(max + 1).padStart(3, "0")}`
  }

  const handleSaveDraft = (data: Omit<SalesSupplyRequest, "id" | "status" | "audit" | "createdDate" | "draftExpiresAt">) => {
    const id = nextId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    const newReq: SalesSupplyRequest = {
      ...data,
      id,
      status: "draft",
      createdDate: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      draftExpiresAt: expiresAt,
      audit: [{ action: "Created", by: data.createdBy, role: "Sales Admin", timestamp: now.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) }],
    }
    setRequests(prev => [newReq, ...prev])
    setShowCreateModal(false)
    showToast(`${id} saved as draft. Auto-deletes in 3 days.`)
  }

  const handleCreateSubmit = (data: Omit<SalesSupplyRequest, "id" | "status" | "audit" | "createdDate" | "draftExpiresAt">) => {
    const id = nextId()
    const now = new Date()
    const ts = now.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
    const newReq: SalesSupplyRequest = {
      ...data,
      id,
      status: "pending-receipt",
      createdDate: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      audit: [
        { action: "Created", by: data.createdBy, role: "Sales Admin", timestamp: ts },
        { action: "Submitted", by: data.createdBy, role: "Sales Admin", timestamp: ts },
      ],
    }
    setRequests(prev => [newReq, ...prev])
    setShowCreateModal(false)
    showToast(`${id} submitted. Ops team has been notified.`)
  }

  const handleSubmitDraft = (req: SalesSupplyRequest) => {
    const ts = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
    setRequests(prev => prev.map(r =>
      r.id === req.id ? {
        ...r,
        status: "pending-receipt" as SalesSupplyRequestStatus,
        draftExpiresAt: undefined,
        audit: [...r.audit, { action: "Submitted", by: r.createdBy, role: "Sales Admin", timestamp: ts }],
      } : r
    ))
    if (selectedRequest?.id === req.id) {
      setSelectedRequest(prev => prev ? { ...prev, status: "pending-receipt", draftExpiresAt: undefined } : null)
    }
    showToast(`${req.id} submitted. Ops team has been notified.`)
  }

  const handleWithdraw = () => {
    if (!withdrawTarget) return
    if (withdrawTarget.status !== "pending-receipt") {
      showToast(`Cannot withdraw ${withdrawTarget.id} - already received by Ops team.`)
      setWithdrawTarget(null)
      return
    }
    const ts = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
    setRequests(prev => prev.map(r =>
      r.id === withdrawTarget.id ? {
        ...r,
        status: "cancelled" as SalesSupplyRequestStatus,
        audit: [...r.audit, { action: "Withdrawn", by: r.createdBy, role: "Sales Admin", timestamp: ts }],
      } : r
    ))
    if (selectedRequest?.id === withdrawTarget.id) {
      setSelectedRequest(null)
    }
    showToast(`${withdrawTarget.id} withdrawn and removed from Ops queue.`)
    setWithdrawTarget(null)
  }

  // Detail view
  if (selectedRequest) {
    const freshReq = requests.find(r => r.id === selectedRequest.id) || selectedRequest
    return (
      <>
        <DetailView
          request={freshReq}
          onBack={() => setSelectedRequest(null)}
          onSubmit={() => handleSubmitDraft(freshReq)}
          onWithdraw={() => setWithdrawTarget(freshReq)}
        />
        <WithdrawModal
          open={!!withdrawTarget}
          request={withdrawTarget}
          onClose={() => setWithdrawTarget(null)}
          onConfirm={handleWithdraw}
        />
        {toast && <Toast message={toast} onDismiss={dismissToast} />}
      </>
    )
  }

  const filteredRequests = activeTab === "All"
    ? requests
    : requests.filter(r => statusToTab[r.status] === activeTab)

  const metricCards = [
    { label: "Total Requests", value: String(requests.length), iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconClipboardCheck },
    { label: "Drafts", value: String(requests.filter(r => r.status === "draft").length), iconBg: "#FEF0D8", iconColor: "#995917", icon: IconFileText },
    { label: "Pending Receipt", value: String(requests.filter(r => r.status === "pending-receipt").length), iconBg: "#FEF0D8", iconColor: "#995917", icon: IconClock },
    { label: "Active", value: String(requests.filter(r => r.status === "active" || r.status === "in-progress").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconPlayerPlay },
    { label: "Completed", value: String(requests.filter(r => r.status === "completed").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconCircleCheck },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[28px] leading-[36px] text-[#161D14]">Supply Requests</h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          <IconPlus className="size-4" />
          Create Supply Request
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        {[
          { label: "All time", icon: IconCalendar },
          { label: "All regions", icon: IconWorld },
          { label: "All commodities", icon: IconWorld },
        ].map((f) => {
          const Icon = f.icon
          return (
            <button key={f.label} className="flex items-center gap-2 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14]">
              <Icon className="size-4 text-[#161D14]" />
              {f.label}
              <IconChevronDown className="size-4 text-[#161D14]" />
            </button>
          )
        })}
      </div>

      {/* Metrics */}
      <div className="grid gap-4 grid-cols-5">
        {metricCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3 hover-lift stagger-child" style={{ "--stagger-index": i } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md flex items-center" style={{ background: card.iconBg }}>
                  <Icon className="size-4" style={{ color: card.iconColor }} />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#161D14]">{card.label}</span>
              </div>
              <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center h-[58px] border-b-2 border-[#E5E8DF]">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.label
          const Icon = tabIcons[tab.label] || IconClipboardCheck
          const count = tab.label === "All" ? requests.length : requests.filter(r => statusToTab[r.status] === tab.label).length
          return (
            <button key={tab.label} onClick={() => setActiveTab(tab.label)} className="flex flex-col justify-center items-center self-stretch">
              <div className={`flex items-center gap-2 px-3 py-4 text-[16px] leading-[24px] ${isActive ? "font-bold text-[#306B28]" : "font-normal text-[#161D14]"}`}>
                <Icon className="size-5" />
                {tab.label}
                {count > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-px rounded-full bg-[#0063EA] outline outline-2 outline-white text-white text-[12px] leading-[18px] font-normal min-w-[18px]">
                    {count}
                  </span>
                )}
              </div>
              <div className={`self-stretch h-0.5 ${isActive ? "bg-[#306B28]" : "bg-[#E5E8DF]"}`} />
            </button>
          )
        })}
      </div>

      {/* Request Cards */}
      <div className="flex flex-col gap-3">
        {filteredRequests.map((req, i) => (
          <div key={req.id} className="stagger-child" style={{ "--stagger-index": i } as React.CSSProperties}>
            <RequestCard
              request={req}
              onOpen={() => setSelectedRequest(req)}
              onSubmit={() => handleSubmitDraft(req)}
              onWithdraw={() => setWithdrawTarget(req)}
            />
          </div>
        ))}
        {filteredRequests.length === 0 && (
          <div className="flex items-center justify-center py-16 text-[14px] leading-[20px] text-[#525C4E]">
            No supply requests in this category.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">
          {filteredRequests.length} request(s)
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Rows per page</span>
            <div className="flex items-center gap-1 h-9 px-3 rounded-lg outline outline-1 outline-[#E5E8DF]">
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="bg-transparent text-[14px] leading-[20px] font-normal text-[#161D14] outline-none appearance-none pr-4">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <IconChevronDown className="size-4 text-[#525C4E] -ml-3" />
            </div>
          </div>
          <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]"><IconChevronsLeft className="size-4" /></button>
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]"><IconChevronLeft className="size-4" /></button>
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]"><IconChevronRight className="size-4" /></button>
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]"><IconChevronsRight className="size-4" /></button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateRequestModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleCreateSubmit}
      />
      <WithdrawModal
        open={!!withdrawTarget}
        request={withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        onConfirm={handleWithdraw}
      />

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
