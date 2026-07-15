import { useState } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronsRight,
  IconChevronsLeft,
  IconAlertCircle,
  IconFileStack,
  IconClock,
  IconCheckbox,
  IconDots,
  IconX,
  IconFileExport,
  IconCheck,
  IconCalendar,
  IconUsers,
  IconSearch,
  IconArrowUp,
  IconAlertTriangle,
  IconSend,
  IconUserPlus,
} from "@tabler/icons-react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { FormField, FormSelect, FormTextarea, FormInput, FormFileUpload } from "@/components/ui/form-fields"

// ── Types ──

type DiscrepancyStatus = "Open" | "Investigating" | "Escalated" | "Approved" | "Resolved" | "Closed"

type DiscrepancyRow = {
  id: string
  aggregator: string
  commodity: string
  discrepancyId: string
  relatedTransaction: string
  expected: number
  actual: number
  variance: number
  variancePercent: number
  warehouse: string
  reportedTime: string
  reportedDate: string
  status: DiscrepancyStatus
}

type TimelineEvent = {
  time: string
  date: string
  action: string
  user: string
}

type DiscrepancyDetail = {
  id: string
  aggregator: string
  commodity: string
  discrepancyId: string
  relatedTransaction: string
  expected: number
  actual: number
  variance: number
  variancePercent: number
  warehouse: string
  reportedTime: string
  reportedDate: string
  status: DiscrepancyStatus
  source: string
  assignedTo: string
  reason: string
  timeline: TimelineEvent[]
}

// ── Static data ──

const summaryCards = [
  { label: "Open discrepancies", value: "8", sub: "-476 MT unaccounted", subColor: "#BA1A1A", icon: IconAlertCircle, iconBg: "#FFDAD6", iconColor: "#BA1A1A" },
  { label: "Total variance (MT)", value: "-476 MT", sub: "GHS -48M  -48 estimated loss", subColor: "#BA1A1A", icon: IconFileStack, iconBg: "#D5E6FD", iconColor: "#00439E" },
  { label: "Avg resolution time", value: "3.2 d", sub: "SLA: 2.0d", subColor: "#525C4E", icon: IconClock, iconBg: "#FEF0D8", iconColor: "#995917", hasChevron: true },
  { label: "Resolved this week", value: "3", sub: "+1  vs last week", subColor: "#1A5514", icon: IconCheckbox, iconBg: "#D4F5D0", iconColor: "#1A5514", hasArrow: true },
]

const discrepancyRows: DiscrepancyRow[] = [
  { id: "1", aggregator: "John Doe", commodity: "Chilli Pepper", discrepancyId: "DIS-001", relatedTransaction: "GRN-2026-01", expected: 840, actual: 2040, variance: -120, variancePercent: -2.9, warehouse: "Kumasi Hub", reportedTime: "14:30", reportedDate: "01 Sep 2026", status: "Closed" },
  { id: "2", aggregator: "Owusu Opoku", commodity: "Cocoa", discrepancyId: "DIS-001", relatedTransaction: "GRN-2026-01", expected: 658, actual: 492, variance: -48, variancePercent: -2.9, warehouse: "Tema Hub", reportedTime: "14:30", reportedDate: "01 Sep 2026", status: "Investigating" },
  { id: "3", aggregator: "Nat Kofi", commodity: "Cassava", discrepancyId: "DIS-001", relatedTransaction: "GRN-2026-01", expected: 210, actual: 100, variance: -220, variancePercent: -2.9, warehouse: "Tema Hub", reportedTime: "14:30", reportedDate: "01 Sep 2026", status: "Closed" },
  { id: "4", aggregator: "John Dumelou", commodity: "Sorghum", discrepancyId: "DIS-001", relatedTransaction: "GRN-2026-01", expected: 320, actual: 305, variance: -15, variancePercent: -2.9, warehouse: "Tema Hub", reportedTime: "14:30", reportedDate: "01 Sep 2026", status: "Approved" },
  { id: "5", aggregator: "Kanta Seyram", commodity: "Maize", discrepancyId: "DIS-001", relatedTransaction: "GRN-2026-01", expected: 1800, actual: 1822, variance: 22, variancePercent: -2.9, warehouse: "Volta Hub", reportedTime: "14:30", reportedDate: "01 Sep 2026", status: "Resolved" },
  { id: "6", aggregator: "Owusu Opoku", commodity: "Yam", discrepancyId: "DIS-002", relatedTransaction: "GRN-2026-01", expected: 1100, actual: 1050, variance: -50, variancePercent: -2.9, warehouse: "Volta Hub", reportedTime: "15:00", reportedDate: "02 Sep 2026", status: "Open" },
  { id: "7", aggregator: "Nat Kofi", commodity: "Rice", discrepancyId: "DIS-002", relatedTransaction: "GRN-2026-01", expected: 900, actual: 920, variance: 20, variancePercent: -2.9, warehouse: "Accra Hub", reportedTime: "15:00", reportedDate: "02 Sep 2026", status: "Escalated" },
  { id: "8", aggregator: "Owusu Opoku", commodity: "Groundnut", discrepancyId: "DIS-002", relatedTransaction: "GRN-2026-01", expected: 450, actual: 470, variance: 20, variancePercent: -2.9, warehouse: "Accra Hub", reportedTime: "15:00", reportedDate: "02 Sep 2026", status: "Closed" },
]

