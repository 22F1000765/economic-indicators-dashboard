
import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Indicator {
  id: string
  name: string
  value: number | null
  unit: string
  observation_date: string
  source: string | null
  source_url: string | null 
  data_status: 'illustrative' | 'verified' | 'stale' | 'unavailable'
}

export interface IndicatorsResponse {
  data_status: string
  message: string
  as_of: string
  indicators: Indicator[]
}

export async function fetchIndicators(): Promise<IndicatorsResponse> {
  const response = await apiClient.get<IndicatorsResponse>('/api/indicators')
  return response.data
}


export interface MarketIndex {
  name: string
  symbol: string
  value: number | null
  change: number | null
  change_percent: number | null
  timestamp: string | null
  status: 'available' | 'unavailable'
  source: string
  source_url: string
}

export interface MarketWatchResponse {
  data_status: string
  as_of: string
  indices: MarketIndex[]
}

export async function fetchMarketWatch(): Promise<MarketWatchResponse> {
  const response = await apiClient.get<MarketWatchResponse>(
    '/api/market-watch'
  )
  return response.data
}
