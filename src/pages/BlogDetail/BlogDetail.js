import React from 'react';
import DisplayPageHeader from '../../layouts/DisplayPageHeader/DisplayPageHeader';
import DisplayPageFooter from '../../layouts/DisplayPageFooter/DisplayPageFooter';
import {Layout, Typography} from 'antd';
import * as styles from './BlogDetail.module.scss';
import { Grid, Row} from 'react-flexbox-grid';
const {Content} = Layout;
const {Title} = Typography;


const BlogDetail = () => {

  return (
    <Layout className={styles.layout}>
      <DisplayPageHeader/>
        <Content className={styles.content}>
          <Grid fluid>
            <Row center="xs" xs={12}>
              
            </Row>
            
           
          </Grid>
        </Content>


      <DisplayPageFooter/>
    </Layout>
  )
};

export default BlogDetail;