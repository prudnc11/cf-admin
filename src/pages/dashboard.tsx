import {
  IconUsersGroup,
  IconPackage,
  IconUsers,
  IconUserPlus,
  IconAlertTriangle,
  IconAlertCircle,
  IconExchange,
  IconShieldCheck,
  IconChevronRight,
  IconChevronUp,
  IconLoader,
  IconClock,
  IconCash,
  IconBuildingWarehouse,
  IconNotes,
  IconCheck,
  IconX,
} from "@tabler/icons-react"
import { requests } from "./procurement-request"
import { supplyRequests } from "./supply-requests"
import { supplyBids } from "./supply-bids"

const metricCards = [
  { label: "Active Aggregators", value: "112", iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconUsersGroup },
  { label: "Inventory (MT)", value: "891", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconPackage },
  { label: "Aggregators", value: "324", iconBg: "#F3E8FD", iconColor: "#6B21A8", icon: IconUsers },
  { label: "Pending Onboarding", value: "7", iconBg: "#FDE8D5", iconColor: "#9A3412", icon: IconUserPlus },
  { label: "Low Stock", value: "12", iconBg: "#FDE8D5", iconColor: "#9A3412", icon: IconAlertCircle },
  { label: "Critical", value: "3", iconBg: "#FEE2E2", iconColor: "#DC2626", icon: IconAlertTriangle },
  { label: "Discrepancies", value: "7", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconExchange },
  { label: "SLA Breaches", value: "5", iconBg: "#FEE2E2", iconColor: "#DC2626", icon: IconShieldCheck },
]

const pipelineSteps = ["Bid Submitted", "Negotiation", "Scheduling", "QA", "Finance", "GRN", "Routing"]

// Compute real counts from supply bids data
const negotiationCount = supplyBids.filter((b) => b.stage === "negotiation").length
const schedulingCount = supplyBids.filter((b) => b.stage === "scheduling").length
const financeReviewCount = supplyBids.filter((b) => b.stage === "finance" && b.financeStatus === "awaiting-review").length
const pendingProofCount = supplyBids.filter((b) => b.stage === "finance" && b.financeStatus === "pending-proof").length
const qaCount = supplyBids.filter((b) => b.stage === "field-qa" || b.stage === "warehouse-qa").length
const grnRoutingCount = supplyBids.filter((b) => b.stage === "grn").length

type PipelineCardData = {
  label: string
  value: string
  iconBg: string
  iconColor: string
  icon: typeof IconLoader
  extra?: string
  badge?: string
  navigateTo: string
  navigateTab?: string
}

const pipelineCards: PipelineCardData[] = [
  { label: "In Negotiation", value: String(negotiationCount), iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconLoader, navigateTo: "Supply Requests", navigateTab: "Negotiation" },
  { label: "Awaiting Scheduling", value: String(schedulingCount), iconBg: "#FEF0D8", iconColor: "#995917", icon: IconClock, navigateTo: "Supply Requests", navigateTab: "Scheduling" },
  { label: "Awaiting Finance Review", value: String(financeReviewCount), iconBg: "#F3E8FD", iconColor: "#6B21A8", icon: IconClock, navigateTo: "Disbursement", navigateTab: "Awaiting Review" },
  { label: "Pending Disbursement", value: String(pendingProofCount), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconCash, navigateTo: "Disbursement", navigateTab: "Pending Proof" },
  { label: "Awaiting QA", value: String(qaCount), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconBuildingWarehouse, navigateTo: "Supply Requests", navigateTab: "QA" },
  { label: "GRN / Routing Needed", value: String(grnRoutingCount), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconNotes, navigateTo: "Supply Requests", navigateTab: "GRN" },
]

// Derive pipeline action items from real requests that need immediate action
const pipelineActionRequests = requests
  .filter((r) => r.currentStage && r.tabCategory !== "Rejected")
  .slice(0, 3)

// Supply bids needing action
const actionBids = supplyBids
  .filter((b) => b.stage !== "completed" && b.stage !== "rejected")
  .slice(0, 3)

