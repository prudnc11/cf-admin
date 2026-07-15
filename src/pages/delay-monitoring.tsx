import { useState } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronsRight,
  IconChevronsLeft,
  IconClipboardCheck,
  IconArrowRight,
  IconClock,
  IconPercentage,
  IconDots,
  IconX,
  IconFileExport,
  IconSearch,
  IconSend,
  IconSettings,
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconRefreshAlert,
} from "@tabler/icons-react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { FormField, FormSelect, FormTextarea } from "@/components/ui/form-fields"

// ── Types ──

type DelayStatus = "On Track" | "At Risk" | "Delayed" | "Escalated" | "Resolved"
type ProcurementIndicator = "Blocked" | "Behind Schedule" | "Not Started" | "Partial"
type FulfillmentSeverity = "Major" | "Moderate" | "Critical" | "Minor" | "Over"

type ProcurementDelayRow = {
  id: string
  aggregator: string
  commodity: string
  lotId: string
  plannedQty: number
  collected: number
  plannedTime: string
  plannedDate: string
  actualTime: string
  actualDate: string
  delay: string
  indicator: ProcurementIndicator
  status: DelayStatus
}

type FulfillmentDelayRow = {
  id: string
  buyer: string
  orderId: string
  commodity: string
  quantity: number
  dispatchTime: string
  dispatchDate: string
  expectedTime: string
  expectedDate: string
  actualTime: string
  actualDate: string
  severity: FulfillmentSeverity
  status: DelayStatus
}

type HeatmapRow = {
  aggregator: string
  days: (number | null)[]
  total: number
}

type DelayReason = {
  label: string
  value: string
  filledSegments: number
  filledColor: string
  emptyColor: string
}

// ── Static data ──

const summaryCards = [
  { label: "Procurement Delays", value: "3", sub: "Avg +2.8d overrun", icon: IconClipboardCheck, iconBg: "#D5E6FD", iconColor: "#00439E" },
  { label: "Fulfilment Delays", value: "4", sub: "Avg +2.1d overrun", icon: IconArrowRight, iconBg: "#FEF0D8", iconColor: "#995917" },
  { label: "Procurement On-time Rate", value: "83%", sub: "+4%  vs last period", subColor: "#1A5514", hasArrow: true, hasChevron: true, icon: IconPercentage, iconBg: "#D4F5D0", iconColor: "#1A5514" },
  { label: "Avg Fulfillment Time", value: "4.1d", sub: "Target: 3.0d", icon: IconClock, iconBg: "#D5E6FD", iconColor: "#00439E" },
]

const delayReasons: DelayReason[] = [
  { label: "Transport delay", value: "1.8 d", filledSegments: 6, filledColor: "#306B28", emptyColor: "#E1E4DA" },
  { label: "Documentation", value: "0.4 d", filledSegments: 5, filledColor: "#995917", emptyColor: "#FEF0D8" },
  { label: "Inventory Shortage", value: "1.1 d", filledSegments: 7, filledColor: "#8F0004", emptyColor: "#FFDAD6" },
  { label: "Buyer Availability", value: "0.1 d", filledSegments: 4, filledColor: "#8F0004", emptyColor: "#FFDAD6" },
  { label: "Farmer Unavailable", value: "1.8 d", filledSegments: 6, filledColor: "#306B28", emptyColor: "#E1E4DA" },
  { label: "Logistics delay", value: "0.1 d", filledSegments: 4, filledColor: "#8F0004", emptyColor: "#FFDAD6" },
  { label: "Supplier Shortfall", value: "0.4 d", filledSegments: 5, filledColor: "#995917", emptyColor: "#FEF0D8" },
  { label: "Quality Rejection", value: "1.8 d", filledSegments: 6, filledColor: "#306B28", emptyColor: "#E1E4DA" },
]

const heatmapData: HeatmapRow[] = [
  { aggregator: "Kojo Kweku", days: [null, null, 2, 2, null, null, null], total: 4 },
  { aggregator: "Jude Owusu", days: [null, null, null, null, 1, null, null], total: 1 },
  { aggregator: "Kofi Olamide", days: [null, 1, 2, 2, null, null, null], total: 5 },
  { aggregator: "Felix Jane", days: [null, null, null, 2, 1, 1, null], total: 4 },
  { aggregator: "Prudence King", days: [1, 1, 1, 2, null, null, null], total: 5 },
  { aggregator: "Jude Owusu", days: [null, null, null, null, 1, null, null], total: 1 },
]

