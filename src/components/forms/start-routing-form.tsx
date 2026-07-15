import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { IconInfoCircle, IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import type { RequestCard } from "@/pages/procurement-request"

const routingOptions = [
  {
    value: "dispatch",
    label: "Dispatch directly to buyer via waybill",
    description: "Skip warehousing - fastest path to delivery",
  },
  {
    value: "warehouse",
    label: "Send to warehouse",
    description: "Use if timing requires holding stock before dispatch",
  },
]

export function StartRoutingForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  onSubmit: (data: { routingMethod: string }) => void
}) {
  const [routingMethod, setRoutingMethod] = useState("")

  const summary = request.detailState.summaryData
  const canSubmit = !!routingMethod

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ routingMethod })
    setRoutingMethod("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title={`Choose Routing - ${request.plan}`} onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {request.cooperative} - {request.commodity} {request.quantity}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Plan {request.plan} <span className="font-bold">•</span> {request.confirmedDate} <span className="font-bold">•</span> {summary.warehouse}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">How should this products be routed?</h3>

                <div className="flex flex-col gap-3">
                  {routingOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRoutingMethod(opt.value)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-[12px] text-left transition-colors",
                        routingMethod === opt.value
                          ? "bg-[#D4F5D0] outline outline-2 outline-[#36B92E]"
                          : "bg-[#EDF0E6]"
                      )}
                    >
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{opt.label}</span>
                        <span className="text-[14px] leading-[20px] text-[#525C4E]">{opt.description}</span>
                      </div>
                      <div className={cn(
                        "size-6 rounded-full border-2 flex items-center justify-center shrink-0",
                        routingMethod === opt.value ? "border-[#36B92E]" : "border-[#C3C8BC]"
                      )}>
                        {routingMethod === opt.value && <div className="size-3 rounded-full bg-[#36B92E]" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-[#D5E6FD] rounded-[12px] flex items-start gap-2">
                  <IconInfoCircle className="size-6 text-[#00439E] shrink-0" />
                  <p className="text-[14px] leading-[20px] text-[#00439E]">
                    This closes the pipeline. GRN, Finance Sign-off, and this Routing decision together complete the request's Activity History.
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!canSubmit}>
              Confirm Routing
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
