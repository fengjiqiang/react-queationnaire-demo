import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLButton, RLDivider, RLTextarea, RLSwitch } from '@components/index.js'
import actionQAManage from '@actions/marketingTool/actionQAManage.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import config from '@/config.js'
import CmpFile from './CmpFile.js';
import moment from 'moment';
import { createRef } from 'react'
import RLCheckbox from '../../../../components/RLCheckbox.js'
import { Divider, Upload } from 'antd';
import { StaticRouter } from 'react-router-dom'
class CmpCommentEdit extends BaseCmp {
    constructor(props) {
        super(props);

        this.questionId = props.questionId;
        this.questionPage = props.questionPage;
        this.is_reply = props.is_reply;

        this.is_edit = this.is_reply

        this.state = {
            question: {
                accessory: {
                    urls: []
                },
                creator: {}
            },
            reply: [],

            is_edit: this.is_reply,

            content: "",
            urls: [],
            is_show: 0,

            addLoading: false
        }
        this.form = createRef()
    }
    componentWillMount() {
        this.getQuestionDetail();
    }

    replyEdit(){
        if(this.state.content.length === 0){
            this.showToast({type:'error',content:'请输入回复内容'});
            return;
        }
        if(this.state.content.length > 1000){
            this.showToast({type:'error',content:'回复字数不得大于1000'});
            return;
        }
        this.setState({
            addLoading: true
        });
        actionQAManage.replyEdit({
            id: this.state.reply[0].id,
            content: this.state.content,
            is_show: this.state.is_show,
            urls: this.state.urls
        }).then(res=>{
            if(res.code === 200){
                this.setState({
                    addLoading: false
                })
                this.showToast({type:'sucuess',content:'修改成功'});
                this.props.changePage('list', {
                    questionPage: this.questionPage
                })
            }else{
                this.setState({
                    addLoading: false
                })
                this.showToast({type:'error',content: res.msg});
            }
        })
    }
    replyCommit(){
        if(this.state.content.length === 0){
            this.showToast({type:'error',content:'请输入回复内容'});
            return;
        }
        if(this.state.content.length > 1000){
            this.showToast({type:'error',content:'回复字数不得大于1000'});
            return;
        }
        this.setState({
            addLoading: true
        });
        
        actionQAManage.replyCommit({
            id: this.questionId,
            content: this.state.content,
            is_show: this.state.is_show,
            urls: this.state.urls
        }).then(res =>{
            if(res.code === 200){
                this.showToast({type:'sucuess',content:'回复成功'});
                this.props.changePage('list', {
                    questionPage: this.questionPage
                })
            }
        });
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>问题回复</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list',{
                            questionPage: this.questionPage
                        })
                    }}
                    label='返回'
                />
            </div>
        )
    }
    getQuestionDetail(){
        actionQAManage.getQuestionDetail({
            id: this.questionId
        }).then(res => {
            if(res.code === 200){
                console.log('-------res------',res)
                this.setState({
                    question: res.data.question,
                    reply: res.data.reply,
                    content: res.data.reply[0] ? res.data.reply[0].content : '',
                    urls: res.data.reply[0] ? res.data.reply[0].accessory.urls : [],
                    is_show: res.data.question.is_show,
                });
            }
        });
    }

    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>{this.is_reply ? '问题回复': '问题查看'}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list',{
                            questionPage: this.questionPage
                        });
                    }}
                    label='返回'
                />
            </div>
        )
    }
    render() {
        console.log('-------question-------', this.state.question)
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='page-userAdd'>
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:20}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>提问者</div>
                            <div>
                                {this.state.question.creator.nickname}
                                {this.state.question.is_hide !== 0 && this.state.question.creator.approval_status === 3 && <span>(认证用户)</span>}
                            </div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:20}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>提问时间</div>
                            <div>{this.state.question.create_at && moment(this.state.question.create_at * 1000).format('YYYY-MM-DD HH:mm')}</div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:40}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>问题描述</div>
                            <div>{this.state.question.describe}</div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:40}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>问题详情</div>
                            <div>
                                <div>{this.state.question.detail}</div>
                                <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                                    {
                                        this.state.question.accessory.urls
                                        .filter( obj => !obj.title.endsWith('.pdf') && !obj.title.endsWith('.PDF'))
                                        .map( obj => {
                                            return <img src={obj.url} key={obj.title} style={{width:160,height:120,marginLeft:10}}/>
                                        })
                                    }
                                </div>
                                <div >
                                    {
                                        this.state.question.accessory.urls
                                        .filter( obj => obj.title.endsWith('.pdf') || obj.title.endsWith('.PDF'))
                                        .map( obj => {
                                            return <CmpFile 
                                                        src={obj.url}
                                                        name={obj.title}
                                                        editable={false}
                                                        click={()=>{
                                                            window.open(obj.url);
                                                        }}
                                                    />
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            !this.is_reply && <div style={{color:'#8F1D22'}}>管理员-{this.state.reply[0] && this.state.reply[0].creator}已回复</div>
                        }
                        <Divider style={{marginTop: 10, marginBottom:10}}/>
                        <div style={{width:100,paddingLeft:5,textAlign:'left',marginRight:50,borderLeft:'5px solid #8F1D22'}}>回复</div>
                        
                        {

                            this.state.is_edit ? 
                            <>
                                <div style={{ display:'flex', flexDirection:'row',marginBottom:20, position:'relative'}}>
                                    <div style={{width:100,textAlign:'right',marginRight:50}}><span style={{color:'red'}}>*</span>回复内容</div>
                                    <div style={{position:'relative'}}>
                                        <RLTextarea 
                                            value={this.state.content}
                                            placeholder="请输入回复"
                                            onChange={(e)=>{
                                                this.setState({
                                                    content: e.target.value
                                                })
                                            }}
                                            style={{width: 520, height: 120}}
                                        />
                                        <div style={{position:'absolute',right:5,bottom:5, color:this.state.content.length > 1000 ? 'red':''}}>{ this.state.content.length } / 1000 </div>
                                    </div>   
                                </div>

                                <div style={{ display:'flex', flexDirection:'row',marginBottom:20}}>
                                    <div style={{width:100,textAlign:'right',marginRight:50}}>辅助材料</div>
                                    <div>
                                        <div style={{display:'flex',flexDirection:'row',alignItems:'flex-end'}}>
                                            <Upload 
                                                accept=".jpeg,.png,.pdf"
                                                showUploadList={false}
                                                customRequest={(upload) =>{
                                                    if(! /^.*\.(jpg|JPG|png|PNG|pdf|PDF)$/.test(upload.file.name)){
                                                        this.showToast({type:'error', content:'上传文件类型应为jpg、png、pdf'});
                                                        return;
                                                    }
                                                    if (upload.file.size > 5 * 1024 * 1024) {
                                                        this.showToast('文件大小不应大于5M');
                                                        return;
                                                    }
                                                    let formData = new FormData();
                                                    formData.append('type', 'doc')
                                                    formData.append('resource', upload.file);
                                                    commonAction.fileUpload(formData).then(res => {
                                                        if(res.code === 200){
                                                            this.state.urls.push({title: upload.file.name, url: res.data.fileurl});
                                                            this.forceUpdate();
                                                        }else{
                                                            this.showToast({type:'error',content: '上传失败'})
                                                        }
                                                       
                                                    })
                                                }}
                                            >
                                                <RLButton label="上传文件"/>
                                            </Upload>
                                            <div style={{marginLeft:10}}>支持上传jpg、png、pdf文件，文件大小不超过5M</div>
                                        </div>
                                        {
                                            this.state.urls.map(obj => {
                                                return <CmpFile 
                                                    src={obj.url}
                                                    name={obj.title}
                                                    editable={true}
                                                    onDelete={()=>{
                                                        let index = this.state.urls.findIndex(url => url.url === obj.url);
                                                        if(index >= 0){
                                                            this.state.urls.splice(index, 1);
                                                            this.forceUpdate();
                                                        }
                                                    }}
                                                />
                                            })
                                        }
                                    </div>
                                </div>
                                <div style={{ display:'flex', flexDirection:'row',marginBottom:20}}>
                                    <div style={{width:100,textAlign:'right',marginRight:50}}>是否显示</div>
                                    <RLSwitch 
                                        checked={this.state.is_show === 1}
                                        onChange={(e)=>{
                                            this.setState({
                                                is_show: e ? 1 :0
                                            })
                                        }}
                                    />
                                </div>
                            </>:
                                <div style={{ display:'flex', flexDirection:'row',marginBottom:40}}>
                                    <div style={{width:100, textAlign:'right',marginRight:50}}>回复详情</div>
                                    <div style={{flex:1}}>
                                        <div>{this.state.reply[0] && this.state.reply[0].content}</div>
                                        <div>
                                            {
                                                this.state.urls
                                                .filter( obj => !obj.url.endsWith('.pdf') && !obj.url.endsWith('.PDF') )
                                                .map( obj => {
                                                    return <img src={obj.url} style={{width:200,height:120}}></img>
                                                })
                                            }
                                        </div>
                                        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                                            {
                                                this.state.urls
                                                .filter( obj => obj.url.endsWith('.pdf') || obj.url.endsWith('.PDF'))
                                                .map( obj => {
                                                    return <CmpFile 
                                                                src={obj.url}
                                                                name={obj.title}
                                                                editable={false}
                                                            />
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                        }
                        
                        <div style={{ display: 'flex', justifyContent: 'center',marginTop:20 }}>
                            <RLButton type="default" label='取消' width={80}
                                style={{ display: 'inline-block' }}
                                onClick={() => {
                                    this.props.changePage('list',{
                                        questionPage: this.questionPage
                                    })
                                }} />

                            {
                                this.is_reply ? <RLButton type="primary"
                                                    label="提交回复"
                                                    loading={this.addLoading}
                                                    style={{ marginLeft: 40, display: 'inline-block' }}
                                                    loading={this.state.addLoading}
                                                    width={80}
                                                    onClick={()=>{
                                                        this.replyCommit();
                                                    }}
                                                    style={{ width: 110, marginLeft:30 }}
                                                /> : 
                                                    
                                                <>
                                                    {
                                                        this.state.reply[0] && this.state.reply[0].uid === this.props.userInfo.id ? 
                                                        <>
                                                            {
                                                                this.state.is_edit ? 
                                                                <RLButton type="primary"
                                                                    label="提交修改"
                                                                    addLoading={this.addLoading}
                                                                    style={{ marginLeft: 40, display: 'inline-block' }}
                                                                    loading={this.state.addLoading}
                                                                    width={80}
                                                                    onClick={()=>{
                                                                        this.replyEdit();
                                                                    }}
                                                                    style={{width:110, marginLeft:30}}
                                                                />:
                                                                <RLButton type="primary"
                                                                    label="编辑"
                                                                    style={{ marginLeft: 40, display: 'inline-block' }}
                                                                    width={80}
                                                                    onClick={()=>{
                                                                        this.setState({
                                                                            is_edit: true
                                                                        })
                                                                    }}
                                                                />
                                                            }
                                                        </>: null
                                                    }

                                                </>
                                                
                            }
                            
                        </div>
                </div>
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
        userInfo: store.personalInfo.userInfo
    }
})(CmpCommentEdit)