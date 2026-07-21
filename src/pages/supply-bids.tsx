import { useState, useEffect, Fragment } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconChevronLeft,
  IconChevronsLeft,
  IconChevronsRight,
  IconCalendar,
  IconUsers,
  IconWorld,
  IconFileText,
  IconClipboardCheck,
  IconClock,
  IconInbox,
  IconCash,
  IconRoute,
  IconX,
  IconCheck,
  IconMessages,
  IconLoader,
  IconCircleCheck,
} from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"
import { SupplyBidDetailPage } from "./supply-bid-detail"
import type { BidModalType } from "./supply-bid-detail"

// --- Types ---

export type BidStage = "submitted" | "negotiation" | "scheduling" | "field-qa" | "warehouse-qa" | "finance" | "grn" | "routing" | "completed" | "rejected"

export type DeliveryMethod = "field-visit" | "warehouse-visit"

export type NegotiationRound = {
  by: "admin" | "aggregator"
  price: string
  date: string
  note?: string
}

export type PipelineStep = {
  label: string
  status: "completed" | "current" | "pending" | "rejected"
}

export type SupplyBid = {
  id: string
  supplyRequestId: string
  aggregator: string
  crop: string
  variety: string
  quantity: string
  unit: string
  pricePerUnit: string
  totalValue: string
  deliveryMethod: DeliveryMethod
  stage: BidStage
  submittedDate: string
  pipeline: PipelineStep[]
  negotiations: NegotiationRound[]
  scheduledDate?: string
  scheduledVisitType?: string
  produceLabel?: "Local" | "Export" | "Both"
  qaResult?: "pass" | "fail" | "pending"
  financeStatus?: "awaiting-review" | "pending-proof" | "awaiting-signoff" | "signed-off" | "rejected"
  grnNumber?: string
  routingDestination?: string
  region: string
  warehouse: string
  aggregatorScore?: number
}

// --- Helpers ---

function makePipeline(activeIndex: number, rejected = false): PipelineStep[] {
  const labels = ["Bid Submitted", "Negotiation", "Scheduling", "QA", "Finance", "GRN", "Routing", "Completed"]
  return labels.map((label, i) => ({
    label,
    status: rejected && i === activeIndex ? "rejected" as const
      : i < activeIndex ? "completed" as const
      : i === activeIndex ? "current" as const
      : "pending" as const,
  }))
}

// --- Mock Data ---

