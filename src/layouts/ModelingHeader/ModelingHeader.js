import React from 'react';
import { LogoutOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Layout, Avatar, Dropdown, Menu, Row, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import SelectLang from '../../components/SelectLang/index';
import * as styles from './ModelingHeader.module.scss';
import { Auth } from 'aws-amplify';
import { genInitial } from '../../utils/genInitial';
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { setCognitoUser } from '../../store/action/index';

const { Header } = Layout;

const ModelingHeader = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const projectID = useLocation().pathname.split('/')[2]

  const signOut = () => {
    dispatch(setCognitoUser(null))
    Auth.signOut();
    history.push('/user/login');
    return;
  }

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]}>
      <Menu.Item key="logout" onClick={signOut}>
        <LogoutOutlined />
        {t('header.logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Header theme='dark' className={styles.header}>
      <Row align='middle'>
        <Button
          type='link'
          size='large'
          icon={<ArrowLeftOutlined />}
          onClick={() => {history.push(`/project/${projectID}`)}}
        >
          Back to Project
        </Button>
        <Menu theme='dark' selectedKeys={"modeling"} mode="horizontal">
          <Menu.Item key="modeling">
            Modeling
          </Menu.Item>
          <Menu.Item key="sketch">
            Sketch Diagram
          </Menu.Item>
          <Menu.Item key="singleline">
            Singleline Diagram
          </Menu.Item>
        </Menu>
        <Row align='middle' className={styles.right} justify='end'>
          <Dropdown overlay={menuHeaderDropdown}>
            <div className={styles.item}>
              <Avatar className={styles.avatar} alt="avatar" icon={<UserOutlined />}/>
              {genInitial(useSelector(state => state.auth.cognitoUser))}
            </div>
          </Dropdown>
          <div className={styles.item}>
            <SelectLang className={styles.item}/>
          </div>
        </Row>
      </Row>


    </Header>
  );
}

export default ModelingHeader;