const detailData: DiscrepancyDetail = {
  id: "2",
  aggregator: "Owusu Opoku",
  commodity: "Cocoa",
  discrepancyId: "DIS-001",
  relatedTransaction: "GRN-2026-01",
  expected: 658,
  actual: 492,
  variance: -48,
  variancePercent: -2.9,
  warehouse: "Tema Hub",
  reportedTime: "14:30",
  reportedDate: "01 Sep 2026",
  status: "Investigating",
  source: "Goods Receiving",
  assignedTo: "Kofi Asante",
  reason: "Weight discrepancy during offloading — truck scale reading inconsistent with warehouse scale.",
  timeline: [
    { time: "14:30", date: "01 Sep 2026", action: "Discrepancy detected during GRN reconciliation", user: "System" },
    { time: "14:45", date: "01 Sep 2026", action: "Case opened and flagged for review", user: "System" },
    { time: "15:10", date: "01 Sep 2026", action: "Investigation assigned to Kofi Asante", user: "Admin" },
    { time: "09:00", date: "02 Sep 2026", action: "Scale calibration check requested", user: "Kofi Asante" },
  ],
}

const TOTAL_ROWS = 68
const ROWS_PER_PAGE = 10

// ── Subcomponents ──

function StatusBadge({ status }: { status: DiscrepancyStatus }) {
  const styles: Record<DiscrepancyStatus, { bg: string; color: string; border?: string }> = {
    Open: { bg: "transparent", color: "#1A5514", border: "#C3C8BC" },
    Investigating: { bg: "transparent", color: "#995917", border: "#E8C888" },
    Escalated: { bg: "transparent", color: "#BA1A1A", border: "#E8A3A3" },
    Approved: { bg: "transparent", color: "#1A5514", border: "#A3D4A0" },
    Resolved: { bg: "transparent", color: "#1A5514", border: "#A3D4A0" },
    Closed: { bg: "#EDF0E6", color: "#525C4E" },
  }
  const s = styles[status]
  return (
    <span
      className="text-[12px] leading-[18px] px-2 py-0.5 rounded-full font-medium"
      style={{ background: s.bg, color: s.color, border: s.border ? `1px solid ${s.border}` : undefined }}
    >
      {status}
    </span>
  )
}

function VarianceCell({ value }: { value: number }) {
  const isPositive = value > 0
  const color = isPositive ? "#1A5514" : "#BA1A1A"
  return (
    <span className="text-[14px] leading-[20px] font-bold" style={{ color }}>
      {isPositive ? "+" : ""}{value} MT
    </span>
  )
}

// ── Detail Sheet ──

