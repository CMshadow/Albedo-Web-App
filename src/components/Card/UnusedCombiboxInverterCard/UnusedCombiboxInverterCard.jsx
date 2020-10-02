import React from 'react'
import { Card, Collapse, Typography, Row, Space, Divider } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as styles from './UnusedCombiboxInverterCard.module.scss'

const { Panel } = Collapse
const { Paragraph } = Typography

export const findUnusedTransformerSerial = (allPowercabinets, allTransformers) => {
  const allTranformerSerial = allTransformers.map(transformer =>
    transformer.transformer_serial_num
  )
  console.log(allTranformerSerial)
  const allUsedTransformerSerial = allPowercabinets.flatMap(powercabinet =>
    powercabinet.linked_transformer_serial_num
  )
  console.log(allUsedTransformerSerial)
  return allTranformerSerial.filter(serial => !allUsedTransformerSerial.includes(serial))
}

export const findUnusedCombiboxSerial = (allTransformers, allPowercabinets, building) => {
  const allCombiboxSerial = building.combibox.map(combibox => 
    combibox.combibox_serial_num
  )
  const allUsedCombiboxSerial = allTransformers.flatMap(trans =>
    trans.linked_combibox_serial_num
  ).concat(
    allPowercabinets.flatMap(powercabinet => powercabinet.linked_combibox_serial_num)
  )
  return allCombiboxSerial.filter(serial => !allUsedCombiboxSerial.includes(serial))
}

export const findUnusedInverterSerial = (allTransformers, allPowercabinets, building) => {
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
  ).concat(
    allPowercabinets.flatMap(powercabinet => powercabinet.linked_inverter_serial_num)
  )
  return allInverterSerial.filter(serial => !allUsedInverterSerial.includes(serial))
}

export const UnusedCombiboxInverterCard = () => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const allPowercabinets = projectData.powercabinets || []
  const allTransformers = projectData.transformers || []

  const unusedTransformerSerial = findUnusedTransformerSerial(allPowercabinets, allTransformers)
  
  const genUnusedCombiboxInverter = (building) => {
    const unusedCombiboxSerial = findUnusedCombiboxSerial(allTransformers, allPowercabinets, building)
    const unusedInverterSerial = findUnusedInverterSerial(allTransformers, allPowercabinets, building)

    return (
      <>
        {
          unusedCombiboxSerial.length > 0 ?
          <Row>
            <Space>
              {t('project.spec.unlink_combibox_serial')}:   
              <Paragraph className={styles.combiboxParagraph}>
                {
                  unusedCombiboxSerial.map(serial => `C${serial.split('-')[1]}`).join(' , ')
                }
              </Paragraph>
            </Space>
          </Row> :
          null
        }
        {
          unusedInverterSerial.length > 0 ?
          <Row>
            <Space>
              {t('project.spec.unlink_inverter_serial')}:
              <Paragraph className={styles.inverterParagraph}>
                {
                  unusedInverterSerial.map(serial =>
                    `S${serial.split('-').slice(-2,).join('-')}`
                  ).join(' , ')
                }
              </Paragraph>
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
      {
        unusedTransformerSerial.length > 0 ?
        <>
          <Row>
            <Space>
              {t('project.spec.unlink_transformer_serial')}:   
              <Paragraph className={styles.transformerParagraph}>
                {
                  unusedTransformerSerial.map(serial => `T${serial}`).join(' , ')
                }
              </Paragraph>
            </Space>
          </Row>
          <Divider/>
        </> :
        null
      }
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