const procurementRows: ProcurementDelayRow[] = [
  { id: "1", aggregator: "John Doe", commodity: "Chilli Pepper", lotId: "DIS-001", plannedQty: 840, collected: 0, plannedTime: "14:30", plannedDate: "01 Sep 2026", actualTime: "14:30", actualDate: "01 Sep 2026", delay: "+4.2d", indicator: "Blocked", status: "Escalated" },
  { id: "2", aggregator: "Owusu Opoku", commodity: "Cocoa", lotId: "DIS-001", plannedQty: 658, collected: 0, plannedTime: "14:30", plannedDate: "01 Sep 2026", actualTime: "14:30", actualDate: "01 Sep 2026", delay: "+2.1d", indicator: "Behind Schedule", status: "At Risk" },
  { id: "3", aggregator: "Nat Kofi", commodity: "Cassava", lotId: "DIS-001", plannedQty: 210, collected: 100, plannedTime: "14:30", plannedDate: "01 Sep 2026", actualTime: "14:30", actualDate: "01 Sep 2026", delay: "+1.8d", indicator: "Blocked", status: "Escalated" },
  { id: "4", aggregator: "John Dumelou", commodity: "Sorghum", lotId: "DIS-001", plannedQty: 320, collected: 0, plannedTime: "14:30", plannedDate: "01 Sep 2026", actualTime: "14:30", actualDate: "01 Sep 2026", delay: "+1.4d", indicator: "Not Started", status: "Delayed" },
  { id: "5", aggregator: "Kanta Seyram", commodity: "Maize", lotId: "DIS-001", plannedQty: 1800, collected: 800, plannedTime: "14:30", plannedDate: "01 Sep 2026", actualTime: "14:30", actualDate: "01 Sep 2026", delay: "+22 MT", indicator: "Partial", status: "Resolved" },
  { id: "6", aggregator: "Owusu Opoku", commodity: "Yam", lotId: "DIS-002", plannedQty: 1100, collected: 10, plannedTime: "15:00", plannedDate: "02 Sep 2026", actualTime: "15:00", actualDate: "02 Sep 2026", delay: "-50 MT", indicator: "Blocked", status: "At Risk" },
  { id: "7", aggregator: "Nat Kofi", commodity: "Rice", lotId: "DIS-002", plannedQty: 900, collected: 48, plannedTime: "15:00", plannedDate: "02 Sep 2026", actualTime: "15:00", actualDate: "02 Sep 2026", delay: "+20 MT", indicator: "Behind Schedule", status: "At Risk" },
  { id: "8", aggregator: "Owusu Opoku", commodity: "Groundnut", lotId: "DIS-002", plannedQty: 450, collected: 470, plannedTime: "15:00", plannedDate: "02 Sep 2026", actualTime: "15:00", actualDate: "02 Sep 2026", delay: "+20 MT", indicator: "Blocked", status: "Delayed" },
]

