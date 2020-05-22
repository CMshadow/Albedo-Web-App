import React from 'react';
import { Map, Marker } from 'react-amap';

const AMap = ({apikey, mapPos, validated}) => {
  const plugins = [
    'MapType',
    'ToolBar'
  ]

  return (
    <div style={{ width: '100%', height: '50vh' }} key='aMap'>
      <Map
        amapkey={apikey}
        plugins={plugins}
        zoom={14}
        center={{latitude: mapPos.lat, longitude: mapPos.lon}}
      >
        {
          validated ?
          <Marker position={{latitude: mapPos.lat, longitude: mapPos.lon}} /> :
          null
        }
      </Map>
    </div>
  )
}

export default AMap
