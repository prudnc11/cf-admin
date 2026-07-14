import { useState, useRef, useEffect } from "react"
import {
  IconSearch,
  IconBell,
  IconSparkles,
  IconCircleCheck,
  IconChevronRight,
  IconClock,
  IconDots,
} from "@tabler/icons-react"

const categories = [
  { label: "Buyer KYC", total: 12, badge: 6 },
  { label: "Aggregator KYC", total: 7, badge: 6 },
  { label: "Deactivation", total: 10, badge: 2 },
  { label: "Suspension", total: 10, badge: 2 },
]

const tabs = [
  { label: "New", icon: IconBell },
  { label: "In progress", icon: IconSparkles },
  { label: "Completed", icon: IconCircleCheck },
]

const newRequests = [
  { date: "27 Aug 2025 at 12:45PM", aggregator: "James Bawuah", requestedBy: "Sampson Emmanuel", status: "Pending" },
  { date: "28 Aug 2025 at 1:30PM", aggregator: "Maria Chen", requestedBy: "Liam O'Reilly", status: "Pending" },
  { date: "29 Aug 2025 at 3:15PM", aggregator: "Sophia Patel", requestedBy: "Ethan Kim", status: "Pending" },
  { date: "27 Aug 2025 at 12:45PM", aggregator: "James Bawuah", requestedBy: "Sampson Emmanuel", status: "Pending" },
  { date: "30 Aug 2025 at 9:00AM", aggregator: "Carlos Ruiz", requestedBy: "Ava Johnson", status: "Pending" },
  { date: "31 Aug 2025 at 11:00AM", aggregator: "Emma Thompson", requestedBy: "Noah Brown", status: "Pending" },
]

const inProgressRequests = [
  { date: "27 Aug 2025 at 12:45PM", customer: "James Bawuah" },
  { date: "27 Aug 2025 at 12:45PM", customer: "James Bawuah" },
  { date: "27 Aug 2025 at 12:45PM", customer: "James Bawuah" },
  { date: "27 Aug 2025 at 12:45PM", customer: "James Bawuah" },
  { date: "27 Aug 2025 at 12:45PM", customer: "James Bawuah" },
  { date: "27 Aug 2025 at 12:45PM", customer: "James Bawuah" },
]

function RowMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-center size-8 rounded-lg hover:bg-[#F7FAF6]">
        <IconDots className="size-4 text-[#161D14]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] py-1 z-10 min-w-[160px]">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full px-3 py-2 text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#F7FAF6]"
          >
            <IconBell className="size-4" />
            Send reminder
          </button>
        </div>
      )}
    </div>
  )
}

