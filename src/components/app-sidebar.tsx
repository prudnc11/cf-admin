import { useState } from "react"
import {
  IconPresentationAnalytics,
  IconClipboardCheck,
  IconUsersGroup,
  IconPackage,
  Icon3dRotate,
  IconCash,
  IconSettings,
  IconChevronDown,
  IconChevronRight,
  type Icon,
} from "@tabler/icons-react"

import logoSvg from "@/assets/Vector.svg"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const MENU_DEFAULT =
  "rounded-md px-2 h-9 text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#F7FAF6] gap-2 [&>svg]:text-[#161D14]"

const MENU_ACTIVE =
  "rounded-md px-2 h-9 text-[14px] leading-[20px] font-bold text-[#36B92E] bg-[#F7FAF6] gap-2 [&>svg]:text-[#36B92E]"

const SUB_DEFAULT =
  "rounded-md px-2 h-9 text-[14px] leading-[20px] font-normal text-[#161D14] hover:bg-[#F7FAF6]"

const SUB_ACTIVE =
  "rounded-md px-2 h-9 text-[14px] leading-[20px] font-bold text-[#36B92E] bg-[#F7FAF6]"

type SubItem = {
  title: string
  badge?: number
}

type MenuItem = {
  title: string
  icon: Icon
  items?: SubItem[]
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: IconPresentationAnalytics },
  { title: "All requests", icon: IconClipboardCheck },
  { title: "Aggregator Management", icon: IconUsersGroup },
  {
    title: "Operations",
    icon: IconPackage,
    items: [
      { title: "Overview" },
      { title: "Aggregation Planning" },
      { title: "Procurement Request" },
      { title: "Inventory Overview" },
      { title: "Stock alerts" },
      { title: "Discrepancies" },
      { title: "Movements Logs" },
      { title: "Delays Monitoring" },
    ],
  },
  {
    title: "Supply chain",
    icon: Icon3dRotate,
    items: [
      { title: "Procurement Request" },
    ],
  },
  {
    title: "Finance",
    icon: IconCash,
    items: [
      { title: "Disbursement", badge: 2 },
    ],
  },
  { title: "Settings", icon: IconSettings },
]

export function AppSidebar({
  activeItem,
  onNavigate,
}: {
  activeItem: string
  onNavigate: (item: string) => void
}) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Operations: true,
  })

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E5E8DF]">
      <SidebarHeader className="h-[70px] justify-center p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="rounded-lg p-2 gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#36B92E]">
                <img src={logoSvg} alt="CF" className="w-4 h-[18px]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-[14px] leading-[20px] text-[#161D14]">CF Admin</span>
                <span className="font-normal text-[12px] leading-[18px] text-[#525C4E]">Aggregator</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-0.5">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-[2px]">
              {menuItems.map((item) => {
                const isActive = activeItem === item.title
                const hasActiveSub = item.items?.some((sub) => activeItem === sub.title)

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.items ? (
                      <>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={MENU_DEFAULT}
                          onClick={() => toggleMenu(item.title)}
                        >
                          <item.icon className="size-4" />
                          <span className="flex-1">{item.title}</span>
                          {openMenus[item.title] || hasActiveSub ? (
                            <IconChevronDown className="size-4" />
                          ) : (
                            <IconChevronRight className="size-4" />
                          )}
                        </SidebarMenuButton>
                        {(openMenus[item.title] || hasActiveSub) && (
                          <SidebarMenuSub className="mx-3.5 border-l border-[#E5E8DF] px-2.5 py-0.5 gap-[4px]">
                            {item.items.map((sub) => {
                              const isSubActive = activeItem === sub.title
                              return (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton
                                    isActive={isSubActive}
                                    className={isSubActive ? SUB_ACTIVE : SUB_DEFAULT}
                                    onClick={() => onNavigate(sub.title)}
                                  >
                                    <span className="flex-1">{sub.title}</span>
                                    {sub.badge && (
                                      <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#BA1A1A] text-white text-[10px] font-bold leading-none">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        className={isActive ? MENU_ACTIVE : MENU_DEFAULT}
                        onClick={() => onNavigate(item.title)}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
