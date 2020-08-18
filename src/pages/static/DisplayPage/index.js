import React from 'react';
import * as styles from './index.module.scss';
import BackToTop from '../../../components/BackToTop/BackToTop';
import DisplayPageHeader from '../../../layouts/DisplayPageHeader/DisplayPageHeader'
import DisplayPageFooter from '../../../layouts/DisplayPageFooter/DisplayPageFooter';
import { Layout, Typography, Card, Statistic } from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import designDisplay from '../../../assets/design-display3.png';
import test from '../../../assets/test.jpeg';
import pad from '../../../assets/pad.png';
import elec from '../../../assets/elec.jpeg';
import computer from '../../../assets/computer.jpeg';
import pads from '../../../assets/2pads.jpeg';
import earth from '../../../assets/earth.jpeg';
import multitasks from '../../../assets/multitasks.jpeg';
import cloud from '../../../assets/cloud.jpeg';
import { genMockNumber } from '../../../utils/genMockNumber'
import { CloudOutlined, ThunderboltOutlined, FallOutlined, BarChartOutlined, ClusterOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const DisplayPage = () => (
  <>
  <BackToTop/>
  <Layout className={styles.layout}>
    <DisplayPageHeader/>
    <Content className={styles.content}>
    
      <Grid fluid>
      <Row center="xs" xs={12}>
        <Title type='primary'>
          智能化云端光伏设计
        </Title>
      </Row>
      <Row center="xs" xs={12}>
        <Title level={3} type='secondary' style={{marginTop: 0}}>
          极速生成报告、一键出图，简单高效的设计模式，开创光伏设计新维度
        </Title>
        <img src={designDisplay} alt="designDisplay" width='80%'/>
      </Row>
      </Grid>

      
      
      {/* <Row className={styles.part}>
        <img src={test} alt="designDisplay" width='100%' height= '150%'/>
      </Row> */}
      
      <Grid fluid>
      <Row center="xs" xs={12} className={styles.part}>
        <Title level={2}>多项功能，统一整合</Title>
        <Row className={styles.section} around = 'sm'>
          <Col sm={3}>
            <Row end='xs' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>每小时</p>
              <p className={styles.regularTxt}>精度天气数据</p>
            </Row>
            <Row start='xs' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>自动化</p>
              <p className={styles.regularTxt}>光伏阵列排布</p>
            </Row>
            <Row end='xs' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>系统产能</p>
              <p className={styles.regularTxt}>计算及损耗分析</p>
            </Row>
          </Col>
          <Col sm={3}>
            <img src={pad} alt="designDisplay" width='100%'/>
          </Col>

          <Col sm={3}>
            <Row start='xs' align='middle' className={styles.padSentence}>
              <p className={styles.regularTxt}>系统设备</p>
              <p className={styles.highlightTxt}>自动化</p>
              <p className={styles.regularTxt}>统计</p>
            </Row>
            <Row end='xs' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>25年</p>
              <p className={styles.regularTxt}>生命周期投资收益分析</p>
            </Row>
            <Row start='xs' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>一键</p>
              <p className={styles.regularTxt}>生成系统电气主接线图</p>
            </Row>
          </Col>
        </Row>
      </Row>
      </Grid>
      
      <Grid fluid>
      <Row center="xs"  xs={12} className={styles.part}>
        <Title level={2}>丰富强大的报告内核</Title>
      </Row>
      
      <Row align='middle'>
        <Col smOffset={1} sm={5} >
          <img src={earth} alt="designDisplay" width='100%'/>
        </Col>
        <Col smOffset={1} sm={5}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <CloudOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>天气分析</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
                根据项目所在地经纬度，快速获取全年小时精度的天气数据。
                自动计算当地最佳铺设朝向倾角，以及全年太阳轨迹
              </p>
            </Row>
          </Card>
        </Col>
      </Row>
      
      <Row align='middle' className={styles.feature}>
        <Col smOffset={1} sm={5}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <ThunderboltOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>发电量计算</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
                使用自主研发的发电量计算模型，支持创建多个不同朝向倾角的光伏阵列，
                精确高效的计算出以小时为单位的光伏系统总发电量
              </p>
            </Row>
          </Card>
        </Col>
        <Col smOffset={1} sm={5}>
          <img src={elec} alt="designDisplay" width='100%'/>
        </Col>
      </Row>

      <Row align='middle' className={styles.feature}>
        <Col smOffset={1} sm={5}>
          <img src={cloud} alt="designDisplay" width='100%'/>
        </Col>
        <Col smOffset={1} sm={5}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <FallOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>系统损失</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
                采用瀑布式发电与损耗计算，辐照端、直流端、交流端、以及升压端，
                步步相扣，准确计算出环节之间的具体损耗，与损耗因数说再见
              </p>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row align='middle' className={styles.feature}>
        <Col smOffset={1} sm={5}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <BarChartOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>投资收益</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
                自动统计项目设计中所有使用设备数量与线缆长度，完全实现项目造价自定义。
                支持手动输入上下网电价与补贴，收益与回本周期从此全掌握
              </p>
            </Row>
          </Card>
        </Col>
        <Col smOffset={1} sm={5}>
          <img src={multitasks} alt="designDisplay" width='100%'/>
        </Col>
      </Row>

      <Row align='middle' className={styles.feature}>
        <Col smOffset={1} sm={5}>
          <img src={computer} alt="designDisplay" width='100%'/>
        </Col>
        <Col smOffset={1} sm={5}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <ClusterOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>电气接线图</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
                根据用户电气接入配置，自动生成光伏系统电气接线图，
                轻松实现一键出图，为设计师省时增效
              </p>
            </Row>
          </Card>
        </Col>
      </Row>
      </Grid>
      <Grid fluid>
      {/*<Row justify="center" className={styles.feature}>*/}
        <Row center="sm" sm={8} className={styles.feature}>
          <Title level={2}>与我们一起成长，为光伏设计添砖加瓦</Title>
        </Row>
        <Row className={styles.section}>
          <Col sm={4}>
            <Statistic
              title={<Title level={3}>用户总数</Title> }
              value={genMockNumber({base: 203, increase: 5})}
              valueStyle={{fontSize: 25, padding: '15px 0px'}}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col sm={4}>
            <Statistic
              title={<Title level={3}>累计生成的项目报告</Title> }
              value={genMockNumber({base: 765, increase: 10})}
              valueStyle={{fontSize: 25, padding: '15px 0px'}}
              prefix={<BarChartOutlined />}
            />
          </Col>
          <Col sm={4}>
            <Statistic
              title={<Title level={3}>项目累计装机容量</Title> }
              value={genMockNumber({base: 1430000, increase: 100})}
              valueStyle={{fontSize: 25, padding: '15px 0px'}}
              prefix={<ThunderboltOutlined />}
              suffix='kW'
            />
          </Col>
        </Row>
      {/*</Row>*/}
      </Grid>
      <Grid fluid>
      <Row align='middle' className={styles.part}>
        <Col smOffset={2} sm={3}>
          <img src={pads} alt="designDisplay" width='100%'/>
        </Col>
        <Col smOffset={1} sm={5}>
          <Card bordered={false} className={styles.card}>
            <Row>
              <Title level={3}>联系我们</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>电话: +86 18811061946</p>
            </Row>
            <Row>
              <p className={styles.regularTxt}>邮箱: admin-cn@albedopowered.com</p>
            </Row>
            <Row>
              <p className={styles.regularTxt}>公司地址: 北京市丰台区方庄顺八条8号院三区6号楼</p>
            </Row>
          </Card>
        </Col>
      </Row>
      </Grid>
    </Content>

  <DisplayPageFooter/>

</Layout>
</>
);

export default DisplayPage;
