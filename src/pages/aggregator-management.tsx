import { useState, useRef, useEffect } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconChevronsRight,
  IconChevronsLeft,
  IconUsersGroup,
  IconWorld,
  IconDots,
  IconX,
  IconFileExport,
  IconSearch,
  IconCalendar,
  IconCheck,
  IconAlertTriangle,
  IconBan,
  IconPlayerPlay,
  IconUserEdit,
  IconCopy,
  IconMail,
  IconRefreshAlert,
} from "@tabler/icons-react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { FormField, FormSelect, FormTextarea, FormInput } from "@/components/ui/form-fields"

// ── Types ──

type AggregatorStatus = "Active" | "Pending" | "Suspended" | "Pending suspension" | "Deactivated" | "Expired"
type AggregatorTier = "PLATINUM" | "GOLD" | "SILVER" | "BRONZE"

type AggregatorRow = {
  id: string
  name: string
  country: string
  countryCode: string
  region: string
  email: string
  dateJoined: string
  tier: AggregatorTier
  status: AggregatorStatus
}

// ── Config ──

const tierConfig: Record<AggregatorTier, { bg: string; text: string }> = {
  PLATINUM: { bg: "#E2D1FD", text: "#7925CC" },
  GOLD: { bg: "#FEF0D8", text: "#995917" },
  SILVER: { bg: "white", text: "#525C4E" },
  BRONZE: { bg: "#D5E6FD", text: "#00439E" },
}

const statusConfig: Record<AggregatorStatus, { dot: string; text: string }> = {
  Active: { dot: "#008744", text: "#008744" },
  Pending: { dot: "#0063EA", text: "#0063EA" },
  Suspended: { dot: "#BA1A1A", text: "#BA1A1A" },
  "Pending suspension": { dot: "#995917", text: "#995917" },
  Deactivated: { dot: "#525C4E", text: "#525C4E" },
  Expired: { dot: "#525C4E", text: "#525C4E" },
}

const countryFlags: Record<string, string> = {
  GH: "\u{1F1EC}\u{1F1ED}",
  NG: "\u{1F1F3}\u{1F1EC}",
  TG: "\u{1F1F9}\u{1F1EC}",
  ZA: "\u{1F1FF}\u{1F1E6}",
  GB: "\u{1F1EC}\u{1F1E7}",
  FR: "\u{1F1EB}\u{1F1F7}",
  KE: "\u{1F1F0}\u{1F1EA}",
  CI: "\u{1F1E8}\u{1F1EE}",
}

// ── Mock Data ──

const allRows: AggregatorRow[] = [
  { id: "1", name: "Bismark Amoateng", country: "Ghana", countryCode: "GH", region: "Kumasi", email: "amoateng.bismark@company.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Active" },
  { id: "2", name: "Noah Carter", country: "Nigeria", countryCode: "NG", region: "Kumasi", email: "charlie.brown@techworld.net", dateJoined: "16 May 2026", tier: "SILVER", status: "Pending" },
  { id: "3", name: "Emma Rodriguez", country: "Togo", countryCode: "TG", region: "Kumasi", email: "samantha.jones@designstudio.org", dateJoined: "16 May 2026", tier: "GOLD", status: "Expired" },
  { id: "4", name: "Mia Thompson", country: "South Africa", countryCode: "ZA", region: "Kumasi", email: "alex.smith@innovate.com", dateJoined: "16 May 2026", tier: "BRONZE", status: "Deactivated" },
  { id: "5", name: "Aiden Brooks", country: "United Kingdom", countryCode: "GB", region: "Kumasi", email: "michael.williams@startup.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Pending suspension" },
  { id: "6", name: "Liam Carter", country: "France", countryCode: "FR", region: "Kumasi", email: "emily.davis@solutions.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Suspended" },
  { id: "7", name: "Sophia Bennett", country: "Ghana", countryCode: "GH", region: "Greater Accra", email: "david.johnson@enterprise.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Active" },
  { id: "8", name: "Noah Thompson", country: "Ghana", countryCode: "GH", region: "Greater Accra", email: "olivia.brown@networking.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Active" },
  { id: "9", name: "Lucas Harrington", country: "Ghana", countryCode: "GH", region: "Volta", email: "jessica.martin@creativehub.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Active" },
  { id: "10", name: "Emma Johnson", country: "Ghana", countryCode: "GH", region: "Volta", email: "liam.miller@business.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Active" },
  { id: "11", name: "Oliver Davis", country: "Ghana", countryCode: "GH", region: "Volta", email: "ava.thompson@ventures.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Active" },
  { id: "12", name: "Ava Wilson", country: "Ghana", countryCode: "GH", region: "Kumasi", email: "noah.jones@creativespace.com", dateJoined: "16 May 2026", tier: "PLATINUM", status: "Active" },
]

