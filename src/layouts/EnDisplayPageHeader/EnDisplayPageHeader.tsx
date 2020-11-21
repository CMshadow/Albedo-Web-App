import React, { useState, useEffect } from 'react'
import { Button, Layout, Menu, Row, Space, Col } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import logo from '../../assets/logo.png'
import styles from './EnDisplayPageHeader.module.scss'
import { RootState } from '../../@types'

const { Header } = Layout

const EnDisplayPageHeader: React.FC = () => {
  const [headerClass, setheaderClass] = useState(styles.headerInFixed)
  const location = useLocation()
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)

  const navKey = location.pathname.split('/')[2] === 'tutorial' ? 'tutorial' : 'home'

  const handleScroll = () => {
    if (document.documentElement.scrollTop > 0) {
      setheaderClass(styles.headerInScroll)
    } else {
      setheaderClass(styles.headerInFixed)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Header className={headerClass}>
      <Row>
        <Col className={styles.logo} xs={8} sm={6}>
          <Link to='/en'>
            <img src={logo} alt='logo' height='45px' />
          </Link>
        </Col>
        <Col xs={4} sm={6}>
          <Menu className={styles.nav} mode='horizontal' selectedKeys={[navKey]}>
            <Menu.Item key='home'>
              <Link to='/en'>Product</Link>
            </Menu.Item>
            <Menu.Item key='tutorial'>
              <Link to='/en/tutorial'>Tutorial</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col className={styles.right} xs={12}>
          {cognitoUser ? (
            <Button type='primary'>
              <Link to='/dashboard'>Dashboard</Link>
            </Button>
          ) : (
            <Space>
              <Button type='primary'>
                <Link to='/user/register'>Free Register</Link>
              </Button>
              <Button>
                <Link to='/user/login'>Login</Link>
              </Button>
            </Space>
          )}
        </Col>
      </Row>
    </Header>
  )
}

export default EnDisplayPageHeader
