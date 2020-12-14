import React, { useState, useEffect } from 'react'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Spin, Card, Row, Col, Menu } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { InvestTab } from './tabs/InvestTab'
import { CommercialEquipmentsTab } from './tabs/CommercialEquipmentsTab'
import { GainTab } from './tabs/GainTab'
import { ProdTab } from './tabs/ProdTab'
import { LossTab } from './tabs/LossTab'
import { IrrTab } from './tabs/IrrTab'
import { MultiPVDetailTable } from '../../components/Table/PVDetailTable/MultiPVDetailTable'
import { MultiInverterDetailTable } from '../../components/Table/InverterDetailTable/MultiInverterDetailTable'
import { EmissionReductionCard } from '../../components/Card/EmissionReductionCard/EmissionReductionCard'
import { ReportHeadDescription } from '../../components/Descriptions/ReportHeadDescription'
import { saveProject, genReport } from '../../services'
import { setReportData, setBuildingReGenReport } from '../../store/action/index'
import styles from './Report.module.scss'
import { Params, RootState } from '../../@types'

const Report = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { projectID, buildingID } = useParams<Params>()
  const projectData = useSelector((state: RootState) => state.project)
  const reportData = useSelector((state: RootState) => state.report)
  const [loading, setloading] = useState(true)
  const [menuKey, setmenuKey] = useState('1')

  useEffect(() => {
    setloading(true)
    if (
      !projectData ||
      !buildingID ||
      projectData.p_loss_soiling === undefined ||
      projectData.p_loss_soiling === null
    ) {
      history.push({
        pathname: `/project/${projectID}/params`,
        state: { buildingID: buildingID },
      })
    } else {
      if (
        (buildingID === 'overview' && projectData.reGenReport) ||
        (buildingID !== 'overview' &&
          projectData.buildings.find(b => b.buildingID === buildingID)?.reGenReport)
      ) {
        saveProject({ projectID, values: projectData })
          .then(() => {
            genReport({ projectID, buildingID }).then(res => {
              dispatch(setReportData({ buildingID, data: res }))
              dispatch(setBuildingReGenReport({ buildingID, reGenReport: false }))
              setloading(false)
            })
          })
          .catch(() => {
            setloading(false)
            history.push(`/project/${projectID}/dashboard`)
          })
      } else {
        setloading(false)
      }
    }
  }, [buildingID, dispatch, history, projectData, projectID])

  if (!buildingID) return null

  let component: React.ReactNode
  switch (menuKey) {
    case '9':
      component = <CommercialEquipmentsTab />
      break
    case '8':
      component = (
        <Card bordered={false}>
          <EmissionReductionCard buildingID={buildingID} />
        </Card>
      )
      break
    case '7':
      component = (
        <Card bordered={false}>
          <MultiInverterDetailTable buildingID={buildingID} />
        </Card>
      )
      break
    case '6':
      component = (
        <Card bordered={false}>
          <MultiPVDetailTable buildingID={buildingID} />
        </Card>
      )
      break
    case '5':
      component = <GainTab buildingID={buildingID} />
      break
    case '4':
      component = <InvestTab buildingID={buildingID} />
      break
    case '3':
      component = <LossTab buildingID={buildingID} />
      break
    case '2':
      component = <ProdTab buildingID={buildingID} />
      break
    case '1':
    default:
      component = <IrrTab buildingID={buildingID} />
  }

  return (
    <Spin indicator={<LoadingOutlined spin />} size='large' spinning={loading}>
      {loading || !reportData[buildingID] ? (
        <Card loading />
      ) : (
        <>
          <GlobalAlert />
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <ReportHeadDescription buildingID={buildingID} />
            </Col>
          </Row>
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <Card bodyStyle={{ padding: 0 }} loading={loading}>
                <Menu
                  className={styles.menu}
                  onClick={e => setmenuKey(e.key.toString())}
                  selectedKeys={[menuKey]}
                  mode='horizontal'
                >
                  <Menu.Item key='1'>{t('report.irrTable')}</Menu.Item>
                  <Menu.Item key='2'>{t('report.acPowerTable')}</Menu.Item>
                  <Menu.Item key='3'>{t('report.lossTable')}</Menu.Item>
                  {buildingID !== 'overview' ? (
                    <Menu.Item key='4'>{t('report.investmentTable')}</Menu.Item>
                  ) : null}
                  {buildingID !== 'overview' ? (
                    <Menu.Item key='5'>{t('report.gainTable')}</Menu.Item>
                  ) : null}
                  {buildingID === 'overview' ? (
                    <Menu.Item key='9'>{t('report.commercialEquipmentTable')}</Menu.Item>
                  ) : null}
                  <Menu.Item key='6'>{t('report.pvDetail')}</Menu.Item>
                  <Menu.Item key='7'>{t('report.inverterDetail')}</Menu.Item>
                  <Menu.Item key='8'>{t('report.emissionReduction')}</Menu.Item>
                </Menu>
                {component}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Spin>
  )
}

export default Report
