import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Layout, Menu, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  setPVData,
  setOfficialPVData,
  setInverterData,
  setOfficialInverterData,
  releaseProjectData,
} from '../../store/action/index'
import logo from '../../assets/logo-no-text.png'
import PrivateHeader from '../PrivateHeader/PrivateHeader'
import PublicHeader from '../PublicHeader/PublicHeader'
import DefaultFooter from '../Footer/DefaultFooter'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import EmailSupport from '../../components/TechSupport/EmailSupport'
import { getPV, getOfficialPV } from '../../pages/PVTable/service'
import { getInverter, getOfficialInverter } from '../../pages/InverterTable/service'
import styles from './BasicLayout.module.scss'
import { RootState } from '../../@types'

const { Sider, Content } = Layout
const { Footer } = Layout

const BasicLayout = ({ children }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  const selectMenu = history.location.pathname.split('/')[1]

  // 释放redux中存储的项目数据
  useEffect(() => {
    if (!cognitoUser) return
    const fetchData = async () => {
      const fetchPromises = []
      fetchPromises.push(
        dispatch(getPV())
          .then(res => dispatch(setPVData(res)))
          .catch(err => history.push('/dashboard'))
      )
      fetchPromises.push(
        dispatch(getOfficialPV(cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US'))
          .then(res => dispatch(setOfficialPVData(res)))
          .catch(err => history.push('/dashboard'))
      )
      fetchPromises.push(
        dispatch(getInverter())
          .then(res => dispatch(setInverterData(res)))
          .catch(err => history.push('/dashboard'))
      )
      fetchPromises.push(
        dispatch(getOfficialInverter(cognitoUser.attributes.locale === 'zh-CN' ? 'CN' : 'US'))
          .then(res => dispatch(setOfficialInverterData(res)))
          .catch(err => history.push('/dashboard'))
      )
      await Promise.all(fetchPromises)
    }

    dispatch(releaseProjectData())
    fetchData()
  }, [cognitoUser, dispatch, history])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={t('user.logo.welcome')} />
        <title>{t('sider.company')}</title>
      </Helmet>
      <Layout>
        <EmailSupport />
        <Sider width={250} className={styles.sider}>
          <Row className={styles.title} align="middle" justify="center">
            <img alt="logo" className={styles.logo} src={logo} />
            <div>
              <h1>{t('sider.company')}</h1>
              <h4>
                {t('sider.edition')}
                {process.env.REACT_APP_VERSION}
              </h4>
            </div>
          </Row>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectMenu]}
            onSelect={({ item, key }) => history.push(`/${key}`)}
          >
            <Menu.Item key="dashboard" className={styles.menuItem}>
              {t('sider.menu.project')}
            </Menu.Item>
            <Menu.Item key="pv" className={styles.menuItem}>
              {t('sider.menu.pv')}
            </Menu.Item>
            <Menu.Item key="inverter" className={styles.menuItem}>
              {t('sider.menu.inverter')}
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className={styles.main}>
          {cognitoUser ? <PrivateHeader /> : <PublicHeader />}
          <Content className={styles.content}>
            <GlobalAlert />
            {children}
          </Content>
          <Footer className={styles.footer}>
            <DefaultFooter />
          </Footer>
        </Layout>
      </Layout>
    </>
  )
}

export default BasicLayout
