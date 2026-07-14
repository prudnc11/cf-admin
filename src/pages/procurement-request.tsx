import { useState, Fragment } from "react"
import { ProcurementRequestDetailPage } from "./procurement-request-detail"
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconChevronLeft,
  IconChevronsLeft,
  IconChevronsRight,
  IconCalendar,
  IconUsers,
  IconWorld,
  IconFileText,
  IconClipboardCheck,
  IconCash,
  IconTruck,
  IconBuildingWarehouse,
  IconNotes,
  IconX,
  IconAlertTriangle,
  IconCheck,
  IconClock,
} from "@tabler/icons-react"

// --- Data ---

const filters = [
  { label: "All time", icon: IconCalendar },
  { label: "All Aggregators", icon: IconUsers },
  { label: "All commodities", icon: IconWorld },
  { label: "All plans", icon: IconFileText },
]

const metricCards = [
  { label: "Total Requests", value: "68", iconBg: "#D5E6FD", iconColor: "#00439E", icon: IconClipboardCheck },
  { label: "Awaiting Schedule", value: "13", iconBg: "#FEF0D8", iconColor: "#995917", icon: IconClock },
  { label: "Scheduled", value: "22", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconCalendar, hasChevron: true },
  { label: "Overdue", value: "9", iconBg: "#FEE2E2", iconColor: "#DC2626", icon: IconAlertTriangle },
  { label: "Picked up", value: "24", iconBg: "#D4F5D0", iconColor: "#1A5514", icon: IconTruck },
]

const tabItems = [
  { label: "All Requests", badge: 68 },
  { label: "Schedule" },
  { label: "Field QA" },
  { label: "Finance" },
  { label: "Pickup" },
  { label: "Warehouse QA" },
  { label: "GRN" },
  { label: "Rejected" },
  { label: "Overdue" },
]

const tabIcons: Record<string, typeof IconClipboardCheck> = {
  "All Requests": IconClipboardCheck,
  "Schedule": IconCalendar,
  "Field QA": IconClipboardCheck,
  "Finance": IconCash,
  "Pickup": IconTruck,
  "Warehouse QA": IconBuildingWarehouse,
  "GRN": IconNotes,
  "Rejected": IconX,
  "Overdue": IconAlertTriangle,
}

export type PipelineStep = {
  label: string
  status: "completed" | "current" | "pending" | "rejected"
}

export type RequestCard = {
  commodity: string
  requestId: string
  cooperative: string
  product: string
  quantity: string
  plan: string
  statuses: { label: string; color: "green" | "blue" | "red" | "warning" }[]
  produceLabel?: "Local" | "Export" | "Both"
  tag: { label: string; color: "blue" | "purple" }
  pipeline: PipelineStep[]
  scheduledDate: string
  assignedTo: string
  confirmedBy: string
  confirmedDate: string
  currentStage?: "schedule" | "field-qa" | "approval" | "finance" | "pickup" | "warehouse-qa" | "grn" | "routing"
  tabCategory: string
  detailState: DetailState
}

export type DetailState = {
  pipelineSteps: PipelineStep[]
  title: string
  titleBadges: { label: string; color: "green" | "blue" | "red" | "warning" }[]
  actionButton?: { label: string; icon: "route" | "qa" | "approve" | "pickup" | "finance" | "grn" }
  fieldVisit: "completed" | "scheduled" | "pending"
  fieldQA: "completed" | "pending" | "action-needed"
  approval: "approved" | "rejected" | "pending" | "action-needed"
  financeSignoff: "signed-off" | "awaiting-review" | "pending-proof" | "pending" | "rejected" | "awaiting-signoff"
  pickup: "completed" | "scheduled" | "pending"
  warehouseQA: "completed" | "pending" | "action-needed"
  grn: "generated" | "pending"
  summaryData: { planId: string; aggregator: string; quantity: string; crop: string; warehouse: string; delivery: string }
}

function makePipeline(activeIndex: number): PipelineStep[] {
  const labels = ["Delivery Method", "Field Visit", "Field QA", "Approval", "Finance Sign-off", "Pickup", "Warehouse QA", "GRN", "Routing"]
  return labels.map((label, i) => ({
    label,
    status: i < activeIndex ? "completed" as const : i === activeIndex ? "current" as const : "pending" as const,
  }))
}

