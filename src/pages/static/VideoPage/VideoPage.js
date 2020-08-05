import React from 'react';
import DisplayPageHeader from '../../../layouts/DisplayPageHeader/DisplayPageHeader';
import DisplayPageFooter from '../../../layouts/DisplayPageFooter/DisplayPageFooter';

import {Layout, Typography} from 'antd';
import Player from 'aliplayer-react';
import * as styles from './VideoPage.module.scss';
//import * as A  from './getUrl';
const {Content} = Layout;
const {Title} = Typography;
const config = {
  source: 'https://albedo-tutorial.oss-cn-shanghai.aliyuncs.com/Albedo%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4',
  width: "100%",
  height: "500px",
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
      <DisplayPageHeader/>
      <Content className={styles.content}>
        <Title className={styles.title1}>Albedo 快速上手教程</Title>
        <Title level={4} type="secondary" className={styles.title2}>
          三分钟快速上手，带你玩转光伏设计
        </Title>
        <Player config={config}/>
      </Content>
      <DisplayPageFooter/>
    </Layout>
  )
};

export default VideoPage;