const fulfillmentRows: FulfillmentDelayRow[] = [
  { id: "1", buyer: "Lagos Grain co", orderId: "ORD-ID-0488", commodity: "Chilli Pepper", quantity: 840, dispatchTime: "14:30", dispatchDate: "01 Sep 2026", expectedTime: "14:30", expectedDate: "01 Sep 2026", actualTime: "", actualDate: "", severity: "Major", status: "Delayed" },
  { id: "2", buyer: "Abuja Commod...", orderId: "ORD-ID-0488", commodity: "Cocoa", quantity: 658, dispatchTime: "14:30", dispatchDate: "01 Sep 2026", expectedTime: "14:30", expectedDate: "01 Sep 2026", actualTime: "", actualDate: "", severity: "Moderate", status: "Delayed" },
  { id: "3", buyer: "Tan Grain Co", orderId: "ORD-ID-0488", commodity: "Cassava", quantity: 210, dispatchTime: "14:30", dispatchDate: "01 Sep 2026", expectedTime: "14:30", expectedDate: "01 Sep 2026", actualTime: "", actualDate: "", severity: "Critical", status: "Delayed" },
  { id: "4", buyer: "Tan Grain Co", orderId: "ORD-ID-0488", commodity: "Sorghum", quantity: 320, dispatchTime: "14:30", dispatchDate: "01 Sep 2026", expectedTime: "14:30", expectedDate: "01 Sep 2026", actualTime: "", actualDate: "", severity: "Minor", status: "Delayed" },
  { id: "5", buyer: "Tan Grain Co", orderId: "ORD-ID-0488", commodity: "Maize", quantity: 1800, dispatchTime: "14:30", dispatchDate: "01 Sep 2026", expectedTime: "14:30", expectedDate: "01 Sep 2026", actualTime: "15:00", actualDate: "02 Sep 2026", severity: "Over", status: "Resolved" },
  { id: "6", buyer: "Tan Grain Co", orderId: "ORD-ID-0488", commodity: "Rice", quantity: 300, dispatchTime: "15:00", dispatchDate: "02 Sep 2026", expectedTime: "15:00", expectedDate: "02 Sep 2026", actualTime: "", actualDate: "", severity: "Major", status: "Escalated" },
]

const TOTAL_ROWS = 68
const ROWS_PER_PAGE = 10

// ── Subcomponents ──

