import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useSelector } from 'react-redux'
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

const localeSwitch = {
  'zh-CN': zhCN,
  'en-US': enUS
}
moment.locale('en')

const AntdConfig = (props) => {
  const locale = useSelector(state => state.locale.locale)

  useEffect(() => {
    if (locale === 'zh-CN') moment.locale('zh-cn')
    else moment.locale('en')
  }, [locale])

  return (
    <ConfigProvider locale={localeSwitch[locale]}>
      {props.children}
    </ConfigProvider>
  )
}

export default AntdConfig
