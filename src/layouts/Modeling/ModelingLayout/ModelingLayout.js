import React from 'react';
import { Layout } from 'antd';
import ModelingHeader from '../ModelingHeader/ModelingHeader';
import FixedSider from '../ModelingFixedSider/FixedSider'
import LeftSider from '../ModelingLeftSider/LeftSider'
import RightSider from '../ModelingRightSider/RightSider'


const { Content } = Layout;

const ModelingLayout = (props) => {

  return (
    <Layout>
      <ModelingHeader/>
      <Layout>
        <FixedSider/>
        <LeftSider/>
        <Content>
          {props.children}
        </Content>
        <RightSider/>
      </Layout>
    </Layout>
  );
}

export default ModelingLayout;