function DelayStatusBadge({ status }: { status: DelayStatus }) {
  const styles: Record<DelayStatus, { color: string; border?: string }> = {
    "On Track": { color: "#1A5514", border: "#A3D4A0" },
    "At Risk": { color: "#995917", border: "#E8C888" },
    Delayed: { color: "#BA1A1A", border: "#E8A3A3" },
    Escalated: { color: "#BA1A1A", border: "#E8A3A3" },
    Resolved: { color: "#1A5514", border: "#A3D4A0" },
  }
  const s = styles[status]
  return (
    <span
      className="text-[12px] leading-[18px] px-2 py-0.5 rounded-full font-medium"
      style={{ color: s.color, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  )
}

function IndicatorBadge({ indicator }: { indicator: ProcurementIndicator }) {
  const colors: Record<ProcurementIndicator, string> = {
    Blocked: "#BA1A1A",
    "Behind Schedule": "#995917",
    "Not Started": "#525C4E",
    Partial: "#00439E",
  }
  return (
    <span className="text-[12px] leading-[18px] font-medium" style={{ color: colors[indicator] }}>
      {indicator}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: FulfillmentSeverity }) {
  const colors: Record<FulfillmentSeverity, string> = {
    Major: "#BA1A1A",
    Moderate: "#995917",
    Critical: "#BA1A1A",
    Minor: "#525C4E",
    Over: "#1A5514",
  }
  return (
    <span className="text-[14px] leading-[20px] font-medium" style={{ color: colors[severity] }}>
      {severity}
    </span>
  )
}

function HeatmapCell({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <div className="w-12 h-12 px-2 py-4 bg-[#EDF0E6] rounded-[6px] flex items-center justify-center">
        <span className="text-[12px] leading-[18px] font-bold text-[#71786C]">--</span>
      </div>
    )
  }
  if (value >= 2) {
    return (
      <div className="w-12 h-12 px-2 py-4 bg-[#FFDAD6] rounded-[6px] flex items-center justify-center">
        <span className="text-[12px] leading-[18px] font-bold text-[#8F0004]">{value}</span>
      </div>
    )
  }
  if (value === 1) {
    return (
      <div className="w-12 h-12 px-2 py-4 bg-[#FEF0D8] rounded-[6px] flex items-center justify-center">
        <span className="text-[12px] leading-[18px] font-bold text-[#995917]">{value}</span>
      </div>
    )
  }
  return (
    <div className="w-12 h-12 px-2 py-4 bg-[#EDF0E6] rounded-[6px] flex items-center justify-center">
      <span className="text-[12px] leading-[18px] font-bold text-[#161D14]">{value}</span>
    </div>
  )
}

// ── Modals ──

function EscalateModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { escalateTo: string; reason: string }) => void
}) {
  const [escalateTo, setEscalateTo] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ escalateTo, reason })
    setEscalateTo(""); setReason("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Escalate Delay" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Escalate Delay</h2>
              <FormField label="Escalate to">
                <FormSelect value={escalateTo} onChange={(e) => setEscalateTo(e.target.value)}>
                  <option value="">Select target</option>
                  <option value="operations-lead">Operations Lead</option>
                  <option value="procurement-lead">Procurement Lead</option>
                  <option value="logistics-manager">Logistics Manager</option>
                  <option value="coo">COO</option>
                </FormSelect>
              </FormField>
              <FormField label="Reason for escalation">
                <FormTextarea placeholder="Describe why this needs escalation..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" size="md" shape="rect">
              <IconSend className="size-5" />
              Escalate
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function ResolveModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { resolution: string; notes: string }) => void
}) {
  const [resolution, setResolution] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ resolution, notes })
    setResolution(""); setNotes("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Resolve Delay" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Resolve Delay</h2>
              <FormField label="Resolution type">
                <FormSelect value={resolution} onChange={(e) => setResolution(e.target.value)}>
                  <option value="">Select resolution</option>
                  <option value="delivered">Delivered successfully</option>
                  <option value="partial-delivery">Partial delivery accepted</option>
                  <option value="rescheduled">Rescheduled and fulfilled</option>
                  <option value="alternative-sourcing">Alternative sourcing completed</option>
                  <option value="cancelled">Order cancelled by buyer</option>
                </FormSelect>
              </FormField>
              <FormField label="Resolution notes">
                <FormTextarea placeholder="Document the resolution..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconCheck className="size-5" />
              Resolve
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// ── Detail Sheet ──

function DelayDetailSheet({
  open,
  onClose,
  type,
  onEscalate,
  onResolve,
}: {
  open: boolean
  onClose: () => void
  type: "procurement" | "fulfillment"
  onEscalate: () => void
  onResolve: () => void
}) {
  if (!open) return null

  const isProcurement = type === "procurement"

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-[35vw] bg-white shadow-lg flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="flex items-center h-[60px] border-b border-[#E5E8DF] px-6 shrink-0">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F7FAF6]">
            <IconX className="size-5 text-[#161D14]" />
          </button>
          <div className="h-5 w-px bg-[#E5E8DF] mx-3" />
          <span className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#161D14]">
            {isProcurement ? "Procurement delay detail" : "Fulfillment delay detail"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[28px] leading-[36px] font-bold text-[#161D14]">
                {isProcurement ? "John Doe" : "Lagos Grain co"}
              </h2>
              <DelayStatusBadge status={isProcurement ? "Escalated" : "Delayed"} />
            </div>
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
              <IconFileExport className="size-4" />
              Export
            </button>
          </div>

          <div className="mx-6 flex items-center gap-2 px-4 py-3 bg-[#FFDAD6] rounded-[12px]">
            <IconAlertTriangle className="size-4 text-[#BA1A1A]" />
            <span className="text-[14px] leading-[20px] font-medium text-[#BA1A1A]">
              {isProcurement ? "Delay: +4.2d overrun • Blocked" : "Major severity • Expected delivery missed"}
            </span>
          </div>

          <div className="h-[8px] bg-[#F3F7F2] mt-4" />

          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">
              {isProcurement ? "Procurement details" : "Order details"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {isProcurement ? (
                <>
                  <DetailTile label="Aggregator" value="John Doe" />
                  <DetailTile label="Commodity" value="Chilli Pepper" />
                  <DetailTile label="Planned QTY" value="840 MT" />
                  <DetailTile label="Collected" value="0 MT" valueColor="#BA1A1A" />
                  <DetailTile label="Planned date" value="01 Sep 2026" />
                  <DetailTile label="Delay" value="+4.2d" valueColor="#BA1A1A" />
                  <DetailTile label="Indicator" value="Blocked" valueColor="#BA1A1A" />
                  <DetailTile label="Root cause" value="Farmer Unavailable" />
                </>
              ) : (
                <>
                  <DetailTile label="Buyer" value="Lagos Grain co" />
                  <DetailTile label="Order ID" value="ORD-ID-0488" />
                  <DetailTile label="Commodity" value="Chilli Pepper" />
                  <DetailTile label="Quantity" value="840 MT" />
                  <DetailTile label="Dispatch date" value="01 Sep 2026" />
                  <DetailTile label="Expected delivery" value="01 Sep 2026" />
                  <DetailTile label="Actual delivery" value="—" valueColor="#BA1A1A" />
                  <DetailTile label="Delay reason" value="Transport delay" />
                </>
              )}
            </div>
          </div>

          <div className="h-[8px] bg-[#F3F7F2]" />

          <div className="px-6 pt-4 pb-5">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Timeline</h3>
            <div className="flex flex-col">
              {[
                { time: "14:30", date: "01 Sep 2026", action: isProcurement ? "Collection planned" : "Order dispatched from warehouse", user: "System" },
                { time: "18:00", date: "01 Sep 2026", action: isProcurement ? "Collection not started — farmer unreachable" : "Delivery deadline passed — no confirmation", user: "System" },
                { time: "09:00", date: "02 Sep 2026", action: isProcurement ? "Delay flagged — SLA breached" : "Delay flagged — escalation triggered", user: "System" },
                { time: "10:15", date: "02 Sep 2026", action: isProcurement ? "Escalated to Operations Lead" : "Investigating transport issue", user: "Admin" },
              ].map((event, i, arr) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-2.5 rounded-full bg-[#36B92E] mt-1.5 shrink-0" />
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-[#E5E8DF]" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-[14px] leading-[20px] text-[#161D14]">{event.action}</p>
                    <p className="text-[12px] leading-[18px] text-[#525C4E]">{event.time} {event.date} &middot; {event.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E8DF] shrink-0">
          <button
            onClick={onEscalate}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#EDF0E6] text-[16px] leading-[24px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
          >
            <IconSend className="size-5" />
            Escalate
          </button>
          <button
            onClick={onResolve}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#36B92E] text-[16px] leading-[24px] font-bold text-white hover:bg-[#2DA526] transition-colors"
          >
            <IconCheck className="size-5" />
            Resolve
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailTile({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="w-[160px] bg-[#F7FAF6] rounded-[8px] p-3 flex flex-col gap-0.5">
      <span className="text-[12px] leading-[18px] text-[#525C4E]">{label}</span>
      <span className="text-[14px] leading-[20px] font-bold" style={{ color: valueColor || "#161D14" }}>{value}</span>
    </div>
  )
}

// ── Row actions ──

function RowActions({
  onViewDetail,
  onResolve,
  onEscalate,
}: {
  onViewDetail: () => void
  onResolve: () => void
  onEscalate: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-1 rounded hover:bg-[#EDF0E6]">
        <IconDots className="size-4 text-[#525C4E]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-[160px] bg-white rounded-[8px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1">
            <button onClick={() => { onViewDetail(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
              <IconInfoCircle className="size-4 text-[#525C4E]" />
              View detail
            </button>
            <button onClick={() => { onResolve(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
              <IconRefreshAlert className="size-4 text-[#525C4E]" />
              Resolve
            </button>
            <button onClick={() => { onEscalate(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[14px] leading-[20px] text-[#BA1A1A] hover:bg-[#F7FAF6]">
              <IconSend className="size-4" />
              Escalate
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main page ──

export function DelayMonitoringPage() {
  const [procPage, setProcPage] = useState(1)
  const [fulPage, setFulPage] = useState(1)
  const [procSearch, setProcSearch] = useState("")
  const [fulSearch, setFulSearch] = useState("")
  const [activeModal, setActiveModal] = useState<"escalate" | "resolve" | null>(null)
  const [detailOpen, setDetailOpen] = useState<"procurement" | "fulfillment" | null>(null)

  const totalPages = Math.ceil(TOTAL_ROWS / ROWS_PER_PAGE)
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

  const filteredProc = procurementRows.filter((r) =>
    procSearch === "" ||
    r.aggregator.toLowerCase().includes(procSearch.toLowerCase()) ||
    r.commodity.toLowerCase().includes(procSearch.toLowerCase())
  )

  const filteredFul = fulfillmentRows.filter((r) =>
    fulSearch === "" ||
    r.buyer.toLowerCase().includes(fulSearch.toLowerCase()) ||
    r.commodity.toLowerCase().includes(fulSearch.toLowerCase()) ||
    r.orderId.toLowerCase().includes(fulSearch.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Quick actions */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF]">
        <Button variant="secondary" size="sm" onClick={() => setActiveModal("escalate")}>
          <IconSend className="size-4" />
          Escalate
        </Button>
        <Button variant="secondary" size="sm">
          <IconSettings className="size-4" />
          Resolve discrepancies
        </Button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="flex gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="flex-1 min-w-0 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-[8px] flex items-center justify-center" style={{ background: card.iconBg }}>
                  <Icon className="size-4" style={{ color: card.iconColor }} />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#525C4E]">{card.label}</span>
                {card.hasChevron && <IconChevronRight className="size-4 text-[#71786C]" />}
              </div>
              <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
              <div className="flex items-center gap-1">
                {card.hasArrow && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M6 2l3 3M6 2L3 5" stroke="#1A5514" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                <p className="text-[12px] leading-[18px]" style={{ color: card.subColor || "#525C4E" }}>{card.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delay Reason Distribution + Heatmap */}
      <div className="flex gap-4">
        {/* Delay Reason Distribution */}
        <div className="flex-1 p-4 bg-white rounded-[12px] shadow-[0px_1px_2px_rgba(22,29,20,0.10)] outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[6px] flex items-center justify-center bg-[#E2D1FD]">
              <IconClipboardCheck className="size-4 text-[#7925CC]" />
            </div>
            <h3 className="flex-1 text-[16px] leading-[24px] font-bold text-[#161D14]">Delay Reason Distribution</h3>
          </div>
          <div className="bg-white rounded-[6px] outline outline-1 outline-[#E5E8DF] overflow-hidden flex flex-col">
            {delayReasons.map((r) => (
              <div key={r.label} className="flex items-start border-b border-[#E5E8DF] last:border-b-0">
                <div className="w-[148px] h-[53px] py-2 pl-4 pr-2 flex items-center shrink-0">
                  <span className="text-[14px] leading-[20px] text-[#161D14]">{r.label}</span>
                </div>
                <div className="flex-1 h-[53px] p-2 flex items-center">
                  <div className="w-full h-[12px] rounded-[4px] overflow-hidden flex">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full"
                        style={{ background: i < r.filledSegments ? r.filledColor : r.emptyColor }}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-[64px] h-[53px] py-2 pl-3 pr-4 flex items-center shrink-0">
                  <span className="text-[14px] leading-[20px] text-[#161D14]">{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Delay Heatmap */}
        <div className="flex-1 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[6px] flex items-center justify-center bg-[#D5E6FD]">
              <IconClock className="size-4 text-[#00439E]" />
            </div>
            <h3 className="flex-1 text-[16px] leading-[24px] font-bold text-[#161D14]">Fulfilment Delay Heatmap</h3>
            <div className="flex items-center gap-2 text-[12px] leading-[18px] text-[#525C4E]">
              <span>Delays per day:</span>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-[4px] bg-[#EDF0E6]" />
                <span>None</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-[4px] bg-[#FEF0D8] flex items-center justify-center">
                  <span className="text-[12px] leading-[18px] text-[#995917]">1</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-[4px] bg-[#FFDAD6] flex items-center justify-center">
                  <span className="text-[12px] leading-[18px] text-[#8F0004]">2+</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            {/* Header row */}
            <div className="flex items-center gap-3">
              <div className="w-[116px] py-4 shrink-0">
                <span className="text-[14px] leading-[20px] text-[#71786C]">Aggregators</span>
              </div>
              {weekDays.map((d) => (
                <div key={d} className="w-12 h-12 px-2 py-4 bg-white rounded-[6px] flex items-center justify-center shrink-0">
                  <span className="text-[12px] leading-[18px] text-[#161D14]">{d}</span>
                </div>
              ))}
              <div className="w-12 h-12 py-4 bg-white rounded-[6px] flex items-center justify-center shrink-0">
                <span className="text-[12px] leading-[18px] text-[#161D14]">TOTAL</span>
              </div>
            </div>
            {/* Data rows */}
            {heatmapData.map((row, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className="w-[116px] py-4 shrink-0">
                  <span className="text-[14px] leading-[20px] text-[#161D14]">{row.aggregator}</span>
                </div>
                {row.days.map((val, j) => (
                  <div key={j} className="shrink-0">
                    <HeatmapCell value={val} />
                  </div>
                ))}
                <div className="w-12 h-12 px-2 py-4 bg-white rounded-[4px] flex items-center justify-center shrink-0">
                  <span className="text-[14px] leading-[20px] font-bold text-[#995917]">{row.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Procurement delay table */}
      <div className="bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4">
          <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Procurement delay</h3>
          <div className="flex-1" />
          <div className="flex items-center gap-2 max-w-[300px] h-9 px-3 rounded-full bg-[#EDF0E6]">
            <IconSearch className="size-4 text-[#525C4E]" />
            <input
              type="text"
              placeholder="Search by Aggregator, Plan"
              className="bg-transparent text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] outline-none w-full"
              value={procSearch}
              onChange={(e) => { setProcSearch(e.target.value); setProcPage(1) }}
            />
          </div>
          <FilterPill label="All Status" />
          <FilterPill label="All Commodity" />
          <FilterPill label="All Indicator" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] leading-[18px] font-bold text-[#525C4E] border-b border-[#E5E8DF]">
              <th className="px-6 py-3 font-bold">Aggregator</th>
              <th className="px-3 py-3 font-bold">Commodity</th>
              <th className="px-3 py-3 font-bold">Planned QTY</th>
              <th className="px-3 py-3 font-bold">Collected</th>
              <th className="px-3 py-3 font-bold">Planned Date</th>
              <th className="px-3 py-3 font-bold">Actual Date</th>
              <th className="px-3 py-3 font-bold">Delay</th>
              <th className="px-3 py-3 font-bold">Indicator</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProc.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <IconClipboardCheck className="size-8 text-[#C3C8BC]" />
                    <p className="text-[16px] leading-[24px] font-bold text-[#161D14]">No procurement delays</p>
                    <p className="text-[14px] leading-[20px] text-[#525C4E]">All procurement activities are on track.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProc.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E5E8DF] hover:bg-[#F7FAF6] cursor-pointer transition-colors"
                  onClick={() => setDetailOpen("procurement")}
                >
                  <td className="px-6 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.aggregator}</td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.commodity}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.lotId}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.plannedQty.toLocaleString()} MT</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.collected} MT</td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.plannedTime}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.plannedDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.actualTime}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.actualDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] font-bold text-[#1A5514]">{row.delay}</td>
                  <td className="px-3 py-4"><IndicatorBadge indicator={row.indicator} /></td>
                  <td className="px-3 py-4"><DelayStatusBadge status={row.status} /></td>
                  <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      onViewDetail={() => setDetailOpen("procurement")}
                      onResolve={() => setActiveModal("resolve")}
                      onEscalate={() => setActiveModal("escalate")}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E8DF]">
          <span className="text-[14px] leading-[20px] text-[#525C4E]">0 of {TOTAL_ROWS} row(s) selected.</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[14px] leading-[20px] text-[#525C4E]">Rows per page</span>
              <select className="px-2 py-1 rounded-[6px] outline outline-1 outline-[#E5E8DF] text-[14px] leading-[20px] text-[#161D14] bg-white">
                <option>10</option><option>20</option><option>50</option>
              </select>
            </div>
            <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Page {procPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setProcPage(Math.max(1, procPage - 1))} disabled={procPage === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronLeft className="size-4 text-[#161D14]" /></button>
              <button onClick={() => setProcPage(1)} disabled={procPage === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronsLeft className="size-4 text-[#161D14]" /></button>
              <button onClick={() => setProcPage(Math.min(totalPages, procPage + 1))} disabled={procPage === totalPages} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronRight className="size-4 text-[#161D14]" /></button>
              <button onClick={() => setProcPage(totalPages)} disabled={procPage === totalPages} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronsRight className="size-4 text-[#161D14]" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Fulfillment delay table */}
      <div className="bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4">
          <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Fulfilment delay</h3>
          <div className="flex-1" />
          <div className="flex items-center gap-2 max-w-[320px] h-9 px-3 rounded-full bg-[#EDF0E6]">
            <IconSearch className="size-4 text-[#525C4E]" />
            <input
              type="text"
              placeholder="Search by Buyer, Aggregator, Order ID"
              className="bg-transparent text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] outline-none w-full"
              value={fulSearch}
              onChange={(e) => { setFulSearch(e.target.value); setFulPage(1) }}
            />
          </div>
          <FilterPill label="All Status" />
          <FilterPill label="All Aggregators" />
          <FilterPill label="All Severities" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] leading-[18px] font-bold text-[#525C4E] border-b border-[#E5E8DF]">
              <th className="px-6 py-3 font-bold">Buyer</th>
              <th className="px-3 py-3 font-bold">Commodity</th>
              <th className="px-3 py-3 font-bold">Quantity</th>
              <th className="px-3 py-3 font-bold">Dispatch Date</th>
              <th className="px-3 py-3 font-bold">Expected Delivery</th>
              <th className="px-3 py-3 font-bold">Actual Delivery</th>
              <th className="px-3 py-3 font-bold">Severity</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredFul.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <IconArrowRight className="size-8 text-[#C3C8BC]" />
                    <p className="text-[16px] leading-[24px] font-bold text-[#161D14]">No fulfillment delays</p>
                    <p className="text-[14px] leading-[20px] text-[#525C4E]">All deliveries are on track.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredFul.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E5E8DF] hover:bg-[#F7FAF6] cursor-pointer transition-colors"
                  onClick={() => setDetailOpen("fulfillment")}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.buyer}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.orderId}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.commodity}</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.quantity.toLocaleString()} MT</td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.dispatchTime}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.dispatchDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.expectedTime}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.expectedDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">
                    {row.actualTime ? (
                      <div className="flex flex-col">
                        <span>{row.actualTime}</span>
                        <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.actualDate}</span>
                      </div>
                    ) : (
                      <span className="text-[#C3C8BC]">&mdash;</span>
                    )}
                  </td>
                  <td className="px-3 py-4"><SeverityBadge severity={row.severity} /></td>
                  <td className="px-3 py-4"><DelayStatusBadge status={row.status} /></td>
                  <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      onViewDetail={() => setDetailOpen("fulfillment")}
                      onResolve={() => setActiveModal("resolve")}
                      onEscalate={() => setActiveModal("escalate")}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E8DF]">
          <span className="text-[14px] leading-[20px] text-[#525C4E]">0 of {TOTAL_ROWS} row(s) selected.</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[14px] leading-[20px] text-[#525C4E]">Rows per page</span>
              <select className="px-2 py-1 rounded-[6px] outline outline-1 outline-[#E5E8DF] text-[14px] leading-[20px] text-[#161D14] bg-white">
                <option>10</option><option>20</option><option>50</option>
              </select>
            </div>
            <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Page {fulPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setFulPage(Math.max(1, fulPage - 1))} disabled={fulPage === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronLeft className="size-4 text-[#161D14]" /></button>
              <button onClick={() => setFulPage(1)} disabled={fulPage === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronsLeft className="size-4 text-[#161D14]" /></button>
              <button onClick={() => setFulPage(Math.min(totalPages, fulPage + 1))} disabled={fulPage === totalPages} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronRight className="size-4 text-[#161D14]" /></button>
              <button onClick={() => setFulPage(totalPages)} disabled={fulPage === totalPages} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30"><IconChevronsRight className="size-4 text-[#161D14]" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      {detailOpen && (
        <DelayDetailSheet
          open={!!detailOpen}
          onClose={() => setDetailOpen(null)}
          type={detailOpen}
          onEscalate={() => { setDetailOpen(null); setActiveModal("escalate") }}
          onResolve={() => { setDetailOpen(null); setActiveModal("resolve") }}
        />
      )}

      {/* Modals */}
      <EscalateModal
        open={activeModal === "escalate"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        onSubmit={() => setActiveModal(null)}
      />
      <ResolveModal
        open={activeModal === "resolve"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        onSubmit={() => setActiveModal(null)}
      />
    </div>
  )
}

// ── Shared filter pill ──

function FilterPill({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 h-9 px-3 py-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
      {label}
      <IconChevronDown className="size-4 text-[#161D14]" />
    </button>
  )
}
