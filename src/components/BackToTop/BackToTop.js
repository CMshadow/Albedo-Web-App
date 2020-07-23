import React from 'react';
import { BackTop } from 'antd';
import { UpCircleTwoTone } from '@ant-design/icons';
import classes from './BackToTop.module.scss';

const backToTop = () => (
  <BackTop>
    <div className={classes.BackToTop}>
      <UpCircleTwoTone style={{fontSize: '30px'}}/>
    </div>
  </BackTop>
)

export default backToTop;
