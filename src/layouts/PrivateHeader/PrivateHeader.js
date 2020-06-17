import React from 'react';
import { LogoutOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Layout, Avatar, Dropdown, Menu, Row, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import SelectLang from '../../components/SelectLang/index';
import * as styles from './PrivateHeader.module.scss';
import { Auth } from 'aws-amplify';
import { genInitial } from '../../utils/genInitial';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { setCognitoUser } from '../../store/action/index';

const { Header } = Layout;

const PrivateHeader = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const projectExist = Object.keys(useSelector(state => state.project)).length !== 0

  const signOut = () => {
    dispatch(setCognitoUser(null))
    Auth.signOut();
    history.push('/user/login');
    return;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]}>
      <Menu.Item key="logout" onClick={signOut}>
        <LogoutOutlined />
        {t('header.logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className={styles.header}>
      {
        projectExist ?
        <Button
          type='link'
          size='large'
          icon={<ArrowLeftOutlined />}
          onClick={() => {history.push('/dashboard')}}
        >
          {t('sider.menu.back-project')}
        </Button> :
        null
      }
      <Row className={styles.right}>
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
    </Header>
  );
}

export default PrivateHeader;
