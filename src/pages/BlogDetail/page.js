import React from 'react';
import reactHtmlParser from 'react-html-parser';
import {Layout, Typography} from 'antd';
import styles from './page.module.scss';
const {Title} = Typography;
const {Content} = Layout;
export default ({ dataSource }) =>{
    return( 
    <Layout>
            {
                 dataSource.map(item=>     
                    <div key={item.id}>
                        <Layout className={styles.layout}>
                                <div className={styles.wrapper}>
                                        <div class="intrinsic-aspect-ratio-container"><img alt='cover' className={styles.img} src={ item.cover } /></div>
                                </div>
                                <Content className={styles.content}>
                                        <Title level={2} className={styles.title1}>{item.title}</Title>
                                        <p className={styles.p}>{reactHtmlParser(item.content) }</p>
                                </Content>  
                        </Layout>                                               
                    </div>)
            }
    </Layout>)
}
