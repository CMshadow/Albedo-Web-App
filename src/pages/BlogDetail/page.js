import React from 'react';
import {Layout} from 'antd';
import reactHtmlParser from 'react-html-parser'
export default ({ dataSource }) =>{
    return( 
    <Layout>
            {
                 dataSource.map(item=>     
                    <div key={item.id}>
                           
                        <img alt='cover' src={ item.cover } />
                            
                        <h1>{item.title}</h1>
                        <p align="justify" line-height='2'>{reactHtmlParser(item.content) }</p>                                              
                    </div>)
            }
    </Layout>)
}
