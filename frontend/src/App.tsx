import { useEffect, useState } from 'react'
import { fetchIndicators } from './api/client'

import IndicatorCard from './components/IndicatorCard'
import GDPChart from './components/GDPChart'
import IndicatorChart from './components/IndicatorChart'

import {
  fetchMarketWatch,
  
  type MarketIndex,
} from './api/client'

const indicators = [
  {
    id: 'gdp-growth',
    title: 'GDP Growth',
    subtitle: 'India & World · Year-on-year',
  },
  {
    id: 'debt-to-gdp',
    title: 'Debt to GDP Ratio',
    subtitle: 'India · Historical trend',
  },
  {
    id: 'trade-balance',
    title: 'Imports, Exports & Trade Balance',
    subtitle: 'External trade · Monthly',
  },
  {
    id: 'gst-collection',
    title: 'GST Tax Collection',
    subtitle: 'Monthly collection · Historical comparison',
  },
  {
    id: 'inflation',
    title: 'Inflation',
    subtitle: 'India · CPI · RBI target',
  },
  {
    id: 'government-expenditure',
    title: 'Government Expenditure',
    subtitle: 'Total and capital expenditure',
  },
]




function App() {
    const [apiStatus, setApiStatus] = useState<
    'loading' | 'connected' | 'error'
  >('loading')

  const [apiMessage, setApiMessage] = useState('Connecting to API...')

  const [indicatorsData, setIndicatorsData] = useState<
  Awaited<ReturnType<typeof fetchIndicators>> | null
>(null)
const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
const [marketWatchStatus, setMarketWatchStatus] = useState<
  'loading' | 'connected' | 'error'
>('loading')


  useEffect(() => {
    async function loadIndicators() {
      try {
        const data = await fetchIndicators()
        setIndicatorsData(data)

        setApiStatus('connected')
        setApiMessage(
          `API connected · ${data.indicators.length} indicator(s) received · ${data.data_status}`
        )
      } catch {
        setApiStatus('error')
        setApiMessage('API unavailable · Dashboard placeholders remain visible')
      }
    }

    loadIndicators()
  }, [])
  useEffect(() => {
  let cancelled = false

  fetchMarketWatch()
    .then((data) => {
      if (cancelled) return

      setMarketIndices(data.indices)
      setMarketWatchStatus(
        data.data_status === 'available' ? 'connected' : 'error'
      )
    })
    .catch(() => {
      if (cancelled) return

      setMarketIndices([])
      setMarketWatchStatus('error')
    })

  return () => {
    cancelled = true
  }
}, [])
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1214px] bg-[#050a12] p-4 text-slate-100">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.2em] text-cyan-400">
          ECONOMIC INTELLIGENCE
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Economic Indicators
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          India · Macroeconomic Overview
        </p>
        <p
  className={`mt-1 text-[10px] ${
    apiStatus === 'connected'
      ? 'text-emerald-400'
      : apiStatus === 'error'
        ? 'text-red-400'
        : 'text-slate-500'
  }`}
>
  {apiMessage}
</p>
      </header>

      <section className="mb-4 rounded-md border border-slate-700 bg-[#0b1422] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-cyan-300">
            MARKET WATCH
          </span>
          <span
  className={`text-[10px] ${
    marketWatchStatus === 'connected'
      ? 'text-emerald-400'
      : marketWatchStatus === 'error'
        ? 'text-red-400'
        : 'text-slate-500'
  }`}
>
  {marketWatchStatus === 'loading'
  ? 'Loading market data…'
  : marketWatchStatus === 'connected'
    ? 'Latest daily data · Yahoo Finance'
    : 'Market data unavailable'}
</span>
        </div>
        
<div className="mt-3 grid grid-cols-3 gap-2">
  {['NIFTY 50', 'SENSEX', 'BANK NIFTY'].map((name) => {
    const index = marketIndices.find((item) => item.name === name)
    const hasValue = index?.value != null
    const change = index?.change_percent
    const changeColor =
      change == null
        ? 'text-slate-500'
        : change > 0
          ? 'text-emerald-400'
          : change < 0
            ? 'text-red-400'
            : 'text-slate-400'

    return (
      <div key={name} className="rounded bg-[#111f31] p-2">
        <p className="text-[10px] text-slate-400">{name}</p>

        <p className="mt-2 text-sm font-semibold text-slate-100">
          {hasValue
            ? index.value!.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
              })
            : '—'}
        </p>

        <p className={`mt-1 text-[10px] ${changeColor}`}>
          {hasValue && change != null
            ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%`
            : marketWatchStatus === 'loading'
              ? 'Loading…'
              : 'Unavailable'}
        </p>

        {index?.timestamp && (
          <p className="mt-1 text-[9px] text-slate-500">
            {new Date(index.timestamp).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Kolkata',
            })}
          </p>
        )}
      </div>
    )
  })}
</div>

      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {indicators.map((indicator) => (
          <IndicatorCard
            key={indicator.title}
            title={indicator.title}
            subtitle={indicator.subtitle}
          >
            

{indicator.id === 'gdp-growth' ? (
  <div className="grid grid-cols-2 gap-2">
    <div className="rounded-md bg-[#111f31] p-3">
      <p className="text-[10px] text-slate-400">Latest value</p>
      <p className="mt-2 text-xl font-semibold text-cyan-300">
        {indicatorsData?.indicators.find(
          (item) => item.id === indicator.id
        )?.value ?? '—'}
        {indicatorsData?.indicators.find(
          (item) => item.id === indicator.id
        )?.value != null
          ? '%'
          : ''}
      </p>
      <p className="mt-1 text-[10px] text-slate-500">
        {(() => {
          const observation = indicatorsData?.indicators.find(
            (item) => item.id === indicator.id
          )

          if (!observation) return 'Data unavailable'
          if (observation.data_status === 'verified')
            return 'Official reported estimate'
          if (observation.data_status === 'illustrative')
            return 'Illustrative demo value'
          if (observation.data_status === 'stale') return 'Stale data'
          return 'Data unavailable'
        })()}
      </p>
    </div>

    <div className="rounded-md bg-[#111f31] p-3">
      <p className="text-[10px] text-slate-400">Previous period</p>
      <p className="mt-2 text-xl font-semibold text-cyan-300">—</p>
      <p className="mt-1 text-[10px] text-slate-500">
        No historical observation available
      </p>
    </div>
  </div>
) : (
  <div className="rounded-md bg-[#111f31] p-3">
    <p className="text-[10px] text-slate-400">Latest value</p>
    <p className="mt-2 text-xl font-semibold text-cyan-300">
      {indicatorsData?.indicators.find(
        (item) => item.id === indicator.id
      )?.value ?? '—'}
      {indicatorsData?.indicators.find(
        (item) => item.id === indicator.id
      )?.value != null
        ? indicatorsData.indicators.find(
            (item) => item.id === indicator.id
          )?.unit
        : ''}
    </p>
    <p className="mt-1 text-[10px] text-slate-500">
      {indicatorsData?.indicators.find(
        (item) => item.id === indicator.id
      )?.data_status ?? 'unavailable'}
    </p>
  </div>
)}


{indicator.id === 'gdp-growth' ? (
  <GDPChart />
) : indicatorsData?.indicators.some(
    (item) => item.id === indicator.id && item.value != null
  ) ? (
  <IndicatorChart title={indicator.title} />
) : (
  <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-slate-700 bg-[#0b1422] p-4 text-center">
    <div>
      <p className="text-sm text-slate-300">Chart unavailable</p>
      <p className="mt-1 text-xs text-slate-500">
        No observations available from the API yet.
      </p>
    </div>
  </div>
)}


            

{(() => {
  const observation = indicatorsData?.indicators.find(
    (item) => item.id === indicator.id
  )

  return (
    <p className="mt-2 text-[10px] text-slate-500">
      Source: {observation?.source ?? 'Pending integration'}
      {' · Observation date: '}
      {observation?.observation_date ?? '—'}
      {' · Status: '}
      {observation?.data_status ?? 'unavailable'}
      {observation?.source_url && (
        <>
          {' · '}
          <a
            href={observation.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 underline hover:text-cyan-200"
          >
            View source
          </a>
        </>
      )}
    </p>
  )
})()}

          </IndicatorCard>
        ))}
      </div>

      <footer className="mt-5 border-t border-slate-800 py-3 text-center text-[10px] text-slate-500">
        Economic Indicators Dashboard · Data provenance and freshness will be displayed per indicator.
      </footer>
    </main>
  )
}

export default App
