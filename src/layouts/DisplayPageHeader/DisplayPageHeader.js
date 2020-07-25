import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Row, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import logo from '../../assets/logo.png';
import * as styles from './DisplayPageHeader.module.scss'

const {Header} = Layout;

const DisplayPageHeader = () => {
  const [headerClass, setheaderClass] = useState(styles.headerInFixed)
  const location = useLocation()
  const cognitoUser = useSelector(state => state.auth.cognitoUser)

  const navKey = location.pathname === 'tutorial' ? 'tutorial' : 'home'

  const handleScroll=() =>{
    if (document.documentElement.scrollTop > 0) {
      setheaderClass(styles.headerInScroll)
    } else {
      setheaderClass(styles.headerInFixed)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return(
    <Header className={headerClass}>
      <Row>
        <Row className={styles.logo} align='middle'>
          <Link to="/cn"><img src={logo} alt="logo" height='45px'/></Link>
        </Row>
        <Menu className={styles.nav} mode="horizontal" selectedKeys={[navKey]}>
          <Menu.Item key="home">
            <Link to="/cn">产品介绍</Link>
          </Menu.Item>
          <Menu.Item key="tutorial">
            <Link to="/tutorial">视频教程</Link>
          </Menu.Item>
        </Menu>
        <Row className={styles.right} justify='end' align='middle'>
          {
            cognitoUser ?
            <Button type='primary'><Link to='/dashboard'>进入操作台</Link></Button> :
            <Space>
              <Button type='primary'><Link to='/user/register'>免费注册账户</Link></Button>
              <Button ><Link to='/user/login'>账户登录</Link></Button>
            </Space>
          }
        </Row>
      </Row>
    </Header>
  )
}

export default DisplayPageHeader;
