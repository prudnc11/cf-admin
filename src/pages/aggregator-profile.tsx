import { useState } from "react"
import {
  IconChevronLeft,
  IconStar,
  IconCheck,
  IconX,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react"
import { supplyBids } from "./supply-bids"
import type { SupplyBid } from "./supply-bids"

// --- Aggregator Score Computation ---

export type AggregatorRating = {
  bidId: string
  type: "qa" | "cycle"
  ratings: Record<string, number>
  comment: string
  date: string
  crop: string
}

export type AggregatorSignal = {
  type: "positive" | "negative"
  label: string
  bidId: string
  date: string
}

export type AggregatorScoreData = {
  name: string
  ratings: AggregatorRating[]
  signals: AggregatorSignal[]
}

// Global mutable store for ratings (simulates backend)
const aggregatorStore: Record<string, AggregatorScoreData> = {}

export function getAggregatorData(name: string): AggregatorScoreData {
  if (!aggregatorStore[name]) {
    aggregatorStore[name] = { name, ratings: [], signals: [] }
  }
  return aggregatorStore[name]
}

export function addRating(aggregatorName: string, rating: AggregatorRating) {
  const data = getAggregatorData(aggregatorName)
  data.ratings.push(rating)
}

export function addSignal(aggregatorName: string, signal: AggregatorSignal) {
  const data = getAggregatorData(aggregatorName)
  data.signals.push(signal)
}

export function computeScore(aggregatorName: string): { score: number; grade: string; trend: "up" | "down" | "stable" } {
  const data = getAggregatorData(aggregatorName)
  const bids = supplyBids.filter(b => b.aggregator === aggregatorName)

  // Base from existing aggregatorScore on completed bids
  const completedWithScore = bids.filter(b => b.stage === "completed" && b.aggregatorScore)
  const baseScore = completedWithScore.length > 0
    ? completedWithScore.reduce((sum, b) => sum + (b.aggregatorScore || 0), 0) / completedWithScore.length
    : 3.0

  // Rating average (weighted: cycle ratings count more)
  let ratingSum = 0
  let ratingCount = 0
  for (const r of data.ratings) {
    const values = Object.values(r.ratings)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const weight = r.type === "cycle" ? 1.5 : 1.0
    ratingSum += avg * weight
    ratingCount += weight
  }
  const ratingAvg = ratingCount > 0 ? ratingSum / ratingCount : baseScore

  // Signal adjustments
  const positiveSignals = data.signals.filter(s => s.type === "positive").length
  const negativeSignals = data.signals.filter(s => s.type === "negative").length

  // Auto signals from bid data
  const qaPassed = bids.filter(b => b.qaResult === "pass").length
  const qaFailed = bids.filter(b => b.qaResult === "fail").length
  const routed = bids.filter(b => b.stage === "completed" || b.stage === "routing").length
  const rejected = bids.filter(b => b.stage === "rejected").length

  // Compute final score
  let score = ratingCount > 0 ? ratingAvg : baseScore
  score += positiveSignals * 0.1
  score -= negativeSignals * 0.15
  score += qaPassed * 0.05
  score -= qaFailed * 0.2
  score += routed * 0.05
  score -= rejected * 0.1

  score = Math.max(0, Math.min(5, score))
  score = Math.round(score * 10) / 10

  const grade = score >= 4.5 ? "Excellent" : score >= 3.5 ? "Good" : score >= 2.5 ? "Average" : score >= 1.5 ? "Below Average" : "Poor"
  const trend = positiveSignals + qaPassed + routed > negativeSignals + qaFailed + rejected ? "up" : negativeSignals + qaFailed + rejected > 0 ? "down" : "stable"

  return { score, grade, trend }
}

// --- Components ---

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const pct = (score / 5) * 100
  const color = score >= 4.0 ? "#36B92E" : score >= 3.0 ? "#0063EA" : score >= 2.0 ? "#995917" : "#DC2626"
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-32">
        <svg viewBox="0 0 128 128" className="size-32">
          <circle cx="64" cy="64" r="56" fill="none" stroke="#EDF0E6" strokeWidth="10" />
          <circle
            cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${pct * 3.52} ${352 - pct * 3.52}`}
            strokeDashoffset="88" strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] leading-[36px] font-bold" style={{ color }}>{score}</span>
          <span className="text-[12px] leading-[18px] text-[#525C4E]">/ 5.0</span>
        </div>
      </div>
      <span className="text-[16px] leading-[24px] font-bold" style={{ color }}>{grade}</span>
    </div>
  )
}

function SignalCard({ type, count, label, icon: Icon }: { type: "positive" | "negative"; count: number; label: string; icon: React.ElementType }) {
  const isPos = type === "positive"
  return (
    <div className={`flex items-center gap-3 p-3 rounded-[8px] ${isPos ? "bg-[#D4F5D0]" : "bg-[#FEE2E2]"}`}>
      <Icon className="size-5" style={{ color: isPos ? "#1A5514" : "#DC2626" }} />
      <div className="flex-1">
        <span className="text-[14px] leading-[20px] font-bold" style={{ color: isPos ? "#1A5514" : "#DC2626" }}>{count}</span>
        <span className="text-[12px] leading-[18px] text-[#525C4E] ml-1.5">{label}</span>
      </div>
    </div>
  )
}

function BidHistoryRow({ bid }: { bid: SupplyBid }) {
  const stageColor = bid.stage === "completed" || bid.stage === "routing" ? "#1A5514"
    : bid.stage === "rejected" ? "#DC2626"
    : "#00439E"
  const stageBg = bid.stage === "completed" || bid.stage === "routing" ? "#D4F5D0"
    : bid.stage === "rejected" ? "#FEE2E2"
    : "#D5E6FD"
  const stageLabel = bid.stage === "completed" ? "Completed" : bid.stage === "routing" ? "Routing" : bid.stage === "rejected" ? "Rejected" : bid.stage === "finance" ? "Finance" : bid.stage === "grn" ? "GRN" : bid.stage === "field-qa" || bid.stage === "warehouse-qa" ? "QA" : bid.stage === "scheduling" ? "Scheduling" : bid.stage === "negotiation" ? "Negotiation" : "Submitted"

  return (
    <div className="flex items-center py-3 border-b border-[#E5E8DF] last:border-b-0">
      <div className="flex-1 flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{bid.id}</span>
          <span className="text-[12px] leading-[18px] text-[#525C4E]">{bid.crop} • {bid.quantity} {bid.unit} • {bid.supplyRequestId}</span>
        </div>
      </div>
      <div className="w-[120px]">
        <span className="text-[12px] leading-[18px] text-[#525C4E]">{bid.submittedDate}</span>
      </div>
      <div className="w-[100px]">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] text-[12px] leading-[18px]" style={{ background: stageBg, color: stageColor }}>
          {stageLabel}
        </span>
      </div>
      <div className="w-[100px] text-right">
        <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{bid.totalValue}</span>
      </div>
      <div className="w-[80px] flex items-center justify-end gap-0.5">
        {bid.aggregatorScore ? (
          <>
            <IconStar className="size-4" style={{ color: "#FBB33A" }} fill="#FBB33A" />
            <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{bid.aggregatorScore}</span>
          </>
        ) : (
          <span className="text-[12px] text-[#525C4E]">—</span>
        )}
      </div>
    </div>
  )
}

function RatingHistoryRow({ rating }: { rating: AggregatorRating }) {
  const avg = Object.values(rating.ratings).reduce((a, b) => a + b, 0) / Object.values(rating.ratings).length
  return (
    <div className="flex items-center py-3 border-b border-[#E5E8DF] last:border-b-0">
      <div className="flex-1 flex flex-col">
        <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">
          {rating.type === "qa" ? "QA Readiness" : "Cycle Experience"} — {rating.crop}
        </span>
        <span className="text-[12px] leading-[18px] text-[#525C4E]">{rating.bidId} • {rating.date}</span>
        {rating.comment && <span className="text-[12px] leading-[18px] text-[#525C4E] italic mt-0.5">"{rating.comment}"</span>}
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <IconStar key={s} className="size-4" style={{ color: s <= Math.round(avg) ? "#FBB33A" : "#E1E4DA" }} fill={s <= Math.round(avg) ? "#FBB33A" : "none"} />
        ))}
        <span className="text-[14px] leading-[20px] font-bold text-[#161D14] ml-1">{avg.toFixed(1)}</span>
      </div>
    </div>
  )
}

// --- Main Profile Page ---

export function AggregatorProfilePage({
  aggregatorName,
  onBack,
}: {
  aggregatorName: string
  onBack: () => void
  onNavigateToBid?: (bidId: string) => void
}) {
  const [activeSection, setActiveSection] = useState<"bids" | "ratings" | "signals">("bids")
  const data = getAggregatorData(aggregatorName)
  const { score, grade, trend } = computeScore(aggregatorName)
  const bids = supplyBids.filter(b => b.aggregator === aggregatorName)

  const completedBids = bids.filter(b => b.stage === "completed").length
  const activeBids = bids.filter(b => b.stage !== "completed" && b.stage !== "rejected").length
  const rejectedBids = bids.filter(b => b.stage === "rejected").length
  const qaPassed = bids.filter(b => b.qaResult === "pass").length
  const qaFailed = bids.filter(b => b.qaResult === "fail").length
  const totalValue = bids.filter(b => b.stage === "completed").reduce((sum, b) => {
    const num = parseFloat(b.totalValue.replace(/[^0-9.]/g, ""))
    return sum + (isNaN(num) ? 0 : num)
  }, 0)

  const TrendIcon = trend === "up" ? IconTrendingUp : trend === "down" ? IconTrendingDown : IconMinus
  const trendColor = trend === "up" ? "#1A5514" : trend === "down" ? "#DC2626" : "#525C4E"

  const sections = [
    { key: "bids" as const, label: "Bid History", count: bids.length },
    { key: "ratings" as const, label: "Admin Ratings", count: data.ratings.length },
    { key: "signals" as const, label: "Score Signals", count: data.signals.length },
  ]

  return (
    <div className="flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="inline-flex justify-between items-start px-[40px] py-[16px] bg-white border-b border-[#E5E8DF] -mx-[40px]">
        <div className="inline-flex flex-col items-start gap-[4px]">
          <div className="inline-flex items-center gap-[2px] py-[4px]">
            <button onClick={onBack} className="flex items-center gap-[2px] h-[22px] text-[16px] leading-[24px] font-bold text-[#36B92E] hover:text-[#2DA526] transition-colors">
              <IconChevronLeft className="size-4" />
              Back
            </button>
          </div>
          <div className="inline-flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#235C4B]">
              <span className="text-[20px] font-bold text-[#CEFFEB]">{aggregatorName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-[28px] leading-[36px] font-bold text-[#161D14]">{aggregatorName}</h1>
              <p className="text-[14px] leading-[20px] text-[#525C4E]">Aggregator Profile — Admin View Only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-0 mt-6">
        {/* Left Column */}
        <div className="flex-1 pr-8 flex flex-col gap-6">
          {/* Score Summary Bar */}
          <div className="flex items-stretch gap-4">
            <div className="flex-1 p-5 rounded-[12px] outline outline-1 outline-[#E5E8DF] flex items-center gap-6">
              <ScoreGauge score={score} grade={grade} />
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <TrendIcon className="size-5" style={{ color: trendColor }} />
                  <span className="text-[14px] leading-[20px] font-bold" style={{ color: trendColor }}>
                    {trend === "up" ? "Trending Up" : trend === "down" ? "Trending Down" : "Stable"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SignalCard type="positive" count={completedBids + qaPassed} label="Positive signals" icon={IconCheck} />
                  <SignalCard type="negative" count={rejectedBids + qaFailed} label="Negative signals" icon={IconX} />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-5 gap-3">
            <div className="p-4 rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-1">
              <span className="text-[12px] leading-[18px] text-[#525C4E]">Total Bids</span>
              <span className="text-[20px] leading-[28px] font-bold text-[#161D14]">{bids.length}</span>
            </div>
            <div className="p-4 rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-1">
              <span className="text-[12px] leading-[18px] text-[#525C4E]">Active</span>
              <span className="text-[20px] leading-[28px] font-bold text-[#0063EA]">{activeBids}</span>
            </div>
            <div className="p-4 rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-1">
              <span className="text-[12px] leading-[18px] text-[#525C4E]">Completed</span>
              <span className="text-[20px] leading-[28px] font-bold text-[#1A5514]">{completedBids}</span>
            </div>
            <div className="p-4 rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-1">
              <span className="text-[12px] leading-[18px] text-[#525C4E]">QA Pass Rate</span>
              <span className="text-[20px] leading-[28px] font-bold text-[#1A5514]">
                {qaPassed + qaFailed > 0 ? Math.round((qaPassed / (qaPassed + qaFailed)) * 100) : 0}%
              </span>
            </div>
            <div className="p-4 rounded-[12px] outline outline-1 outline-[#E5E8DF] flex flex-col gap-1">
              <span className="text-[12px] leading-[18px] text-[#525C4E]">Total Value</span>
              <span className="text-[20px] leading-[28px] font-bold text-[#36B92E]">GHS {totalValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center border-b border-[#E5E8DF]">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2 px-4 py-3 text-[14px] leading-[20px] font-bold transition-colors relative ${
                  activeSection === s.key ? "text-[#36B92E]" : "text-[#525C4E] hover:text-[#161D14]"
                }`}
              >
                {s.label}
                {s.count > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-px rounded-full bg-[#EDF0E6] text-[#525C4E] text-[12px] leading-[18px] min-w-[18px]">
                    {s.count}
                  </span>
                )}
                {activeSection === s.key && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36B92E] rounded-t-full" />}
              </button>
            ))}
          </div>

          {/* Section Content */}
          {activeSection === "bids" && (
            <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <div className="flex items-center px-5 py-3 bg-[#F7FAF6] border-b border-[#E5E8DF] text-[12px] leading-[18px] font-bold text-[#525C4E]">
                <div className="flex-1">Bid</div>
                <div className="w-[120px]">Date</div>
                <div className="w-[100px]">Stage</div>
                <div className="w-[100px] text-right">Value</div>
                <div className="w-[80px] text-right">Score</div>
              </div>
              <div className="px-5">
                {bids.length > 0 ? bids.map(bid => (
                  <BidHistoryRow key={bid.id} bid={bid} />
                )) : (
                  <p className="py-8 text-center text-[14px] text-[#525C4E]">No bids found.</p>
                )}
              </div>
            </div>
          )}

          {activeSection === "ratings" && (
            <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <div className="px-5">
                {data.ratings.length > 0 ? data.ratings.map((r, i) => (
                  <RatingHistoryRow key={i} rating={r} />
                )) : (
                  <p className="py-8 text-center text-[14px] text-[#525C4E]">No ratings submitted yet.</p>
                )}
              </div>
            </div>
          )}

          {activeSection === "signals" && (
            <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden">
              <div className="px-5">
                {data.signals.length > 0 ? data.signals.map((s, i) => (
                  <div key={i} className="flex items-center py-3 border-b border-[#E5E8DF] last:border-b-0">
                    <div className={`flex items-center justify-center size-7 rounded-full shrink-0 ${s.type === "positive" ? "bg-[#D4F5D0]" : "bg-[#FEE2E2]"}`}>
                      {s.type === "positive" ? <IconCheck className="size-4 text-[#1A5514]" /> : <IconX className="size-4 text-[#DC2626]" />}
                    </div>
                    <div className="flex-1 ml-3 flex flex-col">
                      <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{s.label}</span>
                      <span className="text-[12px] leading-[18px] text-[#525C4E]">{s.bidId} • {s.date}</span>
                    </div>
                  </div>
                )) : (
                  <p className="py-8 text-center text-[14px] text-[#525C4E]">No score signals recorded yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className="w-px bg-[#E5E8DF] shrink-0" />

        {/* Right Column - Summary Card */}
        <div className="w-[300px] shrink-0 pl-8">
          <div className="rounded-[12px] outline outline-1 outline-[#E5E8DF] overflow-hidden sticky top-4">
            <div className="p-4 border-b border-[#E5E8DF]">
              <h3 className="text-[16px] leading-[24px] font-bold text-[#161D14]">Score Breakdown</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Admin Ratings</span>
                <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">{data.ratings.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Bids Fulfilled</span>
                <span className="text-[14px] leading-[20px] font-bold text-[#1A5514]">{completedBids}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-[20px] text-[#525C4E]">QA Passed</span>
                <span className="text-[14px] leading-[20px] font-bold text-[#1A5514]">{qaPassed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-[20px] text-[#525C4E]">QA Failures</span>
                <span className="text-[14px] leading-[20px] font-bold text-[#DC2626]">{qaFailed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-[20px] text-[#525C4E]">Rejected Bids</span>
                <span className="text-[14px] leading-[20px] font-bold text-[#DC2626]">{rejectedBids}</span>
              </div>
              <div className="h-px bg-[#E5E8DF]" />
              <div className="p-3 bg-[#F7FAF6] rounded-[8px]">
                <p className="text-[12px] leading-[18px] text-[#525C4E]">
                  Score is computed from admin ratings, QA outcomes, fulfilment history, and system signals. Visible to admins only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
