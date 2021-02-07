import axios from '../axios.config'
import {
  GoogleGeocoderType,
  GoogleRevGeocoderType,
  AMapGeocoderType,
  AMapRevGeocoderType,
} from '../@types'
import injectAuth from './injectAuth'

export const googleGeocoder = (params: {
  address: string
  key: string
}): Promise<GoogleGeocoderType> =>
  axios
    .get<GoogleGeocoderType>('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address: params.address, key: params.key },
    })
    .then(res => res.data)

export const googleRevGeocoder = (params: {
  lon: number
  lat: number
  key: string
}): Promise<GoogleRevGeocoderType> =>
  axios
    .get<GoogleRevGeocoderType>('https://maps.googleapis.com/maps/api/geocode/json?', {
      params: { latlng: `${params.lat},${params.lon}`, key: params.key },
    })
    .then(res => res.data)

export const amapGeocoder = (params: { address: string; key: string }): Promise<AMapGeocoderType> =>
  axios
    .get<AMapGeocoderType>('https://restapi.amap.com/v3/geocode/geo', {
      params: { address: params.address, key: params.key },
    })
    .then(res => res.data)

export const amapRevGeocoder = (params: {
  lon: number
  lat: number
  key: string
}): Promise<AMapRevGeocoderType> =>
  axios
    .get<AMapRevGeocoderType>('https://restapi.amap.com/v3/geocode/regeo', {
      params: { location: `${params.lon},${params.lat}`, key: params.key },
    })
    .then(res => res.data)

const googleElevationRequest = (params: {
  lon: number
  lat: number
  jwtToken: string
}): Promise<{ elevation: number }> =>
  axios
    .get<{ elevation: number }>(`/autoelevation`, {
      params: { longitude: params.lon, latitude: params.lat },
      headers: { 'COG-TOKEN': params.jwtToken },
    })
    .then(res => res.data)

export const googleElevation = injectAuth(googleElevationRequest)

const autoHorizonRequest = (params: {
  lon: number
  lat: number
  ele: number
  r: number
  rOffset: number
  rStep: number
  jwtToken: string
}): Promise<{ elevation: number[] }> =>
  axios
    .get<{ elevation: number[] }>(`/autohorizon`, {
      params: {
        longitude: params.lon,
        latitude: params.lat,
        elevation: params.ele,
        r: params.r,
        rOffset: params.rOffset,
        rStep: params.rStep,
      },
      headers: { 'COG-TOKEN': params.jwtToken },
    })
    .then(res => res.data)

export const autoHorizon = injectAuth(autoHorizonRequest)