export function AllRequestsPage() {
  const [activeCategory, setActiveCategory] = useState("Aggregator KYC")
  const [activeTab, setActiveTab] = useState("New")

  return (
    <div className="flex gap-0 h-full">
      {/* Left Sidebar */}
      <div className="shrink-0 flex flex-col border-r border-[#E5E8DF] w-[280px]">
        <div className="p-4 border-b border-[#E5E8DF] flex flex-col gap-2.5">
          <h2 className="text-[16px] leading-[24px] font-bold text-[#161D14]">All requests</h2>
          <div className="flex items-center h-9 px-2 rounded-full bg-[#EDF0E6]">
            <div className="px-2 flex items-center justify-center">
              <IconSearch className="size-4 text-[#161D14]" />
            </div>
            <input
              type="text"
              placeholder="Search by requester name"
              className="flex-1 bg-transparent text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] outline-none pr-2"
            />
          </div>
        </div>
        <div className="flex flex-col">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-4 text-left ${
                  isActive ? "bg-[#F4FCEC]" : "bg-white hover:bg-[#F7FAF6]"
                }`}
              >
                <div className="flex items-center gap-4 py-4 border-b border-[#E5E8DF]">
                  <div className="flex-1 flex flex-col gap-1">
                    <span
                      className={`text-[16px] leading-[24px] ${
                        isActive ? "font-bold text-[#36B92E]" : "font-normal text-[#161D14]"
                      }`}
                    >
                      {cat.label}
                    </span>
                    <span
                      className={`text-[14px] leading-[20px] text-[#525C4E] ${
                        isActive ? "font-bold" : "font-normal"
                      }`}
                    >
                      Total: {cat.total}
                    </span>
                  </div>
                  <span className="inline-flex items-center justify-center px-1.5 py-px rounded-full bg-[#BA1A1A] outline outline-2 outline-white text-white text-[12px] leading-[18px] font-normal">
                    {cat.badge}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-center h-[58px] px-10 border-b-2 border-[#E5E8DF]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label
            const Icon = tab.icon
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 h-full px-3 border-b-2 -mb-[2px] transition-colors ${
                  isActive
                    ? "border-[#306B28] text-[#306B28] font-bold"
                    : "border-transparent text-[#161D14] font-normal hover:text-[#161D14]"
                } text-[16px] leading-[24px]`}
              >
                <Icon className="size-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Table */}
        {(activeTab === "New" || activeTab === "In progress") && (
        <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden mx-10">
          {activeTab === "New" && (
            <table className="w-full">
              <thead>
                <tr className="bg-[#F7FAF6]">
                  <th className="text-left px-4 py-3 text-[14px] leading-[20px] font-bold text-[#161D14]">Date</th>
                  <th className="text-left px-4 py-3 text-[14px] leading-[20px] font-bold text-[#161D14]">Aggregators</th>
                  <th className="text-left px-4 py-3 text-[14px] leading-[20px] font-bold text-[#161D14]">Requested by</th>
                  <th className="text-left px-4 py-3 text-[14px] leading-[20px] font-bold text-[#161D14]">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {newRequests.map((req, i) => (
                  <tr key={i} className="border-t border-[#E5E8DF]">
                    <td className="px-4 py-4 text-[14px] leading-[20px] font-normal text-[#161D14]">{req.date}</td>
                    <td className="px-4 py-4 text-[14px] leading-[20px] font-normal text-[#161D14]">{req.aggregator}</td>
                    <td className="px-4 py-4 text-[14px] leading-[20px] font-normal text-[#161D14]">{req.requestedBy}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FEF0D8] rounded-[6px]">
                        <IconClock className="size-3 text-[#995917]" />
                        <span className="text-[12px] leading-[18px] font-normal text-[#995917]">{req.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button className="flex items-center gap-1 text-[14px] leading-[20px] font-bold text-[#36B92E]">
                        Review
                        <IconChevronRight className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "In progress" && (
            <table className="w-full">
              <thead>
                <tr className="bg-[#F7FAF6]">
                  <th className="text-left px-4 py-3 text-[14px] leading-[20px] font-bold text-[#161D14]">Date</th>
                  <th className="text-left px-4 py-3 text-[14px] leading-[20px] font-bold text-[#161D14]">Customers</th>
                  <th className="text-left px-4 py-3 text-[14px] leading-[20px] font-bold text-[#161D14]">Status</th>
                  <th className="px-4 py-3 w-[48px]"></th>
                </tr>
              </thead>
              <tbody>
                {inProgressRequests.map((req, i) => (
                  <tr key={i} className="border-t border-[#E5E8DF]">
                    <td className="px-4 py-4 text-[14px] leading-[20px] font-normal text-[#161D14]">{req.date}</td>
                    <td className="px-4 py-4 text-[14px] leading-[20px] font-normal text-[#161D14]">{req.customer}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] outline outline-1 outline-[#E5E8DF]">
                        <IconSparkles className="size-3 text-[#1A5514]" />
                        <span className="text-[12px] leading-[18px] font-normal text-[#1A5514]">In progress</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <RowMenu />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
        )}

        {activeTab === "Completed" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-16">
            {/* Illustration */}
            <div className="relative w-[160px] h-[160px] overflow-hidden">
              {/* Dark teal row */}
              <div className="absolute left-[6.67px] top-[20px] w-[133.33px] h-[36px] rounded-md bg-[#1C4A45]" />
              <div className="absolute left-[28.67px] top-[28.67px] w-[102.53px] h-[6.93px] rounded-sm bg-[#9FF2E0]" />
              <div className="absolute left-[28.67px] top-[40.40px] w-[70.35px] h-[6.93px] rounded-sm bg-[#9FF2E0]" />
              <svg className="absolute left-[14px] top-[28.67px]" width="9" height="9" viewBox="0 0 9 9" fill="none">
                <rect width="8.8" height="8.8" rx="1.5" fill="#9FF2E0" />
                <path d="M2.47 4.4L3.93 5.87L6.87 2.93" stroke="#1C4A45" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Green row */}
              <div className="absolute left-[21.33px] top-[62.67px] w-[133.33px] h-[36px] rounded-md bg-[#31B92E]" />
              <div className="absolute left-[43.33px] top-[71.33px] w-[102.53px] h-[6.93px] rounded-sm bg-[#B4F6A2]" />
              <div className="absolute left-[43.33px] top-[83.07px] w-[70.35px] h-[6.93px] rounded-sm bg-[#B4F6A2]" />
              <svg className="absolute left-[28.67px] top-[71.33px]" width="9" height="9" viewBox="0 0 9 9" fill="none">
                <rect width="8.8" height="8.8" rx="1.5" fill="#B4F6A2" />
                <path d="M2.47 4.4L3.93 5.87L6.87 2.93" stroke="#31B92E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Yellow/orange row */}
              <div className="absolute left-[6.67px] top-[105.33px] w-[133.33px] h-[36px] rounded-md bg-[#FFB400]" />
              <div className="absolute left-[28.67px] top-[114px] w-[102.53px] h-[6.93px] rounded-sm bg-[#FFE000]" />
              <div className="absolute left-[28.67px] top-[125.73px] w-[70.35px] h-[6.93px] rounded-sm bg-[#FFE000]" />
              <svg className="absolute left-[14px] top-[114px]" width="9" height="9" viewBox="0 0 9 9" fill="none">
                <rect width="8.8" height="8.8" rx="1.5" fill="#FFE000" />
                <path d="M2.47 4.4L3.93 5.87L6.87 2.93" stroke="#BC5900" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Text */}
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14] text-center">No completed requests yet</h3>
              <p className="text-[14px] leading-[20px] font-normal text-[#525C4E] text-center">
                Once you've approved or declined requests,<br />they'll appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
