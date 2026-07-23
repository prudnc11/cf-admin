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
  IconCheck,
  IconClock,
  IconCash,
  IconAlertTriangle,
  IconCircleCheck,
  IconX,
  IconClipboardCheck,
  IconFileText,
} from "@tabler/icons-react"

import { requests as procurementRequests } from "./procurement-request"
import type { RequestCard, PipelineStep, ModalType } from "./procurement-request"
import { ProcurementRequestDetailPage } from "./procurement-request-detail"
import { FilterDropdown, DATE_OPTIONS, isWithinDateRange } from "@/components/ui/filter-dropdown"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"
import { FinanceApproveForm } from "@/components/forms/finance-approve-form"
import { FinanceRejectForm } from "@/components/forms/finance-reject-form"
import { AttachProofForm } from "@/components/forms/attach-proof-form"
import { FinanceSignoffForm } from "@/components/forms/finance-signoff-form"

// --- Types ---

type DisbursementStage = "awaiting-review" | "pending-proof" | "signed-off" | "rejected" | "notify-failed"

type DisbursementItem = {
  source: RequestCard
  financeStage: DisbursementStage
}

// Derive finance stage from source request
function deriveFinanceStage(req: RequestCard): DisbursementStage {
  const ds = req.detailState
  if (req.statuses.some((s) => s.label === "Notify Failed")) return "notify-failed"
  if (ds.financeSignoff === "rejected") return "rejected"
  if (ds.financeSignoff === "awaiting-review") return "awaiting-review"
  if (ds.financeSignoff === "pending-proof") return "pending-proof"
  if (ds.financeSignoff === "signed-off") return "signed-off"
  return "awaiting-review"
}

// --- Data ---

const disbursementItems: DisbursementItem[] = procurementRequests
  .filter((r) => r.tabCategory === "Finance")
  .map((r) => ({ source: r, financeStage: deriveFinanceStage(r) }))

const tabItems = [
  { label: "Awaiting Review", badge: disbursementItems.filter((d) => d.financeStage === "awaiting-review").length },
  { label: "Pending Proof" },
  { label: "Rejected" },
  { label: "Signed Off" },
  { label: "Notification Failed" },
]

const tabIcons: Record<string, typeof IconCash> = {
  "Awaiting Review": IconClock,
  "Pending Proof": IconClipboardCheck,
  "Rejected": IconX,
  "Signed Off": IconCircleCheck,
  "Notification Failed": IconAlertTriangle,
}

const metricCards = [
  { label: "Awaiting Review", value: String(disbursementItems.filter((d) => d.financeStage === "awaiting-review").length), iconBg: "#FEF0D8", iconColor: "#995917", icon: IconClock },
  { label: "Pending Proof", value: String(disbursementItems.filter((d) => d.financeStage === "pending-proof").length), iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconClipboardCheck },
  { label: "Rejected", value: String(disbursementItems.filter((d) => d.financeStage === "rejected").length), iconBg: "#FEE2E2", iconColor: "#DC2626", icon: IconX, hasChevron: true },
  { label: "Signed Off", value: String(disbursementItems.filter((d) => d.financeStage === "signed-off").length), iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconCircleCheck },
  { label: "Notification Failed", value: String(disbursementItems.filter((d) => d.financeStage === "notify-failed").length), iconBg: "#FEE2E2", iconColor: "#DC2626", icon: IconAlertTriangle },
]

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

function FullPipelineStepper({ steps }: { steps: PipelineStep[] }) {
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

function DisbursementActions({ stage, onAction }: { stage: DisbursementStage; onAction?: (type: ModalType) => void }) {
  if (stage === "awaiting-review") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onAction?.("finance-approve") }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#36B92E] text-white text-[13px] leading-[18px] font-bold hover:bg-[#5EC758] transition-colors"
        >
          <IconCheck className="size-3.5" />
          Approve Disbursement
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction?.("finance-reject") }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#FFDAD6] text-[#8F0004] text-[13px] leading-[18px] font-bold hover:bg-[#FFCCC7] transition-colors"
        >
          <IconX className="size-3.5" />
          Reject
        </button>
      </div>
    )
  }
  return null
}

