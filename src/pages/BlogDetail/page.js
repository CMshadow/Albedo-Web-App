import React from 'react';
import {Layout} from 'antd';
import reactHtmlParser from 'react-html-parser'
export default ({ dataSource }) =>{
    return( 
    <Layout>
            {
                 dataSource.map(item=>     
                    <div key={item.id}>
                            <div >
                                <img alt='cover' src={ item.cover } />
                            </div>
                            {/* {document.body.outerHTML=item.content}  */}
                            <div>{reactHtmlParser(item.content) }</div>                                              
                    </div>)
            }
    </Layout>)
}
