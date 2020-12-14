import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, Descriptions, PageHeader, Row, Col, Tabs, Divider, Button } from 'antd'
import { RootState, WeatherPortfolio } from '../../@types'
import { useTranslation } from 'react-i18next'
import { AMap } from '../../components/AMap'
import { GoogleMap } from '../../components/GoogleMap'
import { getApiKey } from '../../services'
import styles from './Portfolio.module.scss'

const { TabPane } = Tabs

type PortfolioProps = {
  portfolio: WeatherPortfolio
  onBack: () => void
}

export const Portfolio: React.FC<PortfolioProps> = props => {
  const { portfolio, onBack } = props
  const { t } = useTranslation()
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)
  const [googleMapKey, setgoogleMapKey] = useState<string>()
  const [aMapKey, setaMapKey] = useState<string>()
  const [aMapWebKey, setaMapWebKey] = useState<string>()
  const [selectedMap, setselectedMap] = useState<string>(
    cognitoUser && cognitoUser.attributes.locale === 'zh-CN' ? 'aMap' : 'googleMap'
  )

  // 组件渲染后获取浏览器位置 及 获取地图服务api key
  useEffect(() => {
    getApiKey({}).then(data => {
      setgoogleMapKey(data.GOOGLE_MAP_API_KEY)
      setaMapKey(data.A_MAP_API_KEY)
      setaMapWebKey(data.A_MAP_WEB_API_KEY)
    })
  }, [])

  return (
    <Card>
      <PageHeader
        onBack={onBack}
        title={portfolio.name}
        subTitle={`${t('weatherManager.portfolio.createdAt')}: ${new Date(
          portfolio.createdAt * 1000
        ).toLocaleString()}`}
        extra={[]}
      >
        <Row gutter={15}>
          <Col span={12}>
            <Divider className={styles.divider} />
            <Descriptions column={2}>
              <Descriptions.Item label={t('weatherManager.portfolio.address')} span={2}>
                {portfolio.address}
              </Descriptions.Item>
              <Descriptions.Item label={t('weatherManager.portfolio.longitude')}>
                {portfolio.longitude}
              </Descriptions.Item>
              <Descriptions.Item label={t('weatherManager.portfolio.latitude')}>
                {portfolio.latitude}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Card hoverable>
              <Row align='middle'>
                <Col span={12}>{t('weatherManager.portfolio.meteonorm')}</Col>
                <Col span={12}>
                  <Row justify='end'>
                    <Button>{t('weatherManager.portfolio.src.gen')}</Button>
                  </Row>
                </Col>
              </Row>
            </Card>
            <br />
            <Card hoverable>
              <Row align='middle'>
                <Col span={12}>{t('weatherManager.portfolio.nasa')}</Col>
                <Col span={12}>
                  <Row justify='end'>
                    <Button>{t('weatherManager.portfolio.src.gen')}</Button>
                  </Row>
                </Col>
              </Row>
            </Card>
            <br />
            <Card hoverable>{t('weatherManager.portfolio.custom')}</Card>
          </Col>
          <Col span={12}>
            <Tabs
              defaultActiveKey={selectedMap}
              animated={false}
              type='card'
              onChange={activeKey => setselectedMap(activeKey)}
            >
              <TabPane tab={t(`project.map.aMap`)} key='aMap' forceRender>
                {aMapWebKey && aMapKey ? (
                  <AMap
                    mapPos={{ lon: portfolio.longitude, lat: portfolio.latitude }}
                    validated={true}
                    apiKey={aMapKey}
                    webApiKey={aMapWebKey}
                  />
                ) : null}
              </TabPane>
              <TabPane tab={t(`project.map.googleMap`)} key='googleMap' forceRender>
                {googleMapKey ? (
                  <GoogleMap
                    mapPos={{ lon: portfolio.longitude, lat: portfolio.latitude }}
                    validated={true}
                    apiKey={googleMapKey}
                  />
                ) : null}
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </PageHeader>
    </Card>
  )
}