function DisbursementCardComponent({
  item,
  onOpen,
  onAction,
}: {
  item: DisbursementItem
  onOpen: () => void
  onAction?: (type: ModalType) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const req = item.source
  return (
    <div
      className="p-4 rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 cursor-pointer hover:outline-[#36B92E] transition-colors"
      onClick={onOpen}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] outline outline-1 outline-white shrink-0">
            <span className="text-[16px] leading-[24px] font-bold text-[#CEFFEB]">
              {req.cooperative.charAt(0)}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">
                {req.commodity} • {req.requestId}
              </span>
              {req.statuses.map((s, i) => (
                <StatusBadge key={i} label={s.label} color={s.color} />
              ))}
              {req.produceLabel && <ProduceLabel label={req.produceLabel} />}
            </div>
            <p className="text-[12px] leading-[18px] font-normal text-[#525C4E]">
              {req.cooperative} • {req.product} • {req.quantity} • Plan {req.plan}
            </p>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }} className="shrink-0">
          {expanded ? (
            <IconChevronUp className="size-5 text-[#161D14]" />
          ) : (
            <IconChevronDown className="size-5 text-[#161D14]" />
          )}
        </button>
      </div>

      {/* Expanded: Pipeline */}
      {expanded && <FullPipelineStepper steps={req.pipeline} />}

      {/* Always visible: Schedule info + Actions */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-4 text-[12px] leading-[18px]">
          <span className="text-[#525C4E]">
            Scheduled: <span className="font-bold">{req.scheduledDate}</span>
          </span>
          <span className="text-[#525C4E]">
            By: <span className="font-bold">{req.assignedTo}</span>
          </span>
          {req.confirmedBy !== "—" && (
            <span className="inline-flex items-center gap-1 text-[#008744]">
              <IconCheck className="size-3.5" />
              Confirmed {req.confirmedDate} by {req.confirmedBy}
            </span>
          )}
        </div>
        {expanded && <DisbursementActions stage={item.financeStage} onAction={onAction} />}
      </div>
    </div>
  )
}

// --- Main Page ---

