import React from 'react'
import { LogoutOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Layout, Avatar, Dropdown, Menu, Row, Button, Switch, Space } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import SelectLang from '../../components/SelectLang/index'
import styles from './PrivateHeader.module.scss'
import { Auth } from 'aws-amplify'
import { genInitial } from '../../utils/genInitial'
import { useHistory, useLocation } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { setSignOut, setUnit } from '../../store/action/index'
import { RootState, CognitoUserExt } from '../../@types'
import axios from '../../axios.config'

const { Header } = Layout

const PrivateHeader: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()
  const projectExist = useLocation().pathname.split('/')[1] === 'project'
  const unit = useSelector((state: RootState) => state.unit.unit)
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)

  const signOut = () => {
    dispatch(setSignOut())
    Auth.signOut()
    history.push('/user/login')
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]}>
      <Menu.Item key="logout" onClick={signOut}>
        <LogoutOutlined />
        {t('header.logout')}
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className={styles.header}>
      {
        projectExist &&
        <Button
          type='link'
          size='large'
          icon={<ArrowLeftOutlined />}
          onClick={() => {history.push('/dashboard')}}
        >
          {t('sider.menu.back-project')}
        </Button>
      }
      <Button type='primary'
        onClick={async () => {
          try {
            const auth: CognitoUserExt = await Auth.currentAuthenticatedUser()
            const username = auth.getUsername()
            const session = auth.getSignInUserSession()
            if (!session) throw AuthEr
            const token = session.getIdToken()
          } catch(err) {
            console.log(err)
          }

        }}
      >Test</Button>
      <Row className={styles.right} align='middle'>
        <Space>
          {t('header.unit')}
          <Switch
            checkedChildren='m'
            unCheckedChildren='ft'
            checked={unit === 'm'}
            onChange={checked => dispatch(setUnit(checked ? 'm' : 'ft'))}
          />
        </Space>
        <Dropdown overlay={menuHeaderDropdown}>
          <div className={styles.item}>
            <Avatar className={styles.avatar} alt="avatar" icon={<UserOutlined />}/>
            {cognitoUser && genInitial(cognitoUser)}
          </div>
        </Dropdown>
        <div className={styles.item}>
          <SelectLang className={styles.item}/>
        </div>
      </Row>
    </Header>
  )
}

export default PrivateHeader
