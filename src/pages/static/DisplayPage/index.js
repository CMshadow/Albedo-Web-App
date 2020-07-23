import React from 'react';
import * as styles from './index.module.scss';
import 'antd/dist/antd.css';
import BackToTop from '../../../components/BackToTop/BackToTop';
import UserIncrease from '../../../components/UserIncrease/UserIncrease';
import DisplayPageHeader from '../../../layouts/DisplayPageHeader/DisplayPageHeader'
import DisplayPageFooter from '../../../layouts/DisplayPageFooter/DisplayPageFooter';
import { Layout ,Typography,Row, Col,Card,Descriptions} from 'antd';
import designDisplay from '../../../assets/design-display3.png';
import pad from '../../../assets/pad.png';
import dash from '../../../assets/dash.jpeg';
import elec from '../../../assets/elec.jpeg';
import computer from '../../../assets/computer.jpeg';
import pads from '../../../assets/2pads.jpeg';
import earth from '../../../assets/earth.jpeg';
import multitasks from '../../../assets/multitasks.jpeg';
import cloud from '../../../assets/cloud.jpeg';
import {  CloudOutlined,ThunderboltOutlined, FallOutlined, BarChartOutlined ,ClusterOutlined} from '@ant-design/icons';
const { Title } = Typography;
const { Content } = Layout;


