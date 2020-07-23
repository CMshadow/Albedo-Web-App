import React from 'react';
import 'antd/dist/antd.css';
import { Button, Layout ,Breadcrumb} from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './DisplayPageHeader.scss'
const { Header} = Layout;

const disPlayPageHeader =()=>(
    <div className="DiplayPageHeader">
    <Header style = {{backgroundColor:'#ffffff',width: "100%",height:"64px", minWidth:'1400px'}}>     
            <nav className="DiplayPageHeader-nav">  
                <strong><a><Link to="/cn"><img src = {logo} alt="logo" width="110px" height="45px"/></Link> </a> </strong>                   
                <ul className="DiplayPageHeader-nav-item">                                 
                    <li><a><Link to="/cn">产品功能</Link></a>
                    <a><Link to="/cn">产品定价</Link></a></li>
                    {/*<li><a><Link to="/">空间</Link></a></li>
                    <li><a><Link to="/">定价</Link></a></li>
                    <li><a><Link to="/">下载</Link></a></li>
                    <li><a><Link to="/">发现</Link></a></li>   */ }               
                </ul>
                <Link to="/user/login"><Button style = {{background:'#f6f6f6',float:'right',marginTop:'15px'}} shape="middle" size='large'>登录</Button></Link>
                <Link to="/user/register"><Button style = {{backgroundColor:'#f6f6f6',float:'right',marginTop:'15px',marginRight:'80px'}} shape="middle" size='large'>快速注册</Button></Link>
                
            </nav>
            
          
      </Header>
      </div>
)


export default disPlayPageHeader;