import React from 'react'
import { Layout, Typography, Divider, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'
import * as styles from './FakeParking.module.scss'
import qrcorde from '../../assets/qrcode.png'
import car from '../../assets/car.png'
import p from '../../assets/p.png'
import moment from 'moment'
const { Content } = Layout
const Text = Typography.Text

const FakeParking = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content='Provided by Parking Boss'/>
        <title>Smart Decal</title>
      </Helmet>
      <Layout>
        <Content className={styles.body}>
          <h1 className={styles.h1}>ACTIVE SMART DECAL</h1>
          <div className={styles.content}>
            <Text className={styles.secondline}>RED SMART DECAL (RESIDENT)</Text>
            <Row align='middle' className={styles.num}>
              <img src={qrcorde} className={styles.qrcode} alt=''/>
              <Text className={styles.numstring}>1551138</Text>
            </Row>
            <Divider className={styles.divider1}/>
            <Row align='middle'>
              <Col span={12}>
                <Row align='middle'>
                  <img src={car} className={styles.icon} alt=''/>
                  <Text className={styles.text}>NA</Text>
                </Row>
              </Col>
              <Col span={12}>
                <Row align='middle'>
                  <img src={p} className={styles.icon} alt=''/>
                  <Text className={styles.parking}>1250</Text>
                </Row>
              </Col>
            </Row>
            <Divider className={styles.divider2}/>
            <Row>
              <Text className={styles.smtext}>Updated {moment().format("ddd, MMM D YYYY, h:mm A")} PDT</Text>
            </Row>
            <Row>
              <Text className={styles.smtext}>Only public info for permit and vehicle verification is displayed, no personal, private, or location information is available.</Text>
            </Row>
            <Row>
              <Text className={styles.smtext}>Smart Decal must be active and valid for the vehicle and location. Use of an inactive, revoked, or invalid Smart Decal may result in citation, booting, immobilization, or towing at owner's expense.</Text>
            </Row>
          </div>
        </Content>
      </Layout>
    </>
  )
}

export default FakeParking