export function DisbursementPage({ onDetailViewChange, initialTab }: { onDetailViewChange?: (v: boolean) => void; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || "Awaiting Review")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedRequest, setSelectedRequest] = useState<RequestCard | null>(null)
  const [activeModal, setActiveModal] = useState<{ type: ModalType; requestId: string } | null>(null)
  const { toast, showToast, dismissToast } = useToast()
  const [dateFilter, setDateFilter] = useState("all")
  const [aggregatorFilter, setAggregatorFilter] = useState("all")
  const [commodityFilter, setCommodityFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  const aggregatorOptions = [...new Set(disbursementItems.map((d) => d.source.cooperative))].map((v) => ({ label: v, value: v }))
  const commodityOptions = [...new Set(disbursementItems.map((d) => d.source.commodity))].map((v) => ({ label: v, value: v }))
  const planOptions = [...new Set(disbursementItems.map((d) => d.source.plan))].map((v) => ({ label: v, value: v }))

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    onDetailViewChange?.(!!selectedRequest)
  }, [selectedRequest, onDetailViewChange])

  const handleAction = (type: ModalType, requestId: string) => {
    setActiveModal({ type, requestId })
  }

  const closeModal = () => setActiveModal(null)

  const handleFormSubmit = (message: string) => {
    showToast(message)
    closeModal()
  }

  function renderDisbursementModals() {
    if (!activeModal) return null
    const reqId = activeModal.requestId
    const activeReq = disbursementItems.find((d) => d.source.requestId === reqId)?.source
    if (!activeReq) return null

    return (
      <>
        <FinanceApproveForm
          open={activeModal.type === "finance-approve"}
          onOpenChange={(o) => !o && closeModal()}
          request={activeReq}
          onSubmit={() => handleFormSubmit(`Disbursement approved for ${reqId} successfully`)}
        />
        <FinanceRejectForm
          open={activeModal.type === "finance-reject"}
          onOpenChange={(o) => !o && closeModal()}
          request={activeReq}
          onSubmit={() => handleFormSubmit(`Disbursement rejected for ${reqId} and returned to Ops Admin successfully`)}
        />
        <AttachProofForm
          open={activeModal.type === "attach-proof"}
          onOpenChange={(o) => !o && closeModal()}
          request={activeReq}
          onSubmit={() => handleFormSubmit(`Proof attached for ${reqId} successfully`)}
        />
        <FinanceSignoffForm
          open={activeModal.type === "finance-signoff"}
          onOpenChange={(o) => !o && closeModal()}
          request={activeReq}
          onSubmit={() => handleFormSubmit(`Sign-Off for ${reqId} completed & Supply chain notified successfully`)}
        />
      </>
    )
  }

  // Detail view
  if (selectedRequest) {
    return (
      <>
        <ProcurementRequestDetailPage
          onBack={() => setSelectedRequest(null)}
          request={selectedRequest}
          context="disbursement"
          onAction={(type) => handleAction(type, selectedRequest.requestId)}
        />
        {toast && <Toast message={toast} onDismiss={dismissToast} />}
        {renderDisbursementModals()}
      </>
    )
  }

  const filteredCards = disbursementItems.filter((d) => {
    const map: Record<string, DisbursementStage[]> = {
      "Awaiting Review": ["awaiting-review"],
      "Pending Proof": ["pending-proof"],
      "Signed Off": ["signed-off"],
      "Rejected": ["rejected"],
      "Notification Failed": ["notify-failed"],
    }
    if (!map[activeTab]?.includes(d.financeStage)) return false
    if (dateFilter !== "all" && !isWithinDateRange(d.source.scheduledDate, dateFilter)) return false
    if (aggregatorFilter !== "all" && d.source.cooperative !== aggregatorFilter) return false
    if (commodityFilter !== "all" && d.source.commodity !== commodityFilter) return false
    if (planFilter !== "all" && d.source.plan !== planFilter) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <FilterDropdown label="All time" icon={IconCalendar} options={DATE_OPTIONS} value={dateFilter} onChange={setDateFilter} allLabel="All time" />
        <FilterDropdown label="All Aggregators" icon={IconUsers} options={aggregatorOptions} value={aggregatorFilter} onChange={setAggregatorFilter} allLabel="All Aggregators" />
        <FilterDropdown label="All commodities" icon={IconWorld} options={commodityOptions} value={commodityFilter} onChange={setCommodityFilter} allLabel="All commodities" />
        <FilterDropdown label="All plans" icon={IconFileText} options={planOptions} value={planFilter} onChange={setPlanFilter} allLabel="All plans" />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-5">
        {metricCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3 hover-lift stagger-child"
              style={{ "--stagger-index": i } as React.CSSProperties}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md flex items-center" style={{ background: card.iconBg }}>
                  <Icon className="size-4" style={{ color: card.iconColor }} />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#161D14]">{card.label}</span>
                {card.hasChevron && <IconChevronRight className="size-4 text-[#525C4E]" />}
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
          const Icon = tabIcons[tab.label] || IconCash
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className="flex flex-col justify-center items-center self-stretch"
            >
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

      {/* Disbursement Cards */}
      <div className="flex flex-col gap-3">
        {filteredCards.map((item, i) => (
          <div key={i} className="stagger-child" style={{ "--stagger-index": i } as React.CSSProperties}>
            <DisbursementCardComponent
              item={item}
              onOpen={() => setSelectedRequest(item.source)}
              onAction={(type) => handleAction(type, item.source.requestId)}
            />
          </div>
        ))}
        {filteredCards.length === 0 && (
          <div className="flex items-center justify-center py-16 text-[14px] leading-[20px] text-[#525C4E]">
            No disbursement requests in this category.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">
          0 of {filteredCards.length} row(s) selected.
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Rows per page</span>
            <div className="flex items-center gap-1 h-9 px-3 rounded-lg outline outline-1 outline-[#E5E8DF]">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-transparent text-[14px] leading-[20px] font-normal text-[#161D14] outline-none appearance-none pr-4"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <IconChevronDown className="size-4 text-[#525C4E] -ml-3" />
            </div>
          </div>
          <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]">
              <IconChevronLeft className="size-4" />
            </button>
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]">
              <IconChevronsLeft className="size-4" />
            </button>
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]">
              <IconChevronRight className="size-4" />
            </button>
            <button className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6]">
              <IconChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={dismissToast} />}

      {/* Modals */}
      {renderDisbursementModals()}
    </div>
  )
}
