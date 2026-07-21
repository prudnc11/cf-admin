import { useState, useEffect } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconChevronLeft,
  IconChevronsLeft,
  IconChevronsRight,
  IconCalendar,
  IconWorld,
  IconFileText,
  IconClipboardCheck,
  IconClock,
  IconInbox,
  IconPlayerPlay,
  IconLoader,
  IconCircleCheck,
  IconX,
  IconCheck,
  IconPlus,
} from "@tabler/icons-react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"
import { SupplyRequestDetailPage } from "./supply-request-detail"

// --- Types ---

export type SupplyRequestStatus = "draft" | "pending-receipt" | "received" | "active" | "in-progress" | "completed" | "cancelled" | "rejected"

export type SupplyRequest = {
  id: string
  crop: string
  variety: string
  quantity: string
  unit: string
  region: string
  budget: string
  aggregationWindow: string
  status: SupplyRequestStatus
  createdBy: string
  createdDate: string
  receivedBy?: string
  receivedDate?: string
  approvedBy?: string
  approvedDate?: string
  notes?: string
  linkedBids: number
}

// --- Mock Data ---

export const supplyRequests: SupplyRequest[] = [
  {
    id: "SR-2026-001", crop: "Rice", variety: "Jasmine", quantity: "200", unit: "MT", region: "Volta Region",
    budget: "GHS 1,200,000", aggregationWindow: "Jul 1 - Aug 30, 2026", status: "active",
    createdBy: "Ama Serwaa", createdDate: "15 Jun 2026", receivedBy: "Kwame Asante", receivedDate: "16 Jun 2026",
    approvedBy: "Director Mensah", approvedDate: "17 Jun 2026", notes: "Priority for export contracts", linkedBids: 4,
  },
  {
    id: "SR-2026-002", crop: "Cocoa", variety: "Amelonado", quantity: "150", unit: "MT", region: "Ashanti Region",
    budget: "GHS 2,400,000", aggregationWindow: "Jul 15 - Sep 15, 2026", status: "active",
    createdBy: "Ama Serwaa", createdDate: "14 Jun 2026", receivedBy: "Yaw Darko", receivedDate: "15 Jun 2026",
    approvedBy: "Director Mensah", approvedDate: "16 Jun 2026", linkedBids: 3,
  },
  {
    id: "SR-2026-003", crop: "Maize", variety: "Yellow Maize", quantity: "500", unit: "MT", region: "Brong-Ahafo Region",
    budget: "GHS 800,000", aggregationWindow: "Aug 1 - Oct 31, 2026", status: "in-progress",
    createdBy: "Kofi Boateng", createdDate: "10 Jun 2026", receivedBy: "Kwame Asante", receivedDate: "11 Jun 2026",
    approvedBy: "Director Mensah", approvedDate: "12 Jun 2026", notes: "Local market supply", linkedBids: 6,
  },
  {
    id: "SR-2026-004", crop: "Shea", variety: "Shea Nuts", quantity: "100", unit: "MT", region: "Northern Region",
    budget: "GHS 600,000", aggregationWindow: "Jul 1 - Sep 30, 2026", status: "in-progress",
    createdBy: "Ama Serwaa", createdDate: "08 Jun 2026", receivedBy: "Yaw Darko", receivedDate: "09 Jun 2026",
    approvedBy: "Director Mensah", approvedDate: "10 Jun 2026", linkedBids: 2,
  },
  {
    id: "SR-2026-005", crop: "Cashew", variety: "Raw Cashew Nuts", quantity: "80", unit: "MT", region: "Bono East Region",
    budget: "GHS 1,500,000", aggregationWindow: "Aug 1 - Nov 30, 2026", status: "received",
    createdBy: "Kofi Boateng", createdDate: "20 Jun 2026", receivedBy: "Kwame Asante", receivedDate: "21 Jun 2026",
    notes: "Export grade required", linkedBids: 0,
  },
  {
    id: "SR-2026-006", crop: "Sorghum", variety: "Red Sorghum", quantity: "300", unit: "MT", region: "Upper East Region",
    budget: "GHS 450,000", aggregationWindow: "Sep 1 - Nov 30, 2026", status: "received",
    createdBy: "Ama Serwaa", createdDate: "22 Jun 2026", receivedBy: "Yaw Darko", receivedDate: "23 Jun 2026", linkedBids: 0,
  },
  {
    id: "SR-2026-007", crop: "Cassava", variety: "Cassava Chips", quantity: "400", unit: "MT", region: "Eastern Region",
    budget: "GHS 520,000", aggregationWindow: "Jul 15 - Oct 15, 2026", status: "pending-receipt",
    createdBy: "Kofi Boateng", createdDate: "25 Jun 2026", linkedBids: 0,
  },
  {
    id: "SR-2026-008", crop: "Yam", variety: "Pona Yam", quantity: "250", unit: "MT", region: "Bono Region",
    budget: "GHS 900,000", aggregationWindow: "Aug 15 - Nov 15, 2026", status: "pending-receipt",
    createdBy: "Ama Serwaa", createdDate: "26 Jun 2026", linkedBids: 0,
  },
  {
    id: "SR-2026-009", crop: "Millet", variety: "Pearl Millet", quantity: "120", unit: "MT", region: "Upper West Region",
    budget: "GHS 180,000", aggregationWindow: "Sep 1 - Dec 31, 2026", status: "draft",
    createdBy: "Kofi Boateng", createdDate: "28 Jun 2026", linkedBids: 0,
  },
  {
    id: "SR-2026-013", crop: "Sesame", variety: "White Sesame", quantity: "350", unit: "MT", region: "Northern Region",
    budget: "GHS 3,500,000", aggregationWindow: "Jun 1 - Aug 31, 2026", status: "in-progress",
    createdBy: "Ama Serwaa", createdDate: "20 May 2026", receivedBy: "Kwame Asante", receivedDate: "21 May 2026",
    approvedBy: "Director Mensah", approvedDate: "22 May 2026", notes: "Export buyer contract — 6 aggregators accepted, parallel fulfilment", linkedBids: 6,
  },
  {
    id: "SR-2026-010", crop: "Groundnut", variety: "Chinese Groundnut", quantity: "180", unit: "MT", region: "Northern Region",
    budget: "GHS 360,000", aggregationWindow: "Aug 1 - Oct 31, 2026", status: "completed",
    createdBy: "Ama Serwaa", createdDate: "01 May 2026", receivedBy: "Kwame Asante", receivedDate: "02 May 2026",
    approvedBy: "Director Mensah", approvedDate: "03 May 2026", linkedBids: 5,
  },
  {
    id: "SR-2026-011", crop: "Soybean", variety: "TGX Soybean", quantity: "90", unit: "MT", region: "Savannah Region",
    budget: "GHS 270,000", aggregationWindow: "Jul 1 - Sep 30, 2026", status: "cancelled",
    createdBy: "Kofi Boateng", createdDate: "05 Jun 2026", notes: "Cancelled - budget reallocation", linkedBids: 0,
  },
  {
    id: "SR-2026-012", crop: "Cowpea", variety: "Black-eyed Pea", quantity: "60", unit: "MT", region: "Upper East Region",
    budget: "GHS 120,000", aggregationWindow: "Sep 1 - Nov 30, 2026", status: "rejected",
    createdBy: "Ama Serwaa", createdDate: "18 Jun 2026", receivedBy: "Yaw Darko", receivedDate: "19 Jun 2026",
    notes: "Rejected - insufficient market demand", linkedBids: 0,
  },
]

