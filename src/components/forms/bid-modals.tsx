import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { FormField, FormDateInput, FormSelect, FormInput, FormTextarea, FormCheckbox } from "@/components/ui/form-fields"
import { Button } from "@/components/ui/button"
import { IconInfoCircle, IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import type { SupplyBid } from "@/pages/supply-bids"

// --- Shared ---

function BidSummaryCard({ bid }: { bid: SupplyBid }) {
  return (
    <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden pb-2">
      <div className="px-4 py-1.5 border-b border-[#E5E8DF]">
        <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">Bid summary</span>
      </div>
      {[
        { label: "Aggregator", value: bid.aggregator },
        { label: "Commodity", value: `${bid.crop} - ${bid.variety}` },
        { label: "Quantity", value: `${bid.quantity} ${bid.unit}` },
        { label: "Price", value: bid.pricePerUnit },
        { label: "Total Value", value: bid.totalValue },
        { label: "Delivery", value: bid.deliveryMethod === "field-visit" ? "Field Visit" : "Warehouse Visit" },
      ].map((row) => (
        <div key={row.label} className="px-4 py-2 flex items-center justify-between">
          <span className="text-[14px] leading-[20px] text-[#525C4E]">{row.label}</span>
          <span className="text-[14px] leading-[20px] font-bold text-[#161D14] text-right">{row.value}</span>
        </div>
      ))}
    </div>
  )
}

function InfoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-[#D5E6FD] rounded-[12px] flex items-start gap-2">
      <IconInfoCircle className="size-6 text-[#00439E] shrink-0" />
      <p className="text-[14px] leading-[20px] text-[#00439E]">{children}</p>
    </div>
  )
}

function WarningCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-[#FEF0D8] rounded-[12px] flex items-start gap-2">
      <IconAlertTriangle className="size-6 text-[#995917] shrink-0" />
      <p className="text-[14px] leading-[20px] text-[#995917]">{children}</p>
    </div>
  )
}

// --- 1. Accept Price Modal ---

export function AcceptPriceModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: () => void
}) {
  const lastPrice = bid.negotiations.length > 0 ? bid.negotiations[bid.negotiations.length - 1].price : bid.pricePerUnit

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
          <ModalHeader title="Accept Price" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  {bid.id} &bull; {bid.quantity} {bid.unit} &bull; {bid.region}
                </p>
              </div>

              <BidSummaryCard bid={bid} />

              <div className="p-4 bg-[#D4F5D0] rounded-[12px] flex items-center justify-between">
                <span className="text-[16px] leading-[24px] font-bold text-[#1A5514]">Agreed Price</span>
                <span className="text-[20px] leading-[28px] font-bold text-[#1A5514]">{lastPrice}</span>
              </div>

              <InfoCallout>
                Accepting this price will move the bid to the <strong>Scheduling</strong> stage. The aggregator will be notified to coordinate a {bid.deliveryMethod === "field-visit" ? "field visit" : "warehouse delivery"}.
              </InfoCallout>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              Accept Price
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 2. Counter Offer Modal ---

export function CounterOfferModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: (data: { price: string; note: string }) => void
}) {
  const [price, setPrice] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!price) return
    onSubmit({ price: `GHS ${price}/MT`, note })
    setPrice("")
    setNote("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Counter Offer" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Current offer: {bid.negotiations.length > 0 ? bid.negotiations[bid.negotiations.length - 1].price : bid.pricePerUnit}
                </p>
              </div>

              <BidSummaryCard bid={bid} />

              <div className="flex flex-col gap-4">
                <FormField label="Your counter price (per MT)">
                  <div className="flex items-center">
                    <span className="h-[48px] px-4 flex items-center rounded-l-[12px] bg-[#D9DDD3] text-[16px] text-[#525C4E]">GHS</span>
                    <FormInput value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="rounded-l-none" />
                  </div>
                </FormField>
                <FormField label="Note (optional)">
                  <FormTextarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for counter offer..." />
                </FormField>
              </div>

              <InfoCallout>
                The aggregator will be notified of your counter offer and can accept, reject, or submit a new price.
              </InfoCallout>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!price}>Send Counter Offer</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 3. Schedule Visit Modal ---

