import React from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';


const GoogleMap = ({google, mapPos, validated}) => {
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