export const supplyBids: SupplyBid[] = [
  {
    id: "BID-2026-001", supplyRequestId: "SR-2026-001", aggregator: "Tetteh Cooperative", crop: "Rice", variety: "Jasmine",
    quantity: "38", unit: "MT", pricePerUnit: "GHS 5,200/MT", totalValue: "GHS 197,600", deliveryMethod: "field-visit",
    stage: "submitted", submittedDate: "18 Jun 2026", pipeline: makePipeline(0),
    negotiations: [], region: "Volta Region", warehouse: "Hohoe Warehouse",
  },
  {
    id: "BID-2026-002", supplyRequestId: "SR-2026-001", aggregator: "Wa Agric Group", crop: "Rice", variety: "Jasmine",
    quantity: "50", unit: "MT", pricePerUnit: "GHS 5,400/MT", totalValue: "GHS 270,000", deliveryMethod: "warehouse-visit",
    stage: "submitted", submittedDate: "19 Jun 2026", pipeline: makePipeline(0),
    negotiations: [], region: "Upper West Region", warehouse: "Wa Central Depot",
  },
  {
    id: "BID-2026-003", supplyRequestId: "SR-2026-002", aggregator: "Kumasi Farmers", crop: "Cocoa", variety: "Amelonado",
    quantity: "45", unit: "MT", pricePerUnit: "GHS 16,000/MT", totalValue: "GHS 720,000", deliveryMethod: "field-visit",
    stage: "negotiation", submittedDate: "16 Jun 2026", pipeline: makePipeline(1),
    negotiations: [
      { by: "aggregator", price: "GHS 16,000/MT", date: "16 Jun 2026", note: "Initial offer" },
      { by: "admin", price: "GHS 14,800/MT", date: "17 Jun 2026", note: "Market rate is lower this season" },
    ],
    region: "Ashanti Region", warehouse: "Kumasi Hub",
  },
  {
    id: "BID-2026-004", supplyRequestId: "SR-2026-002", aggregator: "Sefwi Growers", crop: "Cocoa", variety: "Amelonado",
    quantity: "35", unit: "MT", pricePerUnit: "GHS 15,200/MT", totalValue: "GHS 532,000", deliveryMethod: "field-visit",
    stage: "negotiation", submittedDate: "15 Jun 2026", pipeline: makePipeline(1),
    negotiations: [
      { by: "aggregator", price: "GHS 15,200/MT", date: "15 Jun 2026" },
    ],
    region: "Western North Region", warehouse: "Takoradi Depot",
  },
  {
    id: "BID-2026-005", supplyRequestId: "SR-2026-003", aggregator: "Ejura Cooperative", crop: "Maize", variety: "Yellow Maize",
    quantity: "60", unit: "MT", pricePerUnit: "GHS 1,600/MT", totalValue: "GHS 96,000", deliveryMethod: "field-visit",
    stage: "scheduling", submittedDate: "12 Jun 2026", pipeline: makePipeline(2),
    negotiations: [
      { by: "aggregator", price: "GHS 1,800/MT", date: "12 Jun 2026" },
      { by: "admin", price: "GHS 1,600/MT", date: "13 Jun 2026" },
      { by: "aggregator", price: "GHS 1,600/MT", date: "13 Jun 2026", note: "Accepted" },
    ],
    scheduledDate: "25 Jun 2026", region: "Ashanti Region", warehouse: "Ejura Depot",
  },
  {
    id: "BID-2026-006", supplyRequestId: "SR-2026-003", aggregator: "Bolga Cooperative", crop: "Maize", variety: "Yellow Maize",
    quantity: "80", unit: "MT", pricePerUnit: "GHS 1,550/MT", totalValue: "GHS 124,000", deliveryMethod: "warehouse-visit",
    stage: "scheduling", submittedDate: "11 Jun 2026", pipeline: makePipeline(2),
    negotiations: [
      { by: "aggregator", price: "GHS 1,550/MT", date: "11 Jun 2026", note: "Accepted immediately" },
    ],
    region: "Upper East Region", warehouse: "Bolga Warehouse",
  },
  {
    id: "BID-2026-007", supplyRequestId: "SR-2026-003", aggregator: "Tamale Agric", crop: "Maize", variety: "White Maize",
    quantity: "100", unit: "MT", pricePerUnit: "GHS 1,500/MT", totalValue: "GHS 150,000", deliveryMethod: "field-visit",
    stage: "field-qa", submittedDate: "08 Jun 2026", pipeline: makePipeline(3),
    negotiations: [
      { by: "aggregator", price: "GHS 1,500/MT", date: "08 Jun 2026", note: "Accepted" },
    ],
    scheduledDate: "20 Jun 2026", region: "Northern Region", warehouse: "Tamale Hub",
  },
  {
    id: "BID-2026-008", supplyRequestId: "SR-2026-004", aggregator: "Yendi Women Coop", crop: "Shea", variety: "Shea Nuts",
    quantity: "22", unit: "MT", pricePerUnit: "GHS 6,000/MT", totalValue: "GHS 132,000", deliveryMethod: "warehouse-visit",
    stage: "warehouse-qa", submittedDate: "06 Jun 2026", pipeline: makePipeline(3),
    negotiations: [
      { by: "aggregator", price: "GHS 6,000/MT", date: "06 Jun 2026", note: "Accepted" },
    ],
    scheduledDate: "18 Jun 2026", region: "Northern Region", warehouse: "Yendi Depot", produceLabel: "Both",
  },
  {
    id: "BID-2026-009", supplyRequestId: "SR-2026-003", aggregator: "Nkoranza Coop", crop: "Maize", variety: "Yellow Maize",
    quantity: "55", unit: "MT", pricePerUnit: "GHS 1,580/MT", totalValue: "GHS 86,900", deliveryMethod: "field-visit",
    stage: "finance", submittedDate: "05 Jun 2026", pipeline: makePipeline(4),
    negotiations: [
      { by: "aggregator", price: "GHS 1,580/MT", date: "05 Jun 2026", note: "Accepted" },
    ],
    scheduledDate: "15 Jun 2026", region: "Bono East Region", warehouse: "Nkoranza Depot",
    produceLabel: "Local", qaResult: "pass", financeStatus: "awaiting-review",
  },
  {
    id: "BID-2026-010", supplyRequestId: "SR-2026-001", aggregator: "Hohoe Farmers", crop: "Rice", variety: "Jasmine",
    quantity: "40", unit: "MT", pricePerUnit: "GHS 5,100/MT", totalValue: "GHS 204,000", deliveryMethod: "field-visit",
    stage: "finance", submittedDate: "04 Jun 2026", pipeline: makePipeline(4),
    negotiations: [
      { by: "aggregator", price: "GHS 5,300/MT", date: "04 Jun 2026" },
      { by: "admin", price: "GHS 5,100/MT", date: "05 Jun 2026" },
      { by: "aggregator", price: "GHS 5,100/MT", date: "05 Jun 2026", note: "Accepted" },
    ],
    scheduledDate: "12 Jun 2026", region: "Volta Region", warehouse: "Hohoe Warehouse",
    produceLabel: "Local", qaResult: "pass", financeStatus: "pending-proof",
  },
  {
    id: "BID-2026-011", supplyRequestId: "SR-2026-004", aggregator: "Bole Farmers", crop: "Shea", variety: "Shea Nuts",
    quantity: "30", unit: "MT", pricePerUnit: "GHS 5,800/MT", totalValue: "GHS 174,000", deliveryMethod: "field-visit",
    stage: "grn", submittedDate: "01 Jun 2026", pipeline: makePipeline(5),
    negotiations: [
      { by: "aggregator", price: "GHS 5,800/MT", date: "01 Jun 2026", note: "Accepted" },
    ],
    scheduledDate: "10 Jun 2026", region: "Savannah Region", warehouse: "Bole Depot",
    produceLabel: "Export", qaResult: "pass", financeStatus: "signed-off",
  },
  {
    id: "BID-2026-012", supplyRequestId: "SR-2026-010", aggregator: "Lawra Agric", crop: "Groundnut", variety: "Chinese Groundnut",
    quantity: "25", unit: "MT", pricePerUnit: "GHS 2,000/MT", totalValue: "GHS 50,000", deliveryMethod: "field-visit",
    stage: "routing", submittedDate: "28 May 2026", pipeline: makePipeline(6),
    negotiations: [
      { by: "aggregator", price: "GHS 2,000/MT", date: "28 May 2026", note: "Accepted" },
    ],
    scheduledDate: "05 Jun 2026", region: "Upper West Region", warehouse: "Lawra Depot",
    produceLabel: "Local", qaResult: "pass", financeStatus: "signed-off", grnNumber: "GRN-2026-008",
  },
  {
    id: "BID-2026-013", supplyRequestId: "SR-2026-010", aggregator: "Zebilla Coop", crop: "Groundnut", variety: "Chinese Groundnut",
    quantity: "35", unit: "MT", pricePerUnit: "GHS 1,950/MT", totalValue: "GHS 68,250", deliveryMethod: "warehouse-visit",
    stage: "completed", submittedDate: "25 May 2026", pipeline: makePipeline(7),
    negotiations: [
      { by: "aggregator", price: "GHS 1,950/MT", date: "25 May 2026", note: "Accepted" },
    ],
    scheduledDate: "02 Jun 2026", region: "Upper East Region", warehouse: "Zebilla Depot",
    produceLabel: "Local", qaResult: "pass", financeStatus: "signed-off", grnNumber: "GRN-2026-005",
    routingDestination: "Accra Central Warehouse", aggregatorScore: 4.2,
  },
  {
    id: "BID-2026-014", supplyRequestId: "SR-2026-002", aggregator: "Assin Fosu Coop", crop: "Cocoa", variety: "Amelonado",
    quantity: "20", unit: "MT", pricePerUnit: "GHS 15,500/MT", totalValue: "GHS 310,000", deliveryMethod: "field-visit",
    stage: "rejected", submittedDate: "14 Jun 2026", pipeline: makePipeline(3, true),
    negotiations: [
      { by: "aggregator", price: "GHS 15,500/MT", date: "14 Jun 2026" },
      { by: "admin", price: "GHS 14,500/MT", date: "15 Jun 2026" },
      { by: "aggregator", price: "GHS 15,200/MT", date: "15 Jun 2026" },
      { by: "admin", price: "GHS 14,500/MT", date: "16 Jun 2026", note: "Final offer" },
    ],
    region: "Central Region", warehouse: "Assin Fosu Depot",
  },
  {
    id: "BID-2026-015", supplyRequestId: "SR-2026-003", aggregator: "Atebubu Farmers", crop: "Maize", variety: "Yellow Maize",
    quantity: "70", unit: "MT", pricePerUnit: "GHS 1,620/MT", totalValue: "GHS 113,400", deliveryMethod: "warehouse-visit",
    stage: "rejected", submittedDate: "10 Jun 2026", pipeline: makePipeline(1, true),
    negotiations: [
      { by: "aggregator", price: "GHS 1,900/MT", date: "10 Jun 2026" },
      { by: "admin", price: "GHS 1,500/MT", date: "11 Jun 2026" },
    ],
    region: "Bono East Region", warehouse: "Atebubu Depot",
  },
]

