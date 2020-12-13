import React from 'react'
import { Map, Marker } from 'react-amap'
import { amapRevGeocoder } from '../services'
import { AMapRevGeocoderType } from '../@types'

type AMapProps = {
  apiKey: string
  mapPos: { lat: number; lon: number }
  validated: boolean
  onClick?: (e: { lnglat: { lng: number; lat: number } }, res: AMapRevGeocoderType) => void
  webApiKey: string
}

export const AMap: React.FC<AMapProps> = ({ apiKey, mapPos, validated, onClick, webApiKey }) => {
  return (
    <div style={{ width: '100%', height: '50vh' }} key='aMap'>
      <Map
        amapkey={apiKey}
        plugins={['MapType', 'ToolBar']}
        zoom={14}
        center={{ latitude: mapPos.lat, longitude: mapPos.lon }}
        events={{
          click: (e: { lnglat: { lng: number; lat: number } }) => {
            amapRevGeocoder({ lon: e.lnglat.lng, lat: e.lnglat.lat, key: webApiKey }).then(res =>
              onClick?.(e, res)
            )
          },
        }}
      >
        {validated ? <Marker position={{ latitude: mapPos.lat, longitude: mapPos.lon }} /> : null}
      </Map>
    </div>
  )
}
