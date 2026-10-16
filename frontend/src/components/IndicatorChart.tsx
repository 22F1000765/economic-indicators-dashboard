

export default function IndicatorChart({ title }: { title: string }) {
  return (
    <div className="mt-3 flex min-h-40 w-full items-center justify-center rounded-md border border-dashed border-slate-700 bg-[#0b1422] p-4 text-center">
      <div>
        <p className="text-sm font-medium text-slate-300">
          Historical chart unavailable
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {title} currently has no historical observation series in the API.
        </p>
      </div>
    </div>
  )
}
