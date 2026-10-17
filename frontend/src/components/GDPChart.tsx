
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const chartData = [
  { year: '2020', india: -5.8, world: -2.9 },
  { year: '2021', india: 9.7, world: 6.5 },
  { year: '2022', india: 7.6, world: 3.6 },
  { year: '2023', india: 9.2, world: 3.5 },
  { year: '2024', india: 6.5, world: 3.3 },
]

export default function GDPChart() {
  return (
    <div className="w-full">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#1e3045"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#0b1422',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#e2e8f0',
                fontSize: 11,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, color: '#cbd5e1' }}
            />
            <Bar
              dataKey="india"
              name="India"
              fill="#13c4e8"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="world"
              name="World"
              fill="#e8aa39"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-[9px] leading-relaxed text-slate-500">
        <p>Source: World Bank · GDP growth (annual %)</p>
        <a
          href="https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?locations=IN"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-cyan-300 underline"
        >
          View source data
        </a>
      </div>
    </div>
  )
}
