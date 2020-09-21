import React from 'react';
import {Layout, Typography} from 'antd';
import * as styles from './page.module.scss';
import reactHtmlParser from 'react-html-parser'
const { Title, Paragraph, Text } = Typography;
export default ({ dataSource }) =>{
    return( 
    <Layout>
            {
                 dataSource.map(item=>     
                    <Typography key={item.id}>
                            <div >
                                <img src={ item.cover } />
                            </div>
                            {/* {document.body.outerHTML=item.content}  */}
                            <Paragraph>{reactHtmlParser(item.content) }</Paragraph>                                              
                    </Typography>)
            }
    </Layout>)
}
