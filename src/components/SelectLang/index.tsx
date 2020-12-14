import { GlobalOutlined } from '@ant-design/icons'
import { Menu, Dropdown } from 'antd'
import { useDispatch } from 'react-redux'
import { setLanguage } from '../../utils/setLanguage'
import { getLanguage } from '../../utils/getLanguage'
import { setLocale } from '../../store/action/index'
import React from 'react'
import styles from './index.module.scss'

const SelectLang = () => {
  const dispatch = useDispatch()
  const selectedLang = getLanguage()

  const locales = ['zh-CN', 'en-US'] as const
  const languageLabels = {
    'zh-CN': '简体中文',
    'en-US': 'English',
  }
  const languageIcons = {
    'zh-CN': '🇨🇳',
    'en-US': '🇺🇸',
  }
  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={[selectedLang]}
      onClick={({ key }) => {
        setLanguage(key as 'zh-CN' | 'en-US')
        dispatch(setLocale(key as 'zh-CN' | 'en-US'))
      }}
    >
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role='img' aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Dropdown overlay={langMenu} placement='bottomRight'>
      <span className={styles.dropDown}>
        <GlobalOutlined />
      </span>
    </Dropdown>
  )
}

export default SelectLang
