import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { IconInfoCircle } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import type { RequestCard } from "@/pages/procurement-request"

const routingOptions = [
  { value: "Export", label: "Export", description: "Must route via warehouse" },
  { value: "Local", label: "Local", description: "Dispatched or warehouse" },
  { value: "Both", label: "Both", description: "Mixed routing" },
]

export function ApprovalForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  onSubmit: (data: { routing: string }) => void
}) {
  const [routing, setRouting] = useState("")

  const summary = request.detailState.summaryData

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!routing) return
    onSubmit({ routing })
    setRouting("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title={`Approve - ${request.plan}`} onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              {/* Title block */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {request.cooperative} - {request.commodity} {request.quantity}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Plan {request.plan} <span className="font-bold">•</span> {request.confirmedDate} <span className="font-bold">•</span> {summary.warehouse}
                </p>
              </div>

              {/* Plan summary card */}
              <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden pb-2">
                <div className="px-4 py-1.5 border-b border-[#E5E8DF]">
                  <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">Plan summary</span>
                </div>
                {[
                  { label: "Location", value: summary.warehouse },
                  { label: "Commodity", value: summary.crop },
                  { label: "Quantity", value: summary.quantity },
                ].map((row) => (
                  <div key={row.label} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-[14px] leading-[20px] text-[#161D14]">{row.label}</span>
                    <span className="text-[14px] leading-[20px] text-[#161D14] text-right">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Label produce */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Label produce</h3>
                  <div className="flex items-start gap-4">
                    {routingOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRouting(opt.value)}
                        className={cn(
                          "flex-1 px-3 py-6 rounded-[12px] flex flex-col items-center gap-2 transition-colors",
                          routing === opt.value
                            ? "bg-[#008744] text-white"
                            : "bg-[#EDF0E6] outline outline-1 outline-[#E5E8DF]"
                        )}
                      >
                        <span className={cn(
                          "text-[16px] leading-[24px] font-bold",
                          routing === opt.value ? "text-white" : "text-[#161D14]"
                        )}>
                          {opt.label}
                        </span>
                        <span className={cn(
                          "text-[14px] leading-[20px]",
                          routing === opt.value ? "text-white" : "text-[#525C4E]"
                        )}>
                          {opt.description}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[12px] leading-[18px] text-[#161D14]">Required before approval can be finalized</p>
                </div>

                {/* Info callout */}
                <div className="p-4 bg-[#D5E6FD] rounded-[12px] flex items-start gap-2">
                  <IconInfoCircle className="size-6 text-[#00439E] shrink-0" />
                  <p className="text-[14px] leading-[20px] text-[#00439E]">
                    Approving will notify Finance Admin to review and disburse funds
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!routing}>Approve & Notify Finance</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
