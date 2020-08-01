import React from 'react';
import DisplayPageHeader from '../../../layouts/DisplayPageHeader/DisplayPageHeader';
import DisplayPageFooter from '../../../layouts/DisplayPageFooter/DisplayPageFooter';
import { Layout ,Typography} from 'antd';
import Player from 'aliplayer-react';
import * as styles from './VideoPage.module.scss';

const { Content } = Layout;
const { Title } = Typography;
const config = {
    source:
      "https://outin-24065ccdd13511ea962100163e1c60dc.oss-cn-shanghai.aliyuncs.com/sv/46e5d0bf-173980e71b5/46e5d0bf-173980e71b5.mov?Expires=1595995642&OSSAccessKeyId=LTAIxSaOfEzCnBOj&Signature=4O7tM%2F0jKfDBEnp884izDqiQ2QE%3D",
    width: "100%",
    height: "500px",
    autoplay: true,
    isLive: false,
    rePlay: false,
    playsinline: true,
    preload: true,
    controlBarVisibility: "hover",
    useH5Prism: true,
   
  
  };
const VideoPage = ()=>(
    <div >
    <Layout style={{backgroundColor:'#ffffff'}}>
      <DisplayPageHeader/>
      <Content className = {styles.content}>
        <Title className={styles.title1}>Albedo 快速上手教程</Title>
        <Title level={4} type="secondary" className={styles.title2}>三分钟快速上手，带你玩转光伏设计</Title>
      </Content>
      <Content className = {styles.content}>
        <Player config={config} />
      </Content>
      <DisplayPageFooter/>
    </Layout>
    </div>
);

export default VideoPage;