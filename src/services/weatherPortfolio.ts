import axios from '../axios.config'
import {
  IAxiosRequest,
  ParsedCSV,
  WeatherPortfolio,
  MonthRatioIntermedia,
  FormulaIntermedia,
} from '../@types'
import injectAuth from './injectAuth'

const createWeatherPortfolioRequest: IAxiosRequest<
  {
    name: string
    address: string
    longitude: number
    latitude: number
    altitude: number
    mode: 'tmy' | 'processed'
    username: string
    jwtToken: string
  },
  { portfolioID: string; userID: string }
> = args =>
  axios
    .post<WeatherPortfolio>(
      `/weatherportfolio/${args.username}`,
      {
        name: args.name,
        address: args.address,
        longitude: args.longitude,
        latitude: args.latitude,
        altitude: args.altitude,
        mode: args.mode,
      },
      {
        headers: { 'COG-TOKEN': args.jwtToken },
      }
    )
    .then(res => res.data)

const getWeatherPortfolioRequest: IAxiosRequest<
  {
    username: string
    jwtToken: string
  },
  WeatherPortfolio[]
> = args =>
  axios
    .get<WeatherPortfolio[]>(`/weatherportfolio/${args.username}`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const getWeatherPortfolioSingleRequest: IAxiosRequest<
  {
    username: string
    portfolioID: string
    jwtToken: string
  },
  WeatherPortfolio
> = args =>
  axios
    .get<WeatherPortfolio>(`/weatherportfolio/${args.username}/${args.portfolioID}`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const updateWeatherPortfolioRequest: IAxiosRequest<
  {
    portfolioID: string
    username: string
    jwtToken: string
    property: string
    value: string | number | boolean | null
  },
  { Attributes: WeatherPortfolio }
> = args =>
  axios
    .put<{ Attributes: WeatherPortfolio }>(
      `/weatherportfolio/${args.username}/${args.portfolioID}`,
      null,
      {
        params: { property: args.property, value: args.value },
        headers: { 'COG-TOKEN': args.jwtToken },
      }
    )
    .then(res => res.data)

const deleteWeatherPortfolioRequest: IAxiosRequest<
  {
    portfolioID: string
    username: string
    jwtToken: string
  },
  void
> = args =>
  axios
    .delete<void>(`/weatherportfolio/${args.username}`, {
      params: { portfolioID: args.portfolioID },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const complementCSVRequest: IAxiosRequest<
  {
    parsedCSV: ParsedCSV[]
    dataYear: number[]
    source?: 'meteonorm' | 'nasa'
    method?: 'month-ratio' | 'year-formula' | 'month-formula' | 'ghi-ratio'
    portfolioID: string
    username: string
    jwtToken: string
  },
  WeatherPortfolio
> = args =>
  axios
    .post<WeatherPortfolio>(
      `/weatherportfolio/${args.username}/${args.portfolioID}`,
      args.parsedCSV,
      {
        headers: { 'COG-TOKEN': args.jwtToken },
        params: { source: args.source, method: args.method, year: args.dataYear[0] },
      }
    )
    .then(res => res.data)

const createNASARequest: IAxiosRequest<
  { portfolioID: string; username: string; jwtToken: string },
  void
> = args =>
  axios
    .get<void>(`/weatherportfolio/${args.username}/${args.portfolioID}/nasa`, {
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(() => {
      return
    })

const allSrcMonthGHIRequest: IAxiosRequest<
  { portfolioID: string; username: string; jwtToken: string },
  Record<string, number[]>
> = args =>
  axios
    .get<Record<string, number[]>>(
      `/weatherportfolio/${args.username}/${args.portfolioID}/allsrcmonthghi`,
      {
        headers: { 'COG-TOKEN': args.jwtToken },
      }
    )
    .then(res => res.data)

type IntermediateReqBase = {
  parsedCSV: ParsedCSV[]
  dataYear: number[]
  source: 'meteonorm' | 'nasa'
  portfolioID: string
  username: string
  jwtToken: string
}

const yearFormulaIntermediateResultRequest = (
  args: IntermediateReqBase & { method: 'year-formula' }
) =>
  axios
    .post<Promise<{ originGHI: number[]; fixedGHI: number[]; intermediate: FormulaIntermedia }>>(
      `/weatherportfolio/${args.username}/${args.portfolioID}/intermediate`,
      args.parsedCSV,
      {
        headers: { 'COG-TOKEN': args.jwtToken },
        params: { source: args.source, method: args.method, year: args.dataYear[0] },
      }
    )
    .then(res => res.data)

const monthFormulaIntermediateResultRequest = (
  args: IntermediateReqBase & { method: 'month-formula' }
) =>
  axios
    .post<Promise<{ originGHI: number[]; fixedGHI: number[]; intermediate: FormulaIntermedia[] }>>(
      `/weatherportfolio/${args.username}/${args.portfolioID}/intermediate`,
      args.parsedCSV,
      {
        headers: { 'COG-TOKEN': args.jwtToken },
        params: { source: args.source, method: args.method, year: args.dataYear[0] },
      }
    )
    .then(res => res.data)

const monthRatioIntermediateResultRequest = (
  args: IntermediateReqBase & { method: 'month-ratio' }
) =>
  axios
    .post<Promise<{ originGHI: number[]; fixedGHI: number[]; intermediate: MonthRatioIntermedia }>>(
      `/weatherportfolio/${args.username}/${args.portfolioID}/intermediate`,
      args.parsedCSV,
      {
        headers: { 'COG-TOKEN': args.jwtToken },
        params: { source: args.source, method: args.method, year: args.dataYear[0] },
      }
    )
    .then(res => res.data)

export const createWeatherPortfolio = injectAuth(createWeatherPortfolioRequest)
export const getWeatherPortfolio = injectAuth(getWeatherPortfolioRequest)
export const getWeatherPortfolioSingle = injectAuth(getWeatherPortfolioSingleRequest)
export const updateWeatherPortfolio = injectAuth(updateWeatherPortfolioRequest)
export const deleteWeatherPortfolio = injectAuth(deleteWeatherPortfolioRequest)
export const complementCSV = injectAuth(complementCSVRequest)
export const createNASA = injectAuth(createNASARequest)
export const allSrcMonthGHI = injectAuth(allSrcMonthGHIRequest)
export const yearFormulaIntermediateResult = injectAuth(yearFormulaIntermediateResultRequest)
export const monthFormulaIntermediateResult = injectAuth(monthFormulaIntermediateResultRequest)
export const monthRatioIntermediateResult = injectAuth(monthRatioIntermediateResultRequest)
