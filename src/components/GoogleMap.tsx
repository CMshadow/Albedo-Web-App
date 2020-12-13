import React from 'react'
import GoogleMapReact from 'google-map-react'
import { googleRevGeocoder } from '../services'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/pro-light-svg-icons'
import { GoogleRevGeocoderType } from '../@types'

const Marker: React.FC<GoogleMapReact.ChildComponentProps> = () => {
  return (
    <div style={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}>
      <FontAwesomeIcon icon={faMapMarkerAlt} size='3x' color='#1890ff' />
    </div>
  )
}

type GoogleMapProps = {
  apiKey: string
  mapPos: { lat: number; lon: number }
  validated: boolean
  onClick?: (event: GoogleMapReact.ClickEventValue, res: GoogleRevGeocoderType) => void
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ apiKey, mapPos, validated, onClick }) => {
  return (
    <div style={{ width: '100%', height: '50vh' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultZoom={14}
        center={{ lat: mapPos.lat, lng: mapPos.lon }}
        options={maps => ({
          fullscreenControl: false,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'satellite', 'hybird'],
          },
        })}
        onClick={event => {
          googleRevGeocoder({ lon: event.lng, lat: event.lat, key: apiKey }).then(res =>
            onClick?.(event, res)
          )
        }}
      >
        {validated ? <Marker lat={mapPos.lat} lng={mapPos.lon} /> : null}
      </GoogleMapReact>
    </div>
  )
}
