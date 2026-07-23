import {
  IconChevronRight,
  IconAlertTriangle,
  IconX,
  IconTrendingUp,
  IconPackage,
  IconBuildingWarehouse,
  IconPlant2,
  IconCurrencyDollar,
  IconUsers,
  IconClipboardList,
  IconTruckDelivery,
  IconAlertCircle,
  IconCalendar,
  IconWorld,
} from "@tabler/icons-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts"
import { useState } from "react"
import { FilterDropdown, DATE_OPTIONS } from "@/components/ui/filter-dropdown"

// ── Static data ──

const summaryCards = [
  {
    label: "Active aggregators",
    value: "245",
    sub: "+12  onboarded this week",
    subIcon: "up" as const,
    iconBg: "#D5E6FD",
    iconColor: "#00439E",
    icon: IconUsers,
    hasChevron: false,
  },
  {
    label: "Active warehouses",
    value: "5",
    sub: "All operational",
    iconBg: "#D5E6FD",
    iconColor: "#00439E",
    icon: IconBuildingWarehouse,
    hasChevron: false,
  },
  {
    label: "Commodities",
    value: "12",
    sub: "Maize, Sorghum, Rice +3",
    iconBg: "#D5E6FD",
    iconColor: "#00439E",
    icon: IconPlant2,
    hasChevron: true,
  },
  {
    label: "Total inventory",
    value: "13,940 MT",
    sub: "+3 MT  since yesterday",
    subIcon: "up" as const,
    iconBg: "#D4F5D0",
    iconColor: "#1A5514",
    icon: IconPackage,
    hasChevron: true,
  },
  {
    label: "Total value",
    value: "GHS 280,900,000",
    sub: "+8.1%  vs last period",
    subIcon: "up" as const,
    iconBg: "#D4F5D0",
    iconColor: "#1A5514",
    icon: IconCurrencyDollar,
    hasChevron: true,
  },
]

type InventoryMetric = {
  label: string
  value: string
  badge?: string
  badgeColor?: string
  subText?: string
}

const inventoryMetrics: InventoryMetric[] = [
  { label: "Available stock", value: "13,830 MT", badge: "+12%", badgeColor: "#008744", subText: "vs prior period" },
  { label: "Reserved stock", value: "4,600 MT", subText: "Open sales orders" },
  { label: "Low stock items", value: "12", badge: "+3", badgeColor: "#BA1A1A", subText: "since yesterday" },
  { label: "Critical stock", value: "4", subText: "Immediate action needed" },
  { label: "Out of stock", value: "2 MT", badge: "+12", badgeColor: "#BA1A1A", subText: "Maize: WH-002" },
  { label: "Stock discrepancies", value: "8 MT", badge: "+12", badgeColor: "#BA1A1A", subText: "unaccounted" },
  { label: "AVG procurement delay", value: "2.4d", badge: "+12", badgeColor: "#008744", subText: "vs SLA 1.8d" },
  { label: "SLA breaches", value: "5", badge: "+12", badgeColor: "#BA1A1A", subText: "this week" },
]

const procurementMetrics = [
  { label: "Active  plans", value: "18" },
  { label: "Delayed procurement", value: "3" },
  { label: "Completion rate", value: "83%" },
  { label: "Upcoming collection", value: "6" },
]

const fulfilmentMetrics = [
  { label: "Pending orders", value: "18" },
  { label: "Orders in Progress", value: "3" },
  { label: "Delayed fulfilments", value: "2" },
  { label: "Completed (this week)", value: "32" },
]

type AlertItem = {
  iconBg: string
  iconColor: string
  title: string
  badge: string
  badgeColor: string
  badgeBorder: string
  detail: string
  action: string
  actionColor: string
}

