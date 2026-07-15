import { useState } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronsRight,
  IconChevronsLeft,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconAlertCircle,
  IconCheckbox,
  IconDots,
  IconX,
  IconFileExport,
  IconSearch,
  IconCalendar,
  IconArrowsExchange,
  IconPackageImport,
  IconPackageExport,
  IconAdjustments,
  IconAlertTriangle,
  IconBox,
  IconArrowBack,
  IconRepeat,
  IconInfoCircle,
} from "@tabler/icons-react"

// ── Types ──

type MovementType = "Received" | "Dispatch" | "Adjustment" | "Loss Recording" | "Transfer" | "Reservation" | "Return" | "Regrade"
type MovementStatus = "Verified" | "Completed" | "Approved" | "Written off" | "Active"

type MovementRow = {
  id: string
  aggregator: string
  commodity: string
  lotId: string
  quantity: number
  change: number
  type: MovementType
  reference: string
  poReference: string
  performedBySystem: string
  performedByUser: string
  time: string
  date: string
  status: MovementStatus
}

type MovementDetail = {
  transactionId: string
  type: MovementType
  status: MovementStatus
  warehouse: string
  commodity: string
  lotNumber: string
  aggregator: string
  quantityBefore: number
  quantityAfter: number
  change: number
  reference: string
  poReference: string
  performedBySystem: string
  performedByUser: string
  time: string
  date: string
  reason: string
  notes: string
}

// ── Static data ──

const summaryCards = [
  { label: "Total transactions", value: "16", icon: IconArrowsExchange, iconBg: "#D5E6FD", iconColor: "#00439E" },
  { label: "Inbound", value: "+80.3 MT", icon: IconArrowDownLeft, iconBg: "#D4F5D0", iconColor: "#1A5514" },
  { label: "Outbound", value: "-139.1 MT", icon: IconArrowUpRight, iconBg: "#FEF0D8", iconColor: "#995917", hasChevron: true },
  { label: "Losses", value: "4.7", icon: IconAlertCircle, iconBg: "#FFDAD6", iconColor: "#BA1A1A" },
  { label: "Movement types", value: "8 types tracked", icon: IconCheckbox, iconBg: "#D4F5D0", iconColor: "#1A5514" },
]

const typeConfig: Record<MovementType, { icon: typeof IconPackageImport; color: string }> = {
  Received: { icon: IconPackageImport, color: "#1A5514" },
  Dispatch: { icon: IconPackageExport, color: "#995917" },
  Adjustment: { icon: IconAdjustments, color: "#00439E" },
  "Loss Recording": { icon: IconAlertTriangle, color: "#BA1A1A" },
  Transfer: { icon: IconArrowsExchange, color: "#7925CC" },
  Reservation: { icon: IconBox, color: "#00439E" },
  Return: { icon: IconArrowBack, color: "#995917" },
  Regrade: { icon: IconRepeat, color: "#525C4E" },
}

const statusConfig: Record<MovementStatus, { dotColor: string; textColor: string; bg?: string }> = {
  Verified: { dotColor: "#1A5514", textColor: "#1A5514" },
  Completed: { dotColor: "#1A5514", textColor: "#1A5514" },
  Approved: { dotColor: "#1A5514", textColor: "#1A5514" },
  "Written off": { dotColor: "#525C4E", textColor: "#525C4E" },
  Active: { dotColor: "#36B92E", textColor: "#1A5514", bg: "#D4F5D0" },
}

