import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLForm, RLFormItem, RLRadioGroup, RLRadio, RLDisplayBoard, RLDivider, RLTextarea } from '@components/index.js'
import actionVODManage from '@actions/VODManage/actionVODManage.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import config from '@/config.js'

import { createRef } from 'react'
import RLCheckbox from '../../../../components/RLCheckbox.js'
import { Divider } from 'antd';
class CmpCommentEdit extends BaseCmp {
    constructor(props) {
        super(props);

        this.vodId = props.vodId;
        this.vodPage = props.vodPage;
        this.commentId = props.commentId;
        this.commentPage = props.commentPage;

        this.state = {
            commentInfo: props.commentInfo,  
        }
        this.form = createRef()
    }
    componentWillMount() {

    }

    pageTitle = () => {
        let title = '添加用户'
        if (this.userId) {
            title = '编辑用户'
        }
        return (
            <div className="custom-page-title">
                <span>{title}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list')
                    }}
                    label='返回'
                />
            </div>
        )
    }

    updateValue(data){
        actionVODManage.editComment(data).then(res =>{
            if(res.code === 200){
                this.showToast({type:'success',content:'回复成功'});
                this.props.changePage('comment_list',{
                    vodId: this.vodId,
                    vodPage: this.vodPage,
                    commentPage: this.commentPage
                });
            }else{
                this.showToast({type:'error',content: '回复失败'});
            }  
        }).catch( err=>{
            this.showToast({type:'error',content: '回复失败'});
        })
    }

    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>{this.chapterId ? '章节创建': '章节编辑'}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('comment_list',{
                            vodId: this.vodId,
                            vodPage: this.vodPage,
                            commentPage: this.commentPage
                        });
                    }}
                    label='返回'
                />
            </div>
        )
    }
    render() {

        return (
            <WindowContainer title={this.pageTitle}>
                <div className='page-userAdd'>
                        {/*  */}
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:20}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>评论人</div>
                            <div>{this.state.commentInfo.creator}</div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:20}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>评论时间</div>
                            <div>{this.state.commentInfo.created_at}</div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:40}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>评论内容</div>
                            <div>{this.state.commentInfo.content}</div>
                        </div>
                        <div style={{width:100,textAlign:'right',marginRight:50}}>回复评价</div>
                        <Divider style={{marginTop: 10, marginBottom:10}}/>
                        <div style={{ display:'flex', flexDirection:'row',marginBottom:20}}>
                            <div style={{width:100,textAlign:'right',marginRight:50}}>回复内容</div>
                            <RLTextarea 
                                value={this.state.commentInfo.reply_content}
                                placeholder="请输入回复"
                                onChange={(e)=>{
                                    this.setState({
                                        commentInfo:{
                                            ...this.state.commentInfo,
                                            reply_content: e.target.value
                                        }
                                    })
                                }}
                                style={{width: 600, height: 400}}
                                />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center',marginTop:20 }}>
                            <RLButton type="default" label='取消' width={80}
                                style={{ display: 'inline-block' }}
                                onClick={() => {
                                    this.props.changePage('comment_list',{
                                        vodId: this.vodId,
                                        vodPage: this.vodPage,
                                        commentPage: this.commentPage
                                    })
                                }} />
                            <RLButton type="primary"
                                label="确定"
                                style={{ marginLeft: 40, display: 'inline-block' }}
                                loading={this.state.addLoading}
                                width={80}
                                onClick={()=>{
                                    this.updateValue({
                                        course_id: this.vodId,
                                        comment_id: this.commentId,
                                        reply_content: this.state.commentInfo.reply_content,
                                        type: 'comment'
                                    })
                                }}
                            />
                        </div>
                </div>
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
    }
})(CmpCommentEdit)