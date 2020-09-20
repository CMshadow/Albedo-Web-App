import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Row, Col, Card, Tabs, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { UnusedCombiboxInverterCard } from '../../components/Card/UnusedCombiboxInverterCard/UnusedCombiboxInverterCard'
import { TransformerSpecCard } from '../../components/SpecCard/TransformerSpecCard/TransformerSpecCard'
import * as styles from './PowerGrid.module.scss'
import { addTransformer } from '../../store/action/index'

const { TabPane } = Tabs

const rowGutter = [12, 12]

const PowerGrid = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setloading] = useState(false)
  const [editTransformer, seteditTransformer] = useState(false)
  const projectTransformers = useSelector(state => state.project.transformers) || []

  return (
    <div>
      <GlobalAlert/>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Card title={t('project.powergrid.title')} headStyle={{textAlign: 'center'}}>
            <UnusedCombiboxInverterCard/>
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab={t('project.transformer.title')} key="1">
                {
                  projectTransformers.map((transformer, transformerIndex) =>
                    <TransformerSpecCard 
                      transformerIndex={transformerIndex}
                      key={transformerIndex}
                      disabled={editTransformer}
                      seteditTransformer={seteditTransformer}
                      {...transformer}
                    />
                  )
                }
                <Button
                  className={styles.addSpec}
                  loading={loading}
                  block
                  type="dashed"
                  onClick={() => {
                    setloading(true)
                    setTimeout(() => {
                      dispatch(addTransformer())
                      setloading(false)
                    }, 500)
                  }}
                >
                  {t('project.add.transformer')}
                </Button>
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
        </Col>
      </Row>
    </div>
  )
}

export default PowerGrid