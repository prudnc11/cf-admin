import { useState } from "react"
import { IconSearch, IconBell, IconRefresh, IconDownload, IconPlus, IconAdjustments } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardPage } from "@/pages/dashboard"
import { AllRequestsPage } from "@/pages/all-requests"
import { ProcurementRequestPage } from "@/pages/procurement-request"
import { DisbursementPage } from "@/pages/disbursement"
import { OperationsOverviewPage } from "@/pages/operations-overview"
import { InventoryOverviewPage } from "@/pages/inventory-overview"
import { StockAlertsPage } from "@/pages/stock-alerts"
import { DiscrepanciesPage } from "@/pages/discrepancies"
import { MovementLogsPage } from "@/pages/movement-logs"
import { DelayMonitoringPage } from "@/pages/delay-monitoring"
import { AggregatorManagementPage } from "@/pages/aggregator-management"
import { NotificationSheet } from "@/components/notification-sheet"

const PAGES_WITHOUT_SUBHEADER = ["All requests", "Aggregator Management"]

function App() {
  const [activeItem, setActiveItem] = useState("Dashboard")
  const [isDetailView, setIsDetailView] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<string | undefined>(undefined)

  const navigateToPage = (page: string, tab?: string) => {
    setActiveItem(page)
    setInitialTab(tab)
    setIsDetailView(false)
  }

  const hideSubHeader = PAGES_WITHOUT_SUBHEADER.includes(activeItem) || ((activeItem === "Procurement Request" || activeItem === "Disbursement") && isDetailView)

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar activeItem={activeItem} onNavigate={(item) => { setActiveItem(item); setInitialTab(undefined); setIsDetailView(false) }} />
        <SidebarInset>
          <header className="flex h-[60px] items-center gap-3 border-b border-[#E5E8DF] pl-4 pr-10">
            <SidebarTrigger />
            <div className="h-6 w-px bg-[#E5E8DF]" />
            <div className="flex flex-1 items-center gap-2 rounded-full bg-[#EDF0E6] px-3 h-9">
              <IconSearch className="size-4 text-[#525C4E]" />
              <input
                type="text"
                placeholder="Search anything"
                className="bg-transparent text-[14px] leading-[20px] text-[#161D14] placeholder:text-[#525C4E] outline-none w-full"
              />
            </div>
            <button
              onClick={() => setNotifOpen(true)}
              className="flex items-center justify-center size-9 rounded-full bg-[#EDF0E6]"
            >
              <IconBell className="size-4 text-[#161D14]" />
            </button>
            <div className="flex items-center justify-center size-9 rounded-full bg-[#235C4B] text-[#CEFFEB] text-[12px] font-bold leading-[18px]">
              R
            </div>
          </header>
          {!hideSubHeader && (
            <div className="flex h-[76px] items-center justify-between px-10">
              <h1 className="font-bold text-[28px] leading-[36px] text-[#161D14]">
                {activeItem}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-[14px] leading-[20px] font-normal text-[#525C4E]">Last update 10 mins ago</span>
                <Button variant="secondary" size="icon-sm">
                  <IconRefresh className="size-5" />
                </Button>
                <Button variant="secondary" size="sm">
                  <IconDownload className="size-4" />
                  Export
                </Button>
                {activeItem === "Stock alerts" && (
                  <Button variant="primary" size="sm">
                    <IconAdjustments className="size-4" />
                    Threshold setting
                  </Button>
                )}
                {activeItem === "Discrepancies" && (
                  <Button variant="primary" size="sm">
                    <IconPlus className="size-4" />
                    Log Discrepancy
                  </Button>
                )}
                {activeItem !== "Procurement Request" && activeItem !== "Disbursement" && activeItem !== "Stock alerts" && activeItem !== "Discrepancies" && activeItem !== "Movements Logs" && activeItem !== "Delays Monitoring" && (
                  <Button variant="primary" size="sm">
                    <IconPlus className="size-4" />
                    Create Plan
                  </Button>
                )}
              </div>
            </div>
          )}
          <main className={`flex-1 pt-2 pb-6 overflow-auto ${activeItem === "All requests" ? "pl-0 pr-10" : "px-10"}`}>
            {activeItem === "Dashboard" && <DashboardPage onNavigate={navigateToPage} />}
            {activeItem === "All requests" && <AllRequestsPage />}
            {activeItem === "Procurement Request" && <ProcurementRequestPage onDetailViewChange={setIsDetailView} initialTab={initialTab} />}
            {activeItem === "Disbursement" && <DisbursementPage onDetailViewChange={setIsDetailView} initialTab={initialTab} />}
            {activeItem === "Overview" && <OperationsOverviewPage />}
            {activeItem === "Inventory Overview" && <InventoryOverviewPage />}
            {activeItem === "Stock alerts" && <StockAlertsPage />}
            {activeItem === "Discrepancies" && <DiscrepanciesPage />}
            {activeItem === "Movements Logs" && <MovementLogsPage />}
            {activeItem === "Delays Monitoring" && <DelayMonitoringPage />}
            {activeItem === "Aggregator Management" && <AggregatorManagementPage />}
          </main>
        </SidebarInset>
        <NotificationSheet open={notifOpen} onClose={() => setNotifOpen(false)} />
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App
