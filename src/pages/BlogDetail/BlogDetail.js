import React ,{Component} from 'react';
import DisplayPageHeader from '../../layouts/DisplayPageHeader/DisplayPageHeader';
import DisplayPageFooter from '../../layouts/DisplayPageFooter/DisplayPageFooter';
import {Layout, Typography} from 'antd';
import axio from '../Blog/axios-blog';
import * as styles from './BlogDetail.module.scss';
import { Grid, Row} from 'react-flexbox-grid';
import Page from './page';
const {Content} = Layout;
const {Title} = Typography;

export default class BlogDetail extends Component {
  state = {
      blog:[]
  }
  getBlog(){
    axio
        .get(this.props.id,{ responseType: 'json' })
        .then(res=>{
          console.log(res.data)
          this.setState({blog:[res.data]})
          console.log(this.blog)
        }).catch((error)=>{console.log(error)})
  }
  componentDidMount(){
    this.getBlog() 
  }

  render() {
    return (
      <Layout className={styles.layout}>
        <DisplayPageHeader/>
          <Content className={styles.content}>
            <Grid fluid>
              <Row center="xs" xs={12}>
                  <Page dataSource={this.state.blog}/>
              </Row>

            </Grid>
          </Content>


        <DisplayPageFooter/>
      </Layout>
  )
};
}
