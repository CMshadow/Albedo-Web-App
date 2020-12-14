import React from 'react'
import { Card, Collapse, Typography, Row, Space, Divider } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  findUnusedTransformerSerial,
  findUnusedCombiboxSerial,
  findUnusedInverterSerial,
} from '../../../utils/checkUnusedEquipments'
import styles from './UnusedCombiboxInverterCard.module.scss'
import { Building, RootState } from '../../../@types'

const { Panel } = Collapse
const { Paragraph } = Typography

export const UnusedCombiboxInverterCard = () => {
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)
  const allPowercabinets = projectData?.powercabinets || []
  const allTransformers = projectData?.transformers || []

  const unusedTransformerSerial = findUnusedTransformerSerial(allPowercabinets, allTransformers)

  const genUnusedCombiboxInverter = (building: Building) => {
    const unusedCombiboxSerial = findUnusedCombiboxSerial(
      allTransformers,
      allPowercabinets,
      building
    )
    const unusedInverterSerial = findUnusedInverterSerial(
      allTransformers,
      allPowercabinets,
      building
    )

    return (
      <>
        {unusedCombiboxSerial.length > 0 ? (
          <Row>
            <Space>
              {t('project.spec.unlink_combibox_serial')}:
              <Paragraph className={styles.combiboxParagraph}>
                {unusedCombiboxSerial.map(serial => `C${serial.split('-')[1]}`).join(' , ')}
              </Paragraph>
            </Space>
          </Row>
        ) : null}
        {unusedInverterSerial.length > 0 ? (
          <Row>
            <Space>
              {t('project.spec.unlink_inverter_serial')}:
              <Paragraph className={styles.inverterParagraph}>
                {unusedInverterSerial
                  .map(serial => `S${serial.split('-').slice(-2).join('-')}`)
                  .join(' , ')}
              </Paragraph>
            </Space>
          </Row>
        ) : null}
      </>
    )
  }

  return (
    <Card
      className={styles.card}
      title={t('project.spec.unusedEquipments')}
      headStyle={{ textAlign: 'center' }}
      bordered
    >
      {unusedTransformerSerial.length > 0 ? (
        <>
          <Row>
            <Space>
              {t('project.spec.unlink_transformer_serial')}:
              <Paragraph className={styles.transformerParagraph}>
                {unusedTransformerSerial.map(serial => `T${serial}`).join(' , ')}
              </Paragraph>
            </Space>
          </Row>
          <Divider />
        </>
      ) : null}
      <Collapse
        ghost
        defaultActiveKey={projectData?.buildings.map(building => building.buildingID)}
      >
        {projectData?.buildings.map(building => (
          <Panel header={building.buildingName} key={building.buildingID} forceRender>
            {genUnusedCombiboxInverter(building)}
          </Panel>
        ))}
      </Collapse>
    </Card>
  )
}
