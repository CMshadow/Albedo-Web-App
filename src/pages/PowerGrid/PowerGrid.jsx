import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Row, Col, Card, Tabs, Button, Anchor } from 'antd'
import { useTranslation } from 'react-i18next'
import { UnusedCombiboxInverterCard } from '../../components/Card/UnusedCombiboxInverterCard/UnusedCombiboxInverterCard'
import { TransformerSpecCard } from '../../components/SpecCard/TransformerSpecCard/TransformerSpecCard'
import * as styles from './PowerGrid.module.scss'
import { addTransformer } from '../../store/action/index'

const { TabPane } = Tabs
const { Link } = Anchor
const rowGutter = [12, 12]

const PowerGrid = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setloading] = useState(false)
  const [editingTransformer, seteditingTransformer] = useState(null)
  const projectTransformers = useSelector(state => state.project.transformers) || []

  return (
    <>
      <GlobalAlert/>
      <Card title={t('project.powergrid.title')} headStyle={{textAlign: 'center'}}>
        <UnusedCombiboxInverterCard/>
        <Tabs defaultActiveKey="1" centered tabBarStyle={{textAlign: 'center'}}>
          <TabPane tab={t('project.transformer.title')} key="1">
            <Row gutter={rowGutter}>
              <Col span={22}>
                {
                  projectTransformers.map((transformer, transformerIndex) =>
                    <TransformerSpecCard 
                      transformerIndex={transformerIndex}
                      id={`trans${transformerIndex}`}
                      key={transformerIndex}
                      editingTransformer={editingTransformer}
                      seteditingTransformer={seteditingTransformer}
                      {...transformer}
                    />
                  )
                }
                <Button
                  className={styles.addSpec}
                  loading={loading}
                  disabled={editingTransformer !== null}
                  block
                  type="dashed"
                  onClick={() => {
                    seteditingTransformer(projectTransformers.length)
                    setloading(true)
                    setTimeout(() => {
                      dispatch(addTransformer())
                      setloading(false)
                      document.getElementById(`trans${projectTransformers.length - 1}`).scrollIntoView(true)
                    }, 500)
                  }}
                >
                  {t('project.add.transformer')}
                </Button>
              </Col>

              <Col span={2}>
                <Anchor offsetTop={70}>
                {
                  projectTransformers.map((transformer, transformerIndex) =>
                    <Link 
                      key={`anchor${transformerIndex}`} 
                      href={`#trans${transformerIndex}`} 
                      title={`T${transformer.transformer_serial_num}`} 
                    />  
                  )
                }
                </Anchor>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={t('project.powerCabinet.title')} key="2">
            <Button
              className={styles.addSpec}
              loading={loading}
              block
              type="dashed"
              onClick={() => {
                setloading(true)
                setTimeout(() => {
                  setloading(false)
                }, 500)
              }}
            >
              {t('project.add.powercabinet')}
            </Button>
          </TabPane>
        </Tabs>
      </Card>
    </>
  )
}

export default PowerGrid