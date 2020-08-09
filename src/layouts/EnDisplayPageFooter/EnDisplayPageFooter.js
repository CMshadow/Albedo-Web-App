import React from 'react';
import { Layout, Divider, Typography } from 'antd';
import * as styles from './EnDisplayPageFooter.module.scss';
import logo from '../../assets/logo.png';

const { Link, Text } = Typography
const { Footer } = Layout

const DefaultFooter = (props) => {
  return (
    <Footer className={styles.footer}>
      <img src = {logo} alt="logo" height="35px" display= 'inline-block'vertical-align='middle'/>
      <br/>
      <Link href="/terms" target="_blank">
        Term of Use
      </Link>
      <Divider type="vertical" />
      <Link href="/cookie" target="_blank">
        Cookie
      </Link>
      <Divider type="vertical" />
      <Link href="/privacy" target="_blank">
        Privacy
      </Link>
      <br/>
      <Text>Copyright &copy; 2020 Albedo Inc.</Text>
    </Footer>
  )
}

export default DefaultFooter;
