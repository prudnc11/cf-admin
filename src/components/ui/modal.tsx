import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { IconX } from "@tabler/icons-react"

function Modal({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="modal" {...props} />
}

function ModalPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="modal-portal" {...props} />
}

function ModalOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="modal-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      {...props}
    />
  )
}

function ModalContent({
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.Popup
        data-slot="modal-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col w-[720px] bg-white rounded-[12px] shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-ending-style:scale-95 data-starting-style:opacity-0 data-starting-style:scale-95 max-h-[90vh] overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </ModalPortal>
  )
}

function ModalHeader({ className, title, onClose, ...props }: React.ComponentProps<"div"> & { title: string; onClose?: () => void }) {
  return (
    <div
      data-slot="modal-header"
      className={cn("relative flex items-center h-[60px] border-b border-[#E5E8DF] shrink-0", className)}
      {...props}
    >
      {onClose && (
        <DialogPrimitive.Close
          data-slot="modal-close"
          className="absolute left-4 top-3 p-2 rounded-lg hover:bg-[#F7FAF6] transition-colors"
          onClick={onClose}
        >
          <IconX className="size-5 text-[#161D14]" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
      <DialogPrimitive.Title className="flex-1 text-center text-[16px] leading-[24px] font-bold text-[#161D14]">
        {title}
      </DialogPrimitive.Title>
    </div>
  )
}

function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn("flex-1 overflow-y-auto px-10 pt-6", className)}
      {...props}
    />
  )
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn("flex items-center justify-end gap-6 px-10 py-6 shrink-0", className)}
      {...props}
    />
  )
}

export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
}