export const requests: RequestCard[] = [
  // --- Schedule tab (awaiting field visit scheduling) ---
  {
    commodity: "Rice", requestId: "PR-2026-001", cooperative: "Tetteh Cooperative", product: "Rice", quantity: "38MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Awaiting Schedule", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(1), scheduledDate: "—", assignedTo: "Unassigned", confirmedBy: "—", confirmedDate: "—",
    currentStage: "schedule", tabCategory: "Schedule",
    detailState: { pipelineSteps: makePipeline(1), title: "Rice • PR-2026-001", titleBadges: [{ label: "Awaiting Schedule", color: "warning" }], actionButton: { label: "Schedule Visit", icon: "qa" }, fieldVisit: "pending", fieldQA: "pending", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Tetteh Cooperative", quantity: "38 MT", crop: "Rice", warehouse: "Hohoe Warehouse", delivery: "Field Visit" } },
  },
  {
    commodity: "Cocoa", requestId: "PR-2026-002", cooperative: "Kumasi Farmers", product: "Cocoa beans", quantity: "25MT", plan: "PLAN-2026-003",
    statuses: [{ label: "Awaiting Schedule", color: "warning" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(1), scheduledDate: "—", assignedTo: "Unassigned", confirmedBy: "—", confirmedDate: "—",
    currentStage: "schedule", tabCategory: "Schedule",
    detailState: { pipelineSteps: makePipeline(1), title: "Cocoa • PR-2026-002", titleBadges: [{ label: "Awaiting Schedule", color: "warning" }], actionButton: { label: "Schedule Visit", icon: "qa" }, fieldVisit: "pending", fieldQA: "pending", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-003", aggregator: "Kumasi Farmers", quantity: "25 MT", crop: "Cocoa beans", warehouse: "Kumasi Hub", delivery: "Field Visit" } },
  },
  {
    commodity: "Maize", requestId: "PR-2026-003", cooperative: "Bolga Cooperative", product: "Yellow Maize", quantity: "50MT", plan: "PLAN-2026-001",
    statuses: [{ label: "Awaiting Schedule", color: "warning" }], produceLabel: "Local", tag: { label: "Self delivery", color: "blue" },
    pipeline: makePipeline(1), scheduledDate: "—", assignedTo: "Unassigned", confirmedBy: "—", confirmedDate: "—",
    currentStage: "schedule", tabCategory: "Schedule",
    detailState: { pipelineSteps: makePipeline(1), title: "Maize • PR-2026-003", titleBadges: [{ label: "Awaiting Schedule", color: "warning" }], actionButton: { label: "Schedule Visit", icon: "qa" }, fieldVisit: "pending", fieldQA: "pending", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-001", aggregator: "Bolga Cooperative", quantity: "50 MT", crop: "Yellow Maize", warehouse: "Bolga Warehouse", delivery: "Self Delivery" } },
  },

  // --- Field QA tab ---
  {
    commodity: "Rice", requestId: "PR-2026-004", cooperative: "Wa Agric Group", product: "Rice", quantity: "20MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Pending Field QA", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(2), scheduledDate: "15 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-10 09:00",
    currentStage: "field-qa", tabCategory: "Field QA",
    detailState: { pipelineSteps: makePipeline(2), title: "Rice • PR-2026-004", titleBadges: [{ label: "Pending Field QA", color: "warning" }], actionButton: { label: "Log Field QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "action-needed", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Wa Agric Group", quantity: "20 MT", crop: "Rice", warehouse: "Wa Central Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Sorghum", requestId: "PR-2026-005", cooperative: "Tamale Agric", product: "Sorghum", quantity: "30MT", plan: "PLAN-2026-004",
    statuses: [{ label: "Pending Field QA", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(2), scheduledDate: "16 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-11 14:30",
    currentStage: "field-qa", tabCategory: "Field QA",
    detailState: { pipelineSteps: makePipeline(2), title: "Sorghum • PR-2026-005", titleBadges: [{ label: "Pending Field QA", color: "warning" }], actionButton: { label: "Log Field QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "action-needed", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-004", aggregator: "Tamale Agric", quantity: "30 MT", crop: "Sorghum", warehouse: "Tamale Hub", delivery: "Field Visit" } },
  },
  {
    commodity: "Cashew", requestId: "PR-2026-006", cooperative: "Bole Farmers", product: "Raw Cashew", quantity: "15MT", plan: "PLAN-2026-005",
    statuses: [{ label: "Pending Field QA", color: "warning" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(2), scheduledDate: "17 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-12 10:00",
    currentStage: "field-qa", tabCategory: "Field QA",
    detailState: { pipelineSteps: makePipeline(2), title: "Cashew • PR-2026-006", titleBadges: [{ label: "Pending Field QA", color: "warning" }], actionButton: { label: "Log Field QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "action-needed", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-005", aggregator: "Bole Farmers", quantity: "15 MT", crop: "Raw Cashew", warehouse: "Bole Depot", delivery: "Field Visit" } },
  },

  // --- Approval tab (Field QA done, awaiting ops approval) ---
  {
    commodity: "Cocoa", requestId: "PR-2026-007", cooperative: "Tetteh Cooperative", product: "Cocoa beans", quantity: "45MT", plan: "PLAN-2026-003",
    statuses: [{ label: "Pending Approval", color: "warning" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(3), scheduledDate: "10 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-08 11:00",
    currentStage: "approval", tabCategory: "Field QA",
    detailState: { pipelineSteps: makePipeline(3), title: "Cocoa • PR-2026-007", titleBadges: [{ label: "Pending Approval", color: "warning" }], actionButton: { label: "Approve", icon: "approve" }, fieldVisit: "completed", fieldQA: "completed", approval: "action-needed", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-003", aggregator: "Tetteh Cooperative", quantity: "45 MT", crop: "Cocoa beans", warehouse: "Tema Port Warehouse", delivery: "Field Visit" } },
  },
  {
    commodity: "Shea", requestId: "PR-2026-008", cooperative: "Yendi Women Coop", product: "Shea Nuts", quantity: "22MT", plan: "PLAN-2026-006",
    statuses: [{ label: "Pending Approval", color: "warning" }], produceLabel: "Both", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(3), scheduledDate: "11 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-09 08:30",
    currentStage: "approval", tabCategory: "Field QA",
    detailState: { pipelineSteps: makePipeline(3), title: "Shea • PR-2026-008", titleBadges: [{ label: "Pending Approval", color: "warning" }], actionButton: { label: "Approve", icon: "approve" }, fieldVisit: "completed", fieldQA: "completed", approval: "action-needed", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-006", aggregator: "Yendi Women Coop", quantity: "22 MT", crop: "Shea Nuts", warehouse: "Yendi Depot", delivery: "Field Visit" } },
  },

  // --- Finance tab (approved, awaiting disbursement) ---
  {
    commodity: "Rice", requestId: "PR-2026-009", cooperative: "Hohoe Farmers", product: "Rice", quantity: "40MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Awaiting Disbursement", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "08 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-05 09:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Rice • PR-2026-009", titleBadges: [{ label: "Awaiting Disbursement", color: "warning" }], actionButton: { label: "Approve Disbursement", icon: "finance" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "awaiting-review", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Hohoe Farmers", quantity: "40 MT", crop: "Rice", warehouse: "Hohoe Warehouse", delivery: "Field Visit" } },
  },
  {
    commodity: "Maize", requestId: "PR-2026-010", cooperative: "Ejura Cooperative", product: "White Maize", quantity: "60MT", plan: "PLAN-2026-001",
    statuses: [{ label: "Awaiting Disbursement", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "09 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-06 10:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Maize • PR-2026-010", titleBadges: [{ label: "Awaiting Disbursement", color: "warning" }], actionButton: { label: "Approve Disbursement", icon: "finance" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "awaiting-review", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-001", aggregator: "Ejura Cooperative", quantity: "60 MT", crop: "White Maize", warehouse: "Ejura Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Cocoa", requestId: "PR-2026-011", cooperative: "Sefwi Growers", product: "Cocoa beans", quantity: "35MT", plan: "PLAN-2026-003",
    statuses: [{ label: "Pending Proof of Disbursement", color: "warning" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "07 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-04 14:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Cocoa • PR-2026-011", titleBadges: [{ label: "Pending Proof", color: "warning" }], actionButton: { label: "Attach Proof", icon: "finance" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "pending-proof", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-003", aggregator: "Sefwi Growers", quantity: "35 MT", crop: "Cocoa beans", warehouse: "Takoradi Depot", delivery: "Field Visit" } },
  },

  // Finance - Awaiting Review (more)
  {
    commodity: "Rice", requestId: "PR-2026-025", cooperative: "Sarpong Cooperative", product: "Rice", quantity: "38MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Awaiting Review", color: "warning" }], produceLabel: "Both", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "12 Jun 2026", assignedTo: "Yaw", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-14 11:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Rice • PR-2026-025", titleBadges: [{ label: "Awaiting Review", color: "warning" }], actionButton: { label: "Approve Disbursement", icon: "finance" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "awaiting-review", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Sarpong Cooperative", quantity: "38 MT", crop: "Rice", warehouse: "Sarpong Depot", delivery: "Field Visit" } },
  },
  // Finance - Pending Proof (more)
  {
    commodity: "Shea", requestId: "PR-2026-030", cooperative: "Yendi Women Coop", product: "Shea Nuts", quantity: "22MT", plan: "PLAN-2026-006",
    statuses: [{ label: "Pending Proof", color: "warning" }], produceLabel: "Both", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "10 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-08 11:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Shea • PR-2026-030", titleBadges: [{ label: "Pending Proof", color: "warning" }], actionButton: { label: "Attach Proof", icon: "finance" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "pending-proof", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-006", aggregator: "Yendi Women Coop", quantity: "22 MT", crop: "Shea Nuts", warehouse: "Yendi Depot", delivery: "Field Visit" } },
  },
  // Finance - Signed Off
  {
    commodity: "Sorghum", requestId: "PR-2026-026", cooperative: "Tamale Agric", product: "Sorghum", quantity: "30MT", plan: "PLAN-2026-004",
    statuses: [{ label: "Signed Off", color: "green" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "05 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-04 14:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Sorghum • PR-2026-026", titleBadges: [{ label: "Signed Off", color: "green" }], fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-004", aggregator: "Tamale Agric", quantity: "30 MT", crop: "Sorghum", warehouse: "Tamale Hub", delivery: "Field Visit" } },
  },
  {
    commodity: "Cashew", requestId: "PR-2026-027", cooperative: "Bole Farmers", product: "Raw Cashew", quantity: "15MT", plan: "PLAN-2026-005",
    statuses: [{ label: "Signed Off", color: "green" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "06 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-05 10:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Cashew • PR-2026-027", titleBadges: [{ label: "Signed Off", color: "green" }], fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-005", aggregator: "Bole Farmers", quantity: "15 MT", crop: "Raw Cashew", warehouse: "Bole Depot", delivery: "Field Visit" } },
  },
  // Finance - Rejected
  {
    commodity: "Maize", requestId: "PR-2026-028", cooperative: "Wenchi Coop", product: "Yellow Maize", quantity: "20MT", plan: "PLAN-2026-001",
    statuses: [{ label: "Rejected", color: "red" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "08 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-07 09:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Maize • PR-2026-028", titleBadges: [{ label: "Rejected", color: "red" }], fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "rejected", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-001", aggregator: "Wenchi Coop", quantity: "20 MT", crop: "Yellow Maize", warehouse: "Wenchi Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Groundnut", requestId: "PR-2026-031", cooperative: "Bawku Farmers", product: "Groundnuts", quantity: "12MT", plan: "PLAN-2026-008",
    statuses: [{ label: "Rejected", color: "red" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "07 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-06 09:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Groundnut • PR-2026-031", titleBadges: [{ label: "Rejected", color: "red" }], fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "rejected", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-008", aggregator: "Bawku Farmers", quantity: "12 MT", crop: "Groundnuts", warehouse: "Bawku Depot", delivery: "Field Visit" } },
  },
  // Finance - Notification Failed (signed off but notification failed)
  {
    commodity: "Rice", requestId: "PR-2026-029", cooperative: "Akatsi Farmers", product: "Rice", quantity: "25MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Signed Off", color: "green" }, { label: "Notify Failed", color: "red" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "04 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-03 09:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Rice • PR-2026-029", titleBadges: [{ label: "Signed Off", color: "green" }, { label: "Notify Failed", color: "red" }], fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Akatsi Farmers", quantity: "25 MT", crop: "Rice", warehouse: "Akatsi Depot", delivery: "Field Visit" } },
  },

  // --- Pickup tab ---
  {
    commodity: "Rice", requestId: "PR-2026-012", cooperative: "Tetteh Cooperative", product: "Rice", quantity: "38MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Awaiting Pickup", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(5), scheduledDate: "20 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-15 09:00",
    currentStage: "pickup", tabCategory: "Pickup",
    detailState: { pipelineSteps: makePipeline(5), title: "Rice • PR-2026-012", titleBadges: [{ label: "Awaiting Pickup", color: "warning" }], actionButton: { label: "Confirm Pickup", icon: "pickup" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "scheduled", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Tetteh Cooperative", quantity: "38 MT", crop: "Rice", warehouse: "Hohoe Warehouse", delivery: "Field Visit" } },
  },
  {
    commodity: "Cashew", requestId: "PR-2026-013", cooperative: "Techiman Coop", product: "Raw Cashew", quantity: "28MT", plan: "PLAN-2026-005",
    statuses: [{ label: "Awaiting Pickup", color: "warning" }, { label: "Notify Failed", color: "red" }], produceLabel: "Both", tag: { label: "Self delivery", color: "blue" },
    pipeline: makePipeline(5), scheduledDate: "21 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-16 11:00",
    currentStage: "pickup", tabCategory: "Pickup",
    detailState: { pipelineSteps: makePipeline(5), title: "Cashew • PR-2026-013", titleBadges: [{ label: "Awaiting Pickup", color: "warning" }, { label: "Notify Failed", color: "red" }], actionButton: { label: "Confirm Pickup", icon: "pickup" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "scheduled", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-005", aggregator: "Techiman Coop", quantity: "28 MT", crop: "Raw Cashew", warehouse: "Techiman Hub", delivery: "Self Delivery" } },
  },
  {
    commodity: "Soybean", requestId: "PR-2026-014", cooperative: "Kintampo Agric", product: "Soybean", quantity: "18MT", plan: "PLAN-2026-007",
    statuses: [{ label: "Awaiting Pickup", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(5), scheduledDate: "22 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-17 08:00",
    currentStage: "pickup", tabCategory: "Pickup",
    detailState: { pipelineSteps: makePipeline(5), title: "Soybean • PR-2026-014", titleBadges: [{ label: "Awaiting Pickup", color: "warning" }], actionButton: { label: "Confirm Pickup", icon: "pickup" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "scheduled", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-007", aggregator: "Kintampo Agric", quantity: "18 MT", crop: "Soybean", warehouse: "Kintampo Depot", delivery: "Field Visit" } },
  },

  // --- Warehouse QA tab ---
  {
    commodity: "Rice", requestId: "PR-2026-015", cooperative: "Hohoe Farmers", product: "Rice", quantity: "40MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(6), scheduledDate: "18 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-18 14:00",
    currentStage: "warehouse-qa", tabCategory: "Warehouse QA",
    detailState: { pipelineSteps: makePipeline(6), title: "Rice • PR-2026-015", titleBadges: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], actionButton: { label: "Log Warehouse QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "completed", warehouseQA: "action-needed", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Hohoe Farmers", quantity: "40 MT", crop: "Rice", warehouse: "Hohoe Warehouse", delivery: "Field Visit" } },
  },
  {
    commodity: "Cocoa", requestId: "PR-2026-016", cooperative: "Kumasi Farmers", product: "Cocoa beans", quantity: "32MT", plan: "PLAN-2026-003",
    statuses: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(6), scheduledDate: "19 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-19 10:00",
    currentStage: "warehouse-qa", tabCategory: "Warehouse QA",
    detailState: { pipelineSteps: makePipeline(6), title: "Cocoa • PR-2026-016", titleBadges: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], actionButton: { label: "Log Warehouse QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "completed", warehouseQA: "action-needed", grn: "pending", summaryData: { planId: "PLAN-2026-003", aggregator: "Kumasi Farmers", quantity: "32 MT", crop: "Cocoa beans", warehouse: "Kumasi Hub", delivery: "Field Visit" } },
  },
  {
    commodity: "Maize", requestId: "PR-2026-017", cooperative: "Nkoranza Coop", product: "Yellow Maize", quantity: "55MT", plan: "PLAN-2026-001",
    statuses: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], produceLabel: "Local", tag: { label: "Self delivery", color: "blue" },
    pipeline: makePipeline(6), scheduledDate: "20 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-20 09:30",
    currentStage: "warehouse-qa", tabCategory: "Warehouse QA",
    detailState: { pipelineSteps: makePipeline(6), title: "Maize • PR-2026-017", titleBadges: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], actionButton: { label: "Log Warehouse QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "completed", warehouseQA: "action-needed", grn: "pending", summaryData: { planId: "PLAN-2026-001", aggregator: "Nkoranza Coop", quantity: "55 MT", crop: "Yellow Maize", warehouse: "Nkoranza Depot", delivery: "Self Delivery" } },
  },

  // --- GRN tab ---
  {
    commodity: "Rice", requestId: "PR-2026-018", cooperative: "Tetteh Cooperative", product: "Rice", quantity: "38MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Warehouse QA completed", color: "green" }, { label: "Awaiting GRN", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(7), scheduledDate: "12 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-14 11:00",
    currentStage: "grn", tabCategory: "GRN",
    detailState: { pipelineSteps: makePipeline(7), title: "Rice • PR-2026-018", titleBadges: [{ label: "Warehouse QA completed", color: "green" }, { label: "Awaiting GRN", color: "warning" }], actionButton: { label: "Generate GRN", icon: "grn" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "completed", warehouseQA: "completed", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Tetteh Cooperative", quantity: "38 MT", crop: "Rice", warehouse: "Hohoe Warehouse", delivery: "Field Visit" } },
  },
  {
    commodity: "Shea", requestId: "PR-2026-019", cooperative: "Yendi Women Coop", product: "Shea Nuts", quantity: "22MT", plan: "PLAN-2026-006",
    statuses: [{ label: "Warehouse QA completed", color: "green" }, { label: "Awaiting GRN", color: "warning" }], produceLabel: "Both", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(7), scheduledDate: "14 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-15 09:00",
    currentStage: "grn", tabCategory: "GRN",
    detailState: { pipelineSteps: makePipeline(7), title: "Shea • PR-2026-019", titleBadges: [{ label: "Warehouse QA completed", color: "green" }, { label: "Awaiting GRN", color: "warning" }], actionButton: { label: "Generate GRN", icon: "grn" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "completed", warehouseQA: "completed", grn: "pending", summaryData: { planId: "PLAN-2026-006", aggregator: "Yendi Women Coop", quantity: "22 MT", crop: "Shea Nuts", warehouse: "Yendi Depot", delivery: "Field Visit" } },
  },

  // --- Completed (GRN generated, awaiting routing) ---
  {
    commodity: "Cocoa", requestId: "PR-2026-020", cooperative: "Sefwi Growers", product: "Cocoa beans", quantity: "35MT", plan: "PLAN-2026-003",
    statuses: [{ label: "GRN Generated", color: "green" }, { label: "Awaiting Routing", color: "warning" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(8), scheduledDate: "05 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-06 11:00",
    currentStage: "routing", tabCategory: "GRN",
    detailState: { pipelineSteps: makePipeline(8), title: "Cocoa • PR-2026-020", titleBadges: [{ label: "GRN Generated", color: "green" }, { label: "Awaiting Routing", color: "warning" }], actionButton: { label: "Start Routing", icon: "route" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "completed", warehouseQA: "completed", grn: "generated", summaryData: { planId: "PLAN-2026-003", aggregator: "Sefwi Growers", quantity: "35 MT", crop: "Cocoa beans", warehouse: "Takoradi Depot", delivery: "Field Visit" } },
  },

  // --- Rejected ---
  {
    commodity: "Groundnut", requestId: "PR-2026-021", cooperative: "Bawku Farmers", product: "Groundnuts", quantity: "12MT", plan: "PLAN-2026-008",
    statuses: [{ label: "Rejected", color: "red" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(3), scheduledDate: "06 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-07 09:00",
    tabCategory: "Rejected",
    detailState: { pipelineSteps: makePipeline(3), title: "Groundnut • PR-2026-021", titleBadges: [{ label: "Rejected", color: "red" }], fieldVisit: "completed", fieldQA: "completed", approval: "rejected", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-008", aggregator: "Bawku Farmers", quantity: "12 MT", crop: "Groundnuts", warehouse: "Bawku Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Sorghum", requestId: "PR-2026-022", cooperative: "Navrongo Agric", product: "Sorghum", quantity: "18MT", plan: "PLAN-2026-004",
    statuses: [{ label: "Rejected - QA Failed", color: "red" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(2), scheduledDate: "08 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-09 10:00",
    tabCategory: "Rejected",
    detailState: { pipelineSteps: makePipeline(2), title: "Sorghum • PR-2026-022", titleBadges: [{ label: "Rejected - QA Failed", color: "red" }], fieldVisit: "completed", fieldQA: "completed", approval: "rejected", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-004", aggregator: "Navrongo Agric", quantity: "18 MT", crop: "Sorghum", warehouse: "Navrongo Depot", delivery: "Field Visit" } },
  },

  // --- Overdue ---
  {
    commodity: "Rice", requestId: "PR-2026-023", cooperative: "Akatsi Farmers", product: "Rice", quantity: "42MT", plan: "PLAN-2026-002",
    statuses: [{ label: "Overdue", color: "red" }, { label: "Pending Field QA", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(2), scheduledDate: "01 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-05-28 09:00",
    currentStage: "field-qa", tabCategory: "Overdue",
    detailState: { pipelineSteps: makePipeline(2), title: "Rice • PR-2026-023", titleBadges: [{ label: "Overdue", color: "red" }, { label: "Pending Field QA", color: "warning" }], actionButton: { label: "Log Field QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "action-needed", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-002", aggregator: "Akatsi Farmers", quantity: "42 MT", crop: "Rice", warehouse: "Akatsi Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Maize", requestId: "PR-2026-024", cooperative: "Wenchi Coop", product: "Yellow Maize", quantity: "48MT", plan: "PLAN-2026-001",
    statuses: [{ label: "Overdue", color: "red" }, { label: "Awaiting Pickup", color: "warning" }], produceLabel: "Local", tag: { label: "Self delivery", color: "blue" },
    pipeline: makePipeline(5), scheduledDate: "02 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-05-30 10:00",
    currentStage: "pickup", tabCategory: "Overdue",
    detailState: { pipelineSteps: makePipeline(5), title: "Maize • PR-2026-024", titleBadges: [{ label: "Overdue", color: "red" }, { label: "Awaiting Pickup", color: "warning" }], actionButton: { label: "Confirm Pickup", icon: "pickup" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "scheduled", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-001", aggregator: "Wenchi Coop", quantity: "48 MT", crop: "Yellow Maize", warehouse: "Wenchi Depot", delivery: "Self Delivery" } },
  },
  {
    commodity: "Cocoa", requestId: "PR-2026-025", cooperative: "Assin Fosu Coop", product: "Cocoa beans", quantity: "27MT", plan: "PLAN-2026-003",
    statuses: [{ label: "Overdue", color: "red" }, { label: "Awaiting Schedule", color: "warning" }], produceLabel: "Export", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(1), scheduledDate: "—", assignedTo: "Unassigned", confirmedBy: "—", confirmedDate: "—",
    currentStage: "schedule", tabCategory: "Overdue",
    detailState: { pipelineSteps: makePipeline(1), title: "Cocoa • PR-2026-025", titleBadges: [{ label: "Overdue", color: "red" }, { label: "Awaiting Schedule", color: "warning" }], actionButton: { label: "Schedule Visit", icon: "qa" }, fieldVisit: "pending", fieldQA: "pending", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-003", aggregator: "Assin Fosu Coop", quantity: "27 MT", crop: "Cocoa beans", warehouse: "Assin Fosu Depot", delivery: "Field Visit" } },
  },

  // --- More mixed cards for volume ---
  {
    commodity: "Cassava", requestId: "PR-2026-026", cooperative: "Nkwanta Farmers", product: "Cassava Chips", quantity: "65MT", plan: "PLAN-2026-009",
    statuses: [{ label: "Awaiting Schedule", color: "warning" }], produceLabel: "Local", tag: { label: "Self delivery", color: "blue" },
    pipeline: makePipeline(1), scheduledDate: "—", assignedTo: "Unassigned", confirmedBy: "—", confirmedDate: "—",
    currentStage: "schedule", tabCategory: "Schedule",
    detailState: { pipelineSteps: makePipeline(1), title: "Cassava • PR-2026-026", titleBadges: [{ label: "Awaiting Schedule", color: "warning" }], actionButton: { label: "Schedule Visit", icon: "qa" }, fieldVisit: "pending", fieldQA: "pending", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-009", aggregator: "Nkwanta Farmers", quantity: "65 MT", crop: "Cassava Chips", warehouse: "Nkwanta Depot", delivery: "Self Delivery" } },
  },
  {
    commodity: "Millet", requestId: "PR-2026-027", cooperative: "Lawra Agric", product: "Millet", quantity: "14MT", plan: "PLAN-2026-010",
    statuses: [{ label: "Pending Field QA", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(2), scheduledDate: "23 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-20 08:00",
    currentStage: "field-qa", tabCategory: "Field QA",
    detailState: { pipelineSteps: makePipeline(2), title: "Millet • PR-2026-027", titleBadges: [{ label: "Pending Field QA", color: "warning" }], actionButton: { label: "Log Field QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "action-needed", approval: "pending", financeSignoff: "pending", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-010", aggregator: "Lawra Agric", quantity: "14 MT", crop: "Millet", warehouse: "Lawra Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Cowpea", requestId: "PR-2026-028", cooperative: "Zebilla Coop", product: "Cowpea", quantity: "19MT", plan: "PLAN-2026-011",
    statuses: [{ label: "Awaiting Disbursement", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "13 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-10 11:00",
    currentStage: "finance", tabCategory: "Finance",
    detailState: { pipelineSteps: makePipeline(4), title: "Cowpea • PR-2026-028", titleBadges: [{ label: "Awaiting Disbursement", color: "warning" }], actionButton: { label: "Approve Disbursement", icon: "finance" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "awaiting-review", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-011", aggregator: "Zebilla Coop", quantity: "19 MT", crop: "Cowpea", warehouse: "Zebilla Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Yam", requestId: "PR-2026-029", cooperative: "Atebubu Farmers", product: "Yam Tubers", quantity: "70MT", plan: "PLAN-2026-012",
    statuses: [{ label: "Awaiting Pickup", color: "warning" }], produceLabel: "Local", tag: { label: "Self delivery", color: "blue" },
    pipeline: makePipeline(5), scheduledDate: "24 Jun 2026", assignedTo: "Yaw Darko", confirmedBy: "Yaw Darko", confirmedDate: "2026-06-21 09:00",
    currentStage: "pickup", tabCategory: "Pickup",
    detailState: { pipelineSteps: makePipeline(5), title: "Yam • PR-2026-029", titleBadges: [{ label: "Awaiting Pickup", color: "warning" }], actionButton: { label: "Confirm Pickup", icon: "pickup" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "scheduled", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-012", aggregator: "Atebubu Farmers", quantity: "70 MT", crop: "Yam Tubers", warehouse: "Atebubu Depot", delivery: "Self Delivery" } },
  },
  {
    commodity: "Plantain", requestId: "PR-2026-030", cooperative: "Agona Swedru Coop", product: "Plantain", quantity: "33MT", plan: "PLAN-2026-013",
    statuses: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(6), scheduledDate: "17 Jun 2026", assignedTo: "Ama Mensah", confirmedBy: "Ama Mensah", confirmedDate: "2026-06-18 10:00",
    currentStage: "warehouse-qa", tabCategory: "Warehouse QA",
    detailState: { pipelineSteps: makePipeline(6), title: "Plantain • PR-2026-030", titleBadges: [{ label: "Picked Up", color: "green" }, { label: "Pending Warehouse QA", color: "warning" }], actionButton: { label: "Log Warehouse QA", icon: "qa" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "signed-off", pickup: "completed", warehouseQA: "action-needed", grn: "pending", summaryData: { planId: "PLAN-2026-013", aggregator: "Agona Swedru Coop", quantity: "33 MT", crop: "Plantain", warehouse: "Swedru Depot", delivery: "Field Visit" } },
  },
  {
    commodity: "Palm Oil", requestId: "PR-2026-031", cooperative: "Kade Oil Mill", product: "Crude Palm Oil", quantity: "80MT", plan: "PLAN-2026-014",
    statuses: [{ label: "Overdue", color: "red" }, { label: "Awaiting Disbursement", color: "warning" }], produceLabel: "Local", tag: { label: "Field visit", color: "purple" },
    pipeline: makePipeline(4), scheduledDate: "03 Jun 2026", assignedTo: "Kwame Asante", confirmedBy: "Kwame Asante", confirmedDate: "2026-06-01 14:00",
    currentStage: "finance", tabCategory: "Overdue",
    detailState: { pipelineSteps: makePipeline(4), title: "Palm Oil • PR-2026-031", titleBadges: [{ label: "Overdue", color: "red" }, { label: "Awaiting Disbursement", color: "warning" }], actionButton: { label: "Approve Disbursement", icon: "finance" }, fieldVisit: "completed", fieldQA: "completed", approval: "approved", financeSignoff: "awaiting-review", pickup: "pending", warehouseQA: "pending", grn: "pending", summaryData: { planId: "PLAN-2026-014", aggregator: "Kade Oil Mill", quantity: "80 MT", crop: "Crude Palm Oil", warehouse: "Kade Mill Depot", delivery: "Field Visit" } },
  },
]

// --- Components ---

function StatusBadge({ label, color }: { label: string; color: "green" | "blue" | "red" | "warning" }) {
  const styles = {
    green: { bg: "#D4F5D0", text: "#1A5514", dot: "#1A5514" },
    blue: { bg: "#D5E6FD", text: "#00439E", dot: "#00439E" },
    red: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
    warning: { bg: "#FEF0D8", text: "#995917", dot: "#995917" },
  }
  const s = styles[color]
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]" style={{ background: s.bg }}>
      <span className="size-[5px] rounded-full" style={{ background: s.dot }} />
      <span className="text-[12px] leading-[18px] font-normal" style={{ color: s.text }}>{label}</span>
    </span>
  )
}

function ProduceLabel({ label }: { label: "Local" | "Export" | "Both" }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] outline outline-1 outline-[#E5E8DF] text-[12px] leading-[18px] font-normal text-[#161D14]">
      {label}
    </span>
  )
}

function TagBadge({ label, color }: { label: string; color: "blue" | "purple" }) {
  const styles = {
    blue: { bg: "#D5E6FD", text: "#00439E", dot: "#00439E" },
    purple: { bg: "#E2D1FD", text: "#7925CC", dot: "#7925CC" },
  }
  const s = styles[color]
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]" style={{ background: s.bg }}>
      <span className="size-[5px] rounded-full" style={{ background: s.dot }} />
      <span className="text-[12px] leading-[18px] font-normal" style={{ color: s.text }}>{label}</span>
    </span>
  )
}

function PipelineStepCircle({ status }: { status: "completed" | "current" | "pending" }) {
  if (status === "completed") {
    return (
      <div className="flex items-center justify-center p-1 rounded-full bg-[#C9F0D6]">
        <IconCheck className="size-4 text-[#00572D]" />
      </div>
    )
  }
  if (status === "current") {
    return (
      <div className="flex items-center justify-center p-1 rounded-full bg-[#D5E6FD]">
        <IconCheck className="size-4 text-[#00439E]" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center p-1 rounded-full outline outline-[1.4px] outline-[#C3C8BC]">
      <div className="size-4" />
    </div>
  )
}

function stepLabelColor(status: "completed" | "current" | "pending") {
  if (status === "completed") return "#008744"
  if (status === "current") return "#0063EA"
  return "#525C4E"
}

function PipelineStepper({ steps }: { steps: PipelineStep[] }) {
  if (steps.length === 0) return null
  return (
    <div className="py-1 w-full">
      <div className="flex items-start w-full">
        {steps.map((step, i) => (
          <Fragment key={step.label}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <PipelineStepCircle status={step.status} />
              <span
                className="text-[12px] leading-[18px] font-normal text-center whitespace-nowrap"
                style={{ color: stepLabelColor(step.status) }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-1 rounded-full mt-[8px] min-w-[8px]"
                style={{ background: steps[i + 1].status !== "pending" ? "#36B92E" : "#E1E4DA" }}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function StageActions({ stage, onOpen }: { stage?: string; onOpen: () => void }) {
  if (!stage) return null

  const actionMap: Record<string, { primary?: { label: string }; secondary?: { label: string } }> = {
    "schedule": { primary: { label: "Schedule Visit" } },
    "field-qa": { primary: { label: "Log Field QA" } },
    "approval": { primary: { label: "Approve" }, secondary: { label: "Reject" } },
    "finance": { primary: { label: "Approve Disbursement" }, secondary: { label: "Reject" } },
    "pickup": { primary: { label: "Confirm Pickup" } },
    "warehouse-qa": { primary: { label: "Log Warehouse QA" } },
    "grn": { primary: { label: "Generate GRN" } },
    "routing": { primary: { label: "Start Routing" } },
  }

  const actions = actionMap[stage]
  if (!actions) return null

  return (
    <div className="flex items-center gap-2">
      {actions.secondary && (
        <button
          onClick={(e) => { e.stopPropagation() }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg outline outline-1 outline-[#BA1A1A] text-[#BA1A1A] text-[13px] leading-[18px] font-bold hover:bg-[#FEE2E2] transition-colors"
        >
          {actions.secondary.label}
        </button>
      )}
      {actions.primary && (
        <button
          onClick={(e) => { e.stopPropagation(); onOpen() }}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#36B92E] text-white text-[13px] leading-[18px] font-bold hover:bg-[#5EC758] transition-colors"
        >
          {actions.primary.label}
          <IconChevronRight className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function RequestCardComponent({ request, onOpen }: { request: RequestCard; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="p-4 rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-2 cursor-pointer hover:outline-[#36B92E] transition-colors" onClick={onOpen}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] outline outline-1 outline-white shrink-0">
            <span className="text-[16px] leading-[24px] font-bold text-[#CEFFEB]">{request.cooperative.charAt(0)}</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] leading-[24px] font-bold text-[#161D14]">
                {request.commodity} • {request.requestId}
              </span>
              {request.statuses.map((s, i) => (
                <StatusBadge key={i} label={s.label} color={s.color} />
              ))}
              {request.produceLabel && <ProduceLabel label={request.produceLabel} />}
            </div>
            <p className="text-[12px] leading-[18px] font-normal text-[#71786C]">
              {request.cooperative} <span className="font-bold"> • </span>
              {request.product} <span className="font-bold"> • </span>
              {request.quantity}<span className="font-bold"> • </span>
              Plan {request.plan}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TagBadge label={request.tag.label} color={request.tag.color} />
          <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}>
            {expanded ? (
              <IconChevronUp className="size-5 text-[#161D14]" />
            ) : (
              <IconChevronDown className="size-5 text-[#161D14]" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {/* Pipeline Stepper */}
          {request.pipeline.length > 0 && (
            <PipelineStepper steps={request.pipeline} />
          )}

          {/* Schedule Info + Actions */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-start gap-4 px-2 py-1 bg-[#F7FAF6] rounded-[6px] text-[12px] leading-[18px]">
              <span className="text-[#525C4E]">Scheduled: <span className="font-bold">{request.scheduledDate}</span></span>
              <span className="text-[#525C4E]">By: <span className="font-bold">{request.assignedTo}</span></span>
              {request.confirmedBy !== "—" && (
                <span className="flex items-center gap-1 text-[#008744]">
                  <IconCheck className="size-4" />
                  Confirmed {request.confirmedDate} by {request.confirmedBy}
                </span>
              )}
            </div>
            <StageActions stage={request.currentStage} onOpen={onOpen} />
          </div>
        </>
      )}
    </div>
  )
}

// --- Main Page ---

export function ProcurementRequestPage({ onDetailViewChange }: { onDetailViewChange?: (isDetail: boolean) => void }) {
  const [activeTab, setActiveTab] = useState("All Requests")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)

  const openDetail = (index: number) => {
    setSelectedRequest(index)
    onDetailViewChange?.(true)
  }

  const closeDetail = () => {
    setSelectedRequest(null)
    onDetailViewChange?.(false)
  }

  // Filter by tab
  const filteredRequests = activeTab === "All Requests"
    ? requests
    : requests.filter((r) => r.tabCategory === activeTab)

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / rowsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * rowsPerPage
  const paginatedRequests = filteredRequests.slice(startIdx, startIdx + rowsPerPage)

  if (selectedRequest !== null) {
    const req = filteredRequests[selectedRequest]
    return <ProcurementRequestDetailPage onBack={closeDetail} request={req} />
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        {filters.map((f) => {
          const Icon = f.icon
          return (
            <button
              key={f.label}
              className="flex items-center gap-2 h-9 px-3 rounded-full bg-[#EDF0E6] text-[14px] leading-[20px] font-normal text-[#161D14]"
            >
              <Icon className="size-4 text-[#161D14]" />
              {f.label}
              <IconChevronDown className="size-4 text-[#161D14]" />
            </button>
          )
        })}
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-5">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="p-4 bg-white rounded-[12px] shadow-sm outline outline-1 outline-[#E5E8DF] flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md flex items-center" style={{ background: card.iconBg }}>
                  <Icon className="size-4" style={{ color: card.iconColor }} />
                </div>
                <span className="flex-1 text-[14px] leading-[20px] font-normal text-[#161D14]">{card.label}</span>
                {card.hasChevron && <IconChevronRight className="size-4 text-[#161D14]" />}
              </div>
              <p className="text-[20px] leading-[28px] font-bold tracking-[0.1px] text-[#161D14]">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Tab Bar */}
      <div className="flex items-center h-[58px] border-b-2 border-[#E5E8DF]">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.label
          const Icon = tabIcons[tab.label] || IconClipboardCheck
          return (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(tab.label); setCurrentPage(1) }}
              className={`flex items-center gap-2 h-full px-3 border-b-2 -mb-[2px] transition-colors ${
                isActive
                  ? "border-[#306B28] text-[#306B28] font-bold"
                  : "border-transparent text-[#161D14] font-normal hover:text-[#161D14]"
              } text-[14px] leading-[20px]`}
            >
              <Icon className="size-4" />
              {tab.label}
              {tab.badge && (
                <span className="inline-flex items-center justify-center px-1.5 py-px rounded-full bg-[#36B92E] text-white text-[10px] leading-[14px] font-bold min-w-[18px]">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Request Cards */}
      <div className="flex flex-col gap-3">
        {paginatedRequests.map((req, i) => (
          <RequestCardComponent key={startIdx + i} request={req} onOpen={() => openDetail(startIdx + i)} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">
          0 of {filteredRequests.length} row(s) selected.
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-[20px] font-normal text-[#161D14]">Rows per page</span>
            <div className="flex items-center gap-1 h-9 px-3 rounded-lg outline outline-1 outline-[#E5E8DF]">
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                className="bg-transparent text-[14px] leading-[20px] font-normal text-[#161D14] outline-none appearance-none pr-4"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <IconChevronDown className="size-4 text-[#525C4E] -ml-3" />
            </div>
          </div>
          <span className="text-[14px] leading-[20px] font-bold text-[#161D14]">Page {safePage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage <= 1}
              className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6] disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <IconChevronsLeft className="size-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6] disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <IconChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6] disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <IconChevronRight className="size-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage >= totalPages}
              className="flex items-center justify-center size-8 rounded-lg outline outline-1 outline-[#E5E8DF] text-[#525C4E] hover:bg-[#F7FAF6] disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <IconChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
