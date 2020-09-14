import React from 'react'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Row, Col, Card, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'

const { TabPane } = Tabs

const rowGutter = [12, 12]

const PowerGrid = () => {
  const { t } = useTranslation()

  return (
    <div>
      <GlobalAlert/>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Card title={t('project.powergrid.title')} headStyle={{textAlign: 'center'}}>
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab={t('project.transformer.title')} key="1">
                
              </TabPane>
              <TabPane tab={t('project.powerCabinet.title')} key="2">

              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PowerGrid