const DisplayPage = ()=>(
  <div >
    <Layout style={{backgroundColor:'#ffffff'}}>
      <DisplayPageHeader/>
      
      <Content className = {styles.content}>
        <Title className={styles.title1}>智能化云端光伏设计</Title>
        <Title level={4} type="secondary" className={styles.title2}>极速生成报告、一键出图，简单高效的设计模式，开创光伏设计新维度</Title>
         <img src = {designDisplay} alt="designDisplay" width='80%' height='800px' vertical-align='middle'/>
      </Content>

      <Content className = {styles.content} >
      <Title level={2} className={styles.title1} style={{marginBottom:'60px'}}>多项设计功能统一整合</Title>
        <Row justify="center" align="top">  
          <Col span={10} >  
            <div className={styles.div_left}>
              <div className={styles.thang}>
                <p className={styles.highlight}>多功能</p>
                <p>光伏设计专家</p>
              </div>
            
              <div className={styles.circle_left}>
                <div className={styles.thang}>
                  <p className={styles.highlight}>自动化</p>
                  <p>光伏阵列排布</p>
                </div>
              </div>
              <div className={styles.thang}>
                <p className={styles.highlight}>系统产能</p>
                <p>计算及损耗分析</p>
              </div>
            </div>  
            
          </Col>
          <Col span={4}>
            <div style={{marginTop:'20px', marginRight:'60px'}}>
              <img src = {pad} alt="designDisplay" width='150%' height='150%' min-width='200px' />
            </div>
          </Col>
          <Col span={10}>
            <div className={styles.div_right}>
              <div className={styles.thang}>
                <p>系统设备</p>
                <p className={styles.highlight}>自动化</p>
                <p>统计</p>
              </div>
              <div className={styles.circle_right}>
                <div className={styles.thang}>
                  <p className={styles.highlight} >25年</p>
                  <p>全生命周期投资及收益分析</p>
                </div>
              </div>
              <div className={styles.thang}>
                <p className={styles.highlight}>一键</p>
                <p>生成系统电气主接线图</p>
              </div>
            </div>
          </Col>
           
        </Row>      
      </Content>


      
      <Content className = {styles.content} >  
        <Title level={2} className={styles.title1} style={{marginBottom:'60px'}}>丰富强大的报告内核</Title>      
        <Row justify="center" align="top">
          <Col span={2}/>
          <Col span={10} >
            <img src = {earth} alt="designDisplay" width='70%' height='50%'/>
          </Col>
          <Col span={12} >
            <Card bordered={false}  style={{ width: '80%',float:'left'}}>
              <CloudOutlined style={{fontSize:'50px',float:'left',marginRight:'50px'}}/>
              <br/><br/><br/>
              <Title level={3} className={styles.title3}>天气分析</Title>
              <p className={styles.pleft}>根据项目所在地经纬度，快速获取全年小时精度的天气数据。自动计算当地最佳铺设朝向倾角，及系统发电量</p>
            </Card>
          </Col>      
        </Row>
      </Content>

      <Content className = {styles.content} >
        <Row justify="center" align="top"  >
          <Col span={2}/>
          <Col span={10}>
            <Card bordered={false}  style={{ width: '80%',float:'right'}}>
            <ThunderboltOutlined style={{fontSize:'50px',float:'left',marginRight:'50px'}}/>
              <br/><br/><br/>
              <Title level={3} className={styles.title3}>发电量计算</Title>
              <p className={styles.pleft}>使用自主研发的发电量计算模型，支持创建多个不同朝向倾角的光伏阵列，精确高效的计算出以小时为单位的光伏系统总发电量</p>
            </Card>
          </Col>
          <Col span={10}>
            <img src = {elec} alt="designDisplay" width='70%' height='50%' />
          </Col> 
          <Col span={2}/>   
        </Row>
      </Content> 


      <Content className = {styles.content} >  
        <Row justify="center" align="middle">
          <Col span={2}/>
          <Col span={10}>
            <img src = {cloud} alt="designDisplay" width='80%' height='80%' />
          </Col>
          <Col span={10}>
            <Card bordered={false}  style={{ width: '80%',float:'left'}}>
            <FallOutlined style={{fontSize:'50px',float:'left',marginRight:'50px'}}/>
              <br/><br/><br/>
              <Title level={3} className={styles.title3}>系统损失</Title>
              <p className={styles.pright}>采用瀑布式发电与损耗计算，辐照端、直流端、交流端、以及升压端，步步相扣，准确计算出环节之间的具体损耗，与损耗因数说再见</p>
            </Card>
          </Col>  
          <Col span={2}/>      
        </Row>
      </Content>

      <Content className = {styles.content} >
        <Row justify="center" align="top">
          <Col span={2}/> 
          <Col span={10}>
            <Card bordered={false}  style={{ width: '80%',float:'right'}}>
              <BarChartOutlined style={{fontSize:'50px',float:'left',marginRight:'50px'}}/>
              <br/><br/><br/>
              <Title level={3} className={styles.title3}>投资收益</Title>
              <p className={styles.pright}>自动统计项目设计中所有使用设备数量与线缆长度，完全实现项目造价自定义。支持手动输入上下网电价与补贴，收益与回本周期从此全掌握</p>
            </Card>
          </Col>
          <Col span={10}>
            <img src = {multitasks} alt="designDisplay" width='90%' height='90%' />
          </Col> 
          <Col span={2}/>         
        </Row>
      </Content>

      <Content className = {styles.content} >
        <Row justify="center" align="top">
          <Col span={2}/>
          <Col span={10}>
            <img src = {computer} alt="designDisplay" width='80%' height='60%' />
          </Col>
          <Col span={10}>
            <Card bordered={false}  style={{ width: '80%',float:'left'}}>
              <ClusterOutlined  style={{fontSize:'50px',float:'left',marginRight:'50px'}}/>
              <br/><br/><br/>
              <Title level={3} className={styles.title3}>电气接线图</Title>
              <p className={styles.pleft}>根据用户电气接入配置，自动生成光伏系统电气接线图，轻松实现一键出图，为设计师省时增效。</p>
            </Card>
          </Col> 
          <Col span={2}/>        
        </Row>
      </Content>

      
      <Content className = {styles.content} >
        <Title level={2} className={styles.title1} style={{marginBottom:'60px'}}>与我们一起成长，为光伏设计添砖加瓦！</Title>
        <Row justify="center" align="top">
          <Col span={8}>
            <Title level={3} className={styles.title1}>用户总数</Title>
            <p>
              <UserIncrease count={203} increase = {5}/>
            </p>
          </Col>
          <Col span={8}>
            <Title level={3} className={styles.title1}>累计生成的项目报告</Title>
            <UserIncrease count={765} increase = {10} />
          </Col>
          <Col span={8}>
            <Title level={3} className={styles.title1}>项目累计装机容量</Title>
            <UserIncrease count={1430000} increase = {100} />
          </Col>
        </Row>
      </Content>

      <Content className = {styles.content} >
        <Row justify="center" align="top">
          <Col span={3}/> 
          <Col span={9} >   
            <img src = {pads} alt="designDisplay" width='50%' height='50%' />
          </Col>
          <Col span={9}>
            <Card bordered={false}  style={{ width: '80%',float:'left'}}>
              <Title level={4} className={styles.title3}>联系我们</Title>
              {/* <p className={styles.pleft}>负责人: Zhou Maomao</p>
              <br/><br/> */}
              <p className={styles.pleft}>电话: +86 18811061946</p>
              <br/><br/>
              <p className={styles.pleft}>邮箱: admin-cn@albedopowered.com</p>
              <br/><br/>
              <p className={styles.pleft}>公司地址: 北京市丰台区方庄顺八条8号院三区6号楼 </p>
            </Card>
            
          </Col>
          <Col span={3}/>
        </Row>
      </Content>

      <DisplayPageFooter/>
      
    </Layout>,
    <BackToTop/>
  </div>
);

export default DisplayPage;