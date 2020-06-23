import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Upload, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { releaseProjectData } from '../../store/action/index'
import logo from '../../assets/logo-no-text.png';
import PrivateHeader from '../PrivateHeader/PrivateHeader';
import PublicHeader from '../PublicHeader/PublicHeader'
import DefaultFooter from '../Footer/DefaultFooter'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert';
import * as styles from './BasicLayout.module.scss';
import axios from 'axios'

const { Sider, Content } = Layout;
const { Footer } = Layout
const { Dragger } = Upload;

const BasicLayout = (props) => {
  const [loading, setloading] = useState(false)
  const history = useHistory();
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  const selectMenu = history.location.pathname.split('/')[1]

  const onSelect = ({ item, key }) => {
    history.push(`/${key}`)
  }

  // 释放redux中存储的项目数据
  useEffect(() => {
    dispatch(releaseProjectData())
  }, [dispatch])

  return (
    <Layout>
      <Sider width={250} className={styles.sider}>
        <Row className={styles.title} align='middle' justify='center'>
          <img alt="logo" className={styles.logo} src={logo} />
          <div>
            <h1>{t('sider.company')}</h1>
            <h4>{t('sider.edition')}</h4>
          </div>
        </Row>
        <Menu theme="dark" mode="inline" selectedKeys={[selectMenu]} onSelect={onSelect}>
          <Menu.Item key="dashboard" className={styles.menuItem}>
            {t('sider.menu.project')}
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={styles.main}>
        {cognitoUser ? <PrivateHeader /> : <PublicHeader />}
        <Content className={styles.content}>
          <Spin spinning={loading}>
            <GlobalAlert />
          </Spin>
          {props.children}
        </Content>
        <Dragger
          onProgress={({ percent }, file) => {
            console.log('onProgress', `${percent}%`, file.name);
          }}
          customRequest={option => {
            setloading(true)
          console.log(option)
          const reader = new FileReader()
          reader.readAsDataURL(option.file)
          reader.onload = event => {
            axios.post(
              ' https://hmtn4lq275.execute-api.us-west-2.amazonaws.com/dev/upload-image-test',
              {image: event.target.result},
              {
                onUploadProgress: ({ total, loaded }) => {
                  option.onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, option.file);
                }
              }
            )
            .then(res => {
              setloading(false)
              option.onSuccess('success message')

            })
          }
          reader.onerror = err => option.onError(err)
        }}>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Dragger>
        <Footer className={styles.footer}>
          <DefaultFooter/>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
