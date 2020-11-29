import React, { Dispatch, SetStateAction } from 'react'
import GoogleMapReact from 'google-map-react'
import { googleRevGeocoder } from '../../services'
import { notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { FormInstance } from 'antd/lib/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/pro-light-svg-icons'

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
  setmapPos: Dispatch<SetStateAction<{ lat: number; lon: number }>>
  validated: boolean
  setvalidated: Dispatch<SetStateAction<boolean>>
  form: FormInstance
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  mapPos,
  setmapPos,
  validated,
  setvalidated,
  form,
}) => {
  const { t } = useTranslation()
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
          googleRevGeocoder({ lon: event.lng, lat: event.lat, key: apiKey }).then(res => {
            if (res.results.length > 0) {
              setmapPos({ lon: event.lng, lat: event.lat })
              form.setFieldsValue({ projectAddress: res.results[0].formatted_address })
              setvalidated(true)
            } else {
              notification.error({ message: t('project.error.invalid-address.googlemap') })
            }
          })
        }}
      >
        {validated ? <Marker lat={mapPos.lat} lng={mapPos.lon} /> : null}
      </GoogleMapReact>
    </div>
  )
}

export default GoogleMap
