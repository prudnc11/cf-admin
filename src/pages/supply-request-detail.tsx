import { useState, Fragment } from "react"
import type { SupplyRequest } from "./supply-requests"
import { supplyBids } from "./supply-bids"
import type { SupplyBid } from "./supply-bids"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import {
  IconCheck,
  IconChevronUp,
  IconChevronDown,
  IconChevronRight,
  IconX,
  IconUser,
  IconCalendar,
  IconPackage,
  IconPlant,
  IconCash,
  IconFileText,
  IconMapPin,
  IconClipboardCheck,
  IconDownload,
  IconListDetails,
  IconTimeline,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react"

// --- Sub-Components ---

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

function CollapsibleSection({ title, children, defaultOpen = true, badge }: { title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: string }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-5 py-4 hover:bg-[#F7FAF6] transition-colors">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">{title}</h3>
          {badge && (
            <span className="inline-flex items-center justify-center px-1.5 py-px rounded-full bg-[#0063EA] text-white text-[12px] leading-[18px] font-normal min-w-[18px]">
              {badge}
            </span>
          )}
        </div>
        {open ? <IconChevronUp className="size-5 text-[#525C4E]" /> : <IconChevronDown className="size-5 text-[#525C4E]" />}
      </button>
      {open && <div className="flex flex-col px-5 pb-5 border-t border-[#E5E8DF]">{children}</div>}
    </div>
  )
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-start">
      <span className="w-[269px] shrink-0 py-3 text-[16px] leading-[24px] font-normal text-[#525C4E]">{label}</span>
      <span className="flex-1 py-3 text-[16px] leading-[24px] font-normal" style={{ color: valueColor || "#161D14" }}>{value}</span>
    </div>
  )
}

function statusLabel(s: string): string {
  switch (s) {
    case "draft": return "Draft"
    case "pending-receipt": return "Pending Receipt"
    case "received": return "Received"
    case "active": return "Active"
    case "in-progress": return "In Progress"
    case "completed": return "Completed"
    case "cancelled": return "Cancelled"
    case "rejected": return "Rejected"
    default: return s
  }
}

function statusColor(s: string): "green" | "blue" | "red" | "warning" {
  switch (s) {
    case "active": case "completed": return "green"
    case "in-progress": case "received": return "blue"
    case "rejected": case "cancelled": return "red"
    default: return "warning"
  }
}

