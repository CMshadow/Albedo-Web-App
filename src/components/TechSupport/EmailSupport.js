import React, { useState, useEffect } from 'react';
import {Layout, Select, Form, Input, Button, message, Typography, Upload, Tooltip, Modal } from 'antd';
import { QuestionCircleOutlined, InboxOutlined, MessageOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import Axios from 'axios';
const { TextArea } = Input;
const { Text, Title } = Typography;
const { Dragger } = Upload;

const layout = {
    labelCol: {
        span:10,
    },
    wrapperCol: {
        span: 22,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 9,
        span: 16,
    },
};


const EmailSupport = () => {


    const [EmailFormTrigger, setEmailFormTriger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [custFileList, setcustFileList] = useState([])
    const [imageURL, setimageURL] = useState(null)

    const turnOnTriggerHandler = () => {
        setEmailFormTriger(true);
    }

    const turnOffTriggerHandler = () => {
        setEmailFormTriger(false);
    }

    const disableSendButton = () => {
        setLoading(true);
    }

    const enableSendButton = () => {
        setLoading(false);
    }

    const uploadImage = (option) =>{
        disableSendButton();
        const reader = new FileReader()
        reader.readAsDataURL(option.file)
        reader.onload = event => {
        Axios.post(
            'https://j95bduexhe.execute-api.us-east-1.amazonaws.com/dev/upload-image-to-s3',
            {image: event.target.result},
            {
                onUploadProgress: ({ total, loaded }) => {
                    option.onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, option.file);
                }
            }
        )
        .then(res => {
            setimageURL(res.data.imageURL)
            option.onSuccess('success message')
            enableSendButton();
        }).catch(err => {
            option.onError(err);
            enableSendButton();
        })
        }
        reader.onerror = err => {
            option.onError(err)
            enableSendButton();
        }
    }


    const sendEmail = (event) => {
        event.imgURL = imageURL;
        // create reusable transporter object using the default SMTP transport
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://33kbh781cf.execute-api.us-east-1.amazonaws.com/EmalSupportHandler/help-tech-support-emailtracker');
        xhr.onreadystatechange = function(event) {
            
            if (xhr.readyState === 4 && xhr.status === 200){
                let response = JSON.parse(event.target.response);
            
                if (response.status === 200) {
                    message.success('Email has been sent');
                    enableSendButton();
                    turnOffTriggerHandler()
                }
                else {
                    message.success('Fail to send');
                }
            }
        }
        xhr.send(JSON.stringify(event));
        disableSendButton();
    }

    return(
        <>
            <Tooltip title="Support">
                <Button 
                    style={{position: "fixed", bottom:40, right: 40, zIndex: 1, 
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)"}}
                    type="primary" 
                    shape="circle" 
                    icon={<MessageOutlined style={{fontSize: "20px"}}/>} 
                    size={"large"}
                    onClick={turnOnTriggerHandler}   
                />
            </Tooltip>
            <Modal
                style={{
                    position: "fixed",
                    top: '24%',
                    right: 20,
                    zIndex: 5
                }}
            title="Basic Modal"
            visible={EmailFormTrigger}
            title={null}
            footer={null}
            closable={false}
            maskStyle={{background: "rgba(0,0,0,0)"}}
            onCancel={turnOffTriggerHandler}
            >
            <Form
                {...layout}
                name="EmailSupportForm"
                
                onFinish={sendEmail}
                // onFinishFailed={onFinishFailed}
                >
                <Title 
                    level={4} 
                    style={{marginBottom: 20, textAlign: "center"}}
                >Contact Us</Title>


                <Form.Item {...layout}
                    rules={[
                    {
                        required: true,
                        message: <Text style={{marginLeft: "30px", color: "red"}}
                        >Please input your email address!</Text>,
                        type: 'email',
                    }
                    ]}
                    name='EmailAddress'
                >
                    <Input
                        addonBefore="Email"
                        style={{paddingLeft: "30px"}}
                    />
                </Form.Item>
                <Form.Item
                    style ={{
                        
                    }}
                    rules={[
                    {
                        required: true,
                        message: <Text  style={{marginLeft: "30px", color: "red"}}
                        >Please tell us your name!</Text>,
                        type: 'string',
                    },
                    ]}
                    name='UserName'
                >
                    <Input
                        addonBefore="Name"
                        style={{ paddingLeft: "30px"}}
                    />
                </Form.Item>

                <Text style={{ marginLeft: "32px"}}>
                        Please describe the issue:</Text>
                <Form.Item
                
                    rules={[
                    {
                        required: true,
                        message: <Text  style={{marginLeft: "30px", color: "red"}}
                        >The problem cannot be empty. </Text>,
                        
                    },
                    ]}
                    name='Question'
                >
                    
                    <TextArea 
                    style={{ marginLeft: "30px", width: "93%"}}
                    rows={6}/>
                                    
                </Form.Item>

                <Form.Item style={{marginLeft: "30px"}}>
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
                        <p className="ant-upload-text">Click or drag images to this area to upload if needed</p>
                        
                    </Dragger>
                </Form.Item>

                <Form.Item {...tailLayout}
                    // style={{textAlign: "center"}}
                >
                    <Button type="primary" htmlType="submit" disabled={loading}>
                        Send Email
                    </Button>
                    
                </Form.Item>
            </Form>
            </Modal>

            
        </>
    );
}

export default EmailSupport;