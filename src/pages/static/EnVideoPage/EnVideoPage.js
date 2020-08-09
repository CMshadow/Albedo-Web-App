import React from 'react';
import EnDisplayPageHeader from '../../../layouts/EnDisplayPageHeader/EnDisplayPageHeader';
import EnDisplayPageFooter from '../../../layouts/EnDisplayPageFooter/EnDisplayPageFooter';

import {Layout, Typography} from 'antd';
import Player from 'aliplayer-react';
import * as styles from './EnVideoPage.module.scss';
const {Content} = Layout;
const {Title} = Typography;
const config = {
  source: 'https://albedo-videos.s3-us-west-2.amazonaws.com/Albedo+Tutorial.mov',
  height: "600px",
  autoplay: true,
  isLive: false,
  rePlay: false,
  playsinline: true,
  preload: true,
  controlBarVisibility: "hover",
  useH5Prism: true
};

const VideoPage = () => {

  return (
    <Layout className={styles.layout}>
      <EnDisplayPageHeader/>
      <Content className={styles.content}>
        <Title className={styles.title1}>Albedo Quick Start Tutorial</Title>
        <Title level={4} type="secondary" className={styles.title2}>
          Master your design skills within 3 mintues and take it to a new level
        </Title>
        <br/>
        <Player config={config}/>
        <br/>
      </Content>
      <EnDisplayPageFooter/>
    </Layout>
  )
};

export default VideoPage;
