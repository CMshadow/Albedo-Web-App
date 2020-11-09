import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, message, Typography, Upload, Tooltip, Modal } from 'antd'
import { InboxOutlined, MessageOutlined } from '@ant-design/icons'
import Axios from 'axios'
import * as classes from './EmailSupport.module.scss'
const { TextArea } = Input
const { Text, Title } = Typography
const { Dragger } = Upload

const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 9,
    span: 16,
  },
}

const maskstyle = {
  background: 'rgba(0,0,0,0)',
}
const EmailSupport = () => {
  const { t } = useTranslation()
  const [EmailFormTrigger, setEmailFormTriger] = useState(false)
  const [loading, setLoading] = useState(false)
  const [custFileList, setcustFileList] = useState([])
  const [imageURL, setimageURL] = useState(null)

  const turnOnTriggerHandler = () => {
    setEmailFormTriger(true)
  }

  const turnOffTriggerHandler = () => {
    setEmailFormTriger(false)
  }

  const disableSendButton = () => {
    setLoading(true)
  }

  const enableSendButton = () => {
    setLoading(false)
  }

  const uploadImage = option => {
    disableSendButton()
    const reader = new FileReader()
    reader.readAsDataURL(option.file)
    reader.onload = event => {
      Axios.post(
        'https://j95bduexhe.execute-api.us-east-1.amazonaws.com/dev/upload-image-to-s3',
        {
          image: event.target.result,
        },
        {
          onUploadProgress: ({ total, loaded }) => {
            option.onProgress(
              {
                percent: Math.round((loaded / total) * 100).toFixed(2),
              },
              option.file
            )
          },
        }
      )
        .then(res => {
          setimageURL(res.data.imageURL)
          option.onSuccess('success message')
          enableSendButton()
        })
        .catch(err => {
          option.onError(err)
          enableSendButton()
        })
    }
    reader.onerror = err => {
      option.onError(err)
      enableSendButton()
    }
  }

  const sendEmail = event => {
    event.imgURL = imageURL
    // create reusable transporter object using the default SMTP transport
    const xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      'https://33kbh781cf.execute-api.us-east-1.amazonaws.com/EmalSupportHandler/help-tech-support-emailtracker'
    )
    xhr.onreadystatechange = event => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(event.target.response)
        if (response.status === 200) {
          message.success('Email has been sent')
          enableSendButton()
          turnOffTriggerHandler()
        } else {
          message.success('Fail to send')
        }
      }
    }
    xhr.send(JSON.stringify(event))
    disableSendButton()
  }

  return (
    <>
      <Tooltip title={t('techsupport.contactus')}>
        <Button
          className={classes.triggerButton}
          type="primary"
          shape="circle"
          icon={<MessageOutlined className={classes.MessageOutlined} />}
          size={'large'}
          onClick={turnOnTriggerHandler}
        />
      </Tooltip>
      <Modal
        className={classes.modal}
        visible={EmailFormTrigger}
        centered={true}
        title={null}
        footer={null}
        closable={false}
        maskStyle={{ ...maskstyle }}
        onCancel={turnOffTriggerHandler}
      >
        <Form {...layout} name="EmailSupportForm" onFinish={sendEmail}>
          <Title level={4} className={classes.formTitle}>
            {t('techsupport.contactus')}
          </Title>
          <Form.Item
            {...layout}
            className={classes.formItem}
            rules={[{ required: true, type: 'email' }]}
            name="EmailAddress"
          >
            <Input addonBefore={t('techsupport.email')} />
          </Form.Item>

          <Form.Item className={classes.formItem} rules={[{ required: true }]} name="UserName">
            <Input addonBefore={t('techsupport.name')} />
          </Form.Item>

          <Text className={classes.formItem}>{t('techsupport.description')}</Text>
          <Form.Item className={classes.formItem} rules={[{ required: true }]} name="Question">
            <TextArea rows={6} />
          </Form.Item>

          <Form.Item className={classes.formItem}>
            <Dragger
              showUploadList={true}
              fileList={custFileList}
              customRequest={uploadImage}
              onChange={info => {
                const newFileList = info.fileList.slice(-1)
                setcustFileList(newFileList)
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t('techsupport.attachment')}</p>
            </Dragger>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {t('techsupport.sendemail')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EmailSupport
