import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, Row, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import logo from '../../assets/logo.png';
import * as styles from './EnDisplayPageHeader.module.scss'

const {Header} = Layout;

const EnDisplayPageHeader = () => {
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
          <Link to="/en"><img src={logo} alt="logo" height='45px'/></Link>
        </Row>
        <Menu className={styles.nav} mode="horizontal" selectedKeys={[navKey]}>
          <Menu.Item key="home">
            <Link to="/en">Product</Link>
          </Menu.Item>
          <Menu.Item key="tutorial">
            <Link to="/Entutorial">Tutorial</Link>
          </Menu.Item>
        </Menu>
        <Row className={styles.right} justify='end' align='middle'>
          {
            cognitoUser ?
            <Button type='primary'><Link to='/dashboard'>Dashboard</Link></Button> :
            <Space>
              <Button type='primary'><Link to='/user/register'>Free Register</Link></Button>
              <Button ><Link to='/user/login'>Login</Link></Button>
            </Space>
          }
        </Row>
      </Row>
    </Header>
  )
}

export default EnDisplayPageHeader;