// Status lifecycle stepper
function StatusStepper({ status }: { status: string }) {
  const steps = [
    { key: "draft", label: "Draft" },
    { key: "pending-receipt", label: "Pending Receipt" },
    { key: "received", label: "Received" },
    { key: "active", label: "Active" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ]
  const rejected = status === "rejected" || status === "cancelled"
  const idx = steps.findIndex(s => s.key === status)

  return (
    <div className="inline-flex flex-col items-start gap-[16px] px-[2px] py-[16px] bg-white rounded-[12px] w-full">
      <div className="self-stretch flex flex-col items-start gap-[20px] py-[4px]">
        <div className="self-stretch inline-flex items-center">
          {steps.map((step, i) => (
            <Fragment key={step.key}>
              <div className="w-[80px] inline-flex flex-col items-center gap-[8px]">
                {rejected && i === idx ? (
                  <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#FEE2E2]">
                    <IconX className="size-[16px] text-[#DC2626]" />
                  </div>
                ) : i < idx || (i === idx && !rejected) ? (
                  <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#C9F0D6]">
                    <IconCheck className="size-[16px] text-[#00572D]" />
                  </div>
                ) : i === idx ? (
                  <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#D5E6FD]">
                    <IconCheck className="size-[16px] text-[#00439E]" />
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] outline outline-[1.4px] -outline-offset-[1.4px] outline-[#C3C8BC]">
                    <div className="size-[16px] opacity-0" />
                  </div>
                )}
                <span
                  className="text-center text-[12px] leading-[18px] font-normal"
                  style={{
                    color: rejected && i === idx ? "#DC2626"
                      : i < idx ? "#008744"
                      : i === idx ? "#0063EA"
                      : "#525C4E"
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex-[1_1_0] h-[4px] rounded-[1000px]"
                  style={{ background: i < idx ? "#36B92E" : "#E1E4DA" }}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function bidStageLabel(s: string): string {
  switch (s) {
    case "submitted": return "Submitted"
    case "negotiation": return "Negotiation"
    case "scheduling": return "Scheduling"
    case "field-qa": return "Field QA"
    case "warehouse-qa": return "Warehouse QA"
    case "finance": return "Finance"
    case "grn": return "GRN"
    case "routing": return "Routing"
    case "completed": return "Completed"
    case "rejected": return "Rejected"
    default: return s
  }
}

function bidStageColor(s: string): "green" | "blue" | "red" | "warning" {
  switch (s) {
    case "completed": case "routing": return "green"
    case "scheduling": case "grn": case "finance": return "blue"
    case "rejected": return "red"
    default: return "warning"
  }
}

// --- Aggregator Options (from aggregator-management mock data, active only) ---

const aggregatorOptions = [
  { name: "Bismark Amoateng", region: "Kumasi", tier: "PLATINUM" },
  { name: "Sophia Bennett", region: "Greater Accra", tier: "PLATINUM" },
  { name: "Noah Thompson", region: "Greater Accra", tier: "PLATINUM" },
  { name: "Lucas Harrington", region: "Volta", tier: "PLATINUM" },
  { name: "Emma Johnson", region: "Volta", tier: "PLATINUM" },
  { name: "Oliver Davis", region: "Volta", tier: "PLATINUM" },
  { name: "Ava Wilson", region: "Kumasi", tier: "PLATINUM" },
  { name: "Tetteh Cooperative", region: "Volta Region", tier: "GOLD" },
  { name: "Wa Agric Group", region: "Upper West Region", tier: "SILVER" },
  { name: "Kumasi Farmers", region: "Ashanti Region", tier: "GOLD" },
  { name: "Sefwi Growers", region: "Western North Region", tier: "SILVER" },
  { name: "Ejura Cooperative", region: "Ashanti Region", tier: "GOLD" },
]

const tierColors: Record<string, { bg: string; text: string }> = {
  PLATINUM: { bg: "#E2D1FD", text: "#7925CC" },
  GOLD: { bg: "#FEF0D8", text: "#995917" },
  SILVER: { bg: "white", text: "#525C4E" },
  BRONZE: { bg: "#D5E6FD", text: "#00439E" },
}

// --- Assign Bid Modal ---

function AssignBidModal({
  open,
  onClose,
  onSubmit,
  request,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    aggregator: string
    quantity: string
    unit: string
    pricePerUnit: string
    deliveryMethod: "field-visit" | "warehouse-visit"
    region: string
    warehouse: string
  }) => void
  request: SupplyRequest
}) {
  const [aggregator, setAggregator] = useState("")
  const [search, setSearch] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState(request.unit)
  const [pricePerUnit, setPricePerUnit] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<"field-visit" | "warehouse-visit">("field-visit")
  const [region, setRegion] = useState(request.region)
  const [warehouse, setWarehouse] = useState("")

  const filteredAggregators = aggregatorOptions.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.region.toLowerCase().includes(search.toLowerCase())
  )

  const canSubmit = aggregator && quantity && pricePerUnit && warehouse

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ aggregator, quantity, unit, pricePerUnit, deliveryMethod, region, warehouse })
    setAggregator(""); setSearch(""); setQuantity(""); setPricePerUnit(""); setWarehouse("")
  }

  const inputClass = "w-full h-10 px-3 rounded-lg outline outline-1 outline-[#E5E8DF] bg-white text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] focus:outline-[#36B92E]"
  const labelClass = "text-[14px] leading-[20px] font-bold text-[#161D14]"

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Assign Bid to Aggregator" onClose={onClose} />
          <ModalBody>
            <div className="flex flex-col gap-4 pb-2">
              {/* Request context */}
              <div className="p-3 rounded-[12px] bg-[#F7FAF6] flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-full bg-[#235C4B] shrink-0">
                  <span className="text-[14px] leading-[20px] font-bold text-[#CEFFEB]">{request.crop.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{request.crop} • {request.id}</span>
                  <p className="text-[12px] leading-[18px] text-[#525C4E]">{request.variety} • {request.quantity} {request.unit} • {request.region}</p>
                </div>
              </div>

              {/* Aggregator selection */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Select Aggregator *</label>
                {aggregator ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#D4F5D0] outline outline-1 outline-[#36B92E]">
                    <div className="flex items-center justify-center size-7 rounded-full bg-[#235C4B] shrink-0">
                      <span className="text-[12px] font-bold text-[#CEFFEB]">{aggregator.charAt(0)}</span>
                    </div>
                    <span className="flex-1 text-[14px] leading-[20px] font-bold text-[#161D14]">{aggregator}</span>
                    <button type="button" onClick={() => setAggregator("")} className="text-[#525C4E] hover:text-[#DC2626]">
                      <IconX className="size-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#525C4E] pointer-events-none" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or region..."
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                    <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto rounded-lg outline outline-1 outline-[#E5E8DF]">
                      {filteredAggregators.map((a) => {
                        const tc = tierColors[a.tier] || tierColors.SILVER
                        return (
                          <button
                            key={a.name}
                            type="button"
                            onClick={() => { setAggregator(a.name); setSearch("") }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-[#F7FAF6] transition-colors text-left"
                          >
                            <div className="flex items-center justify-center size-7 rounded-full bg-[#235C4B] shrink-0">
                              <span className="text-[12px] font-bold text-[#CEFFEB]">{a.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1 flex flex-col">
                              <span className="text-[13px] leading-[18px] font-bold text-[#161D14]">{a.name}</span>
                              <span className="text-[11px] leading-[16px] text-[#525C4E]">{a.region}</span>
                            </div>
                            <span className="px-1.5 py-px rounded-[4px] text-[10px] leading-[14px] font-bold" style={{ background: tc.bg, color: tc.text }}>
                              {a.tier}
                            </span>
                          </button>
                        )
                      })}
                      {filteredAggregators.length === 0 && (
                        <p className="px-3 py-3 text-[13px] text-[#525C4E] text-center">No aggregators found</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Quantity *</label>
                  <div className="flex">
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className={`${inputClass} rounded-r-none`} />
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-10 px-2 rounded-r-lg outline outline-1 outline-[#E5E8DF] bg-[#EDF0E6] text-[13px] text-[#525C4E]">
                      <option value="MT">MT</option>
                      <option value="KG">KG</option>
                      <option value="Bags">Bags</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Price per Unit *</label>
                  <div className="flex">
                    <span className="h-10 px-3 flex items-center rounded-l-lg bg-[#EDF0E6] outline outline-1 outline-[#E5E8DF] text-[13px] text-[#525C4E]">GHS</span>
                    <input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} placeholder="0" className={`${inputClass} rounded-l-none`} />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Delivery Method</label>
                <div className="flex items-center gap-3">
                  {([["field-visit", "Field Visit"], ["warehouse-visit", "Warehouse Visit"]] as const).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDeliveryMethod(val)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] border text-[14px] leading-[20px] transition-colors ${
                        deliveryMethod === val
                          ? "border-[#36B92E] bg-[#D4F5D0] font-bold text-[#1A5514]"
                          : "border-[#C3C8BC] bg-white text-[#525C4E] hover:border-[#8B9185]"
                      }`}
                    >
                      <div className={`size-4 rounded-full border-2 flex items-center justify-center ${deliveryMethod === val ? "border-[#36B92E]" : "border-[#C3C8BC]"}`}>
                        {deliveryMethod === val && <div className="size-2 rounded-full bg-[#36B92E]" />}
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region & Warehouse */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
                    {["Volta Region", "Ashanti Region", "Brong-Ahafo Region", "Northern Region", "Upper East Region", "Upper West Region", "Eastern Region", "Bono Region", "Bono East Region", "Western North Region", "Greater Accra Region", "Central Region"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Warehouse *</label>
                  <input value={warehouse} onChange={(e) => setWarehouse(e.target.value)} placeholder="e.g. Hohoe Warehouse" className={inputClass} />
                </div>
              </div>

              {/* Summary preview */}
              {canSubmit && (
                <div className="p-3 rounded-[12px] bg-[#F7FAF6] border border-[#E5E8DF] flex flex-col gap-1">
                  <span className="text-[12px] leading-[18px] font-bold text-[#525C4E] uppercase tracking-wide">Bid Preview</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#525C4E]">Aggregator</span>
                    <span className="text-[13px] font-bold text-[#161D14]">{aggregator}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#525C4E]">Quantity</span>
                    <span className="text-[13px] font-bold text-[#161D14]">{quantity} {unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#525C4E]">Price</span>
                    <span className="text-[13px] font-bold text-[#161D14]">GHS {Number(pricePerUnit).toLocaleString()}/{unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#525C4E]">Total Value</span>
                    <span className="text-[13px] font-bold text-[#36B92E]">GHS {(Number(quantity) * Number(pricePerUnit)).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!canSubmit}>
              <IconPlus className="size-4" />
              Assign Bid
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- Linked Bid Card ---

function LinkedBidCard({ bid, index }: { bid: SupplyBid; index: number }) {
  return (
    <div
      className="p-4 rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 hover:outline-[#36B92E] transition-colors stagger-child"
      style={{ "--stagger-index": index } as React.CSSProperties}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center size-8 rounded-full bg-[#235C4B] shrink-0">
          <span className="text-[14px] leading-[20px] font-bold text-[#CEFFEB]">{bid.aggregator.charAt(0)}</span>
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{bid.id}</span>
            <StatusBadge label={bidStageLabel(bid.stage)} color={bidStageColor(bid.stage)} />
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]" style={{ background: bid.deliveryMethod === "field-visit" ? "#E2D1FD" : "#D5E6FD" }}>
              <span className="size-[5px] rounded-full" style={{ background: bid.deliveryMethod === "field-visit" ? "#7925CC" : "#00439E" }} />
              <span className="text-[12px] leading-[18px] font-normal" style={{ color: bid.deliveryMethod === "field-visit" ? "#7925CC" : "#00439E" }}>
                {bid.deliveryMethod === "field-visit" ? "Field Visit" : "Warehouse Visit"}
              </span>
            </span>
          </div>
          <p className="text-[12px] leading-[18px] text-[#525C4E]">
            {bid.aggregator} • {bid.quantity} {bid.unit} • {bid.pricePerUnit}
          </p>
        </div>
        <span className="text-[14px] leading-[20px] font-bold text-[#36B92E]">{bid.totalValue}</span>
      </div>
    </div>
  )
}

// --- Main Component ---

export function SupplyRequestDetailPage({
  onBack,
  request,
  onAction,
  onAssignBid,
}: {
  onBack: () => void
  request: SupplyRequest
  onAction?: (action: string, req: SupplyRequest) => void
  onAssignBid?: (data: { aggregator: string; quantity: string; unit: string; pricePerUnit: string; deliveryMethod: "field-visit" | "warehouse-visit"; region: string; warehouse: string }, request: SupplyRequest) => void
}) {
  const linkedBids = supplyBids.filter(b => b.supplyRequestId === request.id)
  const activeBids = linkedBids.filter(b => b.stage !== "rejected" && b.stage !== "completed")
  const completedBids = linkedBids.filter(b => b.stage === "completed")
  const totalBidQty = linkedBids.reduce((sum, b) => sum + parseFloat(b.quantity), 0)

  const [activeTab, setActiveTab] = useState<"details" | "audit">("details")
  const [showAssignBidModal, setShowAssignBidModal] = useState(false)

  const primaryBtnClass = "inline-flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[8px] bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
  const outlineBtnClass = "inline-flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[8px] outline outline-1 outline-[#E5E8DF] text-[#161D14] text-[14px] leading-[20px] font-bold hover:bg-[#F7FAF6] transition-colors"
  const dangerBtnClass = "inline-flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[8px] outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[14px] leading-[20px] font-bold hover:bg-[#FEE2E2] transition-colors"

  return (
    <div className="flex flex-col animate-fade-in-up">
      {/* Detail Header */}
      <div className="inline-flex justify-between items-start px-[40px] py-[16px] bg-white border-b border-[#E5E8DF] -mx-[40px]">
        {/* Left: Breadcrumb + Title */}
        <div className="inline-flex flex-col items-start gap-[4px]">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-[2px] py-[4px]">
            <button onClick={onBack} className="flex items-center gap-[2px] h-[22px] text-[16px] leading-[24px] font-bold text-[#36B92E] hover:text-[#2DA526] transition-colors">
              Supply Requests
            </button>
            <div className="w-[20px] h-[20px] flex items-center justify-center">
              <IconChevronRight className="size-[20px] text-[#73796E]" />
            </div>
            <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">Request details</span>
          </div>
          {/* Title + Badges */}
          <div className="inline-flex items-center gap-[4px]">
            <h1 className="text-[28px] leading-[36px] font-bold text-[#161D14]">
              {request.crop} • {request.id}
            </h1>
            <div className="flex items-start gap-[12px]">
              <StatusBadge label={statusLabel(request.status)} color={statusColor(request.status)} />
              {request.linkedBids > 0 && (
                <span className="inline-flex items-center gap-1 px-[6px] py-[2px] rounded-[6px] bg-[#D5E6FD]">
                  <span className="text-[12px] leading-[18px] font-bold text-[#00439E]">{request.linkedBids} bids</span>
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Right: Action buttons */}
        <div className="flex items-center gap-[16px]">
          <button className={outlineBtnClass}>
            <IconDownload className="size-[16px]" />
            Export
          </button>
          {request.status === "draft" && (
            <button onClick={() => onAction?.("submit", request)} className={primaryBtnClass}>
              Submit for Review
            </button>
          )}
          {request.status === "pending-receipt" && (
            <>
              <button onClick={() => onAction?.("return", request)} className={dangerBtnClass}>
                Return
              </button>
              <button onClick={() => onAction?.("receive", request)} className={primaryBtnClass}>
                <IconCheck className="size-[16px]" />
                Receive
              </button>
            </>
          )}
          {request.status === "received" && (
            <>
              <button onClick={() => onAction?.("reject", request)} className={dangerBtnClass}>
                <IconX className="size-[16px]" />
                Reject
              </button>
              <button onClick={() => onAction?.("activate", request)} className={primaryBtnClass}>
                <IconCheck className="size-[16px]" />
                Activate
              </button>
            </>
          )}
          {(request.status === "active" || request.status === "in-progress") && (
            <button onClick={() => setShowAssignBidModal(true)} className={primaryBtnClass}>
              <IconPlus className="size-[16px]" />
              Assign Bid
            </button>
          )}
        </div>
      </div>

      {/* Status Stepper */}
      <StatusStepper status={request.status} />

      {/* Tab Bar */}
      <div className="flex items-center border-b border-[#E5E8DF] mb-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-1.5 px-4 py-3 text-[14px] leading-[20px] font-bold transition-colors relative ${
            activeTab === "details" ? "text-[#36B92E]" : "text-[#525C4E] hover:text-[#161D14]"
          }`}
        >
          <IconListDetails className="size-4" />
          Request details
          {activeTab === "details" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36B92E] rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-1.5 px-4 py-3 text-[14px] leading-[20px] font-bold transition-colors relative ${
            activeTab === "audit" ? "text-[#36B92E]" : "text-[#525C4E] hover:text-[#161D14]"
          }`}
        >
          <IconTimeline className="size-4" />
          Audit trail
          {activeTab === "audit" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36B92E] rounded-t-full" />}
        </button>
      </div>

      {/* Content Area with vertical separator */}
      <div className="flex gap-0">
        {/* Left Column */}
        <div className="flex-1 pr-8 flex flex-col gap-4">
          {activeTab === "details" ? (
            <>
              {/* 1. Request Details */}
              <CollapsibleSection title="Request Details">
                <InfoRow label="Crop" value={request.crop} />
                <InfoRow label="Variety" value={request.variety} />
                <InfoRow label="Quantity" value={`${request.quantity} ${request.unit}`} />
                <InfoRow label="Region" value={request.region} />
                <InfoRow label="Budget" value={request.budget} />
                <InfoRow label="Aggregation Window" value={request.aggregationWindow} />
                {request.notes && <InfoRow label="Notes" value={request.notes} />}
              </CollapsibleSection>

              {/* 2. Linked Bids */}
              <CollapsibleSection title="Linked Bids" badge={String(linkedBids.length)} defaultOpen={linkedBids.length > 0}>
                {linkedBids.length > 0 ? (
                  <div className="flex flex-col gap-3 py-3">
                    {/* Bid Summary Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-2">
                      <div className="p-3 rounded-[8px] bg-[#F7FAF6] flex flex-col gap-1">
                        <span className="text-[12px] leading-[18px] text-[#525C4E]">Total Bids</span>
                        <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{linkedBids.length}</span>
                      </div>
                      <div className="p-3 rounded-[8px] bg-[#F7FAF6] flex flex-col gap-1">
                        <span className="text-[12px] leading-[18px] text-[#525C4E]">Active</span>
                        <span className="text-[16px] leading-[24px] font-bold text-[#36B92E]">{activeBids.length}</span>
                      </div>
                      <div className="p-3 rounded-[8px] bg-[#F7FAF6] flex flex-col gap-1">
                        <span className="text-[12px] leading-[18px] text-[#525C4E]">Total Qty</span>
                        <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{totalBidQty} MT</span>
                      </div>
                      <div className="p-3 rounded-[8px] bg-[#F7FAF6] flex flex-col gap-1">
                        <span className="text-[12px] leading-[18px] text-[#525C4E]">Completed</span>
                        <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{completedBids.length}</span>
                      </div>
                    </div>

                    {/* Bid Cards */}
                    {linkedBids.map((bid, i) => (
                      <LinkedBidCard key={bid.id} bid={bid} index={i} />
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-[14px] leading-[20px] text-[#525C4E]">
                    {request.status === "active" ? "No bids received yet. Awaiting aggregator submissions." : "No bids linked to this request."}
                  </p>
                )}
              </CollapsibleSection>

              {/* 3. Fulfilment Progress (for active/in-progress) */}
              {(request.status === "active" || request.status === "in-progress" || request.status === "completed") && (
                <CollapsibleSection title="Fulfilment Progress" defaultOpen={false}>
                  <div className="py-3">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[14px] leading-[20px] text-[#525C4E]">Target Quantity</span>
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{request.quantity} {request.unit}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[14px] leading-[20px] text-[#525C4E]">Bid Quantity</span>
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{totalBidQty} MT</span>
                    </div>
                    <div className="w-full h-3 bg-[#EDF0E6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#36B92E] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((totalBidQty / parseFloat(request.quantity)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] leading-[18px] text-[#525C4E] mt-1">
                      {Math.round((totalBidQty / parseFloat(request.quantity)) * 100)}% of target covered by bids
                    </span>
                  </div>
                </CollapsibleSection>
              )}
            </>
          ) : (
            /* Audit Trail Tab */
            <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <div className="px-5 py-4">
                <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Activity Log</h3>
              </div>
              <div className="flex flex-col gap-4 px-5 pb-5 border-t border-[#E5E8DF] pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center size-8 rounded-full bg-[#EDF0E6] shrink-0">
                    <IconFileText className="size-4 text-[#525C4E]" />
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Created</span>
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">{request.createdDate} by {request.createdBy}</span>
                  </div>
                </div>
                {request.receivedBy && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#D5E6FD] shrink-0">
                      <IconClipboardCheck className="size-4 text-[#00439E]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Received</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{request.receivedDate} by {request.receivedBy}</span>
                    </div>
                  </div>
                )}
                {request.approvedBy && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#C9F0D6] shrink-0">
                      <IconCheck className="size-4 text-[#00572D]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Approved & Activated</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{request.approvedDate} by {request.approvedBy}</span>
                    </div>
                  </div>
                )}
                {request.status === "rejected" && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#FEE2E2] shrink-0">
                      <IconX className="size-4 text-[#DC2626]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Rejected</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{request.notes || "No reason provided"}</span>
                    </div>
                  </div>
                )}
                {request.status === "cancelled" && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#FEE2E2] shrink-0">
                      <IconX className="size-4 text-[#DC2626]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Cancelled</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{request.notes || "No reason provided"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className="w-px bg-[#E5E8DF] shrink-0" />

        {/* Right Column - Summary */}
        <div className="w-[320px] shrink-0 pl-8">
          <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden sticky top-4">
            <div className="p-4 border-b border-[#E5E8DF]">
              <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Request Summary</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <IconFileText className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Request ID</span>
                <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{request.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconPlant className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Crop</span>
                <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{request.crop}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconPackage className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Variety</span>
                <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{request.variety}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconPackage className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Quantity</span>
                <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{request.quantity} {request.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMapPin className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Region</span>
                <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{request.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCalendar className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Window</span>
                <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14] text-right">{request.aggregationWindow}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconUser className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Created by</span>
                <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{request.createdBy}</span>
              </div>
              <div className="h-px bg-[#E5E8DF]" />
              <div className="flex items-center gap-2">
                <IconCash className="size-4 text-[#525C4E]" />
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Budget</span>
                <span className="ml-auto text-[16px] leading-[24px] font-bold text-[#36B92E]">{request.budget}</span>
              </div>
              {linkedBids.length > 0 && (
                <>
                  <div className="h-px bg-[#E5E8DF]" />
                  <div className="flex items-center gap-2">
                    <IconClipboardCheck className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Bids</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#00439E]">{linkedBids.length} linked</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Bid Modal */}
      <AssignBidModal
        open={showAssignBidModal}
        onClose={() => setShowAssignBidModal(false)}
        request={request}
        onSubmit={(data) => {
          onAssignBid?.(data, request)
          setShowAssignBidModal(false)
        }}
      />
    </div>
  )
}
