import React from 'react'
import { Card, Collapse, Typography, Row, Space } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as styles from './UnusedCombiboxInverterCard.module.scss'

const { Panel } = Collapse
const { Text } = Typography

export const UnusedCombiboxInverterCard = () => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const allTransformers = projectData.transformers || []
  
  const genUnusedCombiboxInverter = (building) => {
    const allCombiboxSerial = building.combibox.map(combibox => 
      combibox.combibox_serial_num
    )
    const allUsedCombiboxSerial = allTransformers.flatMap(trans =>
      trans.linked_combibox_serial_num
    )
    const unusedCombiboxSerial = allCombiboxSerial.filter(combibox => 
      !allUsedCombiboxSerial.includes(combibox.combibox_serial_num)
    )


    const allInverterSerial = building.data.flatMap((spec, specIndex) =>
      spec.inverter_wiring.map(inverter => 
        `${building.buildingName}-${specIndex + 1}-${inverter.inverter_serial_number}`
      )
    )
    const allUsedInverterSerial = allTransformers.flatMap(trans =>
      trans.linked_inverter_serial_num
    ).concat(
      building.combibox ? 
      building.combibox.flatMap(combibox => 
        combibox.linked_inverter_serial_num.map(serial => `${building.buildingName}-${serial}`)
      ) :
      []
    )
    const unusedInverterSerial = allInverterSerial.filter(serial => 
      !allUsedInverterSerial.includes(serial)
    )

    return (
      <>
        {
          unusedCombiboxSerial.length > 0 ?
          <Row>
            <Space>
              {t('project.spec.unlink_combibox_serial')}:   
              {
                unusedCombiboxSerial.map(serial =>
                  <Text style={{color: '#69c0ff'}}>
                  {`C${serial.split('-')[1]}`}
                  </Text>
                )
              }
            </Space>
          </Row> :
          null
        }
        {
          unusedInverterSerial.length > 0 ?
          <Row>
            <Space>
              {t('project.spec.unlink_inverter_serial')}:
              {
                unusedInverterSerial.map(serial =>
                  <Text style={{color: '#faad14'}}>
                  {`S${serial.split('-').slice(-2,).join('-')}`}
                  </Text>
                )
              }
            </Space>
          </Row> :
          null
        }
      </>
    )
  }

  return (
    <Card 
      className={styles.card} 
      title={t('project.spec.unusedEquipments')} 
      headStyle={{textAlign: 'center'}} 
      bordered
    >
      <Collapse 
        ghost 
        defaultActiveKey={projectData.buildings.map(building => building.buildingID)}
      >
        {
          projectData.buildings.map(building =>
            <Panel 
              header={building.buildingName} 
              key={building.buildingID}
              forceRender
            >
              {genUnusedCombiboxInverter(building)}
            </Panel>
          )
        }
      </Collapse>
    </Card>
  )
}