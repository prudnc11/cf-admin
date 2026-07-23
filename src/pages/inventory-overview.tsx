import { useState } from "react"
import {
  IconChevronRight,
  IconChevronLeft,
  IconChevronsRight,
  IconChevronsLeft,
  IconPackage,
  IconClipboardCheck,
  IconAlertTriangle,
  IconCircleDot,
  IconDots,
  IconX,
  IconFileExport,
  IconArrowsExchange,
  IconCheck,
  IconArrowsMove,
  IconBox,
  IconCalendar,
  IconUsers,
  IconPlant,
  IconClipboardList,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { FilterDropdown, DATE_OPTIONS } from "@/components/ui/filter-dropdown"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { FormField, FormSelect, FormTextarea } from "@/components/ui/form-fields"

// ── Types ──

type InventoryStatus = "Critical" | "Low" | "Healthy"

type InventoryRow = {
  aggregator: string
  commodity: string
  stock: number
  stockCapacity: number
  capacityTotal: number
  utilization: number
  reserved: number
  trend: number
  lot: string
  lastReceipt: string
  status: InventoryStatus
}

type CommodityDetail = {
  name: string
  lot: string
  total: number
  available: number
  reserved: number
  grade: string
  moisture: string
  expiry: string
  utilization: number
  status: "Healthy" | "Critical" | "Low"
  barColor: string
}

type AggregatorDetail = {
  name: string
  statusLabel: string
  manager: string
  totalInventory: number
  capacity: number
  available: number
  reserved: number
  damaged: number
  quarantined: string
  activeLots: number
  utilisation: string
  commodityCount: number
  lowStock: number
  criticalStock: number
  overstocked: number
  expiringLots: number
  commodities: CommodityDetail[]
}

// ── Static data ──

const summaryCards = [
  { label: "Total inventory", value: "18,560 MT", sub: "9 active \u2022 4 draft \u2022 5 completed", iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconPackage },
  { label: "Available", value: "13,940 MT", sub: "Free to fulfill orders", iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconClipboardCheck },
  { label: "Reserved", value: "4,620 MT", sub: "Against open orders", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconClipboardCheck, hasChevron: true },
  { label: "Damaged", value: "98 MT", sub: "Awaiting disposal decision", iconBg: "#FFDAD6", iconColor: "#BA1A1A", icon: IconAlertTriangle },
  { label: "Quarantined", value: "487 MT", sub: "QA holds \u2022 3 active", iconBg: "#FEF0D8", iconColor: "#995917", icon: IconCircleDot },
]

const warehouseMetrics = [
  { label: "Total capacity", value: "50,500 MT" },
  { label: "Utilization", value: "61%" },
  { label: "Active lots", value: "84" },
  { label: "Commodities", value: "6" },
]

const riskIndicators = [
  { label: "Low stock", value: "12", color: "#BA1A1A" },
  { label: "Critical stock", value: "4", color: "#BA1A1A" },
  { label: "Overstocked", value: "2", color: "#BA1A1A" },
  { label: "Expiring lots (30D)", value: "6", color: "#BA1A1A" },
]

const inventoryRows: InventoryRow[] = [
  { aggregator: "Owusu Opoku", commodity: "Cocoa \u2022 Cassava", stock: 4, stockCapacity: 8, capacityTotal: 120, utilization: 16, reserved: 90, trend: 10, lot: "LOT-897T6", lastReceipt: "01 Sep 2026", status: "Critical" },
  { aggregator: "Owusu Opoku", commodity: "Cocoa \u2022 Cassava", stock: 450, stockCapacity: 340, capacityTotal: 500, utilization: 16, reserved: 90, trend: 93, lot: "LOT-897T6", lastReceipt: "01 Sep 2026", status: "Healthy" },
  { aggregator: "Owusu Opoku", commodity: "Cocoa \u2022 Cassava", stock: 88, stockCapacity: 88, capacityTotal: 140, utilization: 16, reserved: 90, trend: 7, lot: "LOT-897T6", lastReceipt: "01 Sep 2026", status: "Critical" },
  { aggregator: "Owusu Opoku", commodity: "Cocoa \u2022 Cassava", stock: 38, stockCapacity: 340, capacityTotal: 500, utilization: 16, reserved: 8, trend: 19, lot: "LOT-897T6", lastReceipt: "01 Sep 2026", status: "Low" },
  { aggregator: "Owusu Opoku", commodity: "Cocoa \u2022 Cassava", stock: 450, stockCapacity: 340, capacityTotal: 500, utilization: 16, reserved: 90, trend: 91, lot: "LOT-897T6", lastReceipt: "01 Sep 2026", status: "Healthy" },
  { aggregator: "Owusu Opoku", commodity: "Cocoa \u2022 Cassava", stock: 450, stockCapacity: 340, capacityTotal: 500, utilization: 16, reserved: 90, trend: 87, lot: "LOT-897T6", lastReceipt: "01 Sep 2026", status: "Healthy" },
]

const aggregatorDetail: AggregatorDetail = {
  name: "Owusu Opoku",
  statusLabel: "Operational",
  manager: "Kofi Asante",
  totalInventory: 638,
  capacity: 2000,
  available: 529,
  reserved: 105,
  damaged: 4,
  quarantined: "None",
  activeLots: 6,
  utilisation: "32%",
  commodityCount: 3,
  lowStock: 0,
  criticalStock: 0,
  overstocked: 0,
  expiringLots: 0,
  commodities: [
    { name: "Maize", lot: "LOT-2026-041", total: 340, available: 529, reserved: 105, grade: "Grade A", moisture: "MC: 12.1%", expiry: "Exp: 174d", utilization: 68, status: "Healthy", barColor: "#1A5514" },
    { name: "Soybean", lot: "LOT-2026-041", total: 210, available: 160, reserved: 50, grade: "Grade A", moisture: "MC: 10.1%", expiry: "Exp: 157d", utilization: 70, status: "Healthy", barColor: "#E8590C" },
    { name: "Cocoa", lot: "LOT-2026-041", total: 88, available: 71.8, reserved: 15, grade: "Grade A", moisture: "MC: 7.1%", expiry: "Exp: 354d", utilization: 73, status: "Healthy", barColor: "#8B6914" },
  ],
}

const TOTAL_ROWS = 68
const ROWS_PER_PAGE = 10

// ── Subcomponents ──

function StatusBadge({ status }: { status: InventoryStatus }) {
  const styles = {
    Critical: { bg: "#FFDAD6", color: "#BA1A1A" },
    Low: { bg: "#FEF0D8", color: "#995917" },
    Healthy: { bg: "#D4F5D0", color: "#1A5514" },
  }
  const s = styles[status]
  return (
    <span className="text-[12px] leading-[18px] px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  )
}

function UtilizationBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] leading-[20px] text-[#161D14]">{percent}%</span>
      <div className="w-[40px] h-[6px] bg-[#E5E8DF] rounded-full overflow-hidden">
        <div className="h-full bg-[#71786C] rounded-full animate-bar-grow" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function TrendValue({ value }: { value: number }) {
  const color = value >= 50 ? "#1A5514" : "#BA1A1A"
  return <span className="text-[14px] leading-[20px] font-bold" style={{ color }}>{value}%</span>
}

// ── Detail Sheet ──

function InventoryDetailSheet({
  open,
  onClose,
  detail,
  onAdjust,
  onTransfer,
}: {
  open: boolean
  onClose: () => void
  detail: AggregatorDetail
  onAdjust: () => void
  onTransfer: () => void
}) {
  if (!open) return null

  const usedPercent = Math.round((detail.totalInventory / detail.capacity) * 100)
  const availPercent = (detail.available / detail.capacity) * 100
  const reservedPercent = (detail.reserved / detail.capacity) * 100
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
          <span className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#161D14]">Inventory detail</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Aggregator name + badge */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[28px] leading-[36px] font-bold text-[#161D14]">{detail.name}</h2>
              <span className="text-[12px] leading-[18px] px-2 py-0.5 rounded-full bg-[#C9F0D6] text-[#00572D] font-medium">
                {detail.statusLabel}
              </span>
            </div>
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
              <IconFileExport className="size-4" />
              Export
            </button>
          </div>

          {/* Status banner */}
          <div className="mx-6 flex items-center gap-2 px-4 py-3 bg-[#C9F0D6] rounded-[12px]">
            <span className="size-2 rounded-full bg-[#008744]" />
            <span className="text-[14px] leading-[20px] font-medium text-[#00572D]">
              {detail.statusLabel}
            </span>
            <span className="text-[14px] leading-[20px] text-[#00572D]/70 ml-2">
              Manager: {detail.manager}
            </span>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2] mt-4" />

          {/* Capacity */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Capacity</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">
                  {detail.totalInventory}/{detail.capacity.toLocaleString()} MT
                </span>
                <span className="text-[14px] leading-[20px] font-bold text-[#1A5514]">{usedPercent}% used</span>
              </div>
              {/* Stacked bar */}
              <div className="w-full h-[12px] bg-[#E1E4DA] rounded-[4px] overflow-hidden flex">
                <div className="h-full bg-[#306B28]" style={{ width: `${availPercent}%` }} />
                <div className="h-full bg-[#0063EA]" style={{ width: `${reservedPercent}%` }} />
                <div className="h-full bg-[#E1E4DA]" style={{ width: `${Math.max(0, 100 - availPercent - reservedPercent)}%` }} />
              </div>
              <div className="flex items-center gap-4 text-[12px] leading-[18px]">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#008744]" />
                  <span className="text-[#525C4E]">Available:</span>
                  <span className="font-bold text-[#008744]">{detail.available} MT</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#0063EA]" />
                  <span className="text-[#525C4E]">Reserved:</span>
                  <span className="font-bold text-[#0063EA]">{detail.reserved} MT</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#BA1A1A]" />
                  <span className="text-[#525C4E]">Damaged:</span>
                  <span className="font-bold text-[#BA1A1A]">{detail.damaged} MT</span>
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Inventory metrics */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Inventory metrics</h3>
            <div className="flex flex-wrap gap-2">
              <DetailTile label="Total inventory" value={`${detail.totalInventory} MT`} />
              <DetailTile label="Available" value={`${detail.available} MT`} valueColor="#008744" />
              <DetailTile label="Reserved" value={`${detail.reserved} MT`} valueColor="#0063EA" />
              <DetailTile label="Damaged" value={`${detail.damaged} MT`} valueColor="#BA1A1A" />
              <DetailTile label="Quarantined" value={detail.quarantined} valueColor={detail.quarantined === "None" ? "#D8DBD2" : "#995917"} />
              <DetailTile label="Active lots" value={String(detail.activeLots)} />
              <DetailTile label="Capacity" value={`${detail.capacity.toLocaleString()} MT`} />
              <DetailTile label="Utilisation" value={detail.utilisation} />
              <DetailTile label="Commodities" value={String(detail.commodityCount)} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Risk indicator */}
          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Risk indicator</h3>
            <div className="flex flex-wrap gap-2">
              <DetailTile label="Low stock" value={String(detail.lowStock)} valueColor={detail.lowStock === 0 ? "#D8DBD2" : "#1A5514"} />
              <DetailTile label="Critical stock" value={String(detail.criticalStock)} valueColor={detail.criticalStock === 0 ? "#D8DBD2" : "#BA1A1A"} />
              <DetailTile label="Overstocked" value={String(detail.overstocked)} valueColor={detail.overstocked === 0 ? "#D8DBD2" : "#1A5514"} />
              <DetailTile label="Expiring lots (30D)" value={String(detail.expiringLots)} valueColor={detail.expiringLots === 0 ? "#D8DBD2" : "#BA1A1A"} />
            </div>
          </div>

          {/* Divider */}
          <div className="h-[8px] bg-[#F3F7F2]" />

          {/* Inventory by commodity */}
          <div className="px-6 pt-4 pb-5">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">
              Inventory by commodity ({detail.commodities.length})
            </h3>
            <div className="flex flex-col gap-3">
              {detail.commodities.map((c) => (
                <div key={c.name} className="p-4 rounded-[12px] bg-[#F7FAF6] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{c.name}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{c.lot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] leading-[24px] font-bold text-[#008744]">{c.total} MT</span>
                      <span className="flex items-center gap-1 text-[12px] leading-[18px] px-2 py-0.5 rounded-full bg-[#C9F0D6] text-[#00572D]">
                        <span className="size-1.5 rounded-full bg-[#00572D]" />
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[12px] bg-[#E1E4DA] rounded-[4px] overflow-hidden">
                      <div className="h-full rounded-[4px] animate-bar-grow" style={{ width: `${c.utilization}%`, background: c.barColor }} />
                    </div>
                    <span className="text-[12px] leading-[18px] font-bold text-[#008744]">{c.utilization}%</span>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] leading-[18px] text-[#525C4E]">
                    <span>Available: <span className="font-bold text-[#008744]">{c.available} MT</span></span>
                    <span>Reserved: <span className="font-bold text-[#0063EA]">{c.reserved} MT</span></span>
                    <span>{c.grade}</span>
                    <span className="text-[#995917]">{c.moisture}</span>
                    <span>{c.expiry}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E8DF] shrink-0">
          <button
            onClick={onAdjust}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#EDF0E6] text-[16px] leading-[24px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
          >
            All Lots
          </button>
          <button
            onClick={onTransfer}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[12px] bg-[#36B92E] text-[16px] leading-[24px] font-bold text-white hover:bg-[#2DA526] transition-colors"
          >
            <IconArrowsExchange className="size-5" />
            Movement Log
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

// ── Action Modals ──

function AdjustmentModal({
  open,
  onOpenChange,
  row,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: InventoryRow | null
  onSubmit: (data: { type: string; quantity: string; reason: string }) => void
}) {
  const [type, setType] = useState("")
  const [quantity, setQuantity] = useState("0.0")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ type, quantity, reason })
    setType("")
    setQuantity("0.0")
    setReason("")
  }

  if (!row) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Adjustment" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Stock Adjustment</h2>

              <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
                <div className="grid grid-cols-4">
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Current</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{row.stock} MT</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Commodity</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Maize</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">LOT</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{row.lot}</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Status</span>
                    <StatusBadge status={row.status} />
                  </div>
                </div>
              </div>

              <FormField label="Adjustment type">
                <FormSelect value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select adjustment</option>
                  <option value="increase">Increase</option>
                  <option value="decrease">Decrease</option>
                  <option value="correction">Correction</option>
                  <option value="damage">Damage</option>
                  <option value="quarantine">Quarantine</option>
                </FormSelect>
              </FormField>

              <FormField label="Quantity (MT)">
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 bg-[#EDF0E6] rounded-[12px] text-[16px] leading-[24px] text-[#161D14] outline-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </FormField>

              <FormField label="Adjustment reason">
                <FormTextarea
                  placeholder="Document the reason for adjustment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              Submit
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function TransferModal({
  open,
  onOpenChange,
  row,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: InventoryRow | null
  onSubmit: (data: { destination: string; quantity: string; reason: string }) => void
}) {
  const [destination, setDestination] = useState("")
  const [quantity, setQuantity] = useState("0.0")
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ destination, quantity, reason })
    setDestination("")
    setQuantity("0.0")
    setReason("")
  }

  if (!row) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Transfer" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Transfer stock</h2>

              <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
                <div className="grid grid-cols-3">
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Available</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{row.stock} MT</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">From</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{row.aggregator}</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Commodity</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Maize</span>
                  </div>
                </div>
              </div>

              <FormField label="Destination">
                <FormSelect value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="">Select destination</option>
                  <option value="wh-001">Warehouse WH-001</option>
                  <option value="wh-002">Warehouse WH-002</option>
                  <option value="wh-003">Warehouse WH-003</option>
                </FormSelect>
              </FormField>

              <FormField label="Quantity (MT)">
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 bg-[#EDF0E6] rounded-[12px] text-[16px] leading-[24px] text-[#161D14] outline-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </FormField>

              <FormField label="Transfer reason">
                <FormTextarea
                  placeholder="Document the reason for transfer..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconArrowsMove className="size-5" />
              Transfer
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function ReorderModal({
  open,
  onOpenChange,
  row,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: InventoryRow | null
  onSubmit: (data: { quantity: string; urgency: string }) => void
}) {
  const [quantity, setQuantity] = useState("0.0")
  const [urgency, setUrgency] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ quantity, urgency })
    setQuantity("0.0")
    setUrgency("")
  }

  if (!row) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Reorder" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Raise Reorder</h2>

              <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
                <div className="grid grid-cols-3">
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Current stock</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#BA1A1A]">{row.stock} MT</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">From</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{row.aggregator}</span>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-0.5">
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Commodity</span>
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Cassava</span>
                  </div>
                </div>
              </div>

              <FormField label="Reorder Quantity (MT)">
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 bg-[#EDF0E6] rounded-[12px] text-[16px] leading-[24px] text-[#161D14] outline-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </FormField>

              <FormField label="Urgency">
                <FormSelect value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value="">Select urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </FormSelect>
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconBox className="size-5" />
              Submit Reorder
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// ── Row action menu ──

function RowActions({
  onAdjust,
  onTransfer,
  onReorder,
}: {
  onAdjust: () => void
  onTransfer: () => void
  onReorder: () => void
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
            <button onClick={() => { onAdjust(); setOpen(false) }} className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
              Adjust stock
            </button>
            <button onClick={() => { onTransfer(); setOpen(false) }} className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
              Transfer stock
            </button>
            <button onClick={() => { onReorder(); setOpen(false) }} className="w-full px-3 py-2 text-left text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
              Raise reorder
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main page ──

export function InventoryOverviewPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "lots">("summary")
  const [page, setPage] = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<{ type: "adjust" | "transfer" | "reorder"; rowIndex: number } | null>(null)

  // Top bar filter state
  const [dateFilter, setDateFilter] = useState("all")
  const [aggregatorFilter, setAggregatorFilter] = useState("all")
  const [commodityFilter, setCommodityFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  // Table filter state
  const [regionFilter, setRegionFilter] = useState("all")
  const [tableCommodityFilter, setTableCommodityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Derive options from data
  const aggregatorOptions = [...new Set(inventoryRows.map((r) => r.aggregator))].map((a) => ({ label: a, value: a }))
  const commodityOptions = [...new Set(inventoryRows.map((r) => r.commodity))].map((c) => ({ label: c, value: c }))
  const regionOptions = [...new Set(inventoryRows.map((r) => r.aggregator))].map((r) => ({ label: r, value: r }))
  const statusOptions = [
    { label: "Critical", value: "Critical" },
    { label: "Low", value: "Low" },
    { label: "Healthy", value: "Healthy" },
  ]
  const planOptions = [
    { label: "Basic", value: "basic" },
    { label: "Premium", value: "premium" },
    { label: "Enterprise", value: "enterprise" },
  ]

  // Filter table rows
  const filteredRows = inventoryRows.filter((row) => {
    if (aggregatorFilter !== "all" && row.aggregator !== aggregatorFilter) return false
    if (commodityFilter !== "all" && row.commodity !== commodityFilter) return false
    if (regionFilter !== "all" && row.aggregator !== regionFilter) return false
    if (tableCommodityFilter !== "all" && row.commodity !== tableCommodityFilter) return false
    if (statusFilter !== "all" && row.status !== statusFilter) return false
    return true
  })

  const totalPages = Math.ceil(TOTAL_ROWS / ROWS_PER_PAGE)
  const activeRow = activeModal ? inventoryRows[activeModal.rowIndex] ?? inventoryRows[0] : null

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <FilterDropdown label="All time" icon={IconCalendar} options={DATE_OPTIONS} value={dateFilter} onChange={setDateFilter} allLabel="All time" />
        <FilterDropdown label="All Aggregators" icon={IconUsers} options={aggregatorOptions} value={aggregatorFilter} onChange={setAggregatorFilter} allLabel="All Aggregators" />
        <FilterDropdown label="All commodities" icon={IconPlant} options={commodityOptions} value={commodityFilter} onChange={setCommodityFilter} allLabel="All commodities" />
        <FilterDropdown label="All plans" icon={IconClipboardList} options={planOptions} value={planFilter} onChange={setPlanFilter} allLabel="All plans" />
      </div>

      {/* 5 KPI Summary Cards */}
      <div className="flex gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="flex-1 min-w-0 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 hover-lift stagger-child" style={{ "--stagger-index": i } as React.CSSProperties}>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-[8px] flex items-center justify-center" style={{ background: card.iconBg }}>
                  <Icon className="size-4" style={{ color: card.iconColor }} />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#525C4E]">{card.label}</span>
                {card.hasChevron && <IconChevronRight className="size-4 text-[#71786C]" />}
              </div>
              <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
              <p className="text-[12px] leading-[18px] text-[#525C4E]">{card.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Warehouse metrics + Risk indicators */}
      <div className="flex gap-4">
        {/* Warehouse metrics */}
        <div className="flex-1 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[6px] flex items-center justify-center bg-[#E2D1FD]">
              <IconPackage className="size-4 text-[#7925CC]" />
            </div>
            <h3 className="flex-1 text-[16px] leading-[24px] font-bold text-[#161D14]">Warehouse metrics</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {warehouseMetrics.map((m) => (
              <div key={m.label} className="w-[250px] p-3 bg-[#F7FAF6] rounded-[8px] flex flex-col gap-3">
                <span className="text-[12px] leading-[18px] text-[#525C4E]">{m.label}</span>
                <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk indicators */}
        <div className="flex-1 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[6px] flex items-center justify-center bg-[#FFDAD6]">
              <IconAlertTriangle className="size-4 text-[#8F0004]" />
            </div>
            <h3 className="flex-1 text-[16px] leading-[24px] font-bold text-[#161D14]">Risk indicators</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {riskIndicators.map((r) => (
              <div key={r.label} className="w-[250px] p-3 bg-[#F7FAF6] rounded-[8px] flex flex-col gap-3">
                <span className="text-[12px] leading-[18px] text-[#525C4E]">{r.label}</span>
                <span className="text-[16px] leading-[24px] font-bold" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center h-[58px] border-b-2 border-[#E5E8DF]">
        <button
          onClick={() => setActiveTab("summary")}
          className={cn(
            "flex items-center gap-2 px-6 h-full border-b-2 -mb-[2px] transition-colors text-[16px] leading-[24px]",
            activeTab === "summary" ? "text-[#1A5514] font-bold border-[#306B28]" : "text-[#161D14] font-normal border-[#E5E8DF]"
          )}
        >
          <IconPackage className="size-5" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab("lots")}
          className={cn(
            "flex items-center gap-2 px-3 h-full border-b-2 -mb-[2px] transition-colors text-[16px] leading-[24px]",
            activeTab === "lots" ? "text-[#1A5514] font-bold border-[#306B28]" : "text-[#161D14] font-normal border-[#E5E8DF]"
          )}
        >
          <IconCircleDot className="size-5" />
          All Lots
        </button>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] overflow-hidden">
        {/* Table filters */}
        <div className="flex items-center gap-3 px-6 py-4">
          <FilterDropdown label="All region" options={regionOptions} value={regionFilter} onChange={setRegionFilter} allLabel="All region" />
          <FilterDropdown label="All commodities" options={commodityOptions} value={tableCommodityFilter} onChange={setTableCommodityFilter} allLabel="All commodities" />
          <FilterDropdown label="All status" options={statusOptions} value={statusFilter} onChange={setStatusFilter} allLabel="All status" />
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] leading-[18px] font-bold text-[#525C4E] border-b border-[#E5E8DF]">
              <th className="px-6 py-3 font-bold">Aggregator</th>
              <th className="px-3 py-3 font-bold">Commodity</th>
              <th className="px-3 py-3 font-bold">Stock</th>
              <th className="px-3 py-3 font-bold">Capacity</th>
              <th className="px-3 py-3 font-bold">Utilization</th>
              <th className="px-3 py-3 font-bold">Reserved</th>
              <th className="px-3 py-3 font-bold">Trend</th>
              <th className="px-3 py-3 font-bold">Lot</th>
              <th className="px-3 py-3 font-bold">Last receipt</th>
              <th className="px-3 py-3 font-bold">Status</th>
              <th className="px-3 py-3 font-bold w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, i) => {
              const stockColor = row.status === "Critical" ? "#BA1A1A" : row.status === "Low" ? "#995917" : "#1A5514"
              return (
                <tr
                  key={i}
                  className="border-b border-[#E5E8DF] hover:bg-[#F7FAF6] cursor-pointer transition-colors"
                  onClick={() => setDetailOpen(true)}
                >
                  <td className="px-6 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.aggregator}</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.commodity}</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] font-bold" style={{ color: stockColor }}>{row.stock} MT</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.stockCapacity} / {row.capacityTotal} MT</td>
                  <td className="px-3 py-4"><UtilizationBar percent={row.utilization} /></td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.reserved} MT</td>
                  <td className="px-3 py-4"><TrendValue value={row.trend} /></td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.lot}</td>
                  <td className="px-3 py-4 text-[14px] leading-[20px] text-[#161D14]">{row.lastReceipt}</td>
                  <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                    <RowActions
                      onAdjust={() => setActiveModal({ type: "adjust", rowIndex: i })}
                      onTransfer={() => setActiveModal({ type: "transfer", rowIndex: i })}
                      onReorder={() => setActiveModal({ type: "reorder", rowIndex: i })}
                    />
                  </td>
                </tr>
              )
            })}
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
      <InventoryDetailSheet
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        detail={aggregatorDetail}
        onAdjust={() => { setDetailOpen(false); setActiveModal({ type: "adjust", rowIndex: 0 }) }}
        onTransfer={() => { setDetailOpen(false); setActiveModal({ type: "transfer", rowIndex: 0 }) }}
      />

      {/* Modals */}
      <AdjustmentModal
        open={activeModal?.type === "adjust"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        row={activeRow}
        onSubmit={() => setActiveModal(null)}
      />
      <TransferModal
        open={activeModal?.type === "transfer"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        row={activeRow}
        onSubmit={() => setActiveModal(null)}
      />
      <ReorderModal
        open={activeModal?.type === "reorder"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        row={activeRow}
        onSubmit={() => setActiveModal(null)}
      />
    </div>
  )
}
