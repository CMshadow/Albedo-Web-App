import React, { Dispatch, SetStateAction } from 'react'
import { Map, Marker } from 'react-amap'
import { amapRevGeocoder } from './service'
import { notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { FormInstance } from 'antd/lib/form'

type AMapProps = {
  apiKey: string
  mapPos: { lat: number; lon: number }
  setmapPos: Dispatch<SetStateAction<{ lat: number; lon: number }>>
  validated: boolean
  setvalidated: Dispatch<SetStateAction<boolean>>
  form: FormInstance
  webApiKey: string
}

const AMap: React.FC<AMapProps> = ({
  apiKey,
  mapPos,
  setmapPos,
  validated,
  setvalidated,
  form,
  webApiKey,
}) => {
  const { t } = useTranslation()

  return (
    <div style={{ width: '100%', height: '50vh' }} key="aMap">
      <Map
        amapkey={apiKey}
        plugins={['MapType', 'ToolBar']}
        zoom={14}
        center={{ latitude: mapPos.lat, longitude: mapPos.lon }}
        events={{
          click: (e: { lnglat: { lng: number; lat: number } }) => {
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
