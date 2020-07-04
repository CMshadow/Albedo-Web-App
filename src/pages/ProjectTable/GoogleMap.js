import React from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { googleRevGeocoder } from './service'
import { notification } from 'antd'
import { useTranslation } from 'react-i18next'

const GoogleMap = ({google, apiKey, mapPos, setmapPos, validated, setvalidated, form}) => {
  const { t } = useTranslation()

  return (
    <Map
      containerStyle={{
        position: 'relative',
        width: '100%',
        height: '50vh'
      }}
      google={google}
      zoom={14}
      center={{lat: mapPos.lat, lng: mapPos.lon}}
      onClick={(props, map, event) => {
        googleRevGeocoder({lon: event.latLng.lng(), lat: event.latLng.lat(), key: apiKey})
        .then(res => {
          if (res.data.results.length > 0) {
            setmapPos({lon: event.latLng.lng(), lat: event.latLng.lat()})
            form.setFieldsValue({projectAddress: res.data.results[0].formatted_address})
            setvalidated(true)
          } else {
            notification.error({message: t('project.error.invalid-address')})
          }
        })
      }}
    >
      {
        validated ?
        <Marker position={{lat: mapPos.lat, lng: mapPos.lon}} /> :
        null
      }
    </Map>
  )
}

export default GoogleApiWrapper((props) => ({
  apiKey: props.apiKey,
}))(GoogleMap)
