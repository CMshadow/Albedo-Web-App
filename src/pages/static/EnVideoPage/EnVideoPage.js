import React from 'react';
import EnDisplayPageHeader from '../../../layouts/EnDisplayPageHeader/EnDisplayPageHeader';
import EnDisplayPageFooter from '../../../layouts/EnDisplayPageFooter/EnDisplayPageFooter';

import { Layout ,Typography} from 'antd';
import Player from 'aliplayer-react';
import * as styles from './EnVideoPage.module.scss';
//import * as A  from './getUrl';
const { Content } = Layout;
const { Title } = Typography;
const config = {
    source:'https://albedo-videos.s3-us-west-2.amazonaws.com/Albedo+Tutorial.mov',  
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
    
    return(
    <div >
        <Layout style={{backgroundColor:'#ffffff'}}>
          <EnDisplayPageHeader/>
          <Content className = {styles.content}>
            <Title className={styles.title1}>Albedo Quick Start Tutorial</Title>         
            <Title level={4} type="secondary" className={styles.title2}>Three Minutes To Get Started Quickly, Take You To Play Photovoltaic Design</Title>
            <br/>
            <Player config={config} />

          </Content>
          <EnDisplayPageFooter/>
        </Layout>
    </div>
    )
};

export default VideoPage;