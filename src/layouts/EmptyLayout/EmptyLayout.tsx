import React from 'react'
import { Layout, Row, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../@types'
import logo from '../../assets/logo-no-text.png'
import PrivateHeader from '../PrivateHeader/PrivateHeader'
import PublicHeader from '../PublicHeader/PublicHeader'
import DefaultFooter from '../Footer/DefaultFooter'
import EmailSupport from '../../components/TechSupport/EmailSupport'
import styles from './EmptyLayout.module.scss'

const { Sider, Content } = Layout
const { Footer } = Layout

const ProjectLayout: React.FC = () => {
  const { t } = useTranslation()
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)

  return (
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
        <div className={styles.spin}>
          <Spin size="large" />
        </div>
      </Sider>
      <Layout className={styles.main}>
        {cognitoUser ? <PrivateHeader /> : <PublicHeader />}
        <Content className={styles.content}></Content>
        <Footer className={styles.footer}>
          <DefaultFooter />
        </Footer>
      </Layout>
    </Layout>
  )
}

export default ProjectLayout
