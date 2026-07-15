import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { IconInfoCircle, IconX } from "@tabler/icons-react"
import type { RequestCard } from "@/pages/procurement-request"

export function FinanceRejectForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  onSubmit: (data: { reason: string }) => void
}) {
  const [reason, setReason] = useState("")

  const canSubmit = reason.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ reason })
    setReason("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Reject Disbursement" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {request.cooperative} - {request.commodity} {request.quantity}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Approved by {request.confirmedBy} (Ops Admin)  {request.confirmedDate}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] leading-[20px] font-normal text-[#161D14]">Reason for rejection (required)</label>
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">{reason.length}/100</span>
                  </div>
                  <textarea
                    className="w-full p-3 bg-[#EDF0E6] rounded-[12px] text-[14px] leading-[20px] text-[#161D14] outline-none resize-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                    rows={4}
                    maxLength={100}
                    placeholder="Explain what's incomplete, unclear, or doesn't meet financial approval criteria."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-[#FEF0D8] rounded-[12px] flex items-start gap-2">
                  <IconInfoCircle className="size-6 text-[#995917] shrink-0" />
                  <p className="text-[14px] leading-[20px] text-[#995917]">
                    Rejecting routes this back to Ops Admin, not the aggregator directly
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" size="md" shape="rect" disabled={!canSubmit}>
              <IconX className="size-5" />
              Reject & Return to Ops
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
