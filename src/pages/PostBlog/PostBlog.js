import React,{Component} from 'react';
import E from 'wangeditor'
import axio from '../Blog/axios-blog';
import axios from 'axios';
import './PostBlog.css';
import { Button } from 'antd';
export default class PostBlog extends Component{

    state = {
        id: '',
        title: '',
        brief: '',
        cover: '',
        editorContent:''
    };
    
    uploadFile=(e)=>{
        const file = e.target.files[0]
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Make a fileInfo Object
            let fileInfo = {
              name: file.name,
              type: file.type,
              size: Math.round(file.size / 1000) + ' kB',
              base64: reader.result,
              file: file,
            };
            axios
                .post('https://m6s9bsab0b.execute-api.us-east-2.amazonaws.com/dev/picofblog',fileInfo)
                .then(function (result) {
                    console.log(result.data.body);
                    this.setState({'cover':JSON.parse(result.data.body)});
                }.bind(this))
                .catch(function (err) {
                    console.log(err);
                });
        }  
 };
    
    handleChange=(e)=>{
        if (e.target.name === 'ID') {
            this.setState({ 'id': e.target.value });
        }
        if (e.target.name === 'Title') {
            this.setState({ 'title': e.target.value });
        }
        if (e.target.name === 'Brief') {
            this.setState({ 'brief': e.target.value });
        }
        if (e.target.name === 'Content') {
            this.setState({ 'content': e.target.value });
        }
      };
    handleFileSubmit=()=>{
        const Item = {
            'id': this.state.id,
            'brief': this.state.brief,
            'content': this.state.editorContent.replace(/\"/g,"'"),
            'cover': this.state.cover,
            'title':this.state.title
          };
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin':'*'
            }
          };
        axios
            .post('https://xt18hpbqsj.execute-api.us-east-2.amazonaws.com/dev/blogs', Item,axiosConfig)
            .then(function (result) {
                console.log(result)
            })
            .catch(function (err) {
                console.log(err);
                console.log(Item)
            });
    };
    componentDidMount() {
        const elemMenu = this.refs.editorElemMenu;
        const elemBody = this.refs.editorElemBody;
        const editor = new E(elemMenu,elemBody)
        editor.customConfig.onchange = html => {
            this.setState({
                editorContent: editor.txt.html()
            })
        }
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]
        editor.customConfig.uploadImgShowBase64 = true
        editor.customConfig.customUploadImg = function (files, insert) {
            const file = files[0]
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
            // Make a fileInfo Object
            let fileInfo = {
                name: file.name,
                type: file.type,
                size: Math.round(file.size / 1000) + ' kB',
                base64: reader.result,
                file: file,
            };

            axios
                .post('https://m6s9bsab0b.execute-api.us-east-2.amazonaws.com/dev/picofblog',fileInfo)
                .then(function (result) {
                    const url = JSON.parse(result.data.body)
                    insert(url);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }
    editor.create()

    };
    render(){
        return(
            <div className = 'PostBlog'>
                <div>
                    <form>
                        <label>
                            ID:
                            <input type="number" name="ID" onChange={this.handleChange}/>
                        </label>
                        <label>
                            Title:
                            <input type="text" name="Title" onChange={this.handleChange}/>
                        </label>
                        <label>
                            Brief:
                            <input type="text" name="Brief" onChange={this.handleChange}/>
                        </label>
                        <label>
                            Cover IMG:
                            <input  type="file" name="Cover" onChange={this.uploadFile}/>
                        </label> 
                        
                        <div ref="editorElemMenu"
                            style={{backgroundColor:'#f1f1f1',border:"1px solid #ccc"}}
                            className="editorElem-menu">

                        </div>
                        <div
                            style={{
                                padding:"0 10px",
                                overflowY:"scroll",
                                height:500,
                                border:"1px solid #ccc",
                                borderTop:"none"
                            }}
                            ref="editorElemBody" className="editorElem-body">
                        </div>
                        <Button onClick={this.handleFileSubmit}>Submit</Button>
                        <div>{this.state.editorContent.replaceAll("\\",'')}</div>
                    </form> 
                </div>
            </div>
        );
    }
}
