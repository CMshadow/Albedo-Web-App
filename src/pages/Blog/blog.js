import React from 'react';
import DisplayPageHeader from '../../layouts/DisplayPageHeader/DisplayPageHeader';
import DisplayPageFooter from '../../layouts/DisplayPageFooter/DisplayPageFooter';
import {Layout, Typography} from 'antd';
import axio from './axios-blog';
import * as styles from './blog.module.scss';
import BlogList from '../../components/BlogList/BlogList';
import { Grid, Row} from 'react-flexbox-grid';
import datas from './blog.json';
const {Content} = Layout;
const {Title} = Typography;


const Blog = () => {

  return (
    <Layout className={styles.layout}>
      <DisplayPageHeader/>
        <Content className={styles.content}>
          <Grid fluid>
            <Row center="xs" xs={12}>
              <Title level={2} className={styles.title1}>Albedo 最新日志</Title>
            </Row>
            <div className={ styles.wrap }>
              <BlogList dataSource={ datas.data } />
            </div>
           
          </Grid>
        </Content>


      <DisplayPageFooter/>
    </Layout>
  )
};

export default Blog;