export function BidScheduleVisitModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: (data: { date: string; teamType: string; assignedTo: string; schedulePickup: boolean }) => void
}) {
  const [date, setDate] = useState("")
  const [teamType, setTeamType] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [schedulePickup, setSchedulePickup] = useState(false)
  const canSubmit = !!date && !!teamType && !!assignedTo

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ date, teamType, assignedTo, schedulePickup })
    setDate(""); setTeamType(""); setAssignedTo(""); setSchedulePickup(false)
  }

  const isField = bid.deliveryMethod === "field-visit"

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title={isField ? "Schedule Field Visit" : "Schedule Warehouse Delivery"} onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  {bid.quantity} {bid.unit} &bull; {bid.warehouse} &bull; {bid.region}
                </p>
              </div>

              <BidSummaryCard bid={bid} />

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FormField label={isField ? "Visit date" : "Delivery date"}>
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

                <FormField label="Assigned To">
                  <FormSelect value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="">Select person..</option>
                    <option value="Kwame Boateng">Kwame Boateng</option>
                    <option value="Ama Mensah">Ama Mensah</option>
                    <option value="Yaw Asante">Yaw Asante</option>
                  </FormSelect>
                </FormField>

                {isField && (
                  <FormCheckbox checked={schedulePickup} onChange={setSchedulePickup} variant="success">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Schedule Pickup during this visit</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">The assigned team will arrange to collect commodities during the field visit</span>
                    </div>
                  </FormCheckbox>
                )}

                <InfoCallout>
                  The aggregator will be notified of the scheduled {isField ? "visit" : "delivery"} date. After {isField ? "the visit" : "delivery"}, the QA step begins.
                </InfoCallout>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!canSubmit}>
              {isField ? "Schedule Field Visit" : "Confirm Delivery Date"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 4. Log QA Modal ---

export function BidLogQAModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: (data: { result: "pass" | "fail"; grade: string; moisture: string; notes: string }) => void
}) {
  const [result, setResult] = useState<"pass" | "fail" | "">("")
  const [grade, setGrade] = useState("")
  const [moisture, setMoisture] = useState("")
  const [notes, setNotes] = useState("")
  const canSubmit = !!result && !!grade

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !result) return
    onSubmit({ result, grade, moisture, notes })
    setResult(""); setGrade(""); setMoisture(""); setNotes("")
  }

  const isField = bid.stage === "field-qa"

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title={isField ? "Log Field QA" : "Log Warehouse QA"} onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  {bid.quantity} {bid.unit} &bull; Scheduled: {bid.scheduledDate} &bull; {bid.warehouse}
                </p>
              </div>

              {/* Pass/Fail toggle */}
              <div className="flex flex-col gap-2">
                <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">QA Result</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setResult("pass")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-[12px] border font-bold text-[14px] leading-[20px] transition-colors",
                      result === "pass" ? "border-[#1A5514] bg-[#D4F5D0] text-[#1A5514]" : "border-[#C3C8BC] bg-white text-[#525C4E] hover:border-[#1A5514]"
                    )}
                  >
                    <IconCheck className="size-4" />
                    Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setResult("fail")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-[12px] border font-bold text-[14px] leading-[20px] transition-colors",
                      result === "fail" ? "border-[#DC2626] bg-[#FEE2E2] text-[#DC2626]" : "border-[#C3C8BC] bg-white text-[#525C4E] hover:border-[#DC2626]"
                    )}
                  >
                    <IconX className="size-4" />
                    Fail
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <FormField label="Visual Grade">
                    <FormSelect value={grade} onChange={(e) => setGrade(e.target.value)}>
                      <option value="">Select grade..</option>
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Grade C">Grade C</option>
                      <option value="Rejected">Rejected</option>
                    </FormSelect>
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField label="Moisture level (%)">
                    <FormInput value={moisture} onChange={(e) => setMoisture(e.target.value)} placeholder="e.g. 12.4" />
                  </FormField>
                </div>
              </div>

              <FormField label="Notes / Observations">
                <FormTextarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional observations..." />
              </FormField>

              {result === "fail" && (
                <WarningCallout>
                  Failing QA will <strong>reject this bid</strong>. The aggregator will be notified and no further processing will occur.
                </WarningCallout>
              )}

              {result === "pass" && (
                <InfoCallout>
                  Passing QA will advance this bid to the <strong>Finance</strong> stage for disbursement review.
                </InfoCallout>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!canSubmit} variant={result === "fail" ? "destructive" : "primary"}>
              {result === "fail" ? "Fail & Reject Bid" : "Save QA Result"}
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 5. Finance Approve Modal ---

export function BidFinanceApproveModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: () => void
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
          <ModalHeader title="Approve Disbursement" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop} {bid.quantity} {bid.unit}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  {bid.id} &bull; QA Passed &bull; {bid.warehouse}
                </p>
              </div>

              <BidSummaryCard bid={bid} />

              <InfoCallout>
                Approving moves this to <strong>"Pending Proof"</strong> and prompts you to attach proof of payment next.
              </InfoCallout>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              Approve Disbursement
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 6. Finance Reject Modal ---

