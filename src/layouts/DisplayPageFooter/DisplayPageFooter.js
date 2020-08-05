import React from 'react';
import { Layout, Divider } from 'antd';
import * as styles from './DisplayPageFooter.module.scss';
import logo from '../../assets/logo.png';

const {Footer} = Layout;

const DefaultFooter = (props) => {
  return (
    <Footer className={styles.footer} >
      {/* <a href="https://albedopowered.com" target="_blank" rel="noopener noreferrer">
        {t('footer.about')}
      </a>
      <Divider type="vertical" /> */}
      <img src = {logo} alt="logo" height="35px" display= 'inline-block'vertical-align='middle'/>
      <br/>
      <a href="https://albedowebdesign.com/terms" target="_blank" rel="noopener noreferrer" className={styles.imgPlace}>
        服务协议
      </a>
      <Divider type="vertical" />
      <a href="https://albedowebdesign.com/cookie" target="_blank" rel="noopener noreferrer" className={styles.imgPlace}>
        Cookie协议
      </a>
      <Divider type="vertical" />
      <a href="https://albedowebdesign.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.imgPlace}>
        隐私协议
      </a>
      <br/>
        Copyright &copy; 2020 Albedo Inc.
    </Footer>
  )
}

export default DefaultFooter;