// --- Data ---

const filters = [
  { label: "All time", icon: IconCalendar },
  { label: "All Aggregators", icon: IconUsers },
  { label: "All commodities", icon: IconWorld },
  { label: "All requests", icon: IconFileText },
]

const tabItems = [
  { label: "All Bids", badge: supplyBids.length },
  { label: "Unassigned" },
  { label: "Negotiation" },
  { label: "Scheduling" },
  { label: "QA" },
  { label: "Finance" },
  { label: "GRN" },
  { label: "Routed" },
  { label: "Rejected" },
]

const tabIcons: Record<string, typeof IconClipboardCheck> = {
  "All Bids": IconClipboardCheck,
  "Unassigned": IconInbox,
  "Negotiation": IconMessages,
  "Scheduling": IconCalendar,
  "QA": IconClipboardCheck,
  "Finance": IconCash,
  "GRN": IconFileText,
  "Routed": IconRoute,
  "Rejected": IconX,
}

function stageToTab(stage: BidStage): string {
  switch (stage) {
    case "submitted": return "Unassigned"
    case "negotiation": return "Negotiation"
    case "scheduling": return "Scheduling"
    case "field-qa": case "warehouse-qa": return "QA"
    case "finance": return "Finance"
    case "grn": return "GRN"
    case "routing": case "completed": return "Routed"
    case "rejected": return "Rejected"
  }
}

