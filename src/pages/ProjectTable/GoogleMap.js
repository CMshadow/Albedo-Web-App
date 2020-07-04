import React from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { googleRevGeocoder } from './service'


const GoogleMap = ({google, apiKey, mapPos, setmapPos, validated, setvalidated, form}) => {
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
        setmapPos({lon: event.latLng.lng(), lat: event.latLng.lat()})
        googleRevGeocoder({lon: event.latLng.lng(), lat: event.latLng.lat(), key: apiKey})
        .then(res =>
          form.setFieldsValue({projectAddress: res.data.results[0].formatted_address})
        )
        setvalidated(true)
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
