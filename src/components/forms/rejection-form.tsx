import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { FormFileUpload } from "@/components/ui/form-fields"
import { Button } from "@/components/ui/button"
import { IconAlertTriangle } from "@tabler/icons-react"
import type { RequestCard } from "@/pages/procurement-request"

export function RejectionForm({
  open,
  onOpenChange,
  request,
  title = "Reject Aggregation Request",
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  title?: string
  description?: string
  onSubmit: (data: { reason: string; files: File[] }) => void
}) {
  const [reason, setReason] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const summary = request.detailState.summaryData
  const canSubmit = reason.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ reason, files })
    setReason("")
    setFiles([])
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title={title} onClose={() => onOpenChange(false)} />
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

              {/* Rejection form fields */}
              <div className="flex flex-col gap-4">
                {/* Rejection reason with char count */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] leading-[20px] font-normal text-[#161D14]">Rejection reason</label>
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">{reason.length}/100</span>
                  </div>
                  <textarea
                    className="w-full p-3 bg-[#EDF0E6] rounded-[12px] text-[14px] leading-[20px] text-[#161D14] outline-none resize-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                    rows={3}
                    maxLength={100}
                    placeholder="Explain why this request does not meet quality standards."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                {/* File upload */}
                <FormFileUpload
                  label="Upload supporting images / documents"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  files={files}
                  onFilesChange={setFiles}
                />

                {/* Warning callout */}
                <div className="p-4 bg-[#FEF0D8] rounded-[12px] flex items-start gap-2">
                  <IconAlertTriangle className="size-6 text-[#995917] shrink-0" />
                  <p className="text-[14px] leading-[20px] text-[#995917]">
                    Aggregator will be notified via platform and email. They can resubmit after addressing the issue.
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" size="md" shape="rect" disabled={!canSubmit}>Reject & Notify Aggregator</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