export function BidFinanceRejectModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: (data: { reason: string }) => void
}) {
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
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
                  {bid.aggregator} - {bid.crop} {bid.quantity} {bid.unit}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">{bid.id}</p>
              </div>

              <WarningCallout>
                Rejecting will cancel this bid entirely. The aggregator will be notified and no payment will be made.
              </WarningCallout>

              <FormField label="Reason for rejection">
                <FormTextarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why this disbursement is being rejected..." />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" size="md" shape="rect" disabled={!reason.trim()}>
              Reject & Notify
              <IconX className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 7. Attach Proof Modal ---

export function BidAttachProofModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: (data: { note: string }) => void
}) {
  const [note, setNote] = useState("")
  const [fileName, setFileName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileName) return
    onSubmit({ note })
    setNote(""); setFileName("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Attach Proof of Payment" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop} {bid.quantity} {bid.unit}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  Disbursement amount: <strong>{bid.totalValue}</strong>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Upload proof of payment</span>
                {fileName ? (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-[12px] bg-[#EDF0E6]">
                    <span className="flex-1 text-[14px] leading-[20px] text-[#161D14] truncate">{fileName}</span>
                    <button type="button" onClick={() => setFileName("")} className="shrink-0 text-[#525C4E] hover:text-[#DC2626]">
                      <IconX className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFileName("disbursement-proof-" + bid.id + ".pdf")}
                    className="flex items-center justify-center gap-2 px-4 py-4 rounded-[12px] border border-dashed border-[#C3C8BC] bg-[#F7FAF6] text-[14px] leading-[20px] text-[#525C4E] hover:border-[#36B92E] hover:bg-[#EDF0E6] transition-colors"
                  >
                    Click to upload proof (.pdf, .jpg, .png)
                  </button>
                )}
              </div>

              <FormField label="Note (optional)">
                <FormTextarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Payment reference or notes..." />
              </FormField>

              <InfoCallout>
                After attaching proof, this moves to <strong>"Awaiting Sign-off"</strong> for final finance approval.
              </InfoCallout>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!fileName}>
              Save Proof
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 8. Finance Sign-off Modal ---

export function BidFinanceSignoffModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: () => void
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
          <ModalHeader title="Sign-Off Disbursement" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop} {bid.quantity} {bid.unit}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  {bid.id} &bull; {bid.totalValue}
                </p>
              </div>

              <BidSummaryCard bid={bid} />

              <InfoCallout>
                Signing off closes the financial step and advances this bid to <strong>GRN generation</strong>.
              </InfoCallout>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              Sign-Off Disbursement
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 9. Generate GRN Modal ---

export function BidGenerateGRNModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: () => void
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
          <ModalHeader title="Generate GRN" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop} {bid.quantity} {bid.unit}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  {bid.id} &bull; {bid.warehouse} &bull; {bid.region}
                </p>
              </div>

              <BidSummaryCard bid={bid} />

              <InfoCallout>
                A GRN document will be auto-generated with all bid and QA details. This advances the bid to <strong>Routing</strong>.
              </InfoCallout>
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

// --- 10. Start Routing Modal ---

const routingOptions = [
  { value: "dispatch", label: "Dispatch directly to buyer via waybill", description: "Skip warehousing — fastest path to delivery" },
  { value: "warehouse", label: "Send to warehouse", description: "Use if timing requires holding stock before dispatch" },
]

export function BidStartRoutingModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: (data: { routingMethod: string }) => void
}) {
  const [routingMethod, setRoutingMethod] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!routingMethod) return
    onSubmit({ routingMethod })
    setRoutingMethod("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title={`Route — ${bid.id}`} onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop} {bid.quantity} {bid.unit}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">
                  GRN: {bid.grnNumber} &bull; {bid.warehouse}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">How should this produce be routed?</h3>
                <div className="flex flex-col gap-3">
                  {routingOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRoutingMethod(opt.value)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-[12px] text-left transition-colors",
                        routingMethod === opt.value ? "bg-[#D4F5D0] outline outline-2 outline-[#36B92E]" : "bg-[#EDF0E6]"
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

                <InfoCallout>
                  This completes the bid pipeline. The aggregator will be scored and the fulfilment is recorded.
                </InfoCallout>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!routingMethod}>
              Confirm Routing
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// --- 11. Produce Label Modal (after QA pass, before finance) ---

export function BidProduceLabelModal({
  open,
  onOpenChange,
  bid,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bid: SupplyBid
  onSubmit: (data: { label: "Local" | "Export" | "Both" }) => void
}) {
  const [label, setLabel] = useState<"Local" | "Export" | "Both" | "">("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label) return
    onSubmit({ label })
    setLabel("")
  }

  const options: { value: "Local" | "Export" | "Both"; desc: string }[] = [
    { value: "Export", desc: "Produce meets export-grade standards" },
    { value: "Local", desc: "Produce for local/domestic market" },
    { value: "Both", desc: "Split between export and local market" },
  ]

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Label Produce" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">
                  {bid.aggregator} - {bid.crop} {bid.quantity} {bid.unit}
                </h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">QA Passed — label this produce before finance review</p>
              </div>

              <div className="flex flex-col gap-3">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLabel(opt.value)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-[12px] text-left transition-colors",
                      label === opt.value ? "bg-[#D4F5D0] outline outline-2 outline-[#36B92E]" : "bg-[#EDF0E6]"
                    )}
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">{opt.value}</span>
                      <span className="text-[14px] leading-[20px] text-[#525C4E]">{opt.desc}</span>
                    </div>
                    <div className={cn(
                      "size-6 rounded-full border-2 flex items-center justify-center shrink-0",
                      label === opt.value ? "border-[#36B92E]" : "border-[#C3C8BC]"
                    )}>
                      {label === opt.value && <div className="size-3 rounded-full bg-[#36B92E]" />}
                    </div>
                  </button>
                ))}
              </div>

              <InfoCallout>
                Labelling determines routing and export documentation requirements downstream.
              </InfoCallout>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect" disabled={!label}>
              Confirm & Send to Finance
              <IconCheck className="size-5" />
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
