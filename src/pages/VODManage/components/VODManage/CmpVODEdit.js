import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import { RLInput, RLButton, RLSelect, RLForm, RLFormItem, RLRadioGroup, RLRadio, RLTextarea, RLTag } from '@components/index.js'
import actionVODManage from '@actions/VODManage/actionVODManage.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import config from '@/config.js'

import  CmpUpload  from '@/pages/common/CmpUpload.js';

import { createRef } from 'react'

import CmpAddUser from '@/pages/common/meeting/AddUser.js'; 
import '../../../infoManage/components/InfoManage/CmpInfoEdit.less'

const { TabPane } = Tabs

class CmpVODEdit extends BaseCmp {
    constructor(props) {
        super(props);
        this.vodId = props.vodId;
        this.vodPage = props.vodPage;
        this.state = {
            language: 'zh',  //zh: 中文 en: 英文
            showAddUserModal: false,
            vodInfo: {
                title : "", //点播主题
                en_title: "", //英文点播主题
                render_desc: "", // 点播简介
                en_render_desc: "", // 英文点播简介
                thumb: "", //点播封面
                users: [], //可见人名单
                is_public: 1, //是否公开 1 是
                is_comment: 1, //是否允许评论  1可以 
                is_show: 1, //是否上架  1可以 
                speaker: "", //主讲人
            },
            is_edit: this.vodId ? true : false,
            addLoading: false,  // 添加按钮loading
        }

        this.form = createRef();
    }
    componentWillMount() {
        
        if (this.vodId) {
            this.getVODInfo()
        } 
    }
    getVODInfo(){
        actionVODManage.getVODDetail(this.vodId).then(res =>{
            if (res.code === 200) {
                this.setState({
                     vodInfo: res.data
                 }, ()=>{
                     //给表单重置值
                     this.form && this.form.setFieldsValue(this.state.vodInfo)
                 });
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).catch(err =>{

        })
    }
    editConfirm = (values) => {
        this.setState({
            addLoading: true
        })
        if(this.state.language === 'zh'){
            if(this.state.vodInfo.en_title && !this.state.vodInfo.en_render_desc){
                this.showToast({ type:'error',content:'请填写英文点播简介'});
                this.setState({
                    addLoading: false
                });
                return;
            }else if(!this.state.vodInfo.en_title && this.state.vodInfo.en_render_desc){
                this.showToast({ type:'error',content:'请填写英文点播主题'});
                this.setState({
                    addLoading: false
                })
                return;
            }
        }else if(this.state.language === 'en'){
            if(this.state.vodInfo.title && !this.state.vodInfo.render_desc){
                this.showToast({ type:'error',content:'请填写中文点播简介'});
                this.setState({
                    addLoading: false
                });
                return;
            }else if(!this.state.vodInfo.title && this.state.vodInfo.render_desc){
                this.showToast({ type:'error',content:'请填写中文点播主题'});
                this.setState({
                    addLoading: false
                })
                return;
            }
        }

        let data = {
            type: this.state.language === 'zh' ? 'cn': 'en',
            title: this.state.vodInfo.title,
            render_desc: this.state.vodInfo.render_desc,
            thumb: this.state.vodInfo.thumb,
            is_public: this.state.vodInfo.is_public,
            users: this.state.vodInfo.users.map(item => item.id),
            speaker: this.state.vodInfo.speaker,
            is_comment: this.state.vodInfo.is_comment,
            en_title: this.state.vodInfo.en_title,
            en_render_desc: this.state.vodInfo.en_render_desc
        };

        if (this.vodId) {
            data.course_id = this.vodId;
            actionVODManage.editVOD(data).then(res => {
                console.log('编辑用户返回--res:', res)
                if (res.code === 200) {
                    this.showToast({ content: '编辑点播成功', type: 'success' })
                    this.props.changePage('vod_list',{
                        vodPage: this.vodPage
                    })
                } else {
                    this.showToast({ type: 'error', content: res.msg });
                    this.setState({
                        addLoading: false
                    })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        } else {
            actionVODManage.addVOD(data).then(res => {
                if (res.code === 200) {
                    this.props.changePage('vod_list',{
                        vodPage: this.vodPage
                    })
                } else {
                    this.showToast({ type: 'error', content: res.msg });
                    this.setState({
                        addLoading: false
                    })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        }
    }

    pageTitle = () => {
        let title = '添加点播'
        if (this.vodId) {
            title = '编辑点播'
        }
        return (
            <div className="custom-page-title">
                <span>{title}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('vod_list', {
                            vodPage: this.vodPage
                        })
                    }}
                    label='返回'
                />
            </div>
        )
    }
    createLabel = (labelName, need, style = {}) => {
        return <div>
          {need ? <span style={{ color: '#ff4d4f',fontSize: 14, fontFamily:'SimSun, sans-serif' }}>*</span> : null}
          <span style={{ ...style }}>{labelName}</span>
        </div>
    }
    render() {

        return (
            <WindowContainer title={this.pageTitle}>
                <div className='page-info-edit'>
                        <Tabs defaultActiveKey="zh"
                            style={{ flex: 1 }}
                            onChange={key => {
                                this.setState({
                                    language: key
                                })
                            }}
                        >
                            <TabPane tab="中文" key="zh">
                            </TabPane>
                            <TabPane tab="英文" key="en">
                            </TabPane>
                        </Tabs>
                        <RLForm ref={ form => this.form = form}
                            labelCol={{ style: { width: 150, marginRight: 20, marginLeft: 30, textAlign:'right' } }}
                            labelAlign='left'
                            wrapperCol={
                                { span: 24 }
                            }
                            onFinish={this.editConfirm}
                            initialValues={this.state.vodInfo}
                            validateTrigger='onBlur'
                        >      
                            {
                                this.state.language === 'zh' ?
                                <>
                                    <RLFormItem name='title' label='点播主题' colon={false} 
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入点播主题'
                                            }
                                        ]}>
                                        <RLInput placeholder='请输入点播主题' style={{ width: 360 }} 
                                            value={this.state.vodInfo.title}
                                            onChange={(e)=>{
                                                this.setState({
                                                    vodInfo: {
                                                        ...this.state.vodInfo,
                                                        title: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                    </RLFormItem>
                                    
                                    <RLFormItem name='render_desc' label='点播简介' colon={false} 
                                        rules={[{
                                            required: true,
                                            message: '请输入点播简介'
                                        }]
                                        }>
                                        <RLTextarea placeholder='请输入点播简介' style={{ width: 600, height: 400 }} 
                                            value={this.state.vodInfo.render_desc}
                                            onChange={(e)=>{
                                                this.setState({
                                                    vodInfo: {
                                                        ...this.state.vodInfo,
                                                        render_desc: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                    </RLFormItem>
                                </>: 
                                <>
                                    <RLFormItem name='en_title' label='点播主题' colon={false} 
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入点播主题'
                                            }
                                        ]}>
                                        <RLInput placeholder='请输入点播主题' style={{ width: 360 }}
                                            value={this.state.vodInfo.en_title}
                                            onChange={(e)=>{
                                                this.setState({
                                                    vodInfo: {
                                                        ...this.state.vodInfo,
                                                        en_title: e.target.value
                                                    }
                                                })
                                            }} 
                                        />
                                    </RLFormItem>
                                    
                                    <RLFormItem name='en_render_desc' label='点播简介' colon={false} 
                                        rules={[{
                                            required: true,
                                            message: '请输入点播简介'
                                        }]
                                        }>
                                        <RLTextarea placeholder='请输入点播简介' style={{ width: 600, height: 400 }} 
                                            value={this.state.vodInfo.en_render_desc}
                                            onChange={(e)=>{
                                                this.setState({
                                                    vodInfo: {
                                                        ...this.state.vodInfo,
                                                        en_render_desc: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                    </RLFormItem>
                                </>
                            }                                             

                            <RLFormItem name='thumb' label='点播封面' colon={false} 
                                rules={[{
                                    required: true,
                                    message: '请选择点播封面'
                                }]
                                }>
                                <CmpUpload 
                                    aspect={ 4 / 3 }
                                    saveUrl={(fileurl)=>{
                                        this.setState({
                                            vodInfo: {
                                                ...this.state.vodInfo,
                                                thumb: fileurl
                                            }
                                        });
                                        this.form.setFieldsValue({
                                            thumb: fileurl
                                        });
                                    }}
                                    src={this.state.vodInfo.thumb}
                                    imgStyle={{width:86,height:65}}
                                    default={require('../../../../assets/images/default.png').default}
                                />
                                <div style={{marginTop: 10}}>只能上传jpg/png格式图片，大小不超过2M，图片比例4:3</div>
                            </RLFormItem>

                            <RLFormItem name="is_public" label="发布范围" colon={false}
                                rules={[{
                                    required: true,
                                    message: '请选择发布范围'
                                }]}>
                                <RLRadioGroup 
                                    value={this.state.vodInfo.is_public}
                                    items={[
                                        {label:'公开', value: 1},
                                        {label:'非公开', value: 0}
                                    ]}
                                    onChange={(e)=>{
                                        console.log(e)
                                        this.setState({
                                            vodInfo: {
                                                ...this.state.vodInfo,
                                                is_public: e.target.value
                                            }
                                        })
                                    }}
                                />
                            </RLFormItem>

                            <RLFormItem label={this.createLabel('可见名单', this.state.vodInfo.is_public === 0)} colon={false}
                                    name='users'
                                    rules={[
                                        {
                                            validator: () => {
                                                if(this.state.vodInfo.is_public === 0){
                                                    if (this.state.vodInfo.users.length === 0) {
                                                        return Promise.reject('请选择可见人员名单')
                                                    } else {
                                                        return Promise.resolve()
                                                    }
                                                }else{
                                                    return Promise.resolve();
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    <div className='form-item-gropu' style={{display:'flex',flexDirection:'row'}}>
                                        <div style={{
                                            width: 500,
                                            minHeight: 60,
                                            maxHeight: 200,
                                            border: '1px solid rgb(220, 223, 230)',
                                            borderRadius: 3,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            padding: '10px 10px 10px 10px',
                                            boxSizing: 'border-box',
                                            overflowY: 'scroll'
                                        }}>
                                            {this.state.vodInfo.users.map(ele => {
                                                return <div style={{ height: 19,marginTop:10 }} key={ele.id}>
                                                    <RLTag label={ele.nickname} closable onClose={() => {
                                                        let all = [...this.state.vodInfo.users]
                                                        let index = all.findIndex(clc => { return clc.id === ele.id });
                                                        all.splice(index, 1);
                                                        this.setState({
                                                            vodInfo: {
                                                                ...this.state.vodInfo,
                                                                users: all
                                                            }
                                                        })
                                                    }} />
                                                </div>
                                            })}
                                        </div>
                                        <RLButton
                                            label='添加'
                                            type='primary'
                                            disabled={this.state.vodInfo.is_public === 1}
                                            onClick={()=>{
                                                this.setState({
                                                    showAddUserModal: true,
                                                })
                                            }}
                                            style={{ marginLeft: 20 }}
                                        />
                                    </div>
                                </RLFormItem>

                            <RLFormItem name="speaker" label="主讲人名称" colon={false}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <RLInput style={{ width: 360 }}
                                        value={this.state.vodInfo.speaker}
                                        onChange={(e) => {
                                            this.setState({
                                                vodInfo: {
                                                    ...this.state.vodInfo,
                                                    speaker: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                    <div style={{ marginLeft: 5 }}>若不填写，默认为中国债券信息网</div>
                                </div>
                            </RLFormItem>

                            <RLFormItem name="is_comment" label="评论区是否开放" colon={false}
                                rules={[]}>
                                <RLRadioGroup 
                                    value={this.state.vodInfo.is_comment}
                                    items={[
                                        {label:'允许',value: 1},
                                        {label:'禁止',value: 0}
                                    ]}
                                    onChange={(e)=>{
                                        this.setState({
                                            vodInfo: {
                                                ...this.state.vodInfo,
                                                is_comment: e.target.value
                                            }
                                        })
                                    }}
                                />
                            </RLFormItem>

                            <RLFormItem>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <RLButton type="default" label='取消' width={80}
                                        style={{ display: 'inline-block' }}
                                        onClick={() => {
                                            this.props.changePage('vod_list',{
                                                vodPage: this.vodPage
                                            })
                                        }} />
                                    <RLButton type="primary"
                                        htmlType="submit" label={this.vodId ? '保存' : '添加'}
                                        style={{ marginLeft: 40, display: 'inline-block' }}
                                        loading={this.state.addLoading}
                                        width={80}
                                        // onClick={this.editConfirm}
                                    />
                                </div>
                            </RLFormItem>
                        </RLForm>
                </div>
                <CmpAddUser 
                    visible={this.state.showAddUserModal}
                    showSelectGroup={true}
                    selectType="checkbox"
                    originArr={this.state.vodInfo.users}
                    onCancel={()=>{
                        this.setState({
                            showAddUserModal: false
                        })
                    }}
                    originCanCancel={false}
                    returnStyle="object"
                    onAdd={
                        (users)=>{
                            let originUsers = this.state.vodInfo.users;
                            let returnUsers = users.map(item => {
                                return {"id": item.id, "nickname": item.nickname};
                            })
                            let newUsers = []
                            for(let user of returnUsers){
                                let index = originUsers.findIndex(item => item.id === user.id)
                                if(index < 0){
                                    newUsers.push(user)
                                }
                            }
                            let finalUsers = originUsers.concat(newUsers);
                            this.setState({
                                vodInfo: {
                                    ...this.state.vodInfo,
                                    users: finalUsers
                                }
                        })
                    }}
                />
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
        // roleList: store.roleManage.roleList,
    }
})(CmpVODEdit)