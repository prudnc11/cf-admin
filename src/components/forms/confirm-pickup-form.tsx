import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { IconInfoCircle, IconCheck } from "@tabler/icons-react"
import type { RequestCard } from "@/pages/procurement-request"

export function ConfirmPickupForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  onSubmit: (data: { notes: string }) => void
}) {
  const [notes, setNotes] = useState("")

  const summary = request.detailState.summaryData

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ notes })
    setNotes("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Confirm Pickup" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {request.cooperative} - {request.commodity}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Scheduled for  {request.scheduledDate} <span className="font-bold">•</span> {summary.warehouse}
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

              <div className="flex flex-col gap-4">
                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] leading-[20px] font-normal text-[#161D14]">Notes</label>
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">{notes.length}/100</span>
                  </div>
                  <textarea
                    className="w-full p-3 bg-[#EDF0E6] rounded-[12px] text-[14px] leading-[20px] text-[#161D14] outline-none resize-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                    rows={3}
                    maxLength={100}
                    placeholder="Access notes, time window, vehicle details"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Info callout */}
                <div className="p-4 bg-[#D5E6FD] rounded-[12px] flex items-start gap-2">
                  <IconInfoCircle className="size-6 text-[#00439E] shrink-0" />
                  <p className="text-[14px] leading-[20px] text-[#00439E]">
                    Confirming pickup records your name, role and timestamp and immediately triggers the Warehouse QA step for this request. This cannot be bypassed.
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              Confirm Pickup
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
