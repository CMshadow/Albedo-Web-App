import React, { useState, useEffect } from 'react'
import { Button, Layout, Menu, Space, Row, Col } from 'antd'

import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import logo from '../../assets/logo.png'
import styles from './DisplayPageHeader.module.scss'
import { RootState } from '../../@types'

const { Header } = Layout

const DisplayPageHeader: React.FC = () => {
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
        <Col className={styles.logo} xs={6} sm={4}>
          <Link to='/cn'>
            <img src={logo} alt='logo' height='45px' />
          </Link>
        </Col>
        <Col xs={6} sm={8}>
          <Menu className={styles.nav} mode='horizontal' selectedKeys={[navKey]}>
            <Menu.Item key='home'>
              <Link to='/cn'>产品介绍</Link>
            </Menu.Item>
            <Menu.Item key='tutorial'>
              <Link to='/cn/tutorial'>视频教程</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col className={styles.right} xs={12}>
          {cognitoUser ? (
            <Button
              type='primary'
              href='https://albedowebdesign-1302836232.cos-website.ap-shanghai.myqcloud.com/dashboard'
            >
              进入操作台
            </Button>
          ) : (
            <Space>
              <Button
                type='primary'
                href='https://albedowebdesign-1302836232.cos-website.ap-shanghai.myqcloud.com/user/register'
              >
                免费注册
              </Button>
              <Button href='https://albedowebdesign-1302836232.cos-website.ap-shanghai.myqcloud.com/user/login'>
                账户登录
              </Button>
            </Space>
          )}
        </Col>
      </Row>
    </Header>
  )
}

export default DisplayPageHeader
