import { IconCircleCheck } from "@tabler/icons-react"

export function Toast({ message }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center px-4 bg-[#161D14] rounded-[12px] shadow-[0px_16px_48px_rgba(0,0,0,0.22)] w-[1024px] h-16 animate-fade-in-up">
      <IconCircleCheck className="size-6 text-white shrink-0" />
      <span className="flex-1 pl-3 text-[16px] leading-[24px] font-normal text-white">{message}</span>
    </div>
  )
}
