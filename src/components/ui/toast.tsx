import { IconCircleCheck } from "@tabler/icons-react"

export function Toast({ message }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center pl-3 bg-[#161D14] rounded-[12px] shadow-[0px_16px_48px_rgba(0,0,0,0.22)] max-w-[600px]">
      <div className="px-2 py-4">
        <IconCircleCheck className="size-6 text-white" />
      </div>
      <div className="flex-1 py-5 pl-3 pr-4">
        <span className="text-[16px] leading-[24px] font-normal text-white">{message}</span>
      </div>
    </div>
  )
}
