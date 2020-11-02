import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useSelector } from 'react-redux'
import { RootState } from './store/reducer/index'
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

const localeSwitch = {
  'zh-CN': zhCN,
  'en-US': enUS
}
moment.locale('en')

const AntdConfig: React.FC = (props) => {
  const locale = useSelector((state: RootState) => state.locale.locale)

  useEffect(() => {
    if (locale === 'zh-CN') moment.locale('zh-cn')
    else moment.locale('en')
  }, [locale])

  const validateMessages = {
    'zh-CN': {
      required: '必填',
      types: {
        number: '必填数字'
      },
      number: {
        // eslint-disable-next-line no-template-curly-in-string
        min: '不能小于${min}',
        // eslint-disable-next-line no-template-curly-in-string
        max: '不能大于${max}',
        // eslint-disable-next-line no-template-curly-in-string
        range: '必须在${min}到${max}区间内',
      }
    },
    'en-US': {
      required: 'required Field',
      types: {
        number: 'number is required'
      },
      number: {
        // eslint-disable-next-line no-template-curly-in-string
        min: 'cannot be less than ${min}',
        // eslint-disable-next-line no-template-curly-in-string
        max: 'cannot be greater than ${max}',
        // eslint-disable-next-line no-template-curly-in-string
        range: 'must be between ${min} and ${max}',
      }
    }
  }

  return (
    <ConfigProvider 
      locale={localeSwitch[locale]}
      form={{validateMessages: validateMessages[locale]}}
    >
      {props.children}
    </ConfigProvider>
  )
}

export default AntdConfig