const metricCards = [
  { label: "Total Bids", value: String(supplyBids.length), iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconClipboardCheck },
  { label: "In Negotiation", value: String(supplyBids.filter(b => b.stage === "negotiation").length), iconBg: "#FEF0D8", iconColor: "#995917", icon: IconMessages },
  { label: "Awaiting QA", value: String(supplyBids.filter(b => b.stage === "field-qa" || b.stage === "warehouse-qa").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconClipboardCheck },
  { label: "Awaiting Finance", value: String(supplyBids.filter(b => b.stage === "finance").length), iconBg: "#F3E8FD", iconColor: "#6B21A8", icon: IconCash },
  { label: "GRN Pending", value: String(supplyBids.filter(b => b.stage === "grn").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconFileText },
  { label: "Completed", value: String(supplyBids.filter(b => b.stage === "completed").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconCircleCheck },
]

// --- Status helpers ---

function stageColor(s: BidStage): "green" | "blue" | "red" | "warning" {
  switch (s) {
    case "completed": case "routing": return "green"
    case "scheduling": case "grn": case "finance": return "blue"
    case "rejected": return "red"
    default: return "warning"
  }
}

function stageLabel(s: BidStage): string {
  switch (s) {
    case "submitted": return "Submitted"
    case "negotiation": return "In Negotiation"
    case "scheduling": return "Scheduling"
    case "field-qa": return "Field QA"
    case "warehouse-qa": return "Warehouse QA"
    case "finance": return "Finance"
    case "grn": return "Awaiting GRN"
    case "routing": return "Routing"
    case "completed": return "Completed"
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

function ProduceLabel({ label }: { label: "Local" | "Export" | "Both" }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] outline outline-1 outline-[#E5E8DF] text-[12px] leading-[18px] font-normal text-[#161D14]">
      {label}
    </span>
  )
}

function TagBadge({ label, color }: { label: string; color: "blue" | "purple" }) {
  const styles = {
    blue: { bg: "#D5E6FD", text: "#00439E", dot: "#00439E" },
    purple: { bg: "#E2D1FD", text: "#7925CC", dot: "#7925CC" },
  }
  const s = styles[color]
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]" style={{ background: s.bg }}>
      <span className="size-[5px] rounded-full" style={{ background: s.dot }} />
      <span className="text-[12px] leading-[18px] font-normal" style={{ color: s.text }}>{label}</span>
    </span>
  )
}

function PipelineStepCircle({ status }: { status: "completed" | "current" | "pending" | "rejected" }) {
  if (status === "completed") return <div className="flex items-center justify-center p-1 rounded-full bg-[#C9F0D6]"><IconCheck className="size-4 text-[#00572D]" /></div>
  if (status === "current") return <div className="flex items-center justify-center p-1 rounded-full bg-[#D5E6FD]"><IconCheck className="size-4 text-[#00439E]" /></div>
  if (status === "rejected") return <div className="flex items-center justify-center p-1 rounded-full bg-[#FEE2E2]"><IconX className="size-4 text-[#DC2626]" /></div>
  return <div className="flex items-center justify-center p-1 rounded-full outline outline-[1.4px] outline-[#C3C8BC]"><div className="size-4" /></div>
}

function stepLabelColor(status: "completed" | "current" | "pending" | "rejected") {
  if (status === "completed") return "#008744"
  if (status === "current") return "#0063EA"
  if (status === "rejected") return "#DC2626"
  return "#525C4E"
}

function PipelineStepper({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="py-1 w-full">
      <div className="flex items-start w-full">
        {steps.map((step, i) => (
          <Fragment key={step.label}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <PipelineStepCircle status={step.status} />
              <span className="text-[12px] leading-[18px] font-normal text-center whitespace-nowrap" style={{ color: stepLabelColor(step.status) }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-1 rounded-full mt-[8px] min-w-[8px]" style={{ background: steps[i + 1]?.status !== "pending" ? "#36B92E" : "#E1E4DA" }} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function StageActions({ stage, onAction }: { stage: BidStage; onAction?: (type: BidModalType) => void }) {
  const actionMap: Record<string, { primary?: { label: string; modal: BidModalType }; secondary?: { label: string; modal: BidModalType } }> = {
    "submitted": { primary: { label: "Assign to Request", modal: "accept-price" } },
    "negotiation": { primary: { label: "Accept Price", modal: "accept-price" }, secondary: { label: "Counter Offer", modal: "counter-offer" } },
    "scheduling": { primary: { label: "Schedule Visit", modal: "schedule-visit" } },
    "field-qa": { primary: { label: "Log Field QA", modal: "log-qa" } },
    "warehouse-qa": { primary: { label: "Log Warehouse QA", modal: "log-qa" } },
    "finance": { primary: { label: "Approve Disbursement", modal: "finance-approve" }, secondary: { label: "Reject", modal: "finance-reject" } },
    "grn": { primary: { label: "Generate GRN", modal: "generate-grn" } },
    "routing": { primary: { label: "Start Routing", modal: "start-routing" } },
  }
  const actions = actionMap[stage]
  if (!actions) return null
  return (
    <div className="flex items-center gap-2">
      {actions.secondary && (
        <button
          onClick={(e) => { e.stopPropagation(); onAction?.(actions.secondary!.modal) }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[13px] leading-[18px] font-bold hover:bg-[#FEE2E2] transition-colors"
        >
          {actions.secondary.label}
        </button>
      )}
      {actions.primary && (
        <button
          onClick={(e) => { e.stopPropagation(); onAction?.(actions.primary!.modal) }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#36B92E] text-white text-[13px] leading-[18px] font-bold hover:bg-[#5EC758] transition-colors"
        >
          {actions.primary.label}
          <IconChevronRight className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function BidCardComponent({ bid, onOpen, onAction }: { bid: SupplyBid; onOpen: () => void; onAction?: (type: BidModalType) => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="p-4 rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 cursor-pointer hover:outline-[#36B92E] transition-colors" onClick={onOpen}>
      <div className="flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] outline outline-1 outline-white shrink-0">
            <span className="text-[16px] leading-[24px] font-bold text-[#CEFFEB]">{bid.aggregator.charAt(0)}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">
                {bid.crop} • {bid.id}
              </span>
              <StatusBadge label={stageLabel(bid.stage)} color={stageColor(bid.stage)} />
              {bid.produceLabel && <ProduceLabel label={bid.produceLabel} />}
            </div>
            <p className="text-[12px] leading-[18px] font-normal text-[#71786C]">
              {bid.aggregator} <span className="font-bold"> • </span>
              {bid.variety} <span className="font-bold"> • </span>
              {bid.quantity} {bid.unit} <span className="font-bold"> • </span>
              {bid.pricePerUnit}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TagBadge
            label={bid.deliveryMethod === "field-visit" ? "Field Visit" : "Warehouse Visit"}
            color={bid.deliveryMethod === "field-visit" ? "purple" : "blue"}
          />
          <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}>
            {expanded ? <IconChevronUp className="size-5 text-[#161D14]" /> : <IconChevronDown className="size-5 text-[#161D14]" />}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <PipelineStepper steps={bid.pipeline} />
          <div className="flex items-center justify-between">
            <div className="inline-flex items-start gap-4 px-2 py-1 bg-[#F7FAF6] rounded-[6px] text-[12px] leading-[18px]">
              <span className="text-[#525C4E]">Request: <span className="font-bold">{bid.supplyRequestId}</span></span>
              <span className="text-[#525C4E]">Submitted: <span className="font-bold">{bid.submittedDate}</span></span>
              {bid.scheduledDate && <span className="text-[#525C4E]">Scheduled: <span className="font-bold">{bid.scheduledDate}</span></span>}
              {bid.aggregatorScore && (
                <span className="flex items-center gap-1 text-[#008744]">
                  <IconCheck className="size-4" />
                  Score: {bid.aggregatorScore}
                </span>
              )}
            </div>
            <StageActions stage={bid.stage} onAction={onAction} />
          </div>
        </>
      )}
    </div>
  )
}

// --- Main Page ---

export function SupplyBidsPage({ onDetailViewChange, initialTab }: { onDetailViewChange?: (v: boolean) => void; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || "All Bids")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedBid, setSelectedBid] = useState<SupplyBid | null>(null)
  const { toast, showToast, dismissToast } = useToast()

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    onDetailViewChange?.(!!selectedBid)
  }, [selectedBid, onDetailViewChange])

  const handleAction = (type: BidModalType) => {
    const messages: Record<string, string> = {
      "counter-offer": "Counter offer sent",
      "accept-price": "Price accepted",
      "schedule-visit": "Visit scheduled",
      "approve-date": "Date approved",
      "log-qa": "QA logged successfully",
      "finance-approve": "Disbursement approved",
      "finance-reject": "Disbursement rejected",
      "attach-proof": "Proof attached",
      "finance-signoff": "Finance signed off",
      "generate-grn": "GRN generated",
      "start-routing": "Routing started",
    }
    showToast(messages[type] || "Action completed")
  }

  // Detail view
  if (selectedBid) {
    return (
      <>
        <SupplyBidDetailPage
          onBack={() => setSelectedBid(null)}
          bid={selectedBid}
          onAction={handleAction}
        />
        {toast && <Toast message={toast} onDismiss={dismissToast} />}
      </>
    )
  }

  const filteredBids = activeTab === "All Bids"
    ? supplyBids
    : supplyBids.filter(b => stageToTab(b.stage) === activeTab)

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h1 className="font-bold text-[28px] leading-[36px] text-[#161D14]">Supply Requests</h1>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        {filters.map((f) => {
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

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-6">
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

      {/* Tab Bar */}
      <div className="flex items-center h-[58px] border-b-2 border-[#E5E8DF]">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.label
          const Icon = tabIcons[tab.label] || IconClipboardCheck
          return (
            <button key={tab.label} onClick={() => setActiveTab(tab.label)} className="flex flex-col justify-center items-center self-stretch">
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

      {/* Bid Cards */}
      <div className="flex flex-col gap-3">
        {filteredBids.map((bid, i) => (
          <div key={bid.id} className="stagger-child" style={{ "--stagger-index": i } as React.CSSProperties}>
            <BidCardComponent
              bid={bid}
              onOpen={() => setSelectedBid(bid)}
              onAction={handleAction}
            />
          </div>
        ))}
        {filteredBids.length === 0 && (
          <div className="flex items-center justify-center py-16 text-[14px] leading-[20px] text-[#525C4E]">
            No bids in this category.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">{filteredBids.length} bid(s)</span>
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

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