function DiscrepancyDetailSheet({
  open,
  onClose,
  detail,
  onAssign,
  onEscalate,
  onResolve,
}: {
  open: boolean
  onClose: () => void
  detail: DiscrepancyDetail
  onAssign: () => void
  onEscalate: () => void
  onResolve: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-[35vw] bg-white shadow-lg flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center h-[60px] border-b border-[#E5E8DF] px-6 shrink-0">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F7FAF6]">
            <IconX className="size-5 text-[#161D14]" />
          </button>
          <div className="h-5 w-px bg-[#E5E8DF] mx-3" />
          <span className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#161D14]">Discrepancy detail</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Title + status */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[28px] leading-[36px] font-bold text-[#161D14]">{detail.discrepancyId}</h2>
              <StatusBadge status={detail.status} />
            </div>
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
              <IconFileExport className="size-4" />
              Export
            </button>
          </div>

          {/* Variance banner */}
          <div className="mx-6 flex items-center gap-2 px-4 py-3 bg-[#FFDAD6] rounded-[12px]">
            <IconAlertTriangle className="size-4 text-[#BA1A1A]" />
            <span className="text-[14px] leading-[20px] font-medium text-[#BA1A1A]">
              Variance: {detail.variance} MT ({detail.variancePercent}%)
            </span>
            <span className="text-[14px] leading-[20px] text-[#BA1A1A]/70 ml-2">
              Source: {detail.source}
            </span>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2] mt-4" />

          {/* Transaction details */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Transaction details</h3>
            <div className="flex flex-wrap gap-2">
              <DetailTile label="Aggregator" value={detail.aggregator} />
              <DetailTile label="Commodity" value={detail.commodity} />
              <DetailTile label="Related Transaction" value={detail.relatedTransaction} />
              <DetailTile label="Warehouse" value={detail.warehouse} />
              <DetailTile label="Expected" value={`${detail.expected} MT`} />
              <DetailTile label="Actual" value={`${detail.actual} MT`} />
              <DetailTile label="Variance" value={`${detail.variance} MT`} valueColor="#BA1A1A" />
              <DetailTile label="Variance %" value={`${detail.variancePercent}%`} valueColor="#BA1A1A" />
              <DetailTile label="Reported" value={`${detail.reportedTime} ${detail.reportedDate}`} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Investigation */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Investigation</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <DetailTile label="Assigned to" value={detail.assignedTo} />
              <DetailTile label="Source" value={detail.source} />
            </div>
            <div className="p-3 bg-[#F7FAF6] rounded-[8px]">
              <span className="text-[12px] leading-[18px] text-[#525C4E]">Reason</span>
              <p className="text-[14px] leading-[20px] text-[#161D14] mt-1">{detail.reason}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Timeline */}
          <div className="px-6 pt-4 pb-5">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Investigation timeline</h3>
            <div className="flex flex-col">
              {detail.timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-2.5 rounded-full bg-[#36B92E] mt-1.5 shrink-0" />
                    {i < detail.timeline.length - 1 && <div className="w-px flex-1 bg-[#E5E8DF]" />}
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

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E8DF] shrink-0">
          {detail.status === "Open" && (
            <>
              <button
                onClick={onAssign}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#EDF0E6] text-[16px] leading-[24px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
              >
                <IconUserPlus className="size-5" />
                Assign
              </button>
              <button
                onClick={onEscalate}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#36B92E] text-[16px] leading-[24px] font-bold text-white hover:bg-[#2DA526] transition-colors"
              >
                <IconSend className="size-5" />
                Escalate
              </button>
            </>
          )}
          {detail.status === "Investigating" && (
            <>
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
            </>
          )}
          {detail.status === "Escalated" && (
            <button
              onClick={onResolve}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#36B92E] text-[16px] leading-[24px] font-bold text-white hover:bg-[#2DA526] transition-colors"
            >
              <IconCheck className="size-5" />
              Resolve
            </button>
          )}
          {(detail.status === "Approved" || detail.status === "Resolved" || detail.status === "Closed") && (
            <div className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#D4F5D0] text-[16px] leading-[24px] font-bold text-[#1A5514]">
              <IconCheck className="size-5" />
              {detail.status}
            </div>
          )}
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

// ── Action Modals ──

function LogDiscrepancyModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { aggregator: string; commodity: string; warehouse: string; transaction: string; expected: string; actual: string; source: string; notes: string }) => void
}) {
  const [aggregator, setAggregator] = useState("")
  const [commodity, setCommodity] = useState("")
  const [warehouse, setWarehouse] = useState("")
  const [transaction, setTransaction] = useState("")
  const [expected, setExpected] = useState("")
  const [actual, setActual] = useState("")
  const [source, setSource] = useState("")
  const [notes, setNotes] = useState("")

  const variance = expected && actual ? Number(actual) - Number(expected) : 0
  const variancePercent = expected && Number(expected) > 0 ? ((variance / Number(expected)) * 100).toFixed(1) : "0.0"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ aggregator, commodity, warehouse, transaction, expected, actual, source, notes })
    setAggregator(""); setCommodity(""); setWarehouse(""); setTransaction("")
    setExpected(""); setActual(""); setSource(""); setNotes("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Log Discrepancy" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">New Discrepancy</h2>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Aggregator">
                  <FormSelect value={aggregator} onChange={(e) => setAggregator(e.target.value)}>
                    <option value="">Select aggregator</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Owusu Opoku">Owusu Opoku</option>
                    <option value="Nat Kofi">Nat Kofi</option>
                    <option value="John Dumelou">John Dumelou</option>
                    <option value="Kanta Seyram">Kanta Seyram</option>
                  </FormSelect>
                </FormField>
                <FormField label="Commodity">
                  <FormSelect value={commodity} onChange={(e) => setCommodity(e.target.value)}>
                    <option value="">Select commodity</option>
                    <option value="Cocoa">Cocoa</option>
                    <option value="Cassava">Cassava</option>
                    <option value="Maize">Maize</option>
                    <option value="Rice">Rice</option>
                    <option value="Sorghum">Sorghum</option>
                    <option value="Yam">Yam</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Chilli Pepper">Chilli Pepper</option>
                  </FormSelect>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Warehouse">
                  <FormSelect value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
                    <option value="">Select warehouse</option>
                    <option value="Kumasi Hub">Kumasi Hub</option>
                    <option value="Tema Hub">Tema Hub</option>
                    <option value="Volta Hub">Volta Hub</option>
                    <option value="Accra Hub">Accra Hub</option>
                  </FormSelect>
                </FormField>
                <FormField label="Related transaction">
                  <FormInput placeholder="e.g. GRN-2026-01" value={transaction} onChange={(e) => setTransaction(e.target.value)} />
                </FormField>
              </div>

              <FormField label="Discrepancy source">
                <FormSelect value={source} onChange={(e) => setSource(e.target.value)}>
                  <option value="">Select source</option>
                  <option value="Goods Receiving">Goods Receiving</option>
                  <option value="Stock Count">Stock Count</option>
                  <option value="Inventory Adjustment">Inventory Adjustment</option>
                  <option value="Dispatch">Dispatch</option>
                  <option value="Warehouse Transfer">Warehouse Transfer</option>
                </FormSelect>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expected quantity (MT)">
                  <FormInput type="number" step="0.1" placeholder="0.0" value={expected} onChange={(e) => setExpected(e.target.value)} />
                </FormField>
                <FormField label="Actual quantity (MT)">
                  <FormInput type="number" step="0.1" placeholder="0.0" value={actual} onChange={(e) => setActual(e.target.value)} />
                </FormField>
              </div>

              {expected && actual && (
                <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-3 flex flex-col gap-0.5">
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">Variance</span>
                      <span className="text-[14px] leading-[20px] font-bold" style={{ color: variance < 0 ? "#BA1A1A" : "#1A5514" }}>
                        {variance > 0 ? "+" : ""}{variance} MT
                      </span>
                    </div>
                    <div className="px-4 py-3 flex flex-col gap-0.5">
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">Variance %</span>
                      <span className="text-[14px] leading-[20px] font-bold" style={{ color: variance < 0 ? "#BA1A1A" : "#1A5514" }}>
                        {Number(variancePercent) > 0 ? "+" : ""}{variancePercent}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <FormField label="Notes">
                <FormTextarea placeholder="Describe the discrepancy and any initial observations..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconCheck className="size-5" />
              Log Discrepancy
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function AssignModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { assignee: string; priority: string; notes: string }) => void
}) {
  const [assignee, setAssignee] = useState("")
  const [priority, setPriority] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ assignee, priority, notes })
    setAssignee(""); setPriority(""); setNotes("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Assign Investigation" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Assign Investigation</h2>
              <FormField label="Assign to">
                <FormSelect value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                  <option value="">Select team member</option>
                  <option value="Kofi Asante">Kofi Asante</option>
                  <option value="Ama Mensah">Ama Mensah</option>
                  <option value="Kwame Boateng">Kwame Boateng</option>
                </FormSelect>
              </FormField>
              <FormField label="Priority">
                <FormSelect value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </FormSelect>
              </FormField>
              <FormField label="Notes">
                <FormTextarea placeholder="Investigation context and instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconUserPlus className="size-5" />
              Assign
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function EscalateModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { reason: string; escalateTo: string }) => void
}) {
  const [reason, setReason] = useState("")
  const [escalateTo, setEscalateTo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ reason, escalateTo })
    setReason(""); setEscalateTo("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Escalate Discrepancy" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Escalate</h2>
              <FormField label="Escalate to">
                <FormSelect value={escalateTo} onChange={(e) => setEscalateTo(e.target.value)}>
                  <option value="">Select escalation target</option>
                  <option value="operations-lead">Operations Lead</option>
                  <option value="warehouse-manager">Warehouse Manager</option>
                  <option value="finance-team">Finance Team</option>
                  <option value="coo">COO</option>
                </FormSelect>
              </FormField>
              <FormField label="Reason for escalation">
                <FormTextarea placeholder="Why does this need escalation?" value={reason} onChange={(e) => setReason(e.target.value)} />
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
  onSubmit: (data: { rootCause: string; correctiveAction: string; notes: string }) => void
}) {
  const [rootCause, setRootCause] = useState("")
  const [correctiveAction, setCorrectiveAction] = useState("")
  const [notes, setNotes] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ rootCause, correctiveAction, notes })
    setRootCause(""); setCorrectiveAction(""); setNotes(""); setFiles([])
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Resolve Discrepancy" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Resolution</h2>
              <FormField label="Root cause">
                <FormSelect value={rootCause} onChange={(e) => setRootCause(e.target.value)}>
                  <option value="">Select root cause</option>
                  <option value="scale-error">Scale calibration error</option>
                  <option value="counting-error">Counting / measurement error</option>
                  <option value="damage-transit">Damage in transit</option>
                  <option value="theft">Theft / pilferage</option>
                  <option value="system-error">System / data entry error</option>
                  <option value="moisture-loss">Moisture loss</option>
                  <option value="other">Other</option>
                </FormSelect>
              </FormField>
              <FormField label="Corrective action">
                <FormSelect value={correctiveAction} onChange={(e) => setCorrectiveAction(e.target.value)}>
                  <option value="">Select action</option>
                  <option value="stock-adjustment">Stock adjustment</option>
                  <option value="recount">Physical recount</option>
                  <option value="insurance-claim">Insurance claim</option>
                  <option value="write-off">Write off</option>
                  <option value="supplier-claim">Supplier claim</option>
                  <option value="process-improvement">Process improvement</option>
                </FormSelect>
              </FormField>
              <FormField label="Resolution notes">
                <FormTextarea placeholder="Document the resolution details and any follow-up actions..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </FormField>
              <FormField label="Evidence / attachments">
                <FormFileUpload
                  label="Upload evidence"
                  accept="image/*,.pdf,.doc,.docx"
                  multiple
                  files={files}
                  onFilesChange={setFiles}
                />
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

