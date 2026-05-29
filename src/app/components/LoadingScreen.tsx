import Image from "next/image"

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center gap-6">
      {/* Logo + name */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Image
            src="/logo3.png"
            alt="NHMS"
            width={72}
            height={72}
            className="rounded-xl opacity-90"
          />
          {/* green ping ring around logo */}
          <span className="absolute inset-0 rounded-xl ring-2 ring-green-400 animate-ping opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-slate-700 font-bold text-xl tracking-wide">NHMS</p>
          <p className="text-slate-400 text-xs">Nagsiya Health Monitoring System</p>
        </div>
      </div>

      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin" />
      </div>

      {/* Message + dots */}
      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
        <span>{message}</span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  )
}
