import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Row, Col, Card, Tabs, Button, Anchor } from 'antd'
import { useTranslation } from 'react-i18next'
import { UnusedCombiboxInverterCard } from '../../components/Card/UnusedCombiboxInverterCard/UnusedCombiboxInverterCard'
import { TransformerSpecCard } from '../../components/SpecCard/TransformerSpecCard/TransformerSpecCard'
import { PowerCabinetSpecCard } from '../../components/SpecCard/PowerCabinetSpecCard/PowerCabinetSpecCard'
import styles from './PowerGrid.module.scss'
import { addTransformer, addPowercabinet } from '../../store/action/index'
import { RootState } from '../../@types'

const { TabPane } = Tabs
const { Link } = Anchor

const PowerGrid = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setloading] = useState(false)
  const [editingTransformer, seteditingTransformer] = useState<number | undefined>()
  const [editingPowercabinet, seteditingPowercabinet] = useState<number | undefined>()
  const projectTransformers = useSelector((state: RootState) => state.project?.transformers || [])
  const projectPowercabinets = useSelector((state: RootState) => state.project?.powercabinets || [])

  return (
    <>
      <GlobalAlert />
      <Card title={t('project.powergrid.title')} headStyle={{ textAlign: 'center' }}>
        <UnusedCombiboxInverterCard />
        <Tabs defaultActiveKey='1' centered tabBarStyle={{ textAlign: 'center' }}>
          <TabPane tab={t('project.transformer.title')} key='1'>
            <Row gutter={[12, 12]}>
              <Col span={22}>
                {projectTransformers.map((transformer, transformerIndex) => (
                  <TransformerSpecCard
                    transformerIndex={transformerIndex}
                    id={`trans${transformerIndex}`}
                    key={transformerIndex}
                    editingTransformer={editingTransformer}
                    seteditingTransformer={seteditingTransformer}
                    {...transformer}
                  />
                ))}
                <Button
                  className={styles.addSpecTransformer}
                  loading={loading}
                  disabled={editingTransformer !== null}
                  block
                  type='dashed'
                  onClick={() => {
                    seteditingTransformer(projectTransformers.length)
                    setloading(true)
                    setTimeout(() => {
                      dispatch(addTransformer())
                      setloading(false)
                      document
                        .getElementById(`trans${projectTransformers.length}`)
                        ?.scrollIntoView(false)
                    }, 500)
                  }}
                >
                  {t('project.add.transformer')}
                </Button>
              </Col>

              <Col span={2}>
                <Anchor offsetTop={70}>
                  {projectTransformers.map((transformer, transformerIndex) => (
                    <Link
                      key={`anchor-trans${transformerIndex}`}
                      href={`#trans${transformerIndex}`}
                      title={`T${transformer.transformer_serial_num}`}
                    />
                  ))}
                </Anchor>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={t('project.powerCabinet.title')} key='2'>
            <Row gutter={[12, 12]}>
              <Col span={22}>
                {projectPowercabinets.map((powercabinet, powercabinetIndex) => (
                  <PowerCabinetSpecCard
                    powercabinetIndex={powercabinetIndex}
                    id={`cabinet${powercabinetIndex}`}
                    key={powercabinetIndex}
                    editingPowercabinet={editingPowercabinet}
                    seteditingPowercabinet={seteditingPowercabinet}
                    {...powercabinet}
                  />
                ))}
                <Button
                  className={styles.addSpecPowercabinet}
                  loading={loading}
                  disabled={editingPowercabinet !== null}
                  block
                  type='dashed'
                  onClick={() => {
                    seteditingPowercabinet(projectPowercabinets.length)
                    setloading(true)
                    setTimeout(() => {
                      dispatch(addPowercabinet())
                      setloading(false)
                      document
                        .getElementById(`cabinet${projectPowercabinets.length}`)
                        ?.scrollIntoView(false)
                    }, 500)
                  }}
                >
                  {t('project.add.powercabinet')}
                </Button>
              </Col>

              <Col span={2}>
                <Anchor offsetTop={70}>
                  {projectPowercabinets.map((powercabinet, powercabinetIndex) => (
                    <Link
                      key={`anchor-cabinet${powercabinetIndex}`}
                      href={`#cabinet${powercabinetIndex}`}
                      title={`P${powercabinet.powercabinet_serial_num}`}
                    />
                  ))}
                </Anchor>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </>
  )
}

export default PowerGrid