// ── Sub-components ──

function FilterButton({ label, icon: Icon }: { label: string; icon?: React.ElementType }) {
  return (
    <button className="h-9 px-3 flex items-center gap-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] text-[#161D14]">
      {Icon && <Icon className="size-4 text-[#161D14]" />}
      <span>{label}</span>
      <IconChevronDown className="size-4 text-[#161D14]" />
    </button>
  )
}

function TierBadge({ tier }: { tier: AggregatorTier }) {
  const c = tierConfig[tier]
  const isOutline = tier === "SILVER"
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] text-[12px] leading-[18px] ${isOutline ? "outline outline-1 outline-[#E5E8DF]" : ""}`}
      style={{ background: c.bg, color: c.text }}
    >
      {tier}
    </span>
  )
}

function StatusBadge({ status }: { status: AggregatorStatus }) {
  const c = statusConfig[status]
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] bg-white outline outline-1 outline-[#E5E8DF]">
      <span className="size-3 rounded-full" style={{ background: c.dot }} />
      <span className="text-[12px] leading-[18px]" style={{ color: c.text }}>{status}</span>
    </span>
  )
}

function DetailTile({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex-1 min-w-[140px] px-3 py-2 bg-[#F7FAF6] rounded-[8px] flex flex-col gap-1">
      <span className="text-[12px] leading-[18px] text-[#525C4E]">{label}</span>
      <span className="text-[14px] leading-[20px] font-bold" style={{ color: valueColor ?? "#161D14" }}>{value}</span>
    </div>
  )
}

// ── Row Actions ──

function RowActions({ row, onView, onSuspend, onActivate, onDeactivate }: {
  row: AggregatorRow
  onView: () => void
  onSuspend: () => void
  onActivate: () => void
  onDeactivate: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-[#F7FAF6]">
        <IconDots className="size-5 text-[#161D14]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-[200px] bg-white rounded-[12px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1">
          <button onClick={() => { onView(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
            <IconUserEdit className="size-4" /> View details
          </button>
          <button onClick={() => { navigator.clipboard.writeText(row.email); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
            <IconCopy className="size-4" /> Copy email
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-[14px] leading-[20px] text-[#161D14] hover:bg-[#F7FAF6]">
            <IconMail className="size-4" /> Send message
          </button>
          <div className="h-px bg-[#E5E8DF] mx-2 my-1" />
          {(row.status === "Active" || row.status === "Pending") && (
            <button onClick={() => { onSuspend(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-[14px] leading-[20px] text-[#995917] hover:bg-[#F7FAF6]">
              <IconAlertTriangle className="size-4" /> Suspend
            </button>
          )}
          {(row.status === "Suspended" || row.status === "Deactivated" || row.status === "Expired") && (
            <button onClick={() => { onActivate(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-[14px] leading-[20px] text-[#008744] hover:bg-[#F7FAF6]">
              <IconPlayerPlay className="size-4" /> Reactivate
            </button>
          )}
          {row.status !== "Deactivated" && (
            <button onClick={() => { onDeactivate(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-[14px] leading-[20px] text-[#BA1A1A] hover:bg-[#F7FAF6]">
              <IconBan className="size-4" /> Deactivate
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Modals ──

function SuspendModal({ open, onOpenChange, name, onSubmit }: {
  open: boolean; onOpenChange: (v: boolean) => void; name: string
  onSubmit: (data: { reason: string }) => void
}) {
  const [reason, setReason] = useState("")
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ reason }); setReason("") }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Suspend Aggregator" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Suspend {name}</h2>
              <p className="text-[14px] leading-[20px] text-[#525C4E]">This will suspend the aggregator's access. They will not be able to perform any operations until reactivated.</p>
              <FormField label="Reason for suspension">
                <FormTextarea placeholder="Explain why this aggregator is being suspended..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" size="md" shape="rect">
              <IconAlertTriangle className="size-5" />
              Suspend
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function DeactivateModal({ open, onOpenChange, name, onSubmit }: {
  open: boolean; onOpenChange: (v: boolean) => void; name: string
  onSubmit: (data: { reason: string }) => void
}) {
  const [reason, setReason] = useState("")
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ reason }); setReason("") }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Deactivate Aggregator" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">Deactivate {name}</h2>
              <p className="text-[14px] leading-[20px] text-[#525C4E]">This will permanently deactivate the aggregator. This action can be reversed by reactivating.</p>
              <FormField label="Reason for deactivation">
                <FormTextarea placeholder="Explain why this aggregator is being deactivated..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" size="md" shape="rect">
              <IconBan className="size-5" />
              Deactivate
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

function AddAggregatorModal({ open, onOpenChange, onSubmit }: {
  open: boolean; onOpenChange: (v: boolean) => void
  onSubmit: (data: { name: string; email: string; country: string; region: string; tier: string }) => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [tier, setTier] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, email, country, region, tier })
    setName(""); setEmail(""); setCountry(""); setRegion(""); setTier("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Add Aggregator" onClose={() => onOpenChange(false)} />
          <ModalBody>
            <div className="flex flex-col gap-6">
              <h2 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">New Aggregator</h2>
              <FormField label="Full name">
                <FormInput placeholder="Enter aggregator name" value={name} onChange={(e) => setName(e.target.value)} />
              </FormField>
              <FormField label="Email address">
                <FormInput type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormField>
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormField label="Country">
                    <FormSelect value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option value="">Select country</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Togo">Togo</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Kenya">Kenya</option>
                    </FormSelect>
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField label="Region">
                    <FormInput placeholder="Enter region" value={region} onChange={(e) => setRegion(e.target.value)} />
                  </FormField>
                </div>
              </div>
              <FormField label="Tier">
                <FormSelect value={tier} onChange={(e) => setTier(e.target.value)}>
                  <option value="">Select tier</option>
                  <option value="PLATINUM">Platinum</option>
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                  <option value="BRONZE">Bronze</option>
                </FormSelect>
              </FormField>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" size="md" shape="rect" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" size="md" shape="rect">
              <IconCheck className="size-5" />
              Add Aggregator
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

// ── Detail Sheet ──

function AggregatorDetailSheet({ open, onClose, row, onSuspend, onDeactivate, onActivate }: {
  open: boolean; onClose: () => void; row: AggregatorRow | null
  onSuspend: () => void; onDeactivate: () => void; onActivate: () => void
}) {
  if (!open || !row) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-[35vw] bg-white shadow-lg flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="flex items-center h-[60px] border-b border-[#E5E8DF] px-6 shrink-0">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F7FAF6]">
            <IconX className="size-5 text-[#161D14]" />
          </button>
          <div className="h-5 w-px bg-[#E5E8DF] mx-3" />
          <span className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#161D14]">Aggregator details</span>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-[#235C4B] text-[#CEFFEB] text-[14px] font-bold">
                {row.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-[20px] leading-[28px] font-bold text-[#161D14]">{row.name}</h2>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">{row.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TierBadge tier={row.tier} />
              <StatusBadge status={row.status} />
            </div>
          </div>

          <div className="h-[8px] bg-[#F3F7F2]" />

          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Profile details</h3>
            <div className="flex flex-wrap gap-2">
              <DetailTile label="Full name" value={row.name} />
              <DetailTile label="Email" value={row.email} />
              <DetailTile label="Country" value={row.country} />
              <DetailTile label="Region" value={row.region} />
              <DetailTile label="Date joined" value={row.dateJoined} />
              <DetailTile label="Tier" value={row.tier} />
              <DetailTile label="Status" value={row.status} valueColor={statusConfig[row.status].text} />
            </div>
          </div>

          <div className="h-[8px] bg-[#F3F7F2]" />

          <div className="px-6 pt-4 pb-4">
            <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14] pb-3 border-b border-[#E5E8DF] mb-3">Performance summary</h3>
            <div className="flex flex-wrap gap-2">
              <DetailTile label="Total orders" value="142" />
              <DetailTile label="Completed" value="128" valueColor="#008744" />
              <DetailTile label="Pending" value="8" valueColor="#995917" />
              <DetailTile label="Failed" value="6" valueColor="#BA1A1A" />
              <DetailTile label="Avg rating" value="4.6 / 5.0" />
              <DetailTile label="Revenue (MTD)" value="$48,200" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#E5E8DF] shrink-0">
          <button onClick={onClose} className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-bold text-[#161D14] hover:bg-[#E1E4DA] transition-colors">
            <IconFileExport className="size-4" />
            Export
          </button>
          <div className="flex-1" />
          {(row.status === "Suspended" || row.status === "Deactivated" || row.status === "Expired") && (
            <Button variant="primary" size="sm" onClick={onActivate}>
              <IconPlayerPlay className="size-4" />
              Reactivate
            </Button>
          )}
          {(row.status === "Active" || row.status === "Pending") && (
            <Button variant="secondary" size="sm" onClick={onSuspend}>
              <IconAlertTriangle className="size-4" />
              Suspend
            </Button>
          )}
          {row.status !== "Deactivated" && (
            <Button variant="destructive" size="sm" onClick={onDeactivate}>
              <IconBan className="size-4" />
              Deactivate
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Activity Summary Tab ──

function ActivitySummaryTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="p-3 rounded-full bg-[#EDF0E6]">
        <IconRefreshAlert className="size-8 text-[#525C4E]" />
      </div>
      <p className="text-[16px] leading-[24px] font-bold text-[#161D14]">Activity Summary</p>
      <p className="text-[14px] leading-[20px] text-[#525C4E] text-center max-w-[360px]">
        Aggregator activity logs, performance trends, and engagement metrics will appear here.
      </p>
    </div>
  )
}

// ── Main Page ──

export function AggregatorManagementPage() {
  const [activeTab, setActiveTab] = useState<"all" | "activity">("all")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailRow, setDetailRow] = useState<AggregatorRow | null>(null)
  const [suspendTarget, setSuspendTarget] = useState<AggregatorRow | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<AggregatorRow | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const tierRef = useRef<HTMLDivElement>(null)
  const perPage = 10

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusDropdownOpen(false)
      if (tierRef.current && !tierRef.current.contains(e.target as Node)) setTierDropdownOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = allRows.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.country.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "all" && r.status !== statusFilter) return false
    if (tierFilter !== "all" && r.tier !== tierFilter) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage)
  const allChecked = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id))

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pageRows.map((r) => r.id)))
    }
  }

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelectedIds(next)
  }

  // KPI counts
  const totalAggregators = allRows.length
  const activeCount = allRows.filter(r => r.status === "Active").length
  const pendingCount = allRows.filter(r => r.status === "Pending" || r.status === "Pending suspension").length
  const suspendedCount = allRows.filter(r => r.status === "Suspended").length
  const deactivatedCount = allRows.filter(r => r.status === "Deactivated").length
  const uniqueRegions = new Set(allRows.map(r => r.region)).size

  const tabs = [
    { key: "all" as const, label: "All aggregators", icon: IconUsersGroup },
    { key: "activity" as const, label: "Activity summary", icon: IconRefreshAlert },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-2">
        <h1 className="font-bold text-[28px] leading-[36px] text-[#161D14]">Aggregators</h1>
        <Button variant="secondary" size="sm">
          <IconFileExport className="size-4" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#E5E8DF]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 pb-3 text-[14px] leading-[20px] font-medium border-b-2 transition-colors ${activeTab === t.key ? "border-[#36B92E] text-[#161D14]" : "border-transparent text-[#525C4E] hover:text-[#161D14]"}`}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "activity" ? (
        <ActivitySummaryTab />
      ) : (
        <>
          {/* Top Filter pills */}
          <div className="flex items-center gap-4">
            <FilterButton label="Date range" icon={IconCalendar} />
            <FilterButton label="All countries" icon={IconWorld} />
          </div>

          {/* KPI Cards */}
          <div className="flex items-stretch gap-2">
            {/* Total aggregators */}
            <div className="w-[190px] p-4 bg-white shadow-[0px_1px_2px_rgba(22,29,20,0.10)] rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-[6px] bg-[#EBF3E3]">
                  <IconUsersGroup className="size-4 text-[#36B92E]" />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] text-[#161D14]">Total aggregators</span>
              </div>
              <span className="text-[24px] leading-[32px] font-bold text-[#161D14]">{totalAggregators}</span>
            </div>

            {/* Total regions */}
            <div className="w-[180px] p-4 bg-white shadow-[0px_1px_2px_rgba(22,29,20,0.10)] rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-[6px] bg-[#D5E6FD]">
                  <IconWorld className="size-4 text-[#0063EA]" />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] text-[#161D14]">Total regions</span>
              </div>
              <span className="text-[24px] leading-[32px] font-bold text-[#161D14]">{uniqueRegions}</span>
            </div>

            {/* Status breakdown */}
            <div className="flex-1 py-4 pl-5 bg-white shadow-[0px_1px_2px_rgba(22,29,20,0.10)] rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-[6px] bg-[#E2D1FD]">
                  <IconRefreshAlert className="size-4 text-[#7925CC]" />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] text-[#161D14]">Status</span>
              </div>
              <div className="flex items-start gap-5">
                <div className="flex-1 border-r border-[#73796E] flex flex-col gap-1">
                  <span className="text-[12px] leading-[18px] text-[#161D14]">Active</span>
                  <span className="text-[16px] leading-[24px] text-[#008744]">{activeCount}</span>
                </div>
                <div className="flex-1 border-r border-[#73796E] flex flex-col gap-1">
                  <span className="text-[12px] leading-[18px] text-[#161D14]">Pending</span>
                  <span className="text-[16px] leading-[24px] text-[#995917]">{pendingCount}</span>
                </div>
                <div className="flex-1 border-r border-[#73796E] flex flex-col gap-1">
                  <span className="text-[12px] leading-[18px] text-[#161D14]">Suspended</span>
                  <span className="text-[16px] leading-[24px] text-[#8F0004]">{suspendedCount}</span>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[12px] leading-[18px] text-[#161D14]">Deactivated</span>
                  <span className="text-[16px] leading-[24px] text-[#8F0004]">{deactivatedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-2 py-4">
            <div className="w-[360px] h-9 px-4 flex items-center gap-2 rounded-full bg-[#EDF0E6]">
              <IconSearch className="size-4 text-[#161D14]" />
              <input
                type="text"
                placeholder="Search by aggregators, country"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="flex-1 bg-transparent text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] outline-none"
              />
            </div>

            {/* Status filter */}
            <div className="relative" ref={statusRef}>
              <button onClick={() => setStatusDropdownOpen(!statusDropdownOpen)} className="h-9 px-3 flex items-center gap-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] text-[#161D14]">
                <span>{statusFilter === "all" ? "All statuses" : statusFilter}</span>
                <IconChevronDown className="size-4 text-[#161D14]" />
              </button>
              {statusDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 w-[200px] bg-white rounded-[12px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1">
                  {["all", "Active", "Pending", "Suspended", "Pending suspension", "Deactivated", "Expired"].map((s) => (
                    <button key={s} onClick={() => { setStatusFilter(s); setStatusDropdownOpen(false); setPage(1) }}
                      className={`w-full text-left px-3 py-2 text-[14px] leading-[20px] hover:bg-[#F7FAF6] ${statusFilter === s ? "font-bold text-[#161D14]" : "text-[#161D14]"}`}>
                      {s === "all" ? "All statuses" : s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tier filter */}
            <div className="relative" ref={tierRef}>
              <button onClick={() => setTierDropdownOpen(!tierDropdownOpen)} className="h-9 px-3 flex items-center gap-2 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] text-[#161D14]">
                <span>{tierFilter === "all" ? "All tier" : tierFilter}</span>
                <IconChevronDown className="size-4 text-[#161D14]" />
              </button>
              {tierDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 w-[160px] bg-white rounded-[12px] shadow-lg outline outline-1 outline-[#E5E8DF] py-1">
                  {["all", "PLATINUM", "GOLD", "SILVER", "BRONZE"].map((t) => (
                    <button key={t} onClick={() => { setTierFilter(t); setTierDropdownOpen(false); setPage(1) }}
                      className={`w-full text-left px-3 py-2 text-[14px] leading-[20px] hover:bg-[#F7FAF6] ${tierFilter === t ? "font-bold text-[#161D14]" : "text-[#161D14]"}`}>
                      {t === "all" ? "All tier" : t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[6px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
            {/* Header */}
            <div className="flex items-center bg-[#F7FAF6] border-b border-[#E5E8DF]">
              <div className="h-10 pl-4 pr-2 flex items-center">
                <input type="checkbox" checked={allChecked} onChange={toggleAll}
                  className="size-4 rounded-[3px] border border-[#E5E8DF] accent-[#36B92E]" />
              </div>
              <div className="w-[154px] h-10 px-2 flex items-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Aggregator name</span>
              </div>
              <div className="w-[162px] h-10 px-2 flex items-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Country</span>
              </div>
              <div className="w-[100px] h-10 px-2 flex items-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Regions</span>
              </div>
              <div className="flex-1 h-10 px-2 pr-4 flex items-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Aggregator email</span>
              </div>
              <div className="w-[120px] h-10 px-2 flex items-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Date Joined</span>
              </div>
              <div className="w-[110px] h-10 px-2 flex items-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Tier</span>
              </div>
              <div className="w-[156px] h-10 px-2 flex items-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Status</span>
              </div>
              <div className="w-[60px] h-10" />
            </div>

            {/* Body */}
            {pageRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="p-3 rounded-full bg-[#EDF0E6]">
                  <IconUsersGroup className="size-6 text-[#525C4E]" />
                </div>
                <p className="text-[14px] leading-[20px] font-bold text-[#161D14]">No aggregators found</p>
                <p className="text-[14px] leading-[20px] text-[#525C4E]">Try adjusting your search or filters</p>
              </div>
            ) : (
              pageRows.map((row) => (
                <div key={row.id} className="flex items-center border-b border-[#E5E8DF] last:border-b-0 hover:bg-[#FBFDF8] transition-colors">
                  <div className="h-[53px] py-2 pl-4 pr-2 flex items-center">
                    <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)}
                      className="size-4 rounded-[3px] border border-[#E5E8DF] accent-[#36B92E]" />
                  </div>
                  <div className="w-[154px] h-[53px] p-2 flex items-center">
                    <button onClick={() => setDetailRow(row)} className="text-[14px] leading-[20px] text-[#161D14] hover:underline text-left">{row.name}</button>
                  </div>
                  <div className="w-[162px] h-[53px] p-2 flex items-center gap-2.5">
                    <span className="text-[16px]">{countryFlags[row.countryCode] ?? ""}</span>
                    <span className="text-[14px] leading-[20px] text-[#161D14]">{row.country}</span>
                  </div>
                  <div className="w-[100px] h-[53px] p-2 flex items-center">
                    <span className="text-[14px] leading-[20px] text-[#161D14]">{row.region}</span>
                  </div>
                  <div className="flex-1 h-[53px] py-2 pl-2 pr-4 flex items-center">
                    <span className="text-[14px] leading-[20px] text-[#161D14] truncate">{row.email}</span>
                  </div>
                  <div className="w-[120px] h-[53px] p-2 flex items-center">
                    <span className="text-[14px] leading-[20px] text-[#161D14]">{row.dateJoined}</span>
                  </div>
                  <div className="w-[110px] h-[53px] py-2 pl-2 pr-4 flex items-center">
                    <TierBadge tier={row.tier} />
                  </div>
                  <div className="w-[156px] h-[53px] py-2 pl-2 pr-4 flex items-center">
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="h-[53px] py-2 pl-2 pr-4 flex items-center">
                    <RowActions
                      row={row}
                      onView={() => setDetailRow(row)}
                      onSuspend={() => setSuspendTarget(row)}
                      onActivate={() => {/* handle reactivate */}}
                      onDeactivate={() => setDeactivateTarget(row)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 h-9">
            <div className="flex-1">
              <span className="text-[14px] leading-[20px] text-[#161D14]">{selectedIds.size} of {filtered.length} row(s) selected.</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-[14px] leading-[20px] text-[#161D14] pr-2">Rows per page</span>
                <div className="w-[80px] h-9 px-3 py-2 flex items-center justify-between rounded-[6px] outline outline-1 outline-[#E5E8DF]">
                  <span className="text-[14px] leading-[20px] text-[#161D14]">{perPage}</span>
                  <IconChevronDown className="size-4 text-[#161D14]" />
                </div>
              </div>
              <span className="text-[14px] leading-[20px] font-bold text-[#161D14] pr-2">Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(1)} disabled={page === 1}
                  className="size-8 flex items-center justify-center rounded-[6px] outline outline-1 outline-[#E5E8DF] disabled:opacity-50">
                  <IconChevronsLeft className="size-4 text-[#161D14]" />
                </button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="size-8 flex items-center justify-center rounded-[6px] outline outline-1 outline-[#E5E8DF] disabled:opacity-50">
                  <IconChevronLeft className="size-4 text-[#161D14]" />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="size-8 flex items-center justify-center rounded-[6px] outline outline-1 outline-[#E5E8DF] disabled:opacity-50">
                  <IconChevronRight className="size-4 text-[#161D14]" />
                </button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                  className="size-8 flex items-center justify-center rounded-[6px] outline outline-1 outline-[#E5E8DF] disabled:opacity-50">
                  <IconChevronsRight className="size-4 text-[#161D14]" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Sheet */}
      <AggregatorDetailSheet
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        row={detailRow}
        onSuspend={() => { if (detailRow) { setSuspendTarget(detailRow); setDetailRow(null) } }}
        onDeactivate={() => { if (detailRow) { setDeactivateTarget(detailRow); setDetailRow(null) } }}
        onActivate={() => setDetailRow(null)}
      />

      {/* Modals */}
      <SuspendModal
        open={!!suspendTarget}
        onOpenChange={(v) => { if (!v) setSuspendTarget(null) }}
        name={suspendTarget?.name ?? ""}
        onSubmit={() => setSuspendTarget(null)}
      />
      <DeactivateModal
        open={!!deactivateTarget}
        onOpenChange={(v) => { if (!v) setDeactivateTarget(null) }}
        name={deactivateTarget?.name ?? ""}
        onSubmit={() => setDeactivateTarget(null)}
      />
      <AddAggregatorModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={() => setAddOpen(false)}
      />
    </div>
  )
}
