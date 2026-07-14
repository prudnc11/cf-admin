import { useState, Fragment } from "react"
import type { RequestCard, PipelineStep, DetailState } from "./procurement-request"
import {
  IconCheck,
  IconChevronUp,
  IconChevronDown,
  IconEye,
  IconDownload,
  IconClipboardCheck,
  IconTruck,
  IconFileText,
  IconCalendar,
  IconUser,
  IconPackage,
  IconPlant,
  IconBuildingWarehouse,
  IconRoute,
  IconCash,
  IconX,
  IconClock,
  IconAlertTriangle,
  IconUpload,
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

type FileItem = { name: string; date: string; uploadedBy?: string; type: "image" | "document" }

function FileRow({ file }: { file: FileItem }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">{file.name}</span>
        <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">
          {file.date}
          {file.uploadedBy && <> <span className="text-[#008744]">Uploaded by {file.uploadedBy}</span></>}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconEye className="size-5 text-[#1A5514]" /></button>
        <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconDownload className="size-5 text-[#1A5514]" /></button>
      </div>
    </div>
  )
}

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-4 border-b border-[#E5E8DF]">
        <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">{title}</h3>
        {open ? <IconChevronUp className="size-6 text-[#161D14]" /> : <IconChevronDown className="size-6 text-[#161D14]" />}
      </button>
      {open && <div className="flex flex-col">{children}</div>}
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

type StepDef = { label: string; status: "completed" | "current" | "pending" | "rejected" }

function DetailPipelineStepper({ steps }: { steps: PipelineStep[] }) {
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

function FinanceMiniStepper({ steps }: { steps: StepDef[] }) {
  return (
    <div className="py-1 w-full mb-2">
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

function PendingSection({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="size-2 rounded-full bg-[#E1E4DA]" />
      <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">{label}</span>
    </div>
  )
}

// --- Action buttons based on detail state ---

function getActionButton(ds: DetailState) {
  if (!ds.actionButton) return null
  const iconMap: Record<string, typeof IconRoute> = {
    route: IconRoute, qa: IconClipboardCheck, approve: IconCheck, pickup: IconTruck, finance: IconCash, grn: IconFileText,
  }
  const Icon = iconMap[ds.actionButton.icon] || IconRoute
  return { label: ds.actionButton.label, Icon }
}

// --- Section renderers ---

function FieldVisitSection({ state }: { state: DetailState }) {
  if (state.fieldVisit === "pending") return <CollapsibleSection title="Field Visit Request" defaultOpen={false}><PendingSection label="Not yet scheduled" /></CollapsibleSection>
  if (state.fieldVisit === "scheduled") {
    return (
      <CollapsibleSection title="Field Visit Request">
        <div className="flex flex-col">
          <InfoRow label="Aggregation location" value={`${state.summaryData.warehouse} area`} />
          <InfoRow label="Quantity at location" value={state.summaryData.quantity} />
          <InfoRow label="Aggregator notes" value="Access road is rough after rain - advise your team to use a 4x4 truck." />
        </div>
        <div className="mt-2 px-3 py-2.5 bg-[#D5E6FD] rounded-lg flex flex-col gap-1">
          <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Visit scheduled - visible on aggregator dashboard</span>
          <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Date: <span className="font-bold">12-06-2026</span> • Assigned: <span className="font-bold">Ama Mensah (Field Ops)</span></span>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Scheduled by Ama Mensah on 02 Mar 2026</span>
        </div>
      </CollapsibleSection>
    )
  }
  return (
    <CollapsibleSection title="Field Visit Request">
      <div className="flex flex-col">
        <InfoRow label="Aggregation location" value={`${state.summaryData.warehouse} area`} />
        <InfoRow label="Quantity at location" value={state.summaryData.quantity} />
        <InfoRow label="Aggregator notes" value="Access road is rough after rain - advise your team to use a 4x4 truck." />
      </div>
      <div className="p-4 bg-[#F7FAF6] rounded-[12px] flex flex-col gap-2">
        <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Visit scheduled - visible on aggregator dashboard</span>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Date: <span className="font-bold">12-06-2026</span> • Assigned: <span className="font-bold">Ama Mensah</span> (Field Ops)</span>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Scheduled by Ama Mensah on 02 Mar 2026</span>
        </div>
      </div>
    </CollapsibleSection>
  )
}

function FieldQASection({ state }: { state: DetailState }) {
  if (state.fieldQA === "pending") return <CollapsibleSection title="Field QA outcome" defaultOpen={false}><PendingSection label="Awaiting field visit completion" /></CollapsibleSection>
  if (state.fieldQA === "action-needed") {
    return (
      <CollapsibleSection title="Field QA outcome">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FEF0D8] rounded-lg">
          <span className="text-[14px] leading-[20px] font-bold text-[#995917]">Action required: Log the Field QA results after the visit</span>
        </div>
      </CollapsibleSection>
    )
  }
  return (
    <CollapsibleSection title="Field QA outcome">
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] leading-[24px] font-normal text-[#161D14]">Good quality {state.summaryData.crop.toLowerCase()}. Minimal foreign matter. Approved for collection</p>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Logged 2026-06-12 09:30 by Ama Mensah (Field Ops)</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#C9F0D6] text-[14px] leading-[20px] font-normal text-[#00572D] shrink-0">
          <IconCheck className="size-4" />
          Pass
        </span>
      </div>
      <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] p-4 flex flex-col gap-2">
        <span className="text-[14px] leading-[20px] font-bold text-[#525C4E]">Images</span>
        <FileRow file={{ name: "field-qa-rice.jpg", date: "22 Mar 2026, 4:13 PM", type: "image" }} />
        <div className="h-2 bg-[#F3F7F2] -mx-4" />
        <FileRow file={{ name: "field-qa-rice.jpg", date: "22 Mar 2026, 4:13 PM", type: "image" }} />
        <div className="h-2 bg-[#F3F7F2] -mx-4" />
        <FileRow file={{ name: "field-qa-rice.jpg", date: "22 Mar 2026, 4:13 PM", type: "image" }} />
        <div className="h-2 bg-[#F3F7F2] -mx-4" />
        <FileRow file={{ name: "field-qa-rice.jpg", date: "22 Mar 2026, 4:13 PM", type: "image" }} />
        <div className="p-4 bg-[#F7FAF6] rounded-[12px] flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[12px] leading-[18px] font-bold text-[#525C4E]">Document</span>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">farm-inspection-form.pdf</span>
              <div className="flex items-center gap-1">
                <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">22 Mar 2026, 4:13 PM</span>
                <span className="text-[12px] leading-[18px] font-normal text-[#008744]">Uploaded by Ama Mensah (Ops)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconEye className="size-5 text-[#1A5514]" /></button>
            <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconDownload className="size-5 text-[#1A5514]" /></button>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}

function ApprovalSection({ state }: { state: DetailState }) {
  if (state.approval === "pending") return <CollapsibleSection title="Approval" defaultOpen={false}><PendingSection label="Awaiting Field QA completion" /></CollapsibleSection>
  if (state.approval === "action-needed") {
    return (
      <CollapsibleSection title="Approval">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FEF0D8] rounded-lg">
          <span className="text-[14px] leading-[20px] font-bold text-[#995917]">Action required: Review and approve or reject this request</span>
        </div>
      </CollapsibleSection>
    )
  }
  if (state.approval === "rejected") {
    return (
      <CollapsibleSection title="Approval">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge label="Rejected" color="red" />
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Rejected by Ops Manager on 13 Jun 2026</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Reason: <span className="font-bold">Quality below threshold. Excessive moisture content detected.</span></span>
        </div>
      </CollapsibleSection>
    )
  }
  return (
    <CollapsibleSection title="Approval">
      <div className="p-4 bg-[#F7FAF6] rounded-[12px] flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge label="Approved" color="green" />
          <span className="inline-flex items-center px-2 py-1 rounded-[6px] bg-[#D5E6FD] text-[14px] leading-[20px] font-normal text-[#00439E]">Routing: Local</span>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Scheduled by Ama Mensah on 02 Mar 2026</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Date: <span className="font-bold">12-06-2026</span> • Assigned: <span className="font-bold">Ama Mensah</span> (Field Ops)</span>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Scheduled by Ama Mensah on 02 Mar 2026</span>
        </div>
      </div>
    </CollapsibleSection>
  )
}

function FinanceSection({ state, effectiveState, interactive, onAction }: { state: DetailState; effectiveState?: DetailState["financeSignoff"]; interactive?: boolean; onAction?: (action: string) => void }) {
  const financeState = effectiveState ?? state.financeSignoff
  if (financeState === "pending") return <CollapsibleSection title="Finance Sign-off" defaultOpen={false}><PendingSection label="Awaiting approval" /></CollapsibleSection>

  const miniSteps: StepDef[] = (() => {
    if (financeState === "rejected") {
      return [
        { label: "Awaiting Review", status: "rejected" as const },
        { label: "Pending Proof", status: "pending" as const },
        { label: "Signed Off", status: "pending" as const },
      ]
    }
    return [
      { label: "Awaiting Review", status: financeState === "awaiting-review" ? "current" as const : "completed" as const },
      { label: "Pending Proof", status: financeState === "pending-proof" ? "current" as const : (financeState === "signed-off" || financeState === "awaiting-signoff") ? "completed" as const : "pending" as const },
      { label: "Sign-Off", status: financeState === "signed-off" ? "completed" as const : financeState === "awaiting-signoff" ? "current" as const : "pending" as const },
    ]
  })()

  if (financeState === "awaiting-review") {
    return (
      <CollapsibleSection title="Finance Sign-off">
        <FinanceMiniStepper steps={miniSteps} />
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 px-2 py-1 bg-[#F7FAF6] rounded-[6px]">
            <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Awaiting your review</span>
          </div>
          {interactive && (
            <div className="flex items-center gap-2">
              <button onClick={() => onAction?.("approve")} className="flex items-center gap-2 h-9 px-3 rounded-full bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors">
                <IconCheck className="size-4" />
                Approve Disbursement
              </button>
              <button onClick={() => onAction?.("reject")} className="flex items-center gap-2 h-9 px-3 rounded-full bg-[#FFDAD6] text-[#8F0004] text-[14px] leading-[20px] font-bold hover:bg-[#FFCCC7] transition-colors">
                <IconX className="size-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </CollapsibleSection>
    )
  }

  if (financeState === "pending-proof") {
    return (
      <CollapsibleSection title="Finance Sign-off">
        <FinanceMiniStepper steps={miniSteps} />
        <div className="flex flex-col py-2">
          <div className="flex items-center justify-between">
            <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">Funds Disbursed</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#FEF0D8] text-[14px] leading-[20px] font-normal text-[#995917]">
              <IconAlertTriangle className="size-4" />
              Pending Proof
            </span>
          </div>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Approved 2026-06-12 09:30 by Kojo Mensah (Finance Admin)</span>
        </div>
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 px-2 py-1 bg-[#F7FAF6] rounded-[6px]">
            <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Awaiting proof of disbursement</span>
          </div>
          <button onClick={interactive ? () => onAction?.("attach-proof") : undefined} className="inline-flex items-center gap-2 h-9 px-3 bg-[#EDF0E6] rounded-full text-[14px] leading-[20px] font-bold text-[#1A5514]">
            <IconUpload className="size-4" />
            Attach Proof of Disbursement
          </button>
        </div>
      </CollapsibleSection>
    )
  }

  if (financeState === "awaiting-signoff") {
    return (
      <CollapsibleSection title="Finance Sign-off">
        <FinanceMiniStepper steps={miniSteps} />
        <div className="flex flex-col py-2">
          <div className="flex items-center justify-between">
            <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">Funds Disbursed</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#D5E6FD] text-[14px] leading-[20px] font-normal text-[#00439E]">
              <IconClipboardCheck className="size-4" />
              Awaiting Sign-off
            </span>
          </div>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Approved 2026-06-12 09:30 by Kojo Mensah (Finance Admin)</span>
        </div>
        <div className="p-4 bg-[#F7FAF6] rounded-[12px] flex items-center gap-4 my-2">
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[12px] leading-[18px] font-bold text-[#525C4E]">Document</span>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">proof-of-payment.pdf</span>
              <div className="flex items-center gap-1">
                <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">22 Mar 2026, 4:13 PM</span>
                <span className="text-[12px] leading-[18px] font-normal text-[#008744]">Uploaded by Ama Mensah (Ops)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconEye className="size-5 text-[#1A5514]" /></button>
            <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconDownload className="size-5 text-[#1A5514]" /></button>
          </div>
        </div>
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 px-2 py-1 bg-[#F7FAF6] rounded-[6px]">
            <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Awaiting Sign-Off</span>
          </div>
          {interactive && (
            <button onClick={() => onAction?.("sign-off")} className="inline-flex items-center gap-2 h-9 px-3 bg-[#EDF0E6] rounded-full text-[14px] leading-[20px] font-bold text-[#1A5514]">
              <IconDownload className="size-4" />
              Sign Off
            </button>
          )}
        </div>
      </CollapsibleSection>
    )
  }

  if (financeState === "rejected") {
    return (
      <CollapsibleSection title="Finance Sign-off">
        <FinanceMiniStepper steps={miniSteps} />
        <div className="flex flex-col py-2">
          <div className="flex items-center justify-between">
            <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">Disbursement Rejected</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#FEE2E2] text-[14px] leading-[20px] font-normal text-[#DC2626]">
              <IconX className="size-4" />
              Rejected
            </span>
          </div>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Rejected 2026-06-12 09:30 by Kojo Mensah (Finance Admin)</span>
        </div>
        <div className="px-2 py-1 bg-[#F7FAF6] rounded-[6px] my-2">
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">
            <span className="font-bold">Reason:</span> Warehouse allocation doesn&apos;t match the procurement plan quantity. Please confirm the correct warehouse before resubmitting.
          </span>
        </div>
      </CollapsibleSection>
    )
  }

  // signed-off
  return (
    <CollapsibleSection title="Finance Sign-off">
      <FinanceMiniStepper steps={miniSteps} />
      <div className="flex flex-col py-2">
        <div className="flex items-center justify-between">
          <span className="text-[16px] leading-[24px] font-normal text-[#161D14]">Funds Disbursed • DISB-2026-012</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#C9F0D6] text-[14px] leading-[20px] font-normal text-[#00572D]">
            <IconCheck className="size-4" />
            Signed Off
          </span>
        </div>
        <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Approved 2026-06-12 09:30 by Kojo Mensah (Finance Admin)</span>
      </div>
      <div className="p-4 bg-[#F7FAF6] rounded-[12px] flex items-center gap-4 my-2">
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-[12px] leading-[18px] font-bold text-[#525C4E]">Document</span>
          <div className="flex flex-col gap-1">
            <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">proof-of-payment.pdf</span>
            <div className="flex items-center gap-1">
              <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">22 Mar 2026, 4:13 PM</span>
              <span className="text-[12px] leading-[18px] font-normal text-[#008744]">Uploaded by Ama Mensah (Ops)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconEye className="size-5 text-[#1A5514]" /></button>
          <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconDownload className="size-5 text-[#1A5514]" /></button>
        </div>
      </div>
      <div className="px-2 py-1 bg-[#F7FAF6] rounded-[6px]">
        <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Awaiting Sign-Off</span>
      </div>
    </CollapsibleSection>
  )
}

function PickupSection({ state }: { state: DetailState }) {
  if (state.pickup === "pending") return <CollapsibleSection title="Pickup coordination" defaultOpen={false}><PendingSection label="Awaiting finance sign-off" /></CollapsibleSection>
  if (state.pickup === "scheduled") {
    return (
      <CollapsibleSection title="Pickup coordination">
        <div className="flex flex-col">
          <InfoRow label="Scheduled date" value="20-06-2026" />
          <InfoRow label="Scheduled by" value="Yaw Darko • 17-06-2026 • 09:00" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FEF0D8] rounded-lg mt-1">
          <span className="text-[14px] leading-[20px] font-bold text-[#995917]">Pickup scheduled — awaiting confirmation</span>
        </div>
      </CollapsibleSection>
    )
  }
  return (
    <CollapsibleSection title="Pickup coordination">
      <div className="flex flex-col">
        <InfoRow label="Scheduled date" value="20-06-2026" />
        <InfoRow label="Scheduled by" value="Yaw Darko • 17-06-2026 • 09:00" />
        <InfoRow label="Confirmed at" value="20-06-2026" />
        <InfoRow label="Confirmed by" value="Yaw Darko • Supply Chain" />
      </div>
    </CollapsibleSection>
  )
}

function WarehouseQASection({ state }: { state: DetailState }) {
  if (state.warehouseQA === "pending") return <CollapsibleSection title="Warehouse QA" defaultOpen={false}><PendingSection label="Awaiting pickup completion" /></CollapsibleSection>
  if (state.warehouseQA === "action-needed") {
    return (
      <CollapsibleSection title="Warehouse QA">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FEF0D8] rounded-lg">
          <span className="text-[14px] leading-[20px] font-bold text-[#995917]">Action required: Log Warehouse QA results after goods arrive</span>
        </div>
      </CollapsibleSection>
    )
  }
  return (
    <CollapsibleSection title="Warehouse QA">
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] leading-[24px] font-normal text-[#161D14]">Good quality {state.summaryData.crop.toLowerCase()}. Minimal foreign matter. Approved for collection</p>
          <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">Logged 2026-06-12 09:30 by Ama Mensah (Field Ops)</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#C9F0D6] text-[14px] leading-[20px] font-normal text-[#00572D] shrink-0">
          <IconCheck className="size-4" />
          Pass
        </span>
      </div>
      <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] p-4 flex flex-col gap-2">
        <span className="text-[14px] leading-[20px] font-bold text-[#525C4E]">Images</span>
        <FileRow file={{ name: "field-qa-rice.jpg", date: "22 Mar 2026, 4:13 PM", type: "image" }} />
        <div className="h-2 bg-[#F3F7F2] -mx-4" />
        <FileRow file={{ name: "field-qa-rice.jpg", date: "22 Mar 2026, 4:13 PM", type: "image" }} />
        <div className="p-4 bg-[#F7FAF6] rounded-[12px] flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[12px] leading-[18px] font-bold text-[#525C4E]">Document</span>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">farm-inspection-form.pdf</span>
              <div className="flex items-center gap-1">
                <span className="text-[12px] leading-[18px] font-normal text-[#525C4E]">22 Mar 2026, 4:13 PM</span>
                <span className="text-[12px] leading-[18px] font-normal text-[#008744]">Uploaded by Ama Mensah (Ops)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconEye className="size-5 text-[#1A5514]" /></button>
            <button className="flex items-center justify-center p-2 rounded-lg bg-[#EDF0E6]"><IconDownload className="size-5 text-[#1A5514]" /></button>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}

function GRNSection({ state }: { state: DetailState }) {
  if (state.grn === "pending") return <CollapsibleSection title="Good receiving note" defaultOpen={false}><PendingSection label="Awaiting warehouse QA completion" /></CollapsibleSection>
  return (
    <CollapsibleSection title="Good receiving note">
      <FileRow file={{ name: `GRN-2026-058.pdf`, date: "Auto-generated 22-06-2026 • 11:01 by System", type: "document" }} />
    </CollapsibleSection>
  )
}

// --- Tabs ---

const detailTabs = [
  { label: "Request details", icon: IconClipboardCheck },
  { label: "Audit trail", icon: IconClock },
]

// --- Main Detail Page ---

function getDisbursementBadges(state: DetailState["financeSignoff"]): { label: string; color: "green" | "blue" | "red" | "warning" }[] {
  switch (state) {
    case "awaiting-review": return [{ label: "Awaiting Review", color: "warning" }]
    case "pending-proof": return [{ label: "Pending Proof", color: "warning" }]
    case "awaiting-signoff": return [{ label: "Pending Proof", color: "warning" }]
    case "signed-off": return [{ label: "Signed Off", color: "green" }]
    case "rejected": return [{ label: "Rejected", color: "red" }]
    default: return []
  }
}

function getEffectivePipeline(steps: PipelineStep[], financeState: DetailState["financeSignoff"]): PipelineStep[] {
  return steps.map((s) => {
    if (s.label === "Finance Sign-off") {
      if (financeState === "rejected") return { ...s, status: "rejected" as const }
      if (financeState === "signed-off" || financeState === "awaiting-signoff") return { ...s, status: "completed" as const }
      return { ...s, status: "current" as const }
    }
    return s
  })
}

export function ProcurementRequestDetailPage({ onBack, request, context = "procurement" }: { onBack: () => void; request: RequestCard; context?: "procurement" | "disbursement" }) {
  const [activeTab, setActiveTab] = useState("Request details")
  const ds = request.detailState
  const action = getActionButton(ds)

  const [localFinanceState, setLocalFinanceState] = useState<DetailState["financeSignoff"]>(ds.financeSignoff)
  const [toast, setToast] = useState<string | null>(null)

  const effectiveFinanceState = context === "disbursement" ? localFinanceState : ds.financeSignoff
  const effectiveTitleBadges = context === "disbursement"
    ? getDisbursementBadges(effectiveFinanceState)
    : ds.titleBadges
  const effectivePipelineSteps = context === "disbursement"
    ? getEffectivePipeline(ds.pipelineSteps, effectiveFinanceState)
    : ds.pipelineSteps

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }

  const handleFinanceAction = (actionType: string) => {
    if (actionType === "approve") {
      setLocalFinanceState("pending-proof")
    } else if (actionType === "reject") {
      setLocalFinanceState("rejected")
      showToast(`Disbursement rejected for ${request.requestId} and returned to Ops Admin successfully`)
    } else if (actionType === "attach-proof") {
      setLocalFinanceState("awaiting-signoff")
      showToast(`Proof attached for ${request.requestId} successfully`)
    } else if (actionType === "sign-off") {
      setLocalFinanceState("signed-off")
      showToast(`Sign-Off for ${request.requestId} completed & Supply chain notified successfully`)
    }
  }

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-[#161D14] rounded-lg shadow-lg max-w-[600px]">
          <IconCheck className="size-4 text-[#36B92E] shrink-0" />
          <span className="text-[14px] leading-[20px] font-normal text-white">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/60 hover:text-white shrink-0">
            <IconX className="size-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb + Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[14px] leading-[20px] font-bold text-[#36B92E] hover:underline">Procurement request</button>
          <span className="text-[14px] leading-[20px] text-[#525C4E]">{">"}</span>
          <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">Request details</span>
        </div>
        {context === "disbursement" ? (
          <div className="flex items-center gap-3">
            {effectiveFinanceState === "awaiting-review" && (
              <>
                <button onClick={() => handleFinanceAction("approve")} className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors">
                  <IconCheck className="size-4" />
                  Approve Disbursement
                </button>
                <button onClick={() => handleFinanceAction("reject")} className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#FFDAD6] text-[#8F0004] text-[14px] leading-[20px] font-bold hover:bg-[#FFCCC7] transition-colors">
                  <IconX className="size-4" />
                  Reject
                </button>
              </>
            )}
            {effectiveFinanceState === "pending-proof" && (
              <button onClick={() => handleFinanceAction("attach-proof")} className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors">
                <IconCheck className="size-4" />
                Attach Proof of Disbursement
              </button>
            )}
            {effectiveFinanceState === "awaiting-signoff" && (
              <button onClick={() => handleFinanceAction("sign-off")} className="flex items-center gap-2 h-9 px-4 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#161D14] text-[14px] leading-[20px] font-bold hover:bg-[#F7FAF6] transition-colors">
                <IconDownload className="size-4" />
                Sign Off
              </button>
            )}
            {(effectiveFinanceState === "signed-off" || effectiveFinanceState === "rejected") && (
              <button className="flex items-center gap-2 h-9 px-4 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#161D14] text-[14px] leading-[20px] font-bold hover:bg-[#F7FAF6] transition-colors">
                <IconDownload className="size-4" />
                Export
              </button>
            )}
          </div>
        ) : (
          action && (
            <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#36B92E] text-white text-[14px] leading-[20px] font-bold hover:bg-[#5EC758] transition-colors">
              <action.Icon className="size-4" />
              {action.label}
            </button>
          )
        )}
      </div>

      {/* Request Title */}
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-[24px] leading-[32px] font-bold text-[#161D14]">{ds.title}</h1>
        {effectiveTitleBadges.map((b, i) => <StatusBadge key={i} label={b.label} color={b.color} />)}
        {context === "disbursement" && request.produceLabel && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] outline outline-1 outline-[#E5E8DF] text-[12px] leading-[18px] font-normal text-[#161D14]">
            {request.produceLabel}
          </span>
        )}
      </div>

      {/* Pipeline Stepper */}
      <DetailPipelineStepper steps={effectivePipelineSteps} />

      {/* Tab Bar */}
      <div className="flex items-center h-[58px] border-t-2 border-b-2 border-[#E5E8DF]">
        {detailTabs.map((tab) => {
          const isActive = activeTab === tab.label
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className="flex flex-col justify-center items-center self-stretch"
            >
              <div className={`flex items-center gap-2 px-3 py-4 text-[16px] leading-[24px] ${isActive ? "font-bold text-[#1A5514]" : "font-normal text-[#161D14]"}`}>
                <Icon className="size-5" />
                {tab.label}
              </div>
              <div className={`self-stretch h-0.5 ${isActive ? "bg-[#306B28]" : "bg-[#E5E8DF]"}`} />
            </button>
          )
        })}
      </div>

      {/* Content: Two-column */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div className="flex flex-col">
          {activeTab === "Request details" && (
            <div className="bg-white rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <div className="px-6 py-2"><FieldVisitSection state={ds} /></div>
              <div className="h-2 bg-[#F3F7F2]" />
              <div className="px-6 py-2"><FieldQASection state={ds} /></div>
              <div className="h-2 bg-[#F3F7F2]" />
              <div className="px-6 py-2"><ApprovalSection state={ds} /></div>
              <div className="h-2 bg-[#F3F7F2]" />
              <div className="px-6 py-2"><FinanceSection state={ds} effectiveState={effectiveFinanceState} interactive={context === "disbursement"} onAction={handleFinanceAction} /></div>
              <div className="h-2 bg-[#F3F7F2]" />
              <div className="px-6 py-2"><PickupSection state={ds} /></div>
              <div className="h-2 bg-[#F3F7F2]" />
              <div className="px-6 py-2"><WarehouseQASection state={ds} /></div>
              <div className="h-2 bg-[#F3F7F2]" />
              <div className="px-6 py-2"><GRNSection state={ds} /></div>
            </div>
          )}

          {activeTab === "Audit trail" && (
            <div className="bg-white rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <div className="flex items-center justify-center py-16 text-[14px] leading-[20px] text-[#525C4E]">
                No audit trail entries yet.
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-[12px] outline outline-1 outline-[#E5E8DF] bg-white flex flex-col gap-3">
            <h3 className="text-[14px] leading-[20px] font-bold text-[#161D14]">Request summary</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: IconCalendar, label: "Procurement Plan ID", value: ds.summaryData.planId },
                { icon: IconUser, label: "Aggregator", value: ds.summaryData.aggregator },
                { icon: IconPackage, label: "Quantity", value: ds.summaryData.quantity },
                { icon: IconPlant, label: "Crop", value: ds.summaryData.crop },
                { icon: IconBuildingWarehouse, label: "Warehouse", value: ds.summaryData.warehouse },
                { icon: IconTruck, label: "Delivery method", value: ds.summaryData.delivery },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-2">
                    <Icon className="size-4 text-[#525C4E] mt-0.5 shrink-0" />
                    <div className="flex items-start justify-between flex-1 gap-2">
                      <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">{item.label}</span>
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14] text-right">{item.value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
