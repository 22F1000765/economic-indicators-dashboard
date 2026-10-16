
import type { ReactNode } from 'react'

type IndicatorCardProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export default function IndicatorCard({
  title,
  subtitle,
  children,
}: IndicatorCardProps) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-700/80 bg-[#0b1422] p-3 shadow-lg">
      <div className="mb-3 border-b border-slate-800 pb-2">
        <h2 className="text-sm font-semibold text-slate-100">
          {title}
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  )
}
