import { useState, Fragment } from "react"
import type { SupplyBid } from "./supply-bids"
import { supplyRequests } from "./supply-requests"
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
  IconRoute,
  IconCash,
  IconFileText,
  IconMessages,
  IconStar,
  IconClipboardCheck,
  IconDownload,
  IconListDetails,
  IconTimeline,
  IconMapPin,
} from "@tabler/icons-react"

// --- Types ---

export type BidModalType = "counter-offer" | "accept-price" | "schedule-visit" | "approve-date" | "log-qa" | "produce-label" | "finance-approve" | "finance-reject" | "attach-proof" | "finance-signoff" | "generate-grn" | "start-routing" | "prefinance-approve" | "prefinance-reject"

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

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-5 py-4 hover:bg-[#F7FAF6] transition-colors">
        <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">{title}</h3>
        {open ? <IconChevronUp className="size-5 text-[#525C4E]" /> : <IconChevronDown className="size-5 text-[#525C4E]" />}
      </button>
      {open && <div className="flex flex-col px-5 pb-5 border-t border-[#E5E8DF]">{children}</div>}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start">
      <span className="w-[269px] shrink-0 py-3 text-[16px] leading-[24px] font-normal text-[#525C4E]">{label}</span>
      <span className="flex-1 py-3 text-[16px] leading-[24px] font-normal text-[#161D14]">{value}</span>
    </div>
  )
}

function PipelineStepCircle({ status }: { status: "completed" | "current" | "pending" | "rejected" }) {
  if (status === "completed") return <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#C9F0D6]"><IconCheck className="size-[16px] text-[#00572D]" /></div>
  if (status === "current") return <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#D5E6FD]"><IconCheck className="size-[16px] text-[#00439E]" /></div>
  if (status === "rejected") return <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] bg-[#FEE2E2]"><IconX className="size-[16px] text-[#DC2626]" /></div>
  return <div className="inline-flex items-center gap-[10px] p-[4px] rounded-[1000px] outline outline-[1.4px] -outline-offset-[1.4px] outline-[#C3C8BC]"><div className="size-[16px] opacity-0" /></div>
}

function stepLabelColor(status: "completed" | "current" | "pending" | "rejected") {
  if (status === "completed") return "#008744"
  if (status === "current") return "#0063EA"
  if (status === "rejected") return "#DC2626"
  return "#525C4E"
}

function stageLabel(s: string): string {
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
    default: return s
  }
}

function stageColor(s: string): "green" | "blue" | "red" | "warning" {
  switch (s) {
    case "completed": case "routing": return "green"
    case "scheduling": case "grn": case "finance": return "blue"
    case "rejected": return "red"
    default: return "warning"
  }
}

const stageOrder = ["submitted", "negotiation", "scheduling", "field-qa", "warehouse-qa", "finance", "grn", "routing", "completed"]
function stageIndex(s: string) { return stageOrder.indexOf(s) }

