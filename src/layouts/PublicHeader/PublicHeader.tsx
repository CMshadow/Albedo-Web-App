import React from 'react'
import { Layout, Row, Button, Space } from 'antd'
import SelectLang from '../../components/SelectLang/index'
import styles from './PublicHeader.module.scss'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const { Header } = Layout

const PublicHeader: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Header className={styles.header}>
      <Row className={styles.right}>
        <Space className={styles.space} size='large'>
          <Button type='primary' ghost size='large' onClick={() => history.push('/user/login')}>
            {t('header.login')}
          </Button>
          <Button size='large' onClick={() => history.push('/user/signup')}>
            {t('header.signup')}
          </Button>
        </Space>
        <div className={styles.item}>
          <SelectLang className={styles.item} />
        </div>
      </Row>
    </Header>
  )
}

export default PublicHeader
