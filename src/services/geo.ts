import axios from '../axios.config'

type GoogleGeocoderType = {
  results: { geometry: { formatted_address: string; location: { lng: number; lat: number } } }[]
}
type GoogleRevGeocoderType = { googleRevGeocoder: { formatted_address: string }[] }
type AMapGeocoderType = { geocodes: { formatted_address: string; location: string }[] }
type AMapRevGeocoderType = { regeocode: { formatted_address: string } }

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
