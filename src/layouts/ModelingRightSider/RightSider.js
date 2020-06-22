import React from 'react';
import { Layout } from 'antd';
import * as styles from './RightSider.module.scss';
import LockMap from './IndividualButtons/lockMap';
import SelectMap from './IndividualButtons/selectMap';

const { Sider } = Layout;

const RightSider = () => {
  return (
      <Sider
        className={styles.rightSider}
        width={50}
      >
        <SelectMap style={{top: '5px'}}/>
        <LockMap />
      </Sider>
  );
}

export default RightSider;
