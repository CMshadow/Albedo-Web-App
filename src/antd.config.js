import React from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import i18n from './i18n';

const localeSwitch = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const AntdConfig = (props) => {
  return (
    <ConfigProvider locale={localeSwitch[i18n.language]}>
      {props.children}
    </ConfigProvider>
  )
}

export default AntdConfig
