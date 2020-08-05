import React from 'react';
import { Layout, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import * as styles from './DefaultFooter.module.scss';

const {Footer} = Layout;

const DefaultFooter = (props) => {
  const { t } = useTranslation();
  return (
    <Footer className={styles.footer}>
      {/* <a href="https://albedopowered.com" target="_blank" rel="noopener noreferrer">
        {t('footer.about')}
      </a>
      <Divider type="vertical" /> */}
      <a href="https://albedowebdesign.com/terms" target="_blank" rel="noopener noreferrer" className={styles.imgPlace}>
        {t('footer.term-of-use')}
      </a>
      <Divider type="vertical" />
      <a href="https://albedowebdesign.com/cookie" target="_blank" rel="noopener noreferrer" className={styles.imgPlace}>
        {t('footer.cookie')}
      </a>
      <Divider type="vertical" />
      <a href="https://albedowebdesign.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.imgPlace}>
        {t('footer.privacy')}
      </a>
      <br/>
        Copyright &copy; 2020 Albedo Inc.
    </Footer>
  )
}

export default DefaultFooter;
