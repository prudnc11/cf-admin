import * as React from "react"
import { cn } from "@/lib/utils"
import { IconUpload, IconX, IconChevronDown, IconCalendar } from "@tabler/icons-react"

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-[14px] leading-[20px] font-normal text-[#161D14]">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClasses = "w-full px-4 py-3 bg-[#EDF0E6] rounded-[12px] text-[16px] leading-[24px] text-[#161D14] outline-none transition-colors placeholder:text-[#525C4E] focus:ring-2 focus:ring-[#36B92E]/20 disabled:opacity-50 disabled:cursor-not-allowed"

function FormInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(inputClasses, className)}
      {...props}
    />
  )
}

function FormTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(inputClasses, "resize-none", className)}
      rows={3}
      {...props}
    />
  )
}

function FormSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(inputClasses, "appearance-none pr-12 cursor-pointer", className)}
        {...props}
      >
        {children}
      </select>
      <IconChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#161D14] pointer-events-none" />
    </div>
  )
}

function FormDateInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <input
        type="date"
        className={cn(inputClasses, "pr-12", className)}
        {...props}
      />
      <IconCalendar className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#161D14] pointer-events-none" />
    </div>
  )
}

function FormNumberInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="number"
      className={cn(inputClasses, className)}
      {...props}
    />
  )
}

function FormFileUpload({
  label = "Upload file",
  accept,
  multiple,
  files,
  onFilesChange,
}: {
  label?: string
  accept?: string
  multiple?: boolean
  files: File[]
  onFilesChange: (files: File[]) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    onFilesChange(multiple ? [...files, ...newFiles] : newFiles)
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-3 rounded-[12px] border border-dashed border-[#C3C8BC] bg-[#F7FAF6] text-[14px] leading-[20px] text-[#525C4E] hover:border-[#36B92E] hover:bg-[#EDF0E6] transition-colors"
      >
        <IconUpload className="size-5" />
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#EDF0E6]">
              <span className="flex-1 text-[14px] leading-[20px] text-[#161D14] truncate">{file.name}</span>
              <button type="button" onClick={() => removeFile(i)} className="shrink-0 text-[#525C4E] hover:text-[#DC2626]">
                <IconX className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FormRadioGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      {options.map((opt) => (
        <label
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex items-center gap-2 cursor-pointer px-4 py-3 rounded-[12px] border transition-colors",
            value === opt.value
              ? "border-[#36B92E] bg-[#D4F5D0]"
              : "border-[#C3C8BC] bg-white hover:border-[#8B9185]"
          )}
        >
          <div className={cn(
            "size-4 rounded-full border-2 flex items-center justify-center",
            value === opt.value ? "border-[#36B92E]" : "border-[#C3C8BC]"
          )}>
            {value === opt.value && <div className="size-2 rounded-full bg-[#36B92E]" />}
          </div>
          <span className="text-[14px] leading-[20px] text-[#161D14]">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

function FormPassFail({
  value,
  onChange,
}: {
  value: "pass" | "fail" | ""
  onChange: (value: "pass" | "fail") => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange("pass")}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-[12px] border font-bold text-[14px] leading-[20px] transition-colors",
          value === "pass"
            ? "border-[#1A5514] bg-[#D4F5D0] text-[#1A5514]"
            : "border-[#C3C8BC] bg-white text-[#525C4E] hover:border-[#1A5514]"
        )}
      >
        Pass
      </button>
      <button
        type="button"
        onClick={() => onChange("fail")}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-[12px] border font-bold text-[14px] leading-[20px] transition-colors",
          value === "fail"
            ? "border-[#DC2626] bg-[#FEE2E2] text-[#DC2626]"
            : "border-[#C3C8BC] bg-white text-[#525C4E] hover:border-[#DC2626]"
        )}
      >
        Fail
      </button>
    </div>
  )
}

function FormCheckbox({
  checked,
  onChange,
  children,
  variant = "default",
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
  variant?: "default" | "success"
}) {
  const bg = checked
    ? (variant === "success" ? "bg-[#C9F0D6]" : "bg-[#ECEFE5]")
    : "bg-[#ECEFE5]"
  const iconColor = checked
    ? (variant === "success" ? "text-[#00572D]" : "text-[#161D14]")
    : "text-[#161D14]"

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn("flex items-start gap-2 p-4 rounded-[12px] text-left transition-colors", bg)}
    >
      <div className={cn("size-6 shrink-0 flex items-center justify-center rounded", iconColor)}>
        {checked ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="size-5">
            <rect x="1" y="1" width="18" height="18" rx="3" fill="currentColor" />
            <path d="M5.5 10L8.5 13L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="size-5">
            <rect x="1" y="1" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </button>
  )
}

export {
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
  FormDateInput,
  FormNumberInput,
  FormFileUpload,
  FormRadioGroup,
  FormPassFail,
  FormCheckbox,
}