const alerts: AlertItem[] = [
  {
    iconBg: "#FFDAD6",
    iconColor: "#8F0004",
    title: "Stock discrepancy - Cocoa  \u2022 Jude Owusu",
    badge: "Major",
    badgeColor: "#BA1A1A",
    badgeBorder: "#8F0004",
    detail: "-5 MT variance \u2022 Suspected weighing error",
    action: "Investigate",
    actionColor: "#36B92E",
  },
  {
    iconBg: "#FEF0D8",
    iconColor: "#995917",
    title: "QA SLA breach - Cocoa batch \u2022 Jude Owusu",
    badge: "Moderate",
    badgeColor: "#995917",
    badgeBorder: "#995917",
    detail: "QA-2026-040 \u2022 +1.5h over 8h target",
    action: "View QA",
    actionColor: "#36B92E",
  },
  {
    iconBg: "#FEF0D8",
    iconColor: "#995917",
    title: "Low stock: Maize \u2022 Accra South",
    badge: "Moderate",
    badgeColor: "#995917",
    badgeBorder: "#995917",
    detail: "12 MT \u2022 5 days supply remaining",
    action: "Reorder",
    actionColor: "#BA1A1A",
  },
  {
    iconBg: "#FEF0D8",
    iconColor: "#995917",
    title: "Escalation pending review",
    badge: "Moderate",
    badgeColor: "#995917",
    badgeBorder: "#995917",
    detail: "DSC-003 \u2022 5 Suspected theft \u2022 Compliance notified",
    action: "Review",
    actionColor: "#BA1A1A",
  },
]

const volumeData = [
  { week: "W20", procurement: 150, fulfilment: 120 },
  { week: "W21", procurement: 180, fulfilment: 140 },
  { week: "W22", procurement: 900, fulfilment: 650 },
  { week: "W23", procurement: 700, fulfilment: 550 },
  { week: "W24", procurement: 600, fulfilment: 480 },
  { week: "W25", procurement: 650, fulfilment: 500 },
  { week: "W26", procurement: 700, fulfilment: 580 },
  { week: "W27", procurement: 850, fulfilment: 700 },
  { week: "W28", procurement: 800, fulfilment: 650 },
  { week: "W29", procurement: 760, fulfilment: 630 },
]

type WarehouseRow = {
  name: string
  progress: number
  days: string
  status: "On Track" | "At Risk" | "Delayed"
}

const warehouseRows: WarehouseRow[] = [
  { name: "Bismark Allotey", progress: 72, days: "1.8 d", status: "On Track" },
  { name: "Sarah Johnson", progress: 85, days: "0.4 d", status: "At Risk" },
  { name: "Marcus Wu", progress: 60, days: "1.1 d", status: "Delayed" },
  { name: "Emily Chen", progress: 68, days: "0.1 d", status: "On Track" },
  { name: "David Smith", progress: 78, days: "4 d", status: "On Track" },
]

type CommodityRow = {
  name: string
  totalStock: string
  trend: number[]
  change: string
  changePositive: boolean
  qaPassRate: string
  aggregators: string
  status: "Critical" | "Low" | "Healthy"
}

const commodityRows: CommodityRow[] = [
  { name: "Chilli Pepper", totalStock: "402 MT", trend: [40, 35, 30, 38, 45, 48], change: "+18%", changePositive: true, qaPassRate: "92%", aggregators: "Juapong", status: "Critical" },
  { name: "Maize", totalStock: "133 MT", trend: [50, 48, 45, 42, 40, 47], change: "-5%", changePositive: false, qaPassRate: "100%", aggregators: "Juapong", status: "Low" },
  { name: "Groundnut", totalStock: "36 MT", trend: [60, 50, 40, 30, 25, 27], change: "-55%", changePositive: false, qaPassRate: "72%", aggregators: "Juapong", status: "Critical" },
  { name: "Shea Butter", totalStock: "38 MT", trend: [55, 50, 42, 35, 30, 28], change: "-49%", changePositive: false, qaPassRate: "84%", aggregators: "Juapong", status: "Low" },
  { name: "Cocoa", totalStock: "95 MT", trend: [30, 35, 40, 38, 32, 30], change: "-49%", changePositive: false, qaPassRate: "92%", aggregators: "Juapong", status: "Healthy" },
]

// ── Subcomponents ──

function SummaryCard({ card, index }: { card: typeof summaryCards[number]; index: number }) {
  const Icon = card.icon
  return (
    <div
      className="flex-1 min-w-0 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 hover-lift stagger-child"
      style={{ "--stagger-index": index } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-[8px] flex items-center justify-center" style={{ background: card.iconBg }}>
          <Icon className="size-4" style={{ color: card.iconColor }} />
        </div>
        <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#525C4E]">{card.label}</span>
        {card.hasChevron && <IconChevronRight className="size-4 text-[#71786C]" />}
      </div>
      <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
      {card.sub && (
        <p className="flex items-center gap-1 text-[12px] leading-[18px] text-[#525C4E]">
          {card.subIcon === "up" && <IconTrendingUp className="size-3.5 text-[#1A5514]" />}
          {card.sub}
        </p>
      )}
    </div>
  )
}

function InventoryMonitoringCard({
  title,
  icon: Icon,
  iconBg,
  iconColor,
  metrics,
}: {
  title: string
  icon: typeof IconPackage
  iconBg: string
  iconColor: string
  metrics: InventoryMetric[]
}) {
  return (
    <div className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-[6px] flex items-center justify-center" style={{ background: iconBg }}>
          <Icon className="size-4" style={{ color: iconColor }} />
        </div>
        <h3 className="flex-1 text-[16px] leading-[24px] font-bold text-[#161D14]">{title}</h3>
        <IconChevronRight className="size-6 text-[#161D14]" />
      </div>
      <div className="flex flex-wrap gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="w-[261px] p-3 bg-[#F7FAF6] rounded-[8px] flex flex-col gap-3">
            <span className="text-[12px] leading-[18px] text-[#525C4E]">{m.label}</span>
            <div className="flex flex-col gap-1.5">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{m.value}</span>
              <div className="flex items-center gap-2">
                {m.badge && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] outline outline-1 outline-[#E5E8DF] bg-white text-[12px] leading-[18px]"
                    style={{ color: m.badgeColor }}
                  >
                    <span className="size-1.5 rounded-full" style={{ background: m.badgeColor }} />
                    {m.badge}
                  </span>
                )}
                {m.subText && (
                  <span className="text-[12px] leading-[18px] text-[#525C4E]">{m.subText}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SmallMonitoringCard({
  title,
  icon: Icon,
  iconBg,
  iconColor,
  metrics,
}: {
  title: string
  icon: typeof IconPackage
  iconBg: string
  iconColor: string
  metrics: { label: string; value: string }[]
}) {
  return (
    <div className="flex-1 min-w-0 p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-[6px] flex items-center justify-center" style={{ background: iconBg }}>
          <Icon className="size-4" style={{ color: iconColor }} />
        </div>
        <h3 className="flex-1 text-[16px] leading-[24px] font-bold text-[#161D14]">{title}</h3>
        <IconChevronRight className="size-6 text-[#161D14]" />
      </div>
      <div className="flex flex-wrap gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="w-[250px] p-3 bg-[#F7FAF6] rounded-[8px] flex flex-col gap-3">
            <span className="text-[12px] leading-[18px] text-[#525C4E]">{m.label}</span>
            <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertRow({ alert, onDismiss, index }: { alert: AlertItem; onDismiss: () => void; index: number }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 bg-white shadow-sm rounded-[12px] outline outline-1 outline-[#E5E8DF] hover-lift stagger-child"
      style={{ "--stagger-index": index } as React.CSSProperties}
    >
      <div className="p-1.5 rounded-[6px] shrink-0" style={{ background: alert.iconBg }}>
        <IconAlertCircle className="size-4" style={{ color: alert.iconColor }} />
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-1">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{alert.title}</span>
            <span
              className="text-[12px] leading-[18px] px-1.5 py-0.5 rounded-[6px] outline outline-1 -outline-offset-1"
              style={{ color: alert.badgeColor, outlineColor: alert.badgeBorder }}
            >
              {alert.badge}
            </span>
          </div>
          <p className="text-[14px] leading-[20px] text-[#525C4E]">{alert.detail}</p>
        </div>
        <button className="px-3 py-2 rounded-[8px] text-[14px] leading-[20px] font-bold shrink-0" style={{ color: alert.actionColor }}>
          {alert.action}
        </button>
        <button onClick={onDismiss} className="shrink-0">
          <IconX className="size-4 text-[#161D14]" />
        </button>
      </div>
    </div>
  )
}

function VolumeChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const proc = payload.find((p) => p.dataKey === "procurement")?.value ?? 0
  const ful = payload.find((p) => p.dataKey === "fulfilment")?.value ?? 0
  const gap = proc - ful
  return (
    <div className="bg-white rounded-[8px] shadow-lg outline outline-1 outline-[#E5E8DF] p-3 text-[12px] leading-[18px]">
      <p className="font-bold text-[#161D14] mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-[#C6E8B8]" />
        <span className="text-[#525C4E]">Procurement</span>
        <span className="font-bold text-[#161D14] ml-auto">{proc} MT</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-[#1A5514]" />
        <span className="text-[#525C4E]">Fulfilment</span>
        <span className="font-bold text-[#161D14] ml-auto">{ful} MT</span>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-[#E5E8DF] mt-1">
        <span className="text-[#525C4E]">Gap</span>
        <span className="font-bold ml-auto" style={{ color: gap >= 0 ? "#1A5514" : "#BA1A1A" }}>
          {gap >= 0 ? "+" : ""}{gap} MT
        </span>
      </div>
    </div>
  )
}

function WarehouseBar({ row, index }: { row: WarehouseRow; index: number }) {
  const barColors = {
    "On Track": "#1A5514",
    "At Risk": "#E8590C",
    "Delayed": "#BA1A1A",
  }
  const badgeStyles = {
    "On Track": { bg: "#D4F5D0", color: "#1A5514" },
    "At Risk": { bg: "#FEF0D8", color: "#995917" },
    "Delayed": { bg: "#FFDAD6", color: "#BA1A1A" },
  }
  const b = badgeStyles[row.status]

  return (
    <div className="flex items-center gap-4 py-2 stagger-child" style={{ "--stagger-index": index } as React.CSSProperties}>
      <span className="w-[120px] text-[14px] leading-[20px] text-[#161D14] shrink-0">{row.name}</span>
      <div className="flex-1 h-[10px] bg-[#EDF0E6] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full animate-bar-grow"
          style={{ width: `${row.progress}%`, background: barColors[row.status], animationDelay: `${index * 100 + 200}ms` }}
        />
      </div>
      <span className="text-[14px] leading-[20px] text-[#525C4E] w-[48px] text-right shrink-0">{row.days}</span>
      <span
        className="text-[12px] leading-[18px] px-2 py-0.5 rounded-full shrink-0"
        style={{ background: b.bg, color: b.color }}
      >
        {row.status}
      </span>
    </div>
  )
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const chartData = data.map((v, i) => ({ i, v }))
  const color = positive ? "#1A5514" : "#BA1A1A"
  return (
    <div className="w-[80px] h-[28px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} animationDuration={1000} animationBegin={300} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function StatusBadge({ status }: { status: CommodityRow["status"] }) {
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

// ── Main page ──

export function OperationsOverviewPage() {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([])
  const [dateFilter, setDateFilter] = useState("all")
  const [aggregatorFilter, setAggregatorFilter] = useState("all")
  const [commodityFilter, setCommodityFilter] = useState("all")

  const aggregatorOptions = warehouseRows.map((r) => ({ label: r.name, value: r.name }))
  const commodityOptions = commodityRows.map((r) => ({ label: r.name, value: r.name }))

  const visibleAlerts = alerts.filter((_, i) => !dismissedAlerts.includes(i))

  const totalProcurement = volumeData.reduce((s, d) => s + d.procurement, 0)
  const totalFulfilment = volumeData.reduce((s, d) => s + d.fulfilment, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <FilterDropdown
          label="All time"
          icon={IconCalendar}
          options={DATE_OPTIONS}
          value={dateFilter}
          onChange={setDateFilter}
          allLabel="All time"
        />
        <FilterDropdown
          label="All Aggregators"
          icon={IconUsers}
          options={aggregatorOptions}
          value={aggregatorFilter}
          onChange={setAggregatorFilter}
          allLabel="All Aggregators"
        />
        <FilterDropdown
          label="All commodities"
          icon={IconWorld}
          options={commodityOptions}
          value={commodityFilter}
          onChange={setCommodityFilter}
          allLabel="All commodities"
        />
      </div>

      {/* Quick actions */}
      <div className="p-3.5 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex items-center gap-4">
        <button className="flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#1A5514]">
          <IconAlertTriangle className="size-4 text-[#1A5514]" />
          Escalate warehouse issue
        </button>
        <button className="flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#1A5514]">
          <IconAlertTriangle className="size-4 text-[#1A5514]" />
          Resolve Operational issue
        </button>
      </div>

      {/* Operational Summary - 5 KPI cards */}
      <div className="flex gap-4">
        {summaryCards.map((card, i) => (
          <SummaryCard key={card.label} card={card} index={i} />
        ))}
      </div>

      {/* Inventory monitoring */}
      <InventoryMonitoringCard
        title="Inventory monitoring"
        icon={IconPackage}
        iconBg="#E2D1FD"
        iconColor="#7925CC"
        metrics={inventoryMetrics}
      />

      {/* Procurement + Fulfilment side by side */}
      <div className="flex gap-4">
        <SmallMonitoringCard
          title="Procurement monitoring"
          icon={IconClipboardList}
          iconBg="#E2D1FD"
          iconColor="#7925CC"
          metrics={procurementMetrics}
        />
        <SmallMonitoringCard
          title="Fulfilment monitoring"
          icon={IconTruckDelivery}
          iconBg="#E2D1FD"
          iconColor="#7925CC"
          metrics={fulfilmentMetrics}
        />
      </div>

      {/* Operational Alerts */}
      <div className="p-4 pt-5 bg-white shadow-sm rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Operational Alerts</h2>
            <p className="text-[14px] leading-[20px] text-[#525C4E]">Open issues, discrepancies, SLA breaches and escalations</p>
          </div>
          <button className="flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#1A5514]">
            View all
            <IconChevronRight className="size-4 text-[#1A5514]" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {visibleAlerts.map((alert, i) => {
            const originalIndex = alerts.indexOf(alert)
            return (
              <AlertRow
                key={originalIndex}
                alert={alert}
                index={i}
                onDismiss={() => setDismissedAlerts((prev) => [...prev, originalIndex])}
              />
            )
          })}
          {visibleAlerts.length === 0 && (
            <p className="py-8 text-center text-[14px] leading-[20px] text-[#525C4E]">No active alerts</p>
          )}
        </div>
      </div>

      {/* Procurement vs Fulfilment volume */}
      <div className="p-6 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Procurement vs Fulfilment volume</h2>
            <p className="text-[14px] leading-[20px] text-[#525C4E]">Weekly Procurement vs Fulfilment Volume</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#C6E8B8]" />
              <span className="text-[12px] leading-[18px] text-[#525C4E]">PROCUREMENT (MT)</span>
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{totalProcurement.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#1A5514]" />
              <span className="text-[12px] leading-[18px] text-[#525C4E]">FULFILMENT (MT)</span>
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{totalFulfilment.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData} barGap={2} barCategoryGap="20%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E8DF" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#525C4E" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#525C4E" }}
                tickFormatter={(v: number) => `${v} MT`}
              />
              <Tooltip content={<VolumeChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="procurement" fill="#C6E8B8" radius={[4, 4, 0, 0]} animationDuration={1200} animationBegin={200} />
              <Bar dataKey="fulfilment" fill="#1A5514" radius={[4, 4, 0, 0]} animationDuration={1200} animationBegin={400} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Warehouse utilisation */}
      <div className="p-6 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Warehouse utilisation</h2>
          <button className="flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#1A5514]">
            View all
            <IconChevronRight className="size-4 text-[#1A5514]" />
          </button>
        </div>
        <div className="flex flex-col">
          {warehouseRows.map((row, i) => (
            <WarehouseBar key={row.name} row={row} index={i} />
          ))}
        </div>
      </div>

      {/* Commodity Performance Trends */}
      <div className="p-6 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Commodity Performance Trends</h2>
          <button className="flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#1A5514]">
            View all
            <IconChevronRight className="size-4 text-[#1A5514]" />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] leading-[18px] font-normal text-[#525C4E]">
              <th className="pb-3 font-normal">Commodity</th>
              <th className="pb-3 font-normal">Total stock</th>
              <th className="pb-3 font-normal">6-week trend</th>
              <th className="pb-3 font-normal">Change</th>
              <th className="pb-3 font-normal">QA pass rate</th>
              <th className="pb-3 font-normal">Aggregators</th>
              <th className="pb-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {commodityRows.map((row) => (
              <tr key={row.name} className="border-t border-[#E5E8DF]">
                <td className="py-3 text-[14px] leading-[20px] text-[#161D14]">{row.name}</td>
                <td className="py-3 text-[14px] leading-[20px] text-[#161D14]">{row.totalStock}</td>
                <td className="py-3">
                  <Sparkline data={row.trend} positive={row.changePositive} />
                </td>
                <td className="py-3 text-[14px] leading-[20px] font-bold" style={{ color: row.changePositive ? "#1A5514" : "#BA1A1A" }}>
                  {row.change}
                </td>
                <td className="py-3 text-[14px] leading-[20px] text-[#1A5514]">{row.qaPassRate}</td>
                <td className="py-3 text-[14px] leading-[20px] text-[#161D14]">{row.aggregators}</td>
                <td className="py-3"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

