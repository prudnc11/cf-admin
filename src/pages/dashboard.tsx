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
  IconFileText,
  IconNotes,
  IconCheck,
  IconX,
} from "@tabler/icons-react"

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

const pipelineSteps = ["Delivery Method", "Field QA", "Approval", "Finance", "Pickup", "Warehouse QA", "GRN", "Routing"]

const pipelineCards = [
  { label: "Awaiting Ops Approval", value: "GHS 1.26M", iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconLoader },
  { label: "Overdue", value: "7", iconBg: "#FEE2E2", iconColor: "#DC2626", icon: IconAlertTriangle },
  { label: "Awaiting Finance Review", value: "28", iconBg: "#F3E8FD", iconColor: "#6B21A8", icon: IconClock },
  { label: "Pending disbursement", value: "9", extra: "12 requests", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconCash },
  { label: "Awaiting Warehouse QA", value: "43", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconBuildingWarehouse },
  { label: "GRN / Routing Needed", value: "19", badge: "-20% this week", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconNotes },
]

const pipelineActions = [
  {
    commodity: "{Commodity}",
    requestId: "Sales-request-ID",
    cooperative: "Tetteh Cooperative",
    product: "Rice",
    quantity: "38MT",
    plan: "Plan PLAN-2026-002",
    status: "Awaiting Schedule",
    tag: "Field visit",
    scheduledDate: "12 Jun 2026",
    assignedTo: "Yaw",
    confirmedBy: "Yaw Darko",
    confirmedDate: "2026-06-14 11:00",
  },
  {
    commodity: "{Commodity}",
    requestId: "Sales-request-ID",
    cooperative: "Tetteh Cooperative",
    product: "Rice",
    quantity: "38MT",
    plan: "Plan PLAN-2026-002",
    status: "Awaiting Schedule",
    tag: "Field visit",
    scheduledDate: "12 Jun 2026",
    assignedTo: "Yaw",
    confirmedBy: "Yaw Darko",
    confirmedDate: "2026-06-14 11:00",
  },
  {
    commodity: "{Commodity}",
    requestId: "Sales-request-ID",
    cooperative: "Tetteh Cooperative",
    product: "Rice",
    quantity: "38MT",
    plan: "Plan PLAN-2026-002",
    status: "Awaiting Schedule",
    tag: "Field visit",
    scheduledDate: "12 Jun 2026",
    assignedTo: "Yaw",
    confirmedBy: "Yaw Darko",
    confirmedDate: "2026-06-14 11:00",
  },
]

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

function MetricCard({ card }: { card: typeof metricCards[number] }) {
  const Icon = card.icon
  return (
    <div className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md flex items-center" style={{ background: card.iconBg }}>
          <Icon className="size-4" style={{ color: card.iconColor }} />
        </div>
        <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#161D14]">{card.label}</span>
        <IconChevronRight className="size-4 text-[#161D14]" />
      </div>
      <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
    </div>
  )
}

function PipelineCard({ card }: { card: typeof pipelineCards[number] }) {
  const Icon = card.icon
  return (
    <div className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
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

function PipelineActionCard({ item }: { item: typeof pipelineActions[number] }) {
  return (
    <div className="p-4 rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2">
      <div className="inline-flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] outline outline-1 outline-white shrink-0">
            <span className="text-[16px] leading-[24px] font-bold text-[#CEFFEB]">T</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">
                {item.commodity} • {item.requestId}
              </span>
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FEF0D8] rounded-[6px]">
                <span className="size-[5px] rounded-full bg-[#995917]" />
                <span className="text-[12px] leading-[18px] font-normal text-[#995917]">{item.status}</span>
              </div>
            </div>
            <p className="text-[12px] leading-[18px] font-normal text-[#71786C]">
              {item.cooperative} <span className="font-bold"> • </span>{item.product} <span className="font-bold"> • </span>{item.quantity}<span className="font-bold"> • </span> {item.plan}
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#E2D1FD] rounded-[6px] shrink-0">
          <span className="size-[5px] rounded-full bg-[#7925CC]" />
          <span className="text-[12px] leading-[18px] font-normal text-[#7925CC]">{item.tag}</span>
        </div>
      </div>
      <div className="inline-flex items-start gap-4 px-2 py-1 bg-[#F7FAF6] rounded-[6px] text-[12px] leading-[18px]">
        <span className="text-[#525C4E]">Scheduled: <span className="font-bold">{item.scheduledDate}</span></span>
        <span className="text-[#525C4E]">By: <span className="font-bold">{item.assignedTo}</span></span>
        <span className="flex items-center gap-1 text-[#008744]">
          <IconCheck className="size-4" />
          Confirmed {item.confirmedDate} by {item.confirmedBy}
        </span>
      </div>
    </div>
  )
}

function AlertCard({ alert }: { alert: typeof alerts[number] }) {
  const isCritical = alert.severity === "critical"

  return (
    <div
      className="p-4 rounded-[12px] shadow-sm flex flex-col gap-2"
      style={{
        background: isCritical ? "#FFDAD6" : "#FEF0D8",
        border: `1px solid ${isCritical ? "#BA1A1A" : "#FBB33A"}`,
      }}
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

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCard key={card.label} card={card} />
        ))}
      </div>

      {/* Aggregation Pipeline */}
      <div className="p-6 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-4">
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
          {pipelineCards.map((card) => (
            <PipelineCard key={card.label} card={card} />
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
            {pipelineActions.map((item, i) => (
              <PipelineActionCard key={i} item={item} />
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
              <AlertCard key={i} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
