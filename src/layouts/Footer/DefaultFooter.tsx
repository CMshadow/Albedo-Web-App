import React from 'react'
import { Layout, Divider, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import styles from './DefaultFooter.module.scss'

const { Link, Text } = Typography
const { Footer } = Layout

const DefaultFooter: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Footer className={styles.footer}>
      <Link href='albedox.com/terms' target='_blank'>
        {t('footer.term-of-use')}
      </Link>
      <Divider type='vertical' />
      <Link href='albedox.com/cookie' target='_blank'>
        {t('footer.cookie')}
      </Link>
      <Divider type='vertical' />
      <Link href='albedox.com/privacy' target='_blank'>
        {t('footer.privacy')}
      </Link>
      <br />
      <Text>Copyright &copy; 2020 Albedo Inc.</Text>
    </Footer>
  )
}

export default DefaultFooter