// --- Data ---

const filters = [
  { label: "All time", icon: IconCalendar },
  { label: "All regions", icon: IconWorld },
  { label: "All commodities", icon: IconWorld },
]

const tabItems = [
  { label: "All", badge: supplyRequests.length },
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
  "Received": IconInbox,
  "Active": IconPlayerPlay,
  "In Progress": IconLoader,
  "Completed": IconCircleCheck,
  "Cancelled": IconX,
}

const statusToTab: Record<SupplyRequestStatus, string> = {
  "draft": "Draft",
  "pending-receipt": "Pending Receipt",
  "received": "Received",
  "active": "Active",
  "in-progress": "In Progress",
  "completed": "Completed",
  "cancelled": "Cancelled",
  "rejected": "Cancelled",
}

const metricCards = [
  { label: "Total Requests", value: String(supplyRequests.length), iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconClipboardCheck },
  { label: "Pending Receipt", value: String(supplyRequests.filter(r => r.status === "pending-receipt").length), iconBg: "#FEF0D8", iconColor: "#995917", icon: IconClock },
  { label: "Active", value: String(supplyRequests.filter(r => r.status === "active").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconPlayerPlay },
  { label: "In Progress", value: String(supplyRequests.filter(r => r.status === "in-progress").length), iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconLoader },
  { label: "Completed", value: String(supplyRequests.filter(r => r.status === "completed").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconCircleCheck },
]

// --- Status color mapping ---

function statusColor(s: SupplyRequestStatus): "green" | "blue" | "red" | "warning" {
  switch (s) {
    case "active": case "completed": return "green"
    case "in-progress": case "received": return "blue"
    case "rejected": case "cancelled": return "red"
    default: return "warning"
  }
}

function statusLabel(s: SupplyRequestStatus): string {
  switch (s) {
    case "draft": return "Draft"
    case "pending-receipt": return "Pending Receipt"
    case "received": return "Received"
    case "active": return "Active"
    case "in-progress": return "In Progress"
    case "completed": return "Completed"
    case "cancelled": return "Cancelled"
    case "rejected": return "Rejected"
  }
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

function RequestCardComponent({ request, onAction, onOpen }: { request: SupplyRequest; onAction?: (action: string, req: SupplyRequest) => void; onOpen?: () => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="p-4 rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 cursor-pointer hover:outline-[#36B92E] transition-colors" onClick={onOpen}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] outline outline-1 outline-white shrink-0">
            <span className="text-[16px] leading-[24px] font-bold text-[#CEFFEB]">{request.crop.charAt(0)}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">
                {request.crop} • {request.id}
              </span>
              <StatusBadge label={statusLabel(request.status)} color={statusColor(request.status)} />
            </div>
            <p className="text-[12px] leading-[18px] font-normal text-[#71786C]">
              {request.variety} <span className="font-bold"> • </span>
              {request.quantity} {request.unit} <span className="font-bold"> • </span>
              {request.region}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {request.linkedBids > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] bg-[#D5E6FD]">
              <span className="text-[12px] leading-[18px] font-bold text-[#00439E]">{request.linkedBids} bids</span>
            </span>
          )}
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
          {/* Details */}
          <div className="flex flex-col gap-2 px-2 py-3 bg-[#F7FAF6] rounded-[6px]">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[12px] leading-[18px]">
              <span className="text-[#525C4E]">Created by: <span className="font-bold text-[#161D14]">{request.createdBy}</span></span>
              <span className="text-[#525C4E]">Created: <span className="font-bold text-[#161D14]">{request.createdDate}</span></span>
              <span className="text-[#525C4E]">Budget: <span className="font-bold text-[#161D14]">{request.budget}</span></span>
              <span className="text-[#525C4E]">Window: <span className="font-bold text-[#161D14]">{request.aggregationWindow}</span></span>
              {request.receivedBy && <span className="text-[#525C4E]">Received by: <span className="font-bold text-[#161D14]">{request.receivedBy}</span></span>}
              {request.approvedBy && <span className="text-[#525C4E]">Approved by: <span className="font-bold text-[#161D14]">{request.approvedBy}</span></span>}
            </div>
            {request.notes && (
              <p className="text-[12px] leading-[18px] text-[#525C4E] mt-1">
                Notes: <span className="text-[#161D14]">{request.notes}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            {request.status === "draft" && (
              <button
                onClick={(e) => { e.stopPropagation(); onAction?.("submit", request) }}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#36B92E] text-white text-[13px] leading-[18px] font-bold hover:bg-[#5EC758] transition-colors"
              >
                Submit for Review
                <IconChevronRight className="size-3.5" />
              </button>
            )}
            {request.status === "pending-receipt" && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onAction?.("return", request) }}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[13px] leading-[18px] font-bold hover:bg-[#FEE2E2] transition-colors"
                >
                  Return
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onAction?.("receive", request) }}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#36B92E] text-white text-[13px] leading-[18px] font-bold hover:bg-[#5EC758] transition-colors"
                >
                  <IconCheck className="size-3.5" />
                  Receive
                </button>
              </>
            )}
            {request.status === "received" && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onAction?.("reject", request) }}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[13px] leading-[18px] font-bold hover:bg-[#FEE2E2] transition-colors"
                >
                  <IconX className="size-3.5" />
                  Reject
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onAction?.("activate", request) }}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#36B92E] text-white text-[13px] leading-[18px] font-bold hover:bg-[#5EC758] transition-colors"
                >
                  <IconCheck className="size-3.5" />
                  Activate
                </button>
              </>
            )}
            {request.status === "active" && (
              <span className="text-[13px] leading-[18px] text-[#525C4E] italic">Awaiting bids...</span>
            )}
            {request.status === "in-progress" && request.linkedBids > 0 && (
              <span className="text-[13px] leading-[18px] text-[#00439E] font-bold">{request.linkedBids} active bids</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function CreateRequestModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: () => void }) {
  const [crop, setCrop] = useState("")
  const [variety, setVariety] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("MT")
  const [region, setRegion] = useState("")
  const [budget, setBudget] = useState("")
  const [windowStart, setWindowStart] = useState("")
  const [windowEnd, setWindowEnd] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!crop || !quantity || !region) return
    onSubmit()
    setCrop(""); setVariety(""); setQuantity(""); setUnit("MT"); setRegion(""); setBudget(""); setWindowStart(""); setWindowEnd(""); setNotes("")
  }

  const inputClass = "w-full h-10 px-3 rounded-lg outline outline-1 outline-[#E5E8DF] bg-white text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] focus:outline-[#36B92E]"
  const labelClass = "text-[14px] leading-[20px] font-bold text-[#161D14]"

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Create Supply Request" onClose={onClose} />
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Crop *</label>
                  <select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputClass}>
                    <option value="">Select crop</option>
                    {["Rice", "Cocoa", "Maize", "Shea", "Cashew", "Sorghum", "Cassava", "Yam", "Millet", "Groundnut", "Soybean", "Cowpea"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Variety</label>
                  <input value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g. Jasmine" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Quantity *</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Unit</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass}>
                    <option value="MT">MT</option>
                    <option value="KG">KG</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Region *</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
                    <option value="">Select region</option>
                    {["Volta Region", "Ashanti Region", "Brong-Ahafo Region", "Northern Region", "Upper East Region", "Upper West Region", "Eastern Region", "Bono Region", "Savannah Region", "Bono East Region"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Budget</label>
                  <div className="flex items-center">
                    <span className="h-10 px-3 flex items-center rounded-l-lg bg-[#EDF0E6] outline outline-1 outline-[#E5E8DF] text-[14px] text-[#525C4E]">GHS</span>
                    <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0.00" className={`${inputClass} rounded-l-none`} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Window Start</label>
                  <input type="date" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Window End</label>
                  <input type="date" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} className="w-full px-3 py-2 rounded-lg outline outline-1 outline-[#E5E8DF] bg-white text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] focus:outline-[#36B92E] resize-none" />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!crop || !quantity || !region}>Create Request</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- Main Page ---

export function SupplyRequestsPage({ onDetailViewChange, initialTab }: { onDetailViewChange?: (v: boolean) => void; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || "All")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SupplyRequest | null>(null)
  const { toast, showToast, dismissToast } = useToast()

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    onDetailViewChange?.(!!selectedRequest)
  }, [selectedRequest, onDetailViewChange])

  const handleAction = (action: string, req: SupplyRequest) => {
    const messages: Record<string, string> = {
      submit: `${req.id} submitted for review`,
      receive: `${req.id} received successfully`,
      return: `${req.id} returned to Sales Admin`,
      activate: `${req.id} activated - aggregators can now submit bids`,
      reject: `${req.id} rejected`,
    }
    showToast(messages[action] || `Action "${action}" completed for ${req.id}`)
  }

  // Detail view
  if (selectedRequest) {
    return (
      <>
        <SupplyRequestDetailPage
          onBack={() => setSelectedRequest(null)}
          request={selectedRequest}
          onAction={handleAction}
        />
        {toast && <Toast message={toast} onDismiss={dismissToast} />}
      </>
    )
  }

  const filteredRequests = activeTab === "All"
    ? supplyRequests
    : supplyRequests.filter(r => statusToTab[r.status] === activeTab)

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Create button */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[28px] leading-[36px] text-[#161D14]">Supply Requests</h1>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          <IconPlus className="size-4" />
          Create Request
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        {filters.map((f) => {
          const Icon = f.icon
          return (
            <button
              key={f.label}
              className="flex items-center gap-2 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14]"
            >
              <Icon className="size-4 text-[#161D14]" />
              {f.label}
              <IconChevronDown className="size-4 text-[#161D14]" />
            </button>
          )
        })}
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-5">
        {metricCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3 hover-lift stagger-child"
              style={{ "--stagger-index": i } as React.CSSProperties}
            >
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

      {/* Tab Bar */}
      <div className="flex items-center h-[58px] border-b-2 border-[#E5E8DF]">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.label
          const Icon = tabIcons[tab.label] || IconClipboardCheck
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className="flex flex-col justify-center items-center self-stretch"
            >
              <div className={`flex items-center gap-2 px-3 py-4 text-[16px] leading-[24px] ${isActive ? "font-bold text-[#306B28]" : "font-normal text-[#161D14]"}`}>
                <Icon className="size-5" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-px rounded-full bg-[#0063EA] outline outline-2 outline-white text-white text-[12px] leading-[18px] font-normal min-w-[18px]">
                    {tab.badge}
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
            <RequestCardComponent request={req} onAction={handleAction} onOpen={() => setSelectedRequest(req)} />
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

      {/* Create Modal */}
      <CreateRequestModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={() => {
          setShowCreateModal(false)
          showToast("Supply request created successfully")
        }}
      />

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
