import React from 'react';
import * as styles from './index.module.scss';
import BackToTop from '../../../components/BackToTop/BackToTop';
import EnDisplayPageHeader from '../../../layouts/EnDisplayPageHeader/EnDisplayPageHeader'
import EnDisplayPageFooter from '../../../layouts/EnDisplayPageFooter/EnDisplayPageFooter';
import { Layout, Typography, Row, Col, Card, Statistic } from 'antd';
import designDisplay from '../../../assets/design-display3.png';
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

const EnDisplayPage = () => (
  <>
  <BackToTop/>
  <Layout className={styles.layout}>
    <EnDisplayPageHeader/>

    <Content className={styles.content}>
      <Row justify="center">
        <Title level={1} type='primary'>
        Smart Solar Design on the Cloud
        </Title>
        <Title level={3} type='secondary' style={{marginTop: 0}}>
          Immediate project report generation & quick rendering of single line diagram
          <br/>
          to fast track solar design process
        </Title>
        <img src={designDisplay} alt="designDisplay" width='80%'/>
      </Row>

      <Row justify="center" className={styles.part}>
        <Title level={2}>Design Feature All in One</Title>
        <Row className={styles.section} gutter={12}>
          <Col span={8}>
            <Row justify='end' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>Hourly </p>
              <p className={styles.regularTxt}> weather profile input</p>
            </Row>
            <Row justify='start' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>Automated </p>
              <p className={styles.regularTxt}>solar array wiring solution</p>
            </Row>
            <Row justify='end' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>Advanced </p>
              <p className={styles.regularTxt}>energy loss & production analysis</p>
            </Row>
          </Col>
          <Col span={8}>
            <img src={pad} alt="designDisplay" width='100%'/>
          </Col>
          <Col span={8}>
            <Row justify='start' align='middle' className={styles.padSentence}>

              <p className={styles.highlightTxt}>Detailed </p>
              <p className={styles.regularTxt}>statistic of project equipments</p>
            </Row>
            <Row justify='end' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>25-year</p>
              <p className={styles.regularTxt}>lifetime investment & cash flow</p>
            </Row>
            <Row justify='start' align='middle' className={styles.padSentence}>
              <p className={styles.highlightTxt}>“One-click”</p>
              <p className={styles.regularTxt}>solution to the single line diagram</p>
            </Row>
          </Col>
        </Row>
      </Row>

      <Row justify="center" className={styles.part}>
        <Title level={2}>Powerful Software with Most Valued Report</Title>
      </Row>

      <Row align='middle'>
        <Col offset={1} span={10}>
          <img src={earth} alt="designDisplay" width='100%'/>
        </Col>
        <Col offset={1} span={11}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <CloudOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>Irradiance Analysis</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
              Acquire hourly weather data for the project location, and automatically compute optimal tilt and azimuth angle to maximize the irradiance received by the plane of array
              </p>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row align='middle' className={styles.feature}>
        <Col offset={1} span={11}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <ThunderboltOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>Solar Energy Production</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
              Support PV arrays with multi-orientation and MPPT feature to accurately simulate the solar energy yield for the entire PV system
              </p>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={10}>
          <img src={elec} alt="designDisplay" width='100%'/>
        </Col>
      </Row>

      <Row align='middle' className={styles.feature}>
        <Col offset={1} span={10}>
          <img src={cloud} alt="designDisplay" width='100%'/>
        </Col>
        <Col offset={1} span={11}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <FallOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>System Loss</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
              Utilizing the “waterfall” loss structure to more precisely analyze the system loss from the irradiance all the way to the AC end
              </p>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row align='middle' className={styles.feature}>
        <Col offset={1} span={11}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <BarChartOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>Investment & Payback</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
              Automatically count the utilized equipments utilized in the project, with customizable item costs and utility rates to quickly analyze the investment & payback
              </p>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={10}>
          <img src={multitasks} alt="designDisplay" width='100%'/>
        </Col>
      </Row>

      <Row align='middle' className={styles.feature}>
        <Col offset={1} span={10}>
          <img src={computer} alt="designDisplay" width='100%'/>
        </Col>
        <Col offset={1} span={11}>
          <Card bordered={false} hoverable className={styles.card}>
            <Row>
              <ClusterOutlined className={styles.icon}/>
            </Row>
            <Row>
              <Title level={3}>Single Line Diagram</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>
              Generate project single line diagrams with only “one-click” to save more time & improve design efficiency
              </p>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row justify="center" className={styles.feature}>
        <Row justify="center">
          <Title level={2}>Grow with us, together, we shall “design” a renewable future!</Title>
        </Row>
        <Row className={styles.section}>
          <Col span={8}>
            <Statistic
              title={<Title level={3}>Total users</Title> }
              value={genMockNumber({base: 203, increase: 5})}
              valueStyle={{fontSize: 25, padding: '15px 0px'}}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title={<Title level={3}>Project generated</Title> }
              value={genMockNumber({base: 765, increase: 10})}
              valueStyle={{fontSize: 25, padding: '15px 0px'}}
              prefix={<BarChartOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title={<Title level={3}>Accumulated capacity</Title> }
              value={genMockNumber({base: 1430000, increase: 100})}
              valueStyle={{fontSize: 25, padding: '15px 0px'}}
              prefix={<ThunderboltOutlined />}
              suffix='kW'
            />
          </Col>
        </Row>
      </Row>

      <Row align='middle' className={styles.part}>
        <Col offset={2} span={8}>
          <img src={pads} alt="designDisplay" width='100%'/>
        </Col>
        <Col offset={2} span={10}>
          <Card bordered={false} className={styles.card}>
            <Row>
              <Title level={3}>Contact Us</Title>
            </Row>
            <Row>
              <p className={styles.regularTxt}>Tel: (949)558-9632</p>
            </Row>
            <Row>
              <p className={styles.regularTxt}>Email: admin@albedopowered.com</p>
            </Row>
            <Row>
              <p className={styles.regularTxt}>Address: 2001 E Miraloma AvePlacentia, CA 92870</p>
            </Row>
          </Card>
        </Col>
      </Row>
    </Content>

  <EnDisplayPageFooter/>

</Layout>
</>
);

export default EnDisplayPage;