const movementRows: MovementRow[] = [
  { id: "1", aggregator: "John Doe", commodity: "Chilli Pepper", lotId: "DIS-001", quantity: 840, change: 41.8, type: "Received", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "System", time: "14:30", date: "01 Sep 2026", status: "Verified" },
  { id: "2", aggregator: "Owusu Opoku", commodity: "Cocoa", lotId: "DIS-001", quantity: 57, change: -12.0, type: "Dispatch", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Super Admin", time: "14:30", date: "01 Sep 2026", status: "Completed" },
  { id: "3", aggregator: "Nat Kofi", commodity: "Cassava", lotId: "DIS-001", quantity: 8.5, change: -0.5, type: "Adjustment", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Ops Admin", time: "14:30", date: "01 Sep 2026", status: "Approved" },
  { id: "4", aggregator: "Nat Kofi", commodity: "Cassava", lotId: "DIS-001", quantity: 8.5, change: -0.5, type: "Loss Recording", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Ops Admin", time: "14:30", date: "01 Sep 2026", status: "Approved" },
  { id: "5", aggregator: "Owusu Opoku", commodity: "Cocoa", lotId: "DIS-001", quantity: 57, change: -12.0, type: "Transfer", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Super Admin", time: "14:30", date: "01 Sep 2026", status: "Completed" },
  { id: "6", aggregator: "Owusu Opoku", commodity: "Cocoa", lotId: "DIS-001", quantity: 57, change: -12.0, type: "Reservation", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Super Admin", time: "14:30", date: "01 Sep 2026", status: "Completed" },
  { id: "7", aggregator: "Nat Kofi", commodity: "Cassava", lotId: "DIS-001", quantity: 8.5, change: -0.5, type: "Return", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Ops Admin", time: "14:30", date: "01 Sep 2026", status: "Approved" },
  { id: "8", aggregator: "Nat Kofi", commodity: "Cassava", lotId: "DIS-001", quantity: 8.5, change: -0.5, type: "Regrade", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Ops Admin", time: "14:30", date: "01 Sep 2026", status: "Written off" },
  { id: "9", aggregator: "Nat Kofi", commodity: "Cassava", lotId: "DIS-001", quantity: 8.5, change: -0.5, type: "Loss Recording", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Ops Admin", time: "14:30", date: "01 Sep 2026", status: "Active" },
  { id: "10", aggregator: "Nat Kofi", commodity: "Cassava", lotId: "DIS-001", quantity: 8.5, change: -0.5, type: "Adjustment", reference: "GRN-2009", poReference: "PO-2908-18", performedBySystem: "System", performedByUser: "Ops Admin", time: "14:30", date: "01 Sep 2026", status: "Approved" },
]

const detailData: MovementDetail = {
  transactionId: "TXN-2026-00142",
  type: "Received",
  status: "Verified",
  warehouse: "Tema Hub",
  commodity: "Chilli Pepper",
  lotNumber: "LOT-2026-041",
  aggregator: "John Doe",
  quantityBefore: 798.2,
  quantityAfter: 840,
  change: 41.8,
  reference: "GRN-2009",
  poReference: "PO-2908-18",
  performedBySystem: "System",
  performedByUser: "System",
  time: "14:30",
  date: "01 Sep 2026",
  reason: "Goods received from supplier delivery. Verified by warehouse scale and QA inspection.",
  notes: "Truck #TK-4421. Scale reading consistent. Moisture check passed at 11.8%. QA grade: A.",
}

const TOTAL_ROWS = 68
const ROWS_PER_PAGE = 10

// ── Subcomponents ──

function TypeBadge({ type }: { type: MovementType }) {
  const config = typeConfig[type]
  const Icon = config.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px] leading-[20px] font-medium" style={{ color: config.color }}>
      <Icon className="size-4" />
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status: MovementStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px] leading-[18px] px-2 py-0.5 rounded-full font-medium"
      style={{ color: config.textColor, background: config.bg || "transparent", border: config.bg ? undefined : `1px solid #E5E8DF` }}
    >
      <span className="size-1.5 rounded-full" style={{ background: config.dotColor }} />
      {status}
    </span>
  )
}

function ChangeCell({ value }: { value: number }) {
  const isPositive = value > 0
  const color = isPositive ? "#1A5514" : "#BA1A1A"
  const formatted = isPositive ? `+${value.toFixed(1)}` : value.toFixed(1)
  return (
    <span className="text-[14px] leading-[20px] font-bold" style={{ color }}>
      {formatted} MT
    </span>
  )
}

// ── Detail Sheet ──

function MovementDetailSheet({
  open,
  onClose,
  detail,
}: {
  open: boolean
  onClose: () => void
  detail: MovementDetail
}) {
  if (!open) return null

  const tc = typeConfig[detail.type]
  const TypeIcon = tc.icon

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
          <span className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#161D14]">Transaction detail</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Title + status */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[28px] leading-[36px] font-bold text-[#161D14]">{detail.transactionId}</h2>
              <StatusBadge status={detail.status} />
            </div>
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
              <IconFileExport className="size-4" />
              Export
            </button>
          </div>

          {/* Type banner */}
          <div className="mx-6 flex items-center gap-2 px-4 py-3 rounded-[12px]" style={{ background: `${tc.color}10` }}>
            <TypeIcon className="size-4" style={{ color: tc.color }} />
            <span className="text-[14px] leading-[20px] font-medium" style={{ color: tc.color }}>
              {detail.type}
            </span>
            <span className="text-[14px] leading-[20px] ml-2" style={{ color: `${tc.color}99` }}>
              {detail.change > 0 ? "+" : ""}{detail.change.toFixed(1)} MT
            </span>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2] mt-4" />

          {/* Transaction info */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Transaction info</h3>
            <div className="flex flex-wrap gap-2">
              <DetailTile label="Warehouse" value={detail.warehouse} />
              <DetailTile label="Commodity" value={detail.commodity} />
              <DetailTile label="Lot number" value={detail.lotNumber} />
              <DetailTile label="Aggregator" value={detail.aggregator} />
              <DetailTile label="Reference" value={detail.reference} />
              <DetailTile label="PO Reference" value={detail.poReference} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Quantity change */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Quantity change</h3>
            <div className="flex flex-wrap gap-2">
              <DetailTile label="Before" value={`${detail.quantityBefore} MT`} />
              <DetailTile label="After" value={`${detail.quantityAfter} MT`} />
              <DetailTile
                label="Change"
                value={`${detail.change > 0 ? "+" : ""}${detail.change.toFixed(1)} MT`}
                valueColor={detail.change > 0 ? "#1A5514" : "#BA1A1A"}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Performed by */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Audit trail</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <DetailTile label="Performed by" value={detail.performedByUser} />
              <DetailTile label="System" value={detail.performedBySystem} />
              <DetailTile label="Timestamp" value={`${detail.time} ${detail.date}`} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Reason & notes */}
          <div className="px-6 pt-4 pb-5">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Details</h3>
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-[#F7FAF6] rounded-[8px]">
                <span className="text-[12px] leading-[18px] text-[#525C4E]">Reason</span>
                <p className="text-[14px] leading-[20px] text-[#161D14] mt-1">{detail.reason}</p>
              </div>
              <div className="p-3 bg-[#F7FAF6] rounded-[8px]">
                <span className="text-[12px] leading-[18px] text-[#525C4E]">Notes</span>
                <p className="text-[14px] leading-[20px] text-[#161D14] mt-1">{detail.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - read-only ledger, just a close button */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E8DF] shrink-0">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#EDF0E6] text-[16px] leading-[24px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
          >
            Close
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

// ── Row action menu ──

function RowActions({ onViewDetail }: { onViewDetail: () => void }) {
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
            <button
              onClick={() => { onViewDetail(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]"
            >
              <IconInfoCircle className="size-4 text-[#525C4E]" />
              View detail
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main page ──

export function MovementLogsPage() {
  const [page, setPage] = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<MovementStatus | "all">("all")
  const [typeDropdown, setTypeDropdown] = useState(false)
  const [statusDropdown, setStatusDropdown] = useState(false)

  const totalPages = Math.ceil(TOTAL_ROWS / ROWS_PER_PAGE)

  const filteredRows = movementRows.filter((row) => {
    const matchesSearch = searchQuery === "" ||
      row.aggregator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || row.type === typeFilter
    const matchesStatus = statusFilter === "all" || row.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const allTypes: MovementType[] = ["Received", "Dispatch", "Adjustment", "Loss Recording", "Transfer", "Reservation", "Return", "Regrade"]
  const allStatuses: MovementStatus[] = ["Verified", "Completed", "Approved", "Written off", "Active"]

  return (
    <div className="flex flex-col gap-6">
      {/* 5 KPI Summary Cards */}
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
            </div>
          )
        })}
      </div>

      {/* Table section */}
      <div className="bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex items-center gap-2 flex-1 max-w-[360px] h-9 px-3 rounded-full bg-[#EDF0E6]">
            <IconSearch className="size-4 text-[#525C4E]" />
            <input
              type="text"
              placeholder="Search aggregator, commodity"
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

          {/* Type filter */}
          <div className="relative">
            <button
              onClick={() => { setTypeDropdown(!typeDropdown); setStatusDropdown(false) }}
              className="flex items-center gap-2 h-9 px-3 py-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
            >
              <IconArrowsExchange className="size-4 text-[#161D14]" />
              {typeFilter === "all" ? "All types" : typeFilter}
              <IconChevronDown className="size-4 text-[#161D14]" />
            </button>
            {typeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setTypeDropdown(false)} />
                <div className="absolute left-0 top-11 z-20 w-[200px] bg-white rounded-[8px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1">
                  <button
                    onClick={() => { setTypeFilter("all"); setTypeDropdown(false); setPage(1) }}
                    className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]"
                  >
                    All types
                  </button>
                  {allTypes.map((t) => {
                    const tc = typeConfig[t]
                    const TIcon = tc.icon
                    return (
                      <button
                        key={t}
                        onClick={() => { setTypeFilter(t); setTypeDropdown(false); setPage(1) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]"
                      >
                        <TIcon className="size-4" style={{ color: tc.color }} />
                        {t}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => { setStatusDropdown(!statusDropdown); setTypeDropdown(false) }}
              className="flex items-center gap-2 h-9 px-3 py-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
            >
              <IconCheckbox className="size-4 text-[#161D14]" />
              {statusFilter === "all" ? "All status" : statusFilter}
              <IconChevronDown className="size-4 text-[#161D14]" />
            </button>
            {statusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusDropdown(false)} />
                <div className="absolute left-0 top-11 z-20 w-[180px] bg-white rounded-[8px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1">
                  <button
                    onClick={() => { setStatusFilter("all"); setStatusDropdown(false); setPage(1) }}
                    className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]"
                  >
                    All status
                  </button>
                  {allStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setStatusDropdown(false); setPage(1) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]"
                    >
                      <span className="size-1.5 rounded-full" style={{ background: statusConfig[s].dotColor }} />
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] leading-[18px] font-bold text-[#525C4E] border-b border-[#E5E8DF]">
              <th className="px-6 py-3 font-bold">Aggregator</th>
              <th className="px-3 py-3 font-bold">Commodity</th>
              <th className="px-3 py-3 font-bold">Quantity</th>
              <th className="px-3 py-3 font-bold">Change</th>
              <th className="px-3 py-3 font-bold">Type</th>
              <th className="px-3 py-3 font-bold">Reference</th>
              <th className="px-3 py-3 font-bold">Performed by</th>
              <th className="px-3 py-3 font-bold">Timestamp</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <IconArrowsExchange className="size-8 text-[#C3C8BC]" />
                    <p className="text-[16px] leading-[24px] font-bold text-[#161D14]">No movements found</p>
                    <p className="text-[14px] leading-[20px] text-[#525C4E]">
                      {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                        ? "Try adjusting your search or filters."
                        : "No inventory movements have been recorded yet."}
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
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.lotId}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.quantity} MT</td>
                  <td className="px-3 py-4"><ChangeCell value={row.change} /></td>
                  <td className="px-3 py-4"><TypeBadge type={row.type} /></td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.reference}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.poReference}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.performedBySystem}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.performedByUser}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[20px] text-[#161D14]">{row.time}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{row.date}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                    <RowActions onViewDetail={() => setDetailOpen(true)} />
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
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30">
                <IconChevronLeft className="size-4 text-[#161D14]" />
              </button>
              <button onClick={() => setPage(1)} disabled={page === 1} className="p-1 rounded hover:bg-[#EDF0E6] disabled:opacity-30">
                <IconChevronsLeft className="size-4 text-[#161D14]" />
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
      <MovementDetailSheet
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        detail={detailData}
      />
    </div>
  )
}
