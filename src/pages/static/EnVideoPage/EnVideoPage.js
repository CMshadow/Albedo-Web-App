import React from 'react'
import EnDisplayPageHeader from '../../../layouts/EnDisplayPageHeader/EnDisplayPageHeader'
import EnDisplayPageFooter from '../../../layouts/EnDisplayPageFooter/EnDisplayPageFooter'
import { Grid, Row } from 'react-flexbox-grid'
import { Layout, Typography } from 'antd'
import Player from 'aliplayer-react'
import * as styles from './EnVideoPage.module.scss'
const { Content } = Layout
const { Title } = Typography
const config = {
  source: 'https://albedo-videos.s3-us-west-2.amazonaws.com/Albedo+Tutorial.mov',
  height: '600px',
  autoplay: true,
  isLive: false,
  rePlay: false,
  playsinline: true,
  preload: true,
  controlBarVisibility: 'hover',
  useH5Prism: true,
}

const VideoPage = () => {
  return (
    <Layout className={styles.layout}>
      <EnDisplayPageHeader />
      <Content className={styles.content}>
        <Grid fluid>
          <Row center="xs" xs={12}>
            <Title className={styles.title1}>Albedo Quick Start Tutorial</Title>
          </Row>
          <Row center="xs" xs={12}>
            <Title level={4} type="secondary" className={styles.title2}>
              Master your design skills within 3 mintues and take it to a new level
            </Title>
            <Player config={config} />
          </Row>
        </Grid>
      </Content>
      <EnDisplayPageFooter />
    </Layout>
  )
}

export default VideoPage
