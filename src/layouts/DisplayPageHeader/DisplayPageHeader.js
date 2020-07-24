import React from 'react';
import {Button, Layout, Breadcrumb} from 'antd';
import {Link} from 'react-router-dom';
import logo from '../../assets/logo.png';
import './DisplayPageHeader.scss'
import { Menu } from 'antd';
const { Header} = Layout;

const disPlayPageHeader =()=>(
    <div className="DiplayPageHeader">
    <Header style = {{backgroundColor:'#ffffff',Width: "100%",Height:"64px", minWidth:'1080px', display:'flex',padding:'16px,16px'}}> 
        <strong><Link to="/cn"><img src = {logo} alt="logo" width="110px" height="45px"/></Link></strong>
        <Menu mode="horizontal" style={{width: "100%",border:'none'}} selectedKeys={['']} >
            
            <Menu.Item key="产品功能" >
                <li className='DiplayPageHeader'><Link to="/cn">产品功能</Link></li>
            </Menu.Item>
            <Menu.Item key="产品定价">
            <li className='DiplayPageHeader'><Link to="/cn">产品定价</Link></li>
            </Menu.Item>
            
        </Menu> 
        <Link to="/user/login"><Button style = {{background:'#f6f6f6',float:'right',marginTop:'15px'}} shape="middle" size='large'>登录</Button></Link>
        <Link to="/user/register"><Button style = {{backgroundColor:'#f6f6f6',float:'right',marginTop:'15px'}} shape="middle" size='large'>快速注册</Button></Link>   
            {/* <nav className="DiplayPageHeader-nav">  
                <strong><Link to="/cn"><img src = {logo} alt="logo" width="110px" height="45px"/></Link></strong>                   
                <ul className="DiplayPageHeader-nav-item">                                 
                    <li><Link to="/cn">产品功能</Link>
                    <Link to="/cn">产品定价</Link></li>
                    <li><a><Link to="/">空间</Link></a></li>
                    <li><a><Link to="/">定价</Link></a></li>
                    <li><a><Link to="/">下载</Link></a></li>
                    <li><a><Link to="/">发现</Link></a></li>              
                </ul> */}
        
                {/* <Link to="/user/login"><Button style = {{background:'#f6f6f6',float:'right',marginTop:'15px'}} shape="middle" size='large'>登录</Button></Link>
                <Link to="/user/register"><Button style = {{backgroundColor:'#f6f6f6',float:'right',marginTop:'15px',marginRight:'80px'}} shape="middle" size='large'>快速注册</Button></Link> */}
                
            {/* </nav> */}
            
          
      </Header>
      </div>
)

export default disPlayPageHeader;