const alerts = [
  {
    name: "Cocoa",
    severity: "critical",
    badge: "Out of stock",
    detail: "WH-001 • 280 MT remaining • Min threshold: 500 MT",
    source: "Finance • 2h ago",
  },
  {
    name: "Sorghum",
    severity: "low",
    badge: "Low",
    detail: "WH-004 • 380 MT remaining • Reorder point: 600 MT",
    source: "Operations • 1h ago",
  },
  {
    name: "Maize",
    severity: "critical",
    badge: "Critical",
    detail: "WH-003 • 150 MT remaining • 72hr SLA window closing",
    source: "Security • 3h ago",
  },
  {
    name: "Sesame",
    severity: "low",
    badge: "Low",
    detail: "WH-004 • 380 MT remaining • Reorder point: 600 MT",
    source: "Operations • 1h ago",
  },
]

function MetricCard({ card, index }: { card: typeof metricCards[number]; index: number }) {
  const Icon = card.icon
  return (
    <div
      className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3 hover-lift stagger-child"
      style={{ "--stagger-index": index } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md flex items-center" style={{ background: card.iconBg }}>
          <Icon className="size-4" style={{ color: card.iconColor }} />
        </div>
        <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#161D14]">{card.label}</span>
        <IconChevronRight className="size-4 text-[#161D14] transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
      <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
    </div>
  )
}

function PipelineCard({ card, onClick, index }: { card: PipelineCardData; onClick?: () => void; index: number }) {
  const Icon = card.icon
  return (
    <div
      className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3 cursor-pointer hover:outline-[#36B92E] transition-all duration-200 hover-lift stagger-child"
      style={{ "--stagger-index": index } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md flex items-center" style={{ background: card.iconBg }}>
          <Icon className="size-4" style={{ color: card.iconColor }} />
        </div>
        <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#161D14]">{card.label}</span>
        <IconChevronRight className="size-4 text-[#161D14]" />
      </div>
      <div className="flex items-center gap-2">
        <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
        {card.extra && (
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">{card.extra}</span>
        )}
        {card.badge && (
          <span className="text-[12px] leading-[18px] font-normal text-[#DC2626]">{card.badge}</span>
        )}
      </div>
    </div>
  )
}

function PipelineActionCard({ item, onClick, index }: { item: typeof requests[number]; onClick?: () => void; index: number }) {
  return (
    <div
      className="p-4 rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 cursor-pointer hover:outline-[#36B92E] transition-all duration-200 hover-lift stagger-child"
      style={{ "--stagger-index": index } as React.CSSProperties}
      onClick={onClick}
    >
      <div className="inline-flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] outline outline-1 outline-white shrink-0">
            <span className="text-[16px] leading-[24px] font-bold text-[#CEFFEB]">{item.cooperative.charAt(0)}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-start gap-2 flex-wrap">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">
                {item.commodity} • {item.requestId}
              </span>
              {item.statuses.map((s, i) => {
                const colors = {
                  green: { bg: "#D4F5D0", dot: "#1A5514", text: "#1A5514" },
                  blue: { bg: "#D5E6FD", dot: "#00439E", text: "#00439E" },
                  red: { bg: "#FEE2E2", dot: "#DC2626", text: "#DC2626" },
                  warning: { bg: "#FEF0D8", dot: "#995917", text: "#995917" },
                }
                const c = colors[s.color]
                return (
                  <span key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]" style={{ background: c.bg }}>
                    <span className="size-[5px] rounded-full" style={{ background: c.dot }} />
                    <span className="text-[12px] leading-[18px] font-normal" style={{ color: c.text }}>{s.label}</span>
                  </span>
                )
              })}
            </div>
            <p className="text-[12px] leading-[18px] font-normal text-[#71786C]">
              {item.cooperative} <span className="font-bold"> • </span>{item.product} <span className="font-bold"> • </span>{item.quantity}<span className="font-bold"> • </span> Plan {item.plan}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] shrink-0" style={{ background: item.tag.color === "purple" ? "#E2D1FD" : "#D5E6FD" }}>
          <span className="size-[5px] rounded-full" style={{ background: item.tag.color === "purple" ? "#7925CC" : "#00439E" }} />
          <span className="text-[12px] leading-[18px] font-normal" style={{ color: item.tag.color === "purple" ? "#7925CC" : "#00439E" }}>{item.tag.label}</span>
        </div>
      </div>
      <div className="inline-flex items-start gap-4 px-2 py-1 bg-[#F7FAF6] rounded-[6px] text-[12px] leading-[18px]">
        <span className="text-[#525C4E]">Scheduled: <span className="font-bold">{item.scheduledDate}</span></span>
        <span className="text-[#525C4E]">By: <span className="font-bold">{item.assignedTo}</span></span>
        {item.confirmedBy !== "—" && (
          <span className="flex items-center gap-1 text-[#008744]">
            <IconCheck className="size-4" />
            Confirmed {item.confirmedDate} by {item.confirmedBy}
          </span>
        )}
      </div>
    </div>
  )
}

function AlertCard({ alert, index }: { alert: typeof alerts[number]; index: number }) {
  const isCritical = alert.severity === "critical"

  return (
    <div
      className="p-4 rounded-[12px] shadow-sm flex flex-col gap-2 hover-lift stagger-child"
      style={{
        "--stagger-index": index,
        background: isCritical ? "#FFDAD6" : "#FEF0D8",
        border: `1px solid ${isCritical ? "#BA1A1A" : "#FBB33A"}`,
      } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[7px]">
          <IconAlertTriangle className="size-4" style={{ color: isCritical ? "#BA1A1A" : "#FBB33A" }} />
          <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">{alert.name}</span>
          <span
            className="text-[12px] leading-[18px] font-normal px-1.5 py-0.5 rounded-md outline outline-1 -outline-offset-1"
            style={{
              color: isCritical ? "#BA1A1A" : "#995917",
              outlineColor: isCritical ? "#8F0004" : "#995917",
            }}
          >
            {alert.badge}
          </span>
        </div>
        <button>
          <IconX className="size-4 text-[#161D14]" />
        </button>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[14px] leading-[20px] font-normal text-[#525C4E]">{alert.detail}</p>
        <p className="text-[12px] leading-[18px] font-normal text-[#71786C]">{alert.source}</p>
      </div>
    </div>
  )
}

export function DashboardPage({ onNavigate }: { onNavigate?: (page: string, tab?: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <MetricCard key={card.label} card={card} index={i} />
        ))}
      </div>

      {/* Aggregation Pipeline */}
      <div className="p-6 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] leading-[24px] font-bold text-[#161D14]">Aggregation pipeline</h2>
          <span className="size-1.5 rounded-full bg-[#525C4E]" />
          <div className="flex items-center gap-1 text-[14px] leading-[20px] font-normal text-[#525C4E]">
            {pipelineSteps.map((step, i) => (
              <span key={step} className="flex items-center gap-1">
                {step}
                {i < pipelineSteps.length - 1 && <span>→</span>}
              </span>
            ))}
          </div>
          <button className="ml-auto">
            <IconChevronUp className="size-5 text-[#161D14]" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pipelineCards.map((card, i) => (
            <PipelineCard
              key={card.label}
              card={card}
              index={i}
              onClick={() => onNavigate?.(card.navigateTo, card.navigateTab)}
            />
          ))}
        </div>
      </div>

      {/* Pipeline Action Required + Active Alerts */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Pipeline Action Required */}
        <div className="p-6 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] leading-[24px] font-bold text-[#161D14]">Pipeline Action Required</h2>
            <IconChevronUp className="size-5 text-[#161D14]" />
          </div>
          <div className="flex flex-col gap-3">
            {pipelineActionRequests.map((item, i) => (
              <PipelineActionCard
                key={i}
                item={item}
                index={i}
                onClick={() => onNavigate?.("Supply Requests")}
              />
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="p-6 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] leading-[24px] font-bold text-[#161D14]">Active Alerts</h2>
              <p className="text-[14px] leading-[20px] font-normal text-[#525C4E]">2 critical, 2 warnings</p>
            </div>
            <button className="flex items-center gap-1 text-[14px] leading-[20px] font-bold text-[#161D14]">
              View all
              <IconChevronRight className="size-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {alerts.map((alert, i) => (
              <AlertCard key={i} alert={alert} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
