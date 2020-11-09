import React from 'react'
import { Map, Marker } from 'react-amap'
import { amapRevGeocoder } from './service'
import { notification } from 'antd'
import { useTranslation } from 'react-i18next'

const AMap = ({ apikey, mapPos, setmapPos, validated, setvalidated, form, webApiKey }) => {
  const { t } = useTranslation()
  const plugins = ['MapType', 'ToolBar']

  return (
    <div style={{ width: '100%', height: '50vh' }} key="aMap">
      <Map
        amapkey={apikey}
        plugins={plugins}
        zoom={14}
        center={{ latitude: mapPos.lat, longitude: mapPos.lon }}
        events={{
          click: e => {
            amapRevGeocoder({ lon: e.lnglat.lng, lat: e.lnglat.lat, key: webApiKey }).then(res => {
              if (res.data.regeocode.formatted_address.length > 0) {
                setmapPos({ lon: e.lnglat.lng, lat: e.lnglat.lat })
                form.setFieldsValue({ projectAddress: res.data.regeocode.formatted_address })
                setvalidated(true)
              } else {
                notification.error({ message: t('project.error.invalid-address.amap') })
              }
            })
          },
        }}
      >
        {validated ? <Marker position={{ latitude: mapPos.lat, longitude: mapPos.lon }} /> : null}
      </Map>
    </div>
  )
}

export default AMap
