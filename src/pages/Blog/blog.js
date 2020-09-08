import React from 'react';
import DisplayPageHeader from '../../layouts/DisplayPageHeader/DisplayPageHeader';
import DisplayPageFooter from '../../layouts/DisplayPageFooter/DisplayPageFooter';
import {Layout, Typography} from 'antd';
import axio from './axios-blog';
import * as styles from './blog.module.scss';
import { Card } from 'antd';
const { Meta } = Card;
const {Title} = Typography;
const datas = axio.get('https://blog-data-base.firebaseio.com/Blog');

const Blog = () => {

  return (
    <Layout className={styles.layout}>
      <DisplayPageHeader/>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
        <Meta title="Title" description="www.instagram.com" />
        </Card>
      <DisplayPageFooter/>
    </Layout>
  )
};

export default Blog;