// ── Row action menu ──

function RowActions({
  status,
  onInvestigate,
  onAssign,
  onEscalate,
  onResolve,
}: {
  status: DiscrepancyStatus
  onInvestigate: () => void
  onAssign: () => void
  onEscalate: () => void
  onResolve: () => void
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
          <div className="absolute right-0 top-8 z-20 w-[180px] bg-white rounded-[8px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1">
            <button onClick={() => { onInvestigate(); setOpen(false) }} className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
              View details
            </button>
            {(status === "Open" || status === "Investigating") && (
              <button onClick={() => { onAssign(); setOpen(false) }} className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
                Assign investigation
              </button>
            )}
            {status !== "Closed" && status !== "Resolved" && (
              <button onClick={() => { onEscalate(); setOpen(false) }} className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#BA1A1A] hover:bg-[#F7FAF6]">
                Escalate
              </button>
            )}
            {status !== "Closed" && status !== "Resolved" && (
              <button onClick={() => { onResolve(); setOpen(false) }} className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#1A5514] hover:bg-[#F7FAF6]">
                Resolve
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── Main page ──

export function DiscrepanciesPage() {
  const [page, setPage] = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<DiscrepancyStatus | "all">("all")
  const [activeModal, setActiveModal] = useState<"log" | "assign" | "escalate" | "resolve" | null>(null)

  const totalPages = Math.ceil(TOTAL_ROWS / ROWS_PER_PAGE)

  const filteredRows = discrepancyRows.filter((row) => {
    const matchesSearch = searchQuery === "" ||
      row.aggregator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.discrepancyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.warehouse.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || row.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
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
              <div className="flex items-center gap-1.5">
                {card.hasArrow && <IconArrowUp className="size-3.5 text-[#1A5514]" />}
                <p className="text-[12px] leading-[18px]" style={{ color: card.subColor }}>{card.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table section */}
      <div className="bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex items-center gap-2 flex-1 max-w-[400px] h-9 px-3 rounded-full bg-[#EDF0E6]">
            <IconSearch className="size-4 text-[#525C4E]" />
            <input
              type="text"
              placeholder="Search by aggregator, commodity, ID..."
              className="bg-transparent text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] outline-none w-full"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            />
          </div>
          <button className="flex items-center gap-2 h-9 px-3 py-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
            <IconCalendar className="size-4 text-[#161D14]" />
            All time
            <IconChevronDown className="size-4 text-[#161D14]" />
          </button>
          <div className="relative">
            <button
              onClick={() => setStatusFilter(statusFilter === "all" ? "Open" : "all")}
              className="flex items-center gap-2 h-9 px-3 py-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
            >
              <IconUsers className="size-4 text-[#161D14]" />
              {statusFilter === "all" ? "All status" : statusFilter}
              <IconChevronDown className="size-4 text-[#161D14]" />
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] leading-[18px] font-bold text-[#525C4E] border-b border-[#E5E8DF]">
              <th className="px-6 py-3 font-bold">Aggregator</th>
              <th className="px-3 py-3 font-bold">Commodity</th>
              <th className="px-3 py-3 font-bold">Related Transaction</th>
              <th className="px-3 py-3 font-bold">Expected</th>
              <th className="px-3 py-3 font-bold">Actual</th>
              <th className="px-3 py-3 font-bold">Variance</th>
              <th className="px-3 py-3 font-bold">Variance %</th>
              <th className="px-3 py-3 font-bold">Warehouse</th>
              <th className="px-3 py-3 font-bold">Reported</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <IconFileStack className="size-8 text-[#C3C8BC]" />
                    <p className="text-[16px] leading-[24px] font-bold text-[#161D14]">No discrepancies found</p>
                    <p className="text-[14px] leading-[20px] text-[#525C4E]">
                      {searchQuery ? "Try adjusting your search or filters." : "All inventory records are reconciled."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E5E8DF] hover:bg-[#F7FAF6] cursor-pointer transition-colors"
                  onClick={() => setDetailOpen(true)}
                >
                  <td className="px-6 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.aggregator}</td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.commodity}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.discrepancyId}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.relatedTransaction}</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.expected.toLocaleString()} MT</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.actual.toLocaleString()} MT</td>
                  <td className="px-3 py-4"><VarianceCell value={row.variance} /></td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.variancePercent}%</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.warehouse}</td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.reportedTime}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.reportedDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      status={row.status}
                      onInvestigate={() => setDetailOpen(true)}
                      onAssign={() => setActiveModal("assign")}
                      onEscalate={() => setActiveModal("escalate")}
                      onResolve={() => setActiveModal("resolve")}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E8DF]">
          <span className="text-[14px] leading-[20px] text-[#525C4E]">0 of {TOTAL_ROWS} row(s) selected.</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[14px] leading-[20px] text-[#525C4E]">Rows per page</span>
              <select className="px-2 py-1 rounded-[6px] outline outline-1 outline-[#E5E8DF] text-[14px] leading-[20px] text-[#161D14] bg-white">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30">
                <IconChevronsLeft className="size-4 text-[#161D14]" />
              </button>
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30">
                <IconChevronLeft className="size-4 text-[#161D14]" />
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30">
                <IconChevronRight className="size-4 text-[#161D14]" />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30">
                <IconChevronsRight className="size-4 text-[#161D14]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <DiscrepancyDetailSheet
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        detail={detailData}
        onAssign={() => { setDetailOpen(false); setActiveModal("assign") }}
        onEscalate={() => { setDetailOpen(false); setActiveModal("escalate") }}
        onResolve={() => { setDetailOpen(false); setActiveModal("resolve") }}
      />

      {/* Modals */}
      <LogDiscrepancyModal
        open={activeModal === "log"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        onSubmit={() => setActiveModal(null)}
      />
      <AssignModal
        open={activeModal === "assign"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        onSubmit={() => setActiveModal(null)}
      />
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
