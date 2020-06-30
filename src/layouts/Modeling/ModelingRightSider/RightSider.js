import React from 'react';
import { Layout, Row } from 'antd';
import * as styles from './RightSider.module.scss';
import LockMap from './Buttons/lockMap';
import SelectMap from './Buttons/selectMap';
import ShowLength from './Buttons/showLength'
import ShowAngle from './Buttons/showAngle'
import ResetCamera from './Buttons/resetCamera'
import ShowVertex from './Buttons/showVertex'

const { Sider } = Layout;

const RightSider = () => {
  return (
      <Sider
        className={styles.rightSider}
        width={50}
      >
        <Row className={styles.button}><SelectMap/></Row>
        <Row className={styles.button}><ResetCamera/></Row>
        <Row className={styles.button}><LockMap/></Row>
        <Row className={styles.button}><ShowVertex/></Row>
        <Row className={styles.button}><ShowLength/></Row>
        <Row className={styles.button}><ShowAngle/></Row>
      </Sider>
  );
}

export default RightSider;
