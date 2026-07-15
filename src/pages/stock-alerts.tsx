import { useState } from "react"
import {
  IconChevronDown,
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleOff,
  IconUrgent,
  IconSend,
  IconCalendar,
  IconUsers,
  IconSearch,
  IconCheck,
  IconSettings,
} from "@tabler/icons-react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { FormField, FormSelect, FormTextarea, FormInput } from "@/components/ui/form-fields"

// ── Types ──

type AlertSeverity = "Critical" | "Low stock" | "Out of stock"

type StockAlertRow = {
  id: string
  commodity: string
  severity: AlertSeverity
  currentStock: number
  threshold: number
  daysSupply: number
  suggestedReorder: number
  lastReceipt: string
  thresholdPercent: number
}

// ── Static data ──

const alertSummary = [
  { label: "Critical", value: "8", sub: "Operations team notified", icon: IconAlertCircle, iconBg: "#FFDAD6", iconColor: "#BA1A1A", borderColor: "#FFDAD6" },
  { label: "Low stock", value: "12", sub: "+3  since yesterday", subHighlight: "+3", icon: IconAlertTriangle, iconBg: "#FEF0D8", iconColor: "#995917", borderColor: "#FEF0D8" },
  { label: "Out of stock", value: "2", sub: "Rice WH-005 \u2022 Maize WH-002", icon: IconCircleOff, iconBg: "#FFDAD6", iconColor: "#BA1A1A", borderColor: "#FFDAD6" },
  { label: "Escalated alerts", value: "4", sub: "In progress with team", icon: IconUrgent, iconBg: "#FEF0D8", iconColor: "#995917", borderColor: "#FEF0D8" },
]

const alertRows: StockAlertRow[] = [
  { id: "1", commodity: "Cassava", severity: "Critical", currentStock: 18, threshold: 25, daysSupply: 7, suggestedReorder: 100, lastReceipt: "2026-05-19", thresholdPercent: 72 },
  { id: "2", commodity: "Cocos", severity: "Low stock", currentStock: 18, threshold: 25, daysSupply: 7, suggestedReorder: 100, lastReceipt: "2026-05-19", thresholdPercent: 90 },
  { id: "3", commodity: "Soyabean", severity: "Out of stock", currentStock: 18, threshold: 25, daysSupply: 7, suggestedReorder: 100, lastReceipt: "2026-05-19", thresholdPercent: 72 },
  { id: "4", commodity: "Cassava", severity: "Critical", currentStock: 18, threshold: 25, daysSupply: 7, suggestedReorder: 100, lastReceipt: "2026-05-19", thresholdPercent: 72 },
  { id: "5", commodity: "Cocos", severity: "Low stock", currentStock: 18, threshold: 25, daysSupply: 7, suggestedReorder: 100, lastReceipt: "2026-05-19", thresholdPercent: 90 },
]

// ── Subcomponents ──

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const styles: Record<AlertSeverity, { bg: string; color: string }> = {
    Critical: { bg: "#FFDAD6", color: "#BA1A1A" },
    "Low stock": { bg: "#D4F5D0", color: "#1A5514" },
    "Out of stock": { bg: "#FFDAD6", color: "#BA1A1A" },
  }
  const s = styles[severity]
  return (
    <span className="text-[12px] leading-[18px] px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
      {severity}
    </span>
  )
}

function SeverityIcon({ severity }: { severity: AlertSeverity }) {
  const config: Record<AlertSeverity, { bg: string; color: string; icon: typeof IconAlertCircle }> = {
    Critical: { bg: "#FFDAD6", color: "#BA1A1A", icon: IconAlertCircle },
    "Low stock": { bg: "#FEF0D8", color: "#995917", icon: IconAlertTriangle },
    "Out of stock": { bg: "#FFDAD6", color: "#BA1A1A", icon: IconCircleOff },
  }
  const c = config[severity]
  const Icon = c.icon
  return (
    <div className="size-10 rounded-full flex items-center justify-center" style={{ background: c.bg }}>
      <Icon className="size-5" style={{ color: c.color }} />
    </div>
  )
}

function ThresholdBar({ percent, severity }: { percent: number; severity: AlertSeverity }) {
  const barColor = severity === "Low stock" ? "#995917" : "#BA1A1A"
  return (
    <div className="flex flex-col gap-1">
      <div className="w-[120px] h-[6px] bg-[#E5E8DF] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: barColor }} />
      </div>
      <span className="text-[12px] leading-[18px] font-medium" style={{ color: barColor }}>{percent}% of threshold</span>
    </div>
  )
}

// ── Modals ──

function EscalateAlertModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { escalateTo: string; notes: string }) => void
}) {
  const [escalateTo, setEscalateTo] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ escalateTo, notes })
    setEscalateTo(""); setNotes("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Escalate Alert" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Escalate Stock Alert</h2>
              <FormField label="Escalate to">
                <FormSelect value={escalateTo} onChange={(e) => setEscalateTo(e.target.value)}>
                  <option value="">Select team / person</option>
                  <option value="operations-lead">Operations Lead</option>
                  <option value="procurement-team">Procurement Team</option>
                  <option value="warehouse-manager">Warehouse Manager</option>
                  <option value="coo">COO</option>
                </FormSelect>
              </FormField>
              <FormField label="Notes">
                <FormTextarea placeholder="Provide context for the escalation..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconSend className="size-5" />
              Escalate
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function ThresholdSettingsModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}) {
  const [commodity, setCommodity] = useState("")
  const [criticalThreshold, setCriticalThreshold] = useState("")
  const [lowThreshold, setLowThreshold] = useState("")
  const [reorderQty, setReorderQty] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
    setCommodity(""); setCriticalThreshold(""); setLowThreshold(""); setReorderQty("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Threshold Settings" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Stock Threshold Configuration</h2>
              <FormField label="Commodity">
                <FormSelect value={commodity} onChange={(e) => setCommodity(e.target.value)}>
                  <option value="">Select commodity</option>
                  <option value="all">All commodities</option>
                  <option value="Cassava">Cassava</option>
                  <option value="Cocoa">Cocoa</option>
                  <option value="Maize">Maize</option>
                  <option value="Rice">Rice</option>
                  <option value="Soyabean">Soyabean</option>
                </FormSelect>
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Critical threshold (MT)">
                  <FormInput type="number" step="1" placeholder="e.g. 10" value={criticalThreshold} onChange={(e) => setCriticalThreshold(e.target.value)} />
                </FormField>
                <FormField label="Low stock threshold (MT)">
                  <FormInput type="number" step="1" placeholder="e.g. 25" value={lowThreshold} onChange={(e) => setLowThreshold(e.target.value)} />
                </FormField>
              </div>
              <FormField label="Default reorder quantity (MT)">
                <FormInput type="number" step="1" placeholder="e.g. 100" value={reorderQty} onChange={(e) => setReorderQty(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconCheck className="size-5" />
              Save Settings
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// ── Main page ──

export function StockAlertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<AlertSeverity | "all">("all")
  const [activeModal, setActiveModal] = useState<"escalate" | "threshold" | null>(null)
  const [_escalatingId, setEscalatingId] = useState<string | null>(null)

  const filteredRows = alertRows.filter((row) => {
    const matchesSearch = searchQuery === "" ||
      row.commodity.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || row.severity === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Quick actions */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF]">
        <Button variant="secondary" size="sm">
          <IconSend className="size-4" />
          Escalate critical
        </Button>
        <Button variant="secondary" size="sm">
          <IconSettings className="size-4" />
          Resolve Operational issue
        </Button>
      </div>

      {/* 4 Summary Cards */}
      <div className="flex gap-4">
        {alertSummary.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="flex-1 min-w-0 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 flex flex-col gap-2"
              style={{ outlineColor: card.borderColor }}
            >
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-[8px] flex items-center justify-center" style={{ background: card.iconBg }}>
                  <Icon className="size-4" style={{ color: card.iconColor }} />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#525C4E]">{card.label}</span>
              </div>
              <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
              <p className="text-[12px] leading-[18px] text-[#525C4E]">
                {card.subHighlight ? (
                  <>
                    <span className="text-[#1A5514] font-bold">{card.subHighlight}</span>
                    {card.sub.replace(card.subHighlight, "")}
                  </>
                ) : (
                  card.sub
                )}
              </p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 h-9 px-3 py-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
          <IconCalendar className="size-4 text-[#161D14]" />
          All time
          <IconChevronDown className="size-4 text-[#161D14]" />
        </button>
        <div className="relative">
          <button
            onClick={() => setStatusFilter(statusFilter === "all" ? "Critical" : "all")}
            className="flex items-center gap-2 h-9 px-3 py-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#E1E4DA] transition-colors"
          >
            <IconUsers className="size-4 text-[#161D14]" />
            {statusFilter === "all" ? "All status" : statusFilter}
            <IconChevronDown className="size-4 text-[#161D14]" />
          </button>
        </div>
        <div className="flex items-center gap-2 h-9 px-3 rounded-full bg-[#EDF0E6]">
          <IconSearch className="size-4 text-[#525C4E]" />
          <input
            type="text"
            placeholder="Search commodities..."
            className="bg-transparent text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] outline-none w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Alert cards */}
      <div className="flex flex-col gap-3">
        {filteredRows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF]">
            <IconAlertTriangle className="size-8 text-[#C3C8BC]" />
            <p className="text-[16px] leading-[24px] font-bold text-[#161D14]">No alerts found</p>
            <p className="text-[14px] leading-[20px] text-[#525C4E]">
              {searchQuery ? "Try adjusting your search or filters." : "All stock levels are within safe thresholds."}
            </p>
          </div>
        ) : (
          filteredRows.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] p-5 flex items-center gap-4"
            >
              <SeverityIcon severity={row.severity} />
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{row.commodity}</span>
                  <SeverityBadge severity={row.severity} />
                </div>
                <div className="flex items-center gap-6 text-[14px] leading-[20px] text-[#525C4E]">
                  <span>Current: <span className="font-bold text-[#161D14]">{row.currentStock} MT</span></span>
                  <span>Threshold: <span className="font-bold text-[#161D14]">{row.threshold} MT</span></span>
                  <span>Days supply: <span className="font-bold text-[#161D14]">{row.daysSupply} d</span></span>
                  <span>Suggested reorder: <span className="font-bold text-[#161D14]">{row.suggestedReorder} MT</span></span>
                  <span>Last receipt: <span className="font-bold text-[#161D14]">{row.lastReceipt}</span></span>
                </div>
                <ThresholdBar percent={row.thresholdPercent} severity={row.severity} />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setEscalatingId(row.id); setActiveModal("escalate") }}
              >
                <IconSend className="size-4" />
                Escalate
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <EscalateAlertModal
        open={activeModal === "escalate"}
        onOpenChange={(open) => { if (!open) { setActiveModal(null); setEscalatingId(null) } }}
        onSubmit={() => { setActiveModal(null); setEscalatingId(null) }}
      />
      <ThresholdSettingsModal
        open={activeModal === "threshold"}
        onOpenChange={(open) => { if (!open) setActiveModal(null) }}
        onSubmit={() => setActiveModal(null)}
      />
    </div>
  )
}