// Finance mini-stepper
function FinanceMiniStepper({ status }: { status?: string }) {
  const steps = [
    { key: "awaiting-review", label: "Awaiting Review" },
    { key: "pending-proof", label: "Pending Proof" },
    { key: "awaiting-signoff", label: "Awaiting Sign-off" },
    { key: "signed-off", label: "Signed Off" },
  ]
  const idx = steps.findIndex(s => s.key === status)
  return (
    <div className="flex items-center gap-2 py-3">
      {steps.map((step, i) => {
        const isCompleted = i < idx
        const isCurrent = i === idx
        return (
          <Fragment key={step.key}>
            <div className="flex items-center gap-1.5">
              {isCompleted ? (
                <div className="flex items-center justify-center size-5 rounded-full bg-[#C9F0D6]">
                  <IconCheck className="size-3 text-[#00572D]" />
                </div>
              ) : isCurrent ? (
                <div className="flex items-center justify-center size-5 rounded-full bg-[#D5E6FD]">
                  <IconCheck className="size-3 text-[#00439E]" />
                </div>
              ) : (
                <div className="flex items-center justify-center size-5 rounded-full outline outline-1 outline-[#C3C8BC]">
                  <div className="size-3" />
                </div>
              )}
              <span className={`text-[12px] leading-[18px] whitespace-nowrap ${isCompleted ? "text-[#008744]" : isCurrent ? "text-[#0063EA] font-bold" : "text-[#525C4E]"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 min-w-[12px] rounded-full" style={{ background: i < idx ? "#36B92E" : "#E1E4DA" }} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

// --- Main Component ---

export function SupplyBidDetailPage({
  onBack,
  bid,
  context,
  onAction,
  onNavigateToProfile,
}: {
  onBack: () => void
  bid: SupplyBid
  context?: "bids" | "disbursement"
  onAction?: (type: BidModalType) => void
  onNavigateToProfile?: () => void
}) {
  const si = stageIndex(bid.stage)
  const [activeTab, setActiveTab] = useState<"details" | "audit">("details")

  const primaryBtnClass = "inline-flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[8px] bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
  const outlineBtnClass = "inline-flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[8px] outline outline-1 outline-[#E5E8DF] text-[#161D14] text-[14px] leading-[20px] font-bold hover:bg-[#F7FAF6] transition-colors"

  // Action buttons based on stage
  const actionButtons = () => {
    if (bid.stage === "submitted") {
      return (
        <>
          <button onClick={() => onAction?.("counter-offer")} className={outlineBtnClass}>
            <IconMessages className="size-[16px]" />
            Counter Offer
          </button>
          <button onClick={() => onAction?.("accept-price")} className={primaryBtnClass}>
            <IconCheck className="size-[16px]" />
            Accept Price
          </button>
        </>
      )
    }
    if (bid.stage === "negotiation") {
      return (
        <>
          <button onClick={() => onAction?.("counter-offer")} className={outlineBtnClass}>
            <IconMessages className="size-[16px]" />
            Counter Offer
          </button>
          <button onClick={() => onAction?.("accept-price")} className={primaryBtnClass}>
            <IconCheck className="size-[16px]" />
            Accept Price
          </button>
        </>
      )
    }
    if (bid.stage === "scheduling") {
      return (
        <button onClick={() => onAction?.("schedule-visit")} className={primaryBtnClass}>
          <IconCalendar className="size-[16px]" />
          {bid.deliveryMethod === "field-visit" ? "Schedule Field Visit" : "Schedule Warehouse Delivery"}
        </button>
      )
    }
    if (bid.stage === "field-qa" || bid.stage === "warehouse-qa") {
      return (
        <button onClick={() => onAction?.("log-qa")} className={primaryBtnClass}>
          <IconClipboardCheck className="size-[16px]" />
          Log QA
        </button>
      )
    }
    if (bid.stage === "finance") {
      if (bid.financeStatus === "awaiting-review") {
        return (
          <>
            <button onClick={() => onAction?.("finance-reject")} className="inline-flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[8px] outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[14px] leading-[20px] font-bold hover:bg-[#FEE2E2] transition-colors">
              <IconX className="size-[16px]" />
              Reject
            </button>
            <button onClick={() => onAction?.("finance-approve")} className={primaryBtnClass}>
              <IconCheck className="size-[16px]" />
              Approve Disbursement
            </button>
          </>
        )
      }
      if (bid.financeStatus === "pending-proof") {
        return (
          <button onClick={() => onAction?.("attach-proof")} className={primaryBtnClass}>
            Attach Proof of Payment
          </button>
        )
      }
      if (bid.financeStatus === "awaiting-signoff") {
        return (
          <button onClick={() => onAction?.("finance-signoff")} className={primaryBtnClass}>
            <IconCheck className="size-[16px]" />
            Sign Off
          </button>
        )
      }
      return null
    }
    if (bid.stage === "grn") {
      return (
        <button onClick={() => onAction?.("generate-grn")} className={primaryBtnClass}>
          <IconFileText className="size-[16px]" />
          Generate GRN
        </button>
      )
    }
    if (bid.stage === "routing") {
      return (
        <button onClick={() => onAction?.("start-routing")} className={primaryBtnClass}>
          <IconRoute className="size-[16px]" />
          Start Routing
        </button>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col animate-fade-in-up">
      {/* Detail Header */}
      <div className="inline-flex justify-between items-start px-[40px] py-[16px] bg-white border-b border-[#E5E8DF] -mx-[40px]">
        {/* Left: Breadcrumb + Title */}
        <div className="inline-flex flex-col items-start gap-[4px]">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-[2px] py-[4px]">
            <button onClick={onBack} className="flex items-center gap-[2px] h-[22px] text-[16px] leading-[24px] font-bold text-[#36B92E] hover:text-[#2DA526] transition-colors">
              {context === "disbursement" ? "Disbursement" : "Bid Management"}
            </button>
            <div className="w-[20px] h-[20px] flex items-center justify-center">
              <IconChevronRight className="size-[20px] text-[#73796E]" />
            </div>
            <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">Request details</span>
          </div>
          {/* Title + Badges */}
          <div className="inline-flex items-center gap-[4px]">
            <h1 className="text-[28px] leading-[36px] font-bold text-[#161D14]">
              {bid.crop} • {bid.id}
            </h1>
            <div className="flex items-start gap-[12px]">
              <StatusBadge label={stageLabel(bid.stage)} color={stageColor(bid.stage)} />
              {bid.produceLabel && (
                <span className="inline-flex items-center px-[6px] py-[2px] rounded-[6px] outline outline-1 outline-[#E5E8DF] text-[12px] leading-[18px] font-normal text-[#161D14]">
                  {bid.produceLabel}
                </span>
              )}
              {bid.financeStatus && bid.stage === "finance" && (
                <StatusBadge
                  label={bid.financeStatus === "awaiting-review" ? "Awaiting Review" : bid.financeStatus === "pending-proof" ? "Pending Proof" : bid.financeStatus === "signed-off" ? "Signed Off" : bid.financeStatus === "rejected" ? "Rejected" : "Awaiting Sign-off"}
                  color={bid.financeStatus === "signed-off" ? "green" : bid.financeStatus === "rejected" ? "red" : "warning"}
                />
              )}
            </div>
          </div>
        </div>
        {/* Right: Action buttons */}
        <div className="flex items-center gap-[16px]">
          <button className="inline-flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[8px] outline outline-1 outline-[#E5E8DF] text-[#161D14] text-[14px] leading-[20px] font-bold hover:bg-[#F7FAF6] transition-colors">
            <IconDownload className="size-[16px]" />
            Export
          </button>
          {actionButtons()}
        </div>
      </div>

      {/* Pipeline Stepper */}
      <div className="inline-flex flex-col items-start gap-[16px] px-[2px] py-[16px] bg-white rounded-[12px] w-full">
        <div className="self-stretch flex flex-col items-start gap-[20px] py-[4px]">
          <div className="self-stretch inline-flex items-center">
            {bid.pipeline.map((step, i) => (
              <Fragment key={step.label}>
                <div className="w-[80px] inline-flex flex-col items-center gap-[8px]">
                  <PipelineStepCircle status={step.status} />
                  <span className="text-center text-[12px] leading-[18px] font-normal" style={{ color: stepLabelColor(step.status) }}>
                    {step.label}
                  </span>
                </div>
                {i < bid.pipeline.length - 1 && (
                  <div className="flex-[1_1_0] h-[4px] rounded-[1000px]" style={{ background: bid.pipeline[i + 1]?.status !== "pending" ? "#36B92E" : "#E1E4DA" }} />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

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
              {/* 1. Bid Details - always visible */}
              <CollapsibleSection title="Bid Details">
                <div className="flex items-start">
                  <span className="w-[269px] shrink-0 py-3 text-[16px] leading-[24px] font-normal text-[#525C4E]">Aggregator</span>
                  <div className="flex-1 py-3 flex items-center gap-3">
                    <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">{bid.aggregator}</span>
                    {onNavigateToProfile && (
                      <button
                        onClick={onNavigateToProfile}
                        className="text-[13px] leading-[18px] font-bold text-[#36B92E] hover:text-[#2DA526] transition-colors"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                </div>
                <InfoRow label="Crop / Variety" value={`${bid.crop} - ${bid.variety}`} />
                <InfoRow label="Quantity" value={`${bid.quantity} ${bid.unit}`} />
                <InfoRow label="Price per Unit" value={bid.pricePerUnit} />
                <InfoRow label="Total Value" value={bid.totalValue} />
                <InfoRow label="Delivery Method" value={bid.deliveryMethod === "field-visit" ? "Field Visit" : "Warehouse Visit"} />
                <InfoRow label="Submitted" value={bid.submittedDate} />
                <InfoRow label="Supply Request" value={bid.supplyRequestId} />
              </CollapsibleSection>

              {/* 2. Negotiation History */}
              {si >= stageIndex("negotiation") && (
                <CollapsibleSection title="Negotiation History" defaultOpen={bid.stage === "negotiation"}>
                  {bid.negotiations.length > 0 ? (
                    <div className="flex flex-col gap-3 py-3">
                      {bid.negotiations.map((round, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`flex items-center justify-center size-8 rounded-full shrink-0 ${round.by === "admin" ? "bg-[#D5E6FD]" : "bg-[#E2D1FD]"}`}>
                            <IconUser className={`size-4 ${round.by === "admin" ? "text-[#00439E]" : "text-[#7925CC]"}`} />
                          </div>
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">
                                {round.by === "admin" ? "Admin" : "Aggregator"}
                              </span>
                              <span className="text-[12px] leading-[18px] text-[#525C4E]">{round.date}</span>
                            </div>
                            <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{round.price}</span>
                            {round.note && <span className="text-[14px] leading-[20px] text-[#525C4E]">{round.note}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-3 text-[14px] leading-[20px] text-[#525C4E]">No negotiation rounds yet.</p>
                  )}
                </CollapsibleSection>
              )}

              {/* 3. Scheduling */}
              {si >= stageIndex("scheduling") && (
                <CollapsibleSection title="Scheduling" defaultOpen={bid.stage === "scheduling"}>
                  {bid.scheduledDate ? (
                    <>
                      <InfoRow label="Scheduled Date" value={bid.scheduledDate} />
                      <InfoRow label="Visit Type" value={bid.deliveryMethod === "field-visit" ? "Field Visit" : "Warehouse Visit"} />
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 py-3">
                      <p className="text-[14px] leading-[20px] text-[#525C4E]">Not yet scheduled.</p>
                      {bid.stage === "scheduling" && (
                        <button
                          onClick={() => onAction?.("schedule-visit")}
                          className="self-start flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                        >
                          <IconCalendar className="size-4" />
                          {bid.deliveryMethod === "field-visit" ? "Schedule Field Visit" : "Schedule Warehouse Delivery"}
                        </button>
                      )}
                    </div>
                  )}
                </CollapsibleSection>
              )}

              {/* 3b. Pre-financing */}
              {bid.prefinanceStatus && (
                <CollapsibleSection title="Pre-financing" defaultOpen={bid.prefinanceStatus === "requested"}>
                  <div className="flex flex-col gap-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] ${
                        bid.prefinanceStatus === "approved" ? "bg-[#D4F5D0]" :
                        bid.prefinanceStatus === "rejected" ? "bg-[#FEE2E2]" :
                        "bg-[#FEF0D8]"
                      }`}>
                        <span className={`size-[5px] rounded-full ${
                          bid.prefinanceStatus === "approved" ? "bg-[#1A5514]" :
                          bid.prefinanceStatus === "rejected" ? "bg-[#DC2626]" :
                          "bg-[#995917]"
                        }`} />
                        <span className={`text-[12px] leading-[18px] font-normal ${
                          bid.prefinanceStatus === "approved" ? "text-[#1A5514]" :
                          bid.prefinanceStatus === "rejected" ? "text-[#DC2626]" :
                          "text-[#995917]"
                        }`}>
                          {bid.prefinanceStatus === "approved" ? "Approved" : bid.prefinanceStatus === "rejected" ? "Rejected" : "Pending Review"}
                        </span>
                      </span>
                    </div>
                    <InfoRow label="Amount Requested" value={bid.prefinanceAmountRequested || "—"} />
                    {bid.prefinanceStatus === "approved" && (
                      <>
                        <InfoRow label="Amount Disbursed" value={bid.prefinanceAmountDisbursed || "—"} />
                        <div className="flex items-start">
                          <span className="w-[269px] shrink-0 py-3 text-[16px] leading-[24px] font-bold text-[#1A5514]">Remaining Balance</span>
                          <span className="flex-1 py-3 text-[16px] leading-[24px] font-bold text-[#1A5514]">
                            {(() => {
                              const total = parseFloat(bid.totalValue.replace(/[^0-9.]/g, ""))
                              const disbursed = parseFloat((bid.prefinanceAmountDisbursed || "0").replace(/[^0-9.]/g, ""))
                              return `GHS ${(total - disbursed).toLocaleString()}`
                            })()}
                          </span>
                        </div>
                      </>
                    )}
                    {bid.prefinanceStatus === "rejected" && bid.prefinanceRejectionReason && (
                      <InfoRow label="Rejection Reason" value={bid.prefinanceRejectionReason} />
                    )}
                    {bid.prefinanceStatus === "requested" && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onAction?.("prefinance-reject")}
                          className="flex items-center gap-1.5 h-9 px-4 rounded-lg outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[14px] leading-[20px] font-bold hover:bg-[#FEE2E2] transition-colors"
                        >
                          <IconX className="size-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => onAction?.("prefinance-approve")}
                          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                        >
                          <IconCheck className="size-4" />
                          Approve Pre-financing
                        </button>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              )}

              {/* 4. QA Results */}
              {(si >= stageIndex("field-qa") || bid.stage === "warehouse-qa") && (
                <CollapsibleSection title="QA Results" defaultOpen={bid.stage === "field-qa" || bid.stage === "warehouse-qa"}>
                  {bid.qaResult ? (
                    <>
                      <InfoRow label="QA Type" value={bid.deliveryMethod === "field-visit" ? "Field QA" : "Warehouse QA"} />
                      <InfoRow label="Result" value={bid.qaResult === "pass" ? "Passed" : bid.qaResult === "fail" ? "Failed" : "Pending"} />
                      <InfoRow label="Moisture %" value="12.4%" />
                      <InfoRow label="Foreign Matter %" value="0.8%" />
                      <InfoRow label="Grade" value="Grade A" />
                      <InfoRow label="Quantity Verified" value={`${bid.quantity} ${bid.unit}`} />
                      <InfoRow label="Variance" value="0.2 MT" />
                      {/* Supply Chain: Label Produce (only when QA passed but not yet labeled) */}
                      {bid.qaResult === "pass" && !bid.produceLabel && (bid.stage === "field-qa" || bid.stage === "warehouse-qa") && (
                        <div className="flex items-center gap-3 py-3 mt-1 border-t border-[#E5E8DF]">
                          <div className="flex-1">
                            <p className="text-[14px] leading-[20px] font-bold text-[#161D14]">Awaiting produce labeling</p>
                            <p className="text-[12px] leading-[18px] text-[#525C4E]">Supply Chain must label this produce before it moves to Finance</p>
                          </div>
                          <button
                            onClick={() => onAction?.("produce-label")}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                          >
                            Label Produce
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 py-3">
                      <p className="text-[14px] leading-[20px] text-[#525C4E]">QA not yet completed.</p>
                      {(bid.stage === "field-qa" || bid.stage === "warehouse-qa") && (
                        <button
                          onClick={() => onAction?.("log-qa")}
                          className="self-start flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                        >
                          <IconClipboardCheck className="size-4" />
                          Log QA Results
                        </button>
                      )}
                    </div>
                  )}
                </CollapsibleSection>
              )}

              {/* 5. Finance & Disbursement */}
              {si >= stageIndex("finance") && (
                <CollapsibleSection title="Finance & Disbursement" defaultOpen={bid.stage === "finance"}>
                  <FinanceMiniStepper status={bid.financeStatus} />
                  <InfoRow label="Total Bid Value" value={bid.totalValue} />
                  {bid.prefinanceStatus === "approved" && bid.prefinanceAmountDisbursed && (
                    <>
                      <InfoRow label="Pre-financed (deducted)" value={`-${bid.prefinanceAmountDisbursed}`} />
                      <div className="flex items-start">
                        <span className="w-[269px] shrink-0 py-3 text-[16px] leading-[24px] font-bold text-[#161D14]">Net Disbursement</span>
                        <span className="flex-1 py-3 text-[16px] leading-[24px] font-bold text-[#1A5514]">
                          {(() => {
                            const total = parseFloat(bid.totalValue.replace(/[^0-9.]/g, ""))
                            const disbursed = parseFloat((bid.prefinanceAmountDisbursed || "0").replace(/[^0-9.]/g, ""))
                            return `GHS ${(total - disbursed).toLocaleString()}`
                          })()}
                        </span>
                      </div>
                    </>
                  )}
                  <InfoRow label="Payment Method" value="Bank Transfer" />
                  <InfoRow label="Tranches" value={bid.prefinanceStatus === "approved" ? "Pre-financed + Remainder" : "Full Payment"} />
                  {bid.stage === "finance" && (
                    <div className="flex items-center gap-2 py-3">
                      {bid.financeStatus === "awaiting-review" && (
                        <>
                          <button
                            onClick={() => onAction?.("finance-reject")}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-lg outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[14px] leading-[20px] font-bold hover:bg-[#FEE2E2] transition-colors"
                          >
                            <IconX className="size-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => onAction?.("finance-approve")}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                          >
                            <IconCheck className="size-4" />
                            Approve
                          </button>
                        </>
                      )}
                      {bid.financeStatus === "pending-proof" && (
                        <button
                          onClick={() => onAction?.("attach-proof")}
                          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                        >
                          Attach Proof
                        </button>
                      )}
                      {bid.financeStatus === "awaiting-signoff" && (
                        <button
                          onClick={() => onAction?.("finance-signoff")}
                          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                        >
                          <IconCheck className="size-4" />
                          Sign Off
                        </button>
                      )}
                    </div>
                  )}
                </CollapsibleSection>
              )}

              {/* 6. GRN */}
              {si >= stageIndex("grn") && (
                <CollapsibleSection title="Goods Received Note (GRN)" defaultOpen={bid.stage === "grn"}>
                  {bid.grnNumber ? (
                    <>
                      <InfoRow label="GRN Number" value={bid.grnNumber} />
                      <InfoRow label="Produce Label" value={bid.produceLabel || "—"} />
                      <InfoRow label="Status" value="Generated" />
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 py-3">
                      <p className="text-[14px] leading-[20px] text-[#525C4E]">GRN not yet generated.</p>
                      {bid.stage === "grn" && (
                        <button
                          onClick={() => onAction?.("generate-grn")}
                          className="self-start flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                        >
                          <IconFileText className="size-4" />
                          Generate GRN
                        </button>
                      )}
                    </div>
                  )}
                </CollapsibleSection>
              )}

              {/* 7. Routing */}
              {si >= stageIndex("routing") && (
                <CollapsibleSection title="Routing & Fulfilment" defaultOpen={bid.stage === "routing"}>
                  {bid.routingDestination ? (
                    <>
                      <InfoRow label="Destination" value={bid.routingDestination} />
                      <InfoRow label="Routing Type" value={bid.produceLabel === "Export" ? "Export via warehouse" : "Local dispatch"} />
                      <InfoRow label="Waybill" value="WB-2026-0042" />
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 py-3">
                      <p className="text-[14px] leading-[20px] text-[#525C4E]">Not yet routed.</p>
                      {bid.stage === "routing" && (
                        <button
                          onClick={() => onAction?.("start-routing")}
                          className="self-start flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors"
                        >
                          <IconRoute className="size-4" />
                          Start Routing
                        </button>
                      )}
                    </div>
                  )}
                </CollapsibleSection>
              )}

              {/* Aggregator Score */}
              {bid.aggregatorScore && (
                <CollapsibleSection title="Aggregator Score" defaultOpen={false}>
                  <div className="flex items-center gap-3 py-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <IconStar
                          key={star}
                          className="size-5"
                          style={{ color: star <= Math.round(bid.aggregatorScore!) ? "#FBB33A" : "#E1E4DA" }}
                          fill={star <= Math.round(bid.aggregatorScore!) ? "#FBB33A" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{bid.aggregatorScore}/5.0</span>
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
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Bid Submitted</span>
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">{bid.submittedDate} by {bid.aggregator}</span>
                  </div>
                </div>
                {si >= stageIndex("negotiation") && bid.negotiations.length > 0 && (
                  bid.negotiations.map((round, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`flex items-center justify-center size-8 rounded-full shrink-0 ${round.by === "admin" ? "bg-[#D5E6FD]" : "bg-[#E2D1FD]"}`}>
                        <IconMessages className={`size-4 ${round.by === "admin" ? "text-[#00439E]" : "text-[#7925CC]"}`} />
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">
                          {round.by === "admin" ? "Counter offer sent" : "Price submitted"} — {round.price}
                        </span>
                        <span className="text-[12px] leading-[18px] text-[#525C4E]">{round.date}</span>
                      </div>
                    </div>
                  ))
                )}
                {si >= stageIndex("scheduling") && bid.scheduledDate && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#D5E6FD] shrink-0">
                      <IconCalendar className="size-4 text-[#00439E]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Visit scheduled</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{bid.scheduledDate}</span>
                    </div>
                  </div>
                )}
                {bid.prefinanceStatus && (
                  <div className="flex items-start gap-3">
                    <div className={`flex items-center justify-center size-8 rounded-full shrink-0 ${
                      bid.prefinanceStatus === "approved" ? "bg-[#C9F0D6]" :
                      bid.prefinanceStatus === "rejected" ? "bg-[#FEE2E2]" :
                      "bg-[#FEF0D8]"
                    }`}>
                      <IconCash className={`size-4 ${
                        bid.prefinanceStatus === "approved" ? "text-[#00572D]" :
                        bid.prefinanceStatus === "rejected" ? "text-[#DC2626]" :
                        "text-[#995917]"
                      }`} />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">
                        Pre-financing {bid.prefinanceStatus === "approved" ? `Approved — ${bid.prefinanceAmountDisbursed}` : bid.prefinanceStatus === "rejected" ? "Rejected" : "Requested"}
                      </span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">
                        {bid.prefinanceStatus === "approved" ? "Funds disbursed before field visit" : bid.prefinanceStatus === "rejected" ? bid.prefinanceRejectionReason || "Request denied" : `Pending review — ${bid.prefinanceAmountRequested}`}
                      </span>
                    </div>
                  </div>
                )}
                {bid.qaResult && (
                  <div className="flex items-start gap-3">
                    <div className={`flex items-center justify-center size-8 rounded-full shrink-0 ${bid.qaResult === "pass" ? "bg-[#C9F0D6]" : "bg-[#FEE2E2]"}`}>
                      <IconClipboardCheck className={`size-4 ${bid.qaResult === "pass" ? "text-[#00572D]" : "text-[#DC2626]"}`} />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">QA {bid.qaResult === "pass" ? "Passed" : "Failed"}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">Quality assessment completed</span>
                    </div>
                  </div>
                )}
                {bid.grnNumber && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#C9F0D6] shrink-0">
                      <IconFileText className="size-4 text-[#00572D]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">GRN Generated — {bid.grnNumber}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">Goods received note created</span>
                    </div>
                  </div>
                )}
                {bid.stage === "completed" && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#C9F0D6] shrink-0">
                      <IconCheck className="size-4 text-[#00572D]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Bid Completed</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">All stages fulfilled</span>
                    </div>
                  </div>
                )}
                {bid.stage === "rejected" && (
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-[#FEE2E2] shrink-0">
                      <IconX className="size-4 text-[#DC2626]" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Bid Rejected</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">Request did not pass review</span>
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
            {(() => {
              const sr = supplyRequests.find(r => r.id === bid.supplyRequestId)
              return (
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <IconFileText className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Request ID</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#36B92E]">{bid.supplyRequestId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconPlant className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Crop / Variety</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{sr ? `${sr.crop} - ${sr.variety}` : bid.crop}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconPackage className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Target Qty</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{sr ? `${sr.quantity} ${sr.unit}` : `${bid.quantity} ${bid.unit}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMapPin className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Region</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{sr?.region ?? bid.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCash className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Budget</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{sr?.budget ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCalendar className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Window</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{sr?.aggregationWindow ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconUser className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Created by</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{sr?.createdBy ?? "—"}</span>
                  </div>
                  <div className="h-px bg-[#E5E8DF]" />
                  <div className="flex items-center gap-2">
                    <IconClipboardCheck className="size-4 text-[#525C4E]" />
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">Linked Bids</span>
                    <span className="ml-auto text-[14px] leading-[20px] font-bold text-[#161D14]">{sr?.linkedBids ?? "—"}</span>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
