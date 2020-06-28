import React from 'react';
import { Layout } from 'antd';
import * as styles from './RightSider.module.scss';
import LockMap from './Buttons/lockMap';
import SelectMap from './Buttons/selectMap';
import ShowLength from './Buttons/showLength'
import ShowAngle from './Buttons/showAngle'

const { Sider } = Layout;

const RightSider = () => {
  return (
      <Sider
        className={styles.rightSider}
        width={50}
      >
        <SelectMap style={{top: '5px'}}/>
        <LockMap />
        <ShowLength />
        <ShowAngle />
      </Sider>
  );
}

export default RightSider;
