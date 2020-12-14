export type GoogleGeocoderType = {
  results: { formatted_address: string; geometry: { location: { lng: number; lat: number } } }[]
}
export type GoogleRevGeocoderType = {
  results: { formatted_address: string; geometry: { location: { lng: number; lat: number } } }[]
}
export type AMapGeocoderType = { geocodes: { formatted_address: string; location: string }[] }
export type AMapRevGeocoderType = { regeocode: { formatted_address: string } }
