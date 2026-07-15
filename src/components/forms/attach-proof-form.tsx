import { useState, useRef } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { IconUpload, IconCheck, IconX } from "@tabler/icons-react"
import type { RequestCard } from "@/pages/procurement-request"

export function AttachProofForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  onSubmit: (data: { file: File[]; note: string }) => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [note, setNote] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const summary = request.detailState.summaryData
  const canSubmit = files.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ file: files, note })
    setFiles([])
    setNote("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...newFiles])
    e.target.value = ""
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Attach Proof of Disbursement" onClose={() => onOpenChange(false)} />
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
                {/* Upload area */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] leading-[20px] text-[#161D14]">Upload receipt or proof document</label>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-4 px-4 py-4 rounded-[12px] border border-dashed border-[#C3C8BC] bg-white hover:border-[#36B92E] transition-colors"
                  >
                    <IconUpload className="size-6 text-[#36B92E]" />
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[14px] leading-[20px] font-bold text-[#36B92E]">Upload</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">PDF, JPEG, or PNG less than 10MB</span>
                    </div>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#EDF0E6]">
                      <span className="flex-1 text-[14px] leading-[20px] text-[#161D14] truncate">{file.name}</span>
                      <button type="button" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} className="shrink-0 text-[#525C4E] hover:text-[#DC2626]">
                        <IconX className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] leading-[20px] font-normal text-[#161D14]">Note (Optional)</label>
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">{note.length}/100</span>
                  </div>
                  <textarea
                    className="w-full p-3 bg-[#EDF0E6] rounded-[12px] text-[14px] leading-[20px] text-[#161D14] outline-none resize-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                    rows={4}
                    maxLength={100}
                    placeholder="Enter a description of proof"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!canSubmit}>
              Save Proof of Disbursement
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
