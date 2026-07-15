import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { FormField, FormDateInput, FormSelect, FormCheckbox } from "@/components/ui/form-fields"
import { Button } from "@/components/ui/button"
import { IconInfoCircle } from "@tabler/icons-react"
import type { RequestCard } from "@/pages/procurement-request"

export function ScheduleVisitForm({
  open,
  onOpenChange,
  request,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: RequestCard
  requestId?: string
  onSubmit: (data: { date: string; teamType: string; assignedTo: string; schedulePickup: boolean }) => void
}) {
  const [date, setDate] = useState("")
  const [teamType, setTeamType] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [schedulePickup, setSchedulePickup] = useState(false)

  const summary = request.detailState.summaryData
  const canSubmit = !!date && !!teamType && !!assignedTo

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ date, teamType, assignedTo, schedulePickup })
    setDate("")
    setTeamType("")
    setAssignedTo("")
    setSchedulePickup(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Schedule Field Visit" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              {/* Title block */}
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {request.cooperative} - {request.commodity}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Capture produce quality at collection point
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
                  { label: "Quantity at location", value: summary.quantity },
                ].map((row) => (
                  <div key={row.label} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-[14px] leading-[20px] text-[#161D14]">{row.label}</span>
                    <span className="text-[14px] leading-[20px] text-[#161D14] text-right">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-4">
                {/* Visit date + Team type row */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FormField label="Visit date">
                      <FormDateInput value={date} onChange={(e) => setDate(e.target.value)} />
                    </FormField>
                  </div>
                  <div className="flex-1">
                    <FormField label="Assign team type">
                      <FormSelect value={teamType} onChange={(e) => setTeamType(e.target.value)}>
                        <option value="">Select team..</option>
                        <option value="internal">Internal QA Team</option>
                        <option value="external">External Auditor</option>
                        <option value="joint">Joint Team</option>
                      </FormSelect>
                    </FormField>
                  </div>
                </div>

                {/* Assigned To */}
                <FormField label="Assigned To">
                  <FormSelect value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="">Select person..</option>
                    <option value="Kwame Boateng">Kwame Boateng</option>
                    <option value="Ama Mensah">Ama Mensah</option>
                    <option value="Yaw Asante">Yaw Asante</option>
                  </FormSelect>
                </FormField>

                {/* Schedule Pickup checkbox */}
                <FormCheckbox
                  checked={schedulePickup}
                  onChange={setSchedulePickup}
                  variant="success"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Schedule Pickup during this visit</span>
                    <span className="text-[12px] leading-[18px] text-[#525C4E]">The assigned team will arrange to collect commodities during the field visit</span>
                  </div>
                </FormCheckbox>

                {/* Info callout */}
                <div className="p-4 bg-[#D5E6FD] rounded-[12px] flex items-start gap-2">
                  <IconInfoCircle className="size-6 text-[#00439E] shrink-0" />
                  <p className="text-[14px] leading-[20px] text-[#00439E]">
                    The aggregator will be notified of the scheduled visit and can view it in their dashboard
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!canSubmit}>Schedule Field Visit</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
