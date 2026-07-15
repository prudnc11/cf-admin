import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { IconInfoCircle, IconCheck } from "@tabler/icons-react"
import type { RequestCard } from "@/pages/procurement-request"

export function GenerateGRNForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  onSubmit: () => void
}) {
  const summary = request.detailState.summaryData

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Generate GRN" onClose={() => onOpenChange(false)} />
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

              <div className="p-4 bg-[#D5E6FD] rounded-[12px] flex items-start gap-2">
                <IconInfoCircle className="size-6 text-[#00439E] shrink-0" />
                <p className="text-[14px] leading-[20px] text-[#00439E]">
                  A GRN document will be auto-generated with all procurement details for this request.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              Generate GRN
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
