import { useState, useRef } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { FormField, FormSelect, FormInput } from "@/components/ui/form-fields"
import { Button } from "@/components/ui/button"
import { IconPlus, IconTrash, IconCheck } from "@tabler/icons-react"
import type { RequestCard } from "@/pages/procurement-request"

export function LogWarehouseQAForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  onSubmit: (data: { grade: string; moisture: string; notes: string; images: File[] }) => void
}) {
  const [grade, setGrade] = useState("")
  const [moisture, setMoisture] = useState("")
  const [notes, setNotes] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const summary = request.detailState.summaryData
  const canSubmit = !!grade

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ grade, moisture, notes, images })
    setGrade("")
    setMoisture("")
    setNotes("")
    setImages([])
    setPreviews([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Warehouse QA" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {request.cooperative} - {request.commodity}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Pickup: {request.scheduledDate} <span className="font-bold">•</span> {request.assignedTo} <span className="font-bold">•</span> {summary.warehouse}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FormField label="Visual grade">
                      <FormSelect value={grade} onChange={(e) => setGrade(e.target.value)}>
                        <option value="">Select grade..</option>
                        <option value="Grade A (Excellent)">Grade A (Excellent)</option>
                        <option value="Grade B (Good)">Grade B (Good)</option>
                        <option value="Grade C (Acceptable)">Grade C (Acceptable)</option>
                        <option value="Rejected">Rejected</option>
                      </FormSelect>
                    </FormField>
                  </div>
                  <div className="w-[176px]">
                    <FormField label="Moisture level (Optional)">
                      <FormInput placeholder="e.g. 13%" value={moisture} onChange={(e) => setMoisture(e.target.value)} />
                    </FormField>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] leading-[20px] font-normal text-[#161D14]">Notes / Observations</label>
                    <span className="text-[14px] leading-[20px] text-[#525C4E]">{notes.length}/100</span>
                  </div>
                  <textarea
                    className="w-full p-3 bg-[#EDF0E6] rounded-[12px] text-[14px] leading-[20px] text-[#161D14] outline-none resize-none placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20"
                    rows={3}
                    maxLength={100}
                    placeholder="Defects, conditions, observations.."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] leading-[20px] text-[#161D14]">Upload photos (Optional)</span>
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">Add photos of commodities. (Max size: 10MB)</span>
                  </div>
                  <div className="flex flex-wrap items-start gap-3">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-[109px] h-[109px] rounded-[16px] border border-dashed border-[#C3C8BC] bg-white flex items-center justify-center hover:bg-[#F7FAF6] transition-colors"
                    >
                      <IconPlus className="size-6 text-[#36B92E]" />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-[109px] h-[109px] rounded-[16px] overflow-hidden bg-[#E1E4DA] group">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconTrash className="size-5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="justify-end">
            <Button type="submit" size="md" shape="rect" disabled={!canSubmit}>
              Save QA Result
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
