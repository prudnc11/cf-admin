import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent font-bold whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-[0.36] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-[#36B92E] text-white hover:bg-[#5EC758]",
        secondary: "bg-[#EDF0E6] text-[#1A5514] hover:bg-[#D9DDD3]",
        ghost: "bg-transparent text-[#36B92E] hover:bg-[#F7FAF6]",
        destructive: "bg-[#BA1A1A] text-white hover:bg-[#DC2626]",
      },
      size: {
        sm: "h-9 gap-2 px-3 text-[14px] leading-[20px] [&_svg:not([class*='size-'])]:size-4",
        md: "h-12 gap-2 px-4 text-[16px] leading-[24px] [&_svg:not([class*='size-'])]:size-5",
        lg: "h-auto gap-2 px-4 py-4 text-[16px] leading-[24px] [&_svg:not([class*='size-'])]:size-5",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-md": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
      shape: {
        rect: "rounded-lg",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
      shape: "rect",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "sm",
  shape = "rect",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
