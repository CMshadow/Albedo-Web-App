import React from 'react';
import DisplayPageHeader from '../../../layouts/DisplayPageHeader/DisplayPageHeader';
import DisplayPageFooter from '../../../layouts/DisplayPageFooter/DisplayPageFooter';
//import getUrl from './getUrl';
import { Layout ,Typography} from 'antd';
import Player from 'aliplayer-react';
import * as styles from './VideoPage.module.scss';

const { Content } = Layout;
const { Title } = Typography;


const config = {
    source:' https://outin-24065ccdd13511ea962100163e1c60dc.oss-cn-shanghai.aliyuncs.com/sv/8f593b9-173ad9b1d30/8f593b9-173ad9b1d30.mp4?Expires=1596352747&OSSAccessKeyId=LTAIxSaOfEzCnBOj&Signature=9MU7%2BnRU9MjIwLjwN7lDiGbqt8g%3D',  
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
        <br/>
        <Player config={config} />
      </Content>
      <DisplayPageFooter/>
    </Layout>
    </div>
);

export default VideoPage;