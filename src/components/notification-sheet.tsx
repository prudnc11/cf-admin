import { useState } from "react"
import {
  IconX,
  IconChevronRight,
  IconAlertTriangle,
  IconTruck,
  IconClipboardCheck,
  IconBuildingWarehouse,
  IconRoute,
  IconCalendar,
  IconUsers,
  IconCash,
  IconRefresh,
} from "@tabler/icons-react"

type Notification = {
  id: string
  title: string
  description: string
  date: string
  status: "unread" | "read"
  action?: { label: string; type: "link" | "retry" }
  icon: typeof IconAlertTriangle
  navigateTo?: string
  navigateTab?: string
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Low stock alert",
    description: "Sesame at sokoto Depot has fallen below the reorder threshold.",
    date: "23 Oct 2025, 12:45PM",
    status: "unread",
    action: { label: "View alert", type: "link" },
    icon: IconAlertTriangle,
    navigateTo: "Stock alerts",
  },
  {
    id: "2",
    title: "Pickup overdue - AR-2026-009",
    description: "Boateng Agric, Cassava scheduled pickup date passed without confirmation",
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconTruck,
    navigateTo: "Supply Requests",
    navigateTab: "QA",
  },
  {
    id: "3",
    title: "Quality variance flagged for review",
    description: "AR-2026-012. KMF Agro Ltd - 0.5 MT variance logged at warehouse QA, within tolerance but flagged",
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconBuildingWarehouse,
    navigateTo: "Supply Requests",
    navigateTab: "QA",
  },
  {
    id: "4",
    title: "Warehouse QA failed AR-2026-011",
    description: "Asare Family Farm. Shea Butter, contamination detected in 3 sacks, 1.2 MT variance",
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconBuildingWarehouse,
    navigateTo: "Supply Requests",
    navigateTab: "QA",
  },
  {
    id: "5",
    title: "Routing blocked . produce label missing",
    description: "AR-2026-071. Danso Farms Cooperative, GRN generated but no Export/Local/Both label was set at approval",
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconRoute,
    navigateTo: "Supply Requests",
    navigateTab: "GRN",
  },
  {
    id: "6",
    title: "Field visit overdue AR-2026-771",
    description: "Darko Farms, cassava, visit date passed without a QA log.",
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconCalendar,
    navigateTo: "Supply Requests",
    navigateTab: "QA",
  },
  {
    id: "7",
    title: "Aggregator resubmitted a rejected request",
    description: "AR-2026-120, Sarpong Cooperative, resubmission of AR-2026-166, awaiting field visit.",
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconUsers,
    navigateTo: "Supply Requests",
    navigateTab: "QA",
  },
  {
    id: "8",
    title: "Disbursement rejected - AR-2026-001",
    description: 'Finance Admin rejected, QA log missing moisture readings for this batch. "Please review and resubmit.',
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconCash,
    navigateTo: "Disbursement",
    navigateTab: "Rejected",
  },
  {
    id: "9",
    title: "Approved by Ops Admin",
    description: "Tetteh Cooperative, Rice, 38 MT. Awaiting your review and disbursement decision",
    date: "23 Oct 2025, 12:45PM",
    status: "read",
    icon: IconClipboardCheck,
    navigateTo: "Disbursement",
    navigateTab: "Awaiting Review",
  },
  {
    id: "10",
    title: "Supply Chain notification failed to send",
    description: "AR-2026-018 was signed off but the transport-request notification to Supply Chain did not deliver",
    date: "23 Oct 2025, 12:45PM",
    status: "unread",
    action: { label: "Retry delivery", type: "retry" },
    icon: IconRefresh,
    navigateTo: "Disbursement",
    navigateTab: "Notification Failed",
  },
]

export function NotificationSheet({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  onNavigate?: (page: string, tab?: string) => void
}) {
  const [items, setItems] = useState(notifications)

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, status: "read" as const })))
  }

  const handleClick = (n: Notification) => {
    setItems((prev) => prev.map((item) => item.id === n.id ? { ...item, status: "read" as const } : item))
    if (n.navigateTo && n.action?.type !== "retry") {
      onNavigate?.(n.navigateTo, n.navigateTab)
      onClose()
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-[rgba(23,31,23,0.40)] backdrop-blur-[4px] animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed top-0 right-0 z-50 w-[560px] h-full bg-white shadow-[0px_6px_20px_rgba(22,29,20,0.20)] overflow-hidden flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center h-[60px] px-4 border-b border-[#E5E8DF] shrink-0">
          <button onClick={onClose} className="flex items-center justify-center p-2 rounded-lg hover:bg-[#F7FAF6] transition-colors">
            <IconX className="size-5 text-[#161D14]" />
          </button>
          <span className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#161D14]">Notifications</span>
          <button
            onClick={markAllRead}
            className="flex items-center h-9 px-3 rounded-lg bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#1A5514] hover:bg-[#E1E4DA] transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {items.map((n, index) => {
            const isUnread = n.status === "unread"
            const Icon = n.icon
            const isNavigable = !!n.navigateTo && n.action?.type !== "retry"
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-8 cursor-pointer transition-colors duration-200 hover:bg-[#EDF0E6] stagger-child ${isUnread ? "bg-[#F4FCEC]" : "bg-white"}`}
                style={{ "--stagger-index": index } as React.CSSProperties}
                onClick={() => handleClick(n)}
              >
                <div className="py-5 shrink-0">
                  <div className="flex items-center justify-center size-6 rounded-[4px]">
                    <Icon className="size-5 transition-colors duration-200" style={{ color: isUnread ? "#36B92E" : "#525C4E" }} />
                  </div>
                </div>
                <div className="flex-1 py-5 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span
                      className={`flex-1 text-[16px] leading-[24px] transition-colors duration-200 ${isUnread ? "font-bold text-[#306B28]" : "font-normal text-[#525C4E]"}`}
                    >
                      {n.title}
                    </span>
                    <span
                      className={`text-[14px] leading-[20px] font-normal shrink-0 transition-colors duration-200 ${isUnread ? "text-[#306B28]" : "text-[#525C4E]"}`}
                    >
                      {n.date}
                    </span>
                  </div>
                  <p className={`text-[14px] leading-[20px] font-normal transition-colors duration-200 ${isUnread ? "text-[#161D14]" : "text-[#525C4E]"}`}>
                    {n.description}
                  </p>
                  {(n.action || isNavigable) && (
                    <button
                      className="flex items-center gap-0.5 pt-2 text-[14px] leading-[20px] font-bold text-[#36B92E] hover:text-[#2DA526] transition-colors duration-200 group"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClick(n)
                      }}
                    >
                      {n.action?.type === "retry" && <IconRefresh className="size-4 text-[#36B92E] group-hover:animate-spin" />}
                      {n.action?.label || "View details"}
                      {(n.action?.type === "link" || (!n.action && isNavigable)) && (
                        <IconChevronRight className="size-4 text-[#36B92E] transition-transform duration-200 group-hover:translate-x-0.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
