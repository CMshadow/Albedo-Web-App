import React, { Component } from 'react';
import styles from './BlogList.module.scss';
import { Link } from 'react-router-dom';
import { Card, Tag } from 'antd';
const { Meta } = Card;
export default ({ dataSource }) =>{
    return <div className={ styles.bloglist }>
        <ul>
            {
                dataSource.map(item=>
                     <Card
                        hoverable
                        style={{ width: '18.75em', height:'45em', margin:'1.25em'}}
                        cover={<img alt={item.id} src={ item.cover } />}
                        activeTabKey={item.id}
                        extra={ <Link to={ `/cn/blog/${item.id}` } key = {item.id} > More </Link>}
                        >
                        <Meta 
                        title={item.title} 
                        description={item.brief} 
                        style={{ marginBottom: '1.8em'}}/>
                        {/* { item.tags && item.tags.map(i=><Tag key={i}>{i}</Tag>) } */}
                    </Card>
                )
            }
        </ul>
    </div>
}
