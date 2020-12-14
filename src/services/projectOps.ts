import axios from '../axios.config'
import injectAuth from './injectAuth'
import { IAxiosRequest } from '../@types'

type OptimalTiltAzimuthPOAResponse = {
  optTilt: number
  optAzimuth: number
  optPOA: number
}

type AllTiltAzimuthPOAResponse = {
  allTiltAziPOA: [number, number, number][]
}

type InvPlan = {
  pps: number
  spi: number
  mpptSetup: number[][]
  mpptSpec: number[]
}

type WiringOptions = string[]

type WiringChoice = {
  transformer_wir_choice: string
  Ie: number
}

type ManualInverterResponse = {
  autoPlan: {
    plan: InvPlan[]
    wasted: number
  }
  N1vdcMax: number
  N1vmpptMax: number
  N1Min: number
}

type InverterLimitResponse = {
  inverterPlans: InvPlan[]
  N1vdcMax: number
  N1vmpptMax: number
  N1Min: number
}

const globalOptTiltAzimuthRequest: IAxiosRequest<
  { projectID: string; username: string; jwtToken: string },
  OptimalTiltAzimuthPOAResponse
> = args =>
  axios
    .post<OptimalTiltAzimuthPOAResponse>(
      `/project/${args.username}/${args.projectID}/opttiltazimuth`,
      {},
      { headers: { 'COG-TOKEN': args.jwtToken } }
    )
    .then(res => res.data)

const allTiltAzimuthPOARequest: IAxiosRequest<
  { projectID: string; startAzi: number; endAzi: number; username: string; jwtToken: string },
  AllTiltAzimuthPOAResponse
> = args =>
  axios
    .post<AllTiltAzimuthPOAResponse>(
      `/project/${args.username}/${args.projectID}/alltiltazimuthpoa`,
      {},
      {
        params: { startAzi: args.startAzi, endAzi: args.endAzi },
        headers: { 'COG-TOKEN': args.jwtToken },
      }
    )
    .then(res => res.data)

const manualInverterRequest: IAxiosRequest<
  {
    projectID: string
    invID: string
    invUserID: string
    pvID: string
    pvUserID: string
    ttlPV: number
    username: string
    jwtToken: string
  },
  ManualInverterResponse | string
> = args =>
  axios
    .get<ManualInverterResponse>(`/project/${args.username}/${args.projectID}/manualinverter`, {
      params: {
        inverterModel: {
          inverterID: args.invID,
          userID: args.invUserID,
        },
        pvModel: {
          pvID: args.pvID,
          userID: args.pvUserID,
        },
        ttlPV: args.ttlPV,
        pvMode: 'single',
      },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const inverterLimitRequest: IAxiosRequest<
  {
    projectID: string
    invID: string
    invUserID: string
    pvID: string
    pvUserID: string
    username: string
    jwtToken: string
  },
  InverterLimitResponse
> = args =>
  axios
    .get<InverterLimitResponse>(`/project/${args.username}/${args.projectID}/inverterlimit`, {
      params: {
        inverterModel: {
          inverterID: args.invID,
          userID: args.invUserID,
        },
        pvModel: {
          pvID: args.pvID,
          userID: args.pvUserID,
        },
      },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const wiringOptionsRequest: IAxiosRequest<
  {
    type: string
    Ut: number
    jwtToken: string
  },
  WiringOptions
> = args =>
  axios
    .get<WiringOptions>(`/wiringoptions`, {
      params: {
        type: args.type,
        ut: args.Ut,
      },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

const wiringChoiceRequest: IAxiosRequest<
  {
    type: string
    Ut: number
    Se: number
    jwtToken: string
    TransformerCableLen: number
    allowACVolDropFac: number
    Ib: number
  },
  WiringChoice
> = args =>
  axios
    .get<WiringChoice>(`/wiringchoice`, {
      params: {
        type: args.type,
        ut: args.Ut,
        se: args.Se,
        transformercablelen: args.TransformerCableLen,
        allowacvoldropfac: args.allowACVolDropFac,
        ib: args.Ib,
      },
      headers: { 'COG-TOKEN': args.jwtToken },
    })
    .then(res => res.data)

export const globalOptTiltAzimuth = injectAuth(globalOptTiltAzimuthRequest)
export const allTiltAzimuthPOA = injectAuth(allTiltAzimuthPOARequest)
export const manualInverter = injectAuth(manualInverterRequest)
export const inverterLimit = injectAuth(inverterLimitRequest)
export const wiringOptions = injectAuth(wiringOptionsRequest)
export const wiringChoice = injectAuth(wiringChoiceRequest)
