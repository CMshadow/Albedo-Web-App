import React from 'react';
import { BackTop } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

const style = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 40,
};

export const Back2TopButton = () => (
  <BackTop>
    <VerticalAlignTopOutlined style={style}/>
  </BackTop>
)