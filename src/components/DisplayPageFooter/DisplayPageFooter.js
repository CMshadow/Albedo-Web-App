import React from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './DisplayPageFooter.scss';

const { Footer} = Layout;
const dispalyPageFooter=()=>(
    <div className="DisplayPageFooter">
        <Footer style = {{backgroundColor:'#f0f2f5',textAlign:"center",width: "100%",height:"130px",position: "absolute",bottom:'0px',left:'0px'}}>
            <img src = {logo} alt="logo" width="85px" height="35px" display= 'inline-block'vertical-align='middle'/>
            <span >十万阿里人都在用的笔记与文档知识库</span>
            <nav className="DisplayPageFooter-nav">                      
                <ul className="DisplayPageFooter-nav-item">                                 
                    <li><a><Link to="/"> 关于语雀</Link></a></li>
                    <li><a><Link to="/">使用帮助</Link></a></li>
                    <li><a><Link to="/">数据安全</Link></a></li>
                    <li><a><Link to="/">服务协议</Link></a></li>   
                </ul>  
            </nav>
            <p >© 语雀  经营许可证编号：合字B2-20190051ICP备案号：浙ICP备16025414号-3</p>
        </Footer>
    </div>
)

export default dispalyPageFooter;