import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LoadingOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import {
  Card,
  Descriptions,
  PageHeader,
  Row,
  Col,
  Tabs,
  Divider,
  Button,
  Badge,
  Spin,
  Tooltip,
  Space,
} from 'antd'
import promiseRetry from 'promise-retry'
import { Params, RootState, WeatherPortfolio } from '../../@types'
import { useTranslation } from 'react-i18next'
import { AMap } from '../../components/AMap'
import { GoogleMap } from '../../components/GoogleMap'
import { TmyProcedure } from './TmyProcedure'
import { getApiKey, getWeatherPortfolioSingle, createNASA } from '../../services'
import styles from './index.module.scss'
import { m2other } from '../../utils/unitConverter'
import { useHistory, useParams } from 'react-router-dom'
import { GHIViz } from './GHIViz'

const { TabPane } = Tabs

const WeatherPortfolioFC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const unit = useSelector((state: RootState) => state.unit.unit)
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)
  const { portfolioID } = useParams<Params>()
  const [portfolio, setportfolio] = useState<WeatherPortfolio | undefined>()
  const [googleMapKey, setgoogleMapKey] = useState<string>()
  const [waitMeteonorm, setwaitMeteonorm] = useState(true)
  const [nasaLoading, setnasaLoading] = useState(false)
  const [aMapKey, setaMapKey] = useState<string>()
  const [aMapWebKey, setaMapWebKey] = useState<string>()
  const [selectedMap, setselectedMap] = useState<string>(
    cognitoUser && cognitoUser.attributes.locale === 'zh-CN' ? 'aMap' : 'googleMap'
  )

  const [extraChartData, setextraChartData] = useState<
    { month: number; src: string; value: number }[]
  >([])
  const [extraTableData, setextraTableData] = useState<Record<string, number[]>>({})

  const genExtraChartData = (data: { month: number; src: string; value: number }[]) => {
    setextraChartData(data)
  }

  const genExtraTableData = (data: Record<string, number[]>) => {
    setextraTableData(data)
  }

  const createNASAData = () => {
    if (!portfolioID) return
    setnasaLoading(true)
    createNASA({ portfolioID: portfolioID })
      .then(res => {
        setportfolio(res)
        setnasaLoading(false)
      })
      .catch(err => {
        console.log(err)
        setnasaLoading(false)
      })
  }

  // 组件渲染后获取浏览器位置 及 获取地图服务api key
  useEffect(() => {
    getApiKey({}).then(data => {
      setgoogleMapKey(data.GOOGLE_MAP_API_KEY)
      setaMapKey(data.A_MAP_API_KEY)
      setaMapWebKey(data.A_MAP_WEB_API_KEY)
    })
  }, [])

  useEffect(() => {
    portfolioID &&
      promiseRetry(
        retry => {
          return getWeatherPortfolioSingle({ portfolioID: portfolioID }).then(res => {
            if (!res.meteonorm_src) {
              retry(null)
            } else {
              setwaitMeteonorm(false)
              return res
            }
          })
        },
        { minTimeout: 10000 }
      )
        .then(res => res && setportfolio(res))
        .catch(() => history.goBack())
  }, [history, portfolioID])

  return (
    <Card>
      <Spin
        indicator={<LoadingOutlined />}
        spinning={waitMeteonorm}
        tip={t('weatherManager.portfolio.waitMeteonorm')}
      >
        <PageHeader
          onBack={() => history.goBack()}
          title={portfolio?.name ?? '-'}
          subTitle={`${t('weatherManager.portfolio.createdAt')}: ${
            portfolio ? new Date(portfolio.createdAt * 1000).toLocaleString() : '-'
          }`}
          extra={[]}
        />
        <Row gutter={15}>
          <Col span={12}>
            <Divider className={styles.divider} />
            <Descriptions column={3}>
              <Descriptions.Item label={t('weatherManager.portfolio.address')} span={3}>
                {portfolio?.address}
              </Descriptions.Item>
              <Descriptions.Item label={t('weatherManager.portfolio.longitude')}>
                {portfolio?.longitude}
              </Descriptions.Item>
              <Descriptions.Item label={t('weatherManager.portfolio.latitude')}>
                {portfolio?.latitude}
              </Descriptions.Item>
              <Descriptions.Item label={t('weatherManager.portfolio.altitude')}>
                {m2other(unit, portfolio?.altitude ?? 0)} {unit}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Card hoverable>
              <Row align='middle'>
                <Col span={12}>{t('weatherManager.portfolio.meteonorm')}</Col>
                <Col span={12}>
                  <Row justify='end'>
                    {portfolio?.meteonorm_src ? (
                      <Space>
                        <Badge status='success' text={t('weatherManager.portfolio.src.yes')} />
                        <Tooltip title={t('weatherManager.portfolio.src.download.meteonorm')}>
                          <Button type='link' disabled icon={<CloudDownloadOutlined />} />
                        </Tooltip>
                      </Space>
                    ) : (
                      <Badge status='default' text={t('weatherManager.portfolio.src.no')} />
                    )}
                  </Row>
                </Col>
              </Row>
            </Card>
            {portfolio?.mode === 'processed' ? (
              <>
                <br />
                <Card hoverable>
                  <Row align='middle'>
                    <Col span={12}>{t('weatherManager.portfolio.nasa')}</Col>
                    <Col span={12}>
                      <Row justify='end'>
                        {portfolio?.nasa_src ? (
                          <Space>
                            <Badge status='success' text={t('weatherManager.portfolio.src.yes')} />
                            <Tooltip title={t('weatherManager.portfolio.src.download')}>
                              <Button type='link' icon={<CloudDownloadOutlined />} />
                            </Tooltip>
                          </Space>
                        ) : (
                          <Button onClick={createNASAData} loading={nasaLoading}>
                            {t('weatherManager.portfolio.src.gen')}
                          </Button>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </>
            ) : null}
            <br />
            <Card hoverable>
              <Row align='middle'>
                <Col span={12}>{t('weatherManager.portfolio.custom')}</Col>
                <Col span={12}>
                  <Row justify='end'>
                    {portfolio?.custom_src ? (
                      <Space>
                        <Badge status='success' text={t('weatherManager.portfolio.src.yes')} />
                        <Tooltip title={t('weatherManager.portfolio.src.download')}>
                          <Button type='link' icon={<CloudDownloadOutlined />} />
                        </Tooltip>
                      </Space>
                    ) : (
                      <Badge status='default' text={t('weatherManager.portfolio.src.no')} />
                    )}
                  </Row>
                </Col>
              </Row>
            </Card>
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
                    mapPos={{ lon: portfolio?.longitude ?? 0, lat: portfolio?.latitude ?? 0 }}
                    validated={true}
                    apiKey={aMapKey}
                    webApiKey={aMapWebKey}
                  />
                ) : null}
              </TabPane>
              <TabPane tab={t(`project.map.googleMap`)} key='googleMap' forceRender>
                {googleMapKey ? (
                  <GoogleMap
                    mapPos={{ lon: portfolio?.longitude ?? 0, lat: portfolio?.latitude ?? 0 }}
                    validated={true}
                    apiKey={googleMapKey}
                  />
                ) : null}
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <Divider />
        {portfolio ? (
          <GHIViz
            portfolio={portfolio}
            extraChartData={extraChartData}
            extraTableData={extraTableData}
          />
        ) : null}
        <Divider className={styles.nextsect} />
        <Row>
          {portfolio && (
            <TmyProcedure
              portfolio={portfolio}
              setportfolio={(p: WeatherPortfolio) => setportfolio(p)}
              initStep={portfolio?.custom_src ? 2 : 0}
              genExtraChartData={genExtraChartData}
              genExtraTableData={genExtraTableData}
            />
          )}
        </Row>
      </Spin>
    </Card>
  )
}

export default WeatherPortfolioFC
