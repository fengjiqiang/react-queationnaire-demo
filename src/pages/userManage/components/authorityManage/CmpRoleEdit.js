import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLForm, RLFormItem, RLRadioGroup, RLCheckbox } from '@components/index.js'
import commonAction from '@actions/commonActions'
import actionRoleManage from '@actions/userManage/actionRoleManage.js';
import utils from '@/libs/utils.js'
import config from '@/config.js'

import CmpAuthTree from './CmpAuthTree.js';

import { Input, Form,  } from 'antd';
import './CmpRoleEdit.less';


class CmpRoleEdit extends BaseCmp {
    constructor(props) {
        super(props);

        this.roleId = props.roleId;
        this.rolePage = props.rolePage
        this.roleDetail = props.roleDetail;
       
        this.state = {
            sysAuthData: [],
            is_edit: this.roleId ? true: false,
            addLoading: false,  // 添加按钮loadin
            roleInfo: this.roleId ? this.roleDetail: {role_name: '', role_desc:'', auth:[], role_code: ''},
            role_id: ''
        };
        this.authTree = createRef();
        this.form = createRef();

    }
    componentWillMount() {
        this.getSystemAuth();
    }
    getSystemAuth = ()=>{
        actionRoleManage.getSystemAuth().then(res =>{
            if(res.code === 200){
                this.setState({
                    sysAuthData: res.data
                });
            }else{
                this.showToast({type:'erroe', content: res.msg});
            }
        }).catch( err => {
            this.showToast({type:'erroe', content: err.msg});
        })
    }
    editConfirm = (values) => {
        this.setState({
            addLoading: true
        });
        let data = {
            ...values,
            role_code: this.roleId,
            auth: this.authTree.getCheckedList()
        }
        if (this.roleId) {
            actionRoleManage.editRole(data).then(res => {
                if (res.code === 200) {
                    this.showToast({ content: '编辑角色成功', type: 'success' })
                    this.setState({
                        addLoading: false
                    });
                    this.props.changePage('list',{
                        rolePage: this.rolePage
                    });
                } else {
                    this.showToast({ type: 'error', content: res.msg });
                    this.setState({
                        addLoading: false
                    });
                }
            }).catch( err=> {
                this.showToast({ type: 'error', content: err.msg });
                    this.setState({
                        addLoading: false
                    });
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        } else {
            actionRoleManage.addRole(data).then(res => {
                if (res.code === 200) {
                    this.showToast({ type: 'success', content: '角色创建成功！' })
                    this.props.changePage('list',{
                        rolePage: this.rolePage
                    })
                }else {
                    this.showToast({ type: 'error', content: res.msg })
                }
            }).catch(err => {
                this.showToast({ type: 'error', content: err.msg });
                this.setState({
                    addLoading: false
                });
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        }
    }

    pageTitle = () => {
        let title = '添加角色'
        if (this.roleId) {
            title = this.state.roleInfo.role_name || '编辑角色';
        }
        return (
            <div className="custom-page-title">
                <span>{title}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list',{
                            rolePage: this.rolePage
                        })
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
                    <RLForm ref={form => this.form = form}
                        labelCol={{ style: { width: 100, marginRight: 20, marginLeft: 30 } }}
                        labelAlign='left'
                        wrapperCol={
                            { span: 24 }
                        }
                        onFinish={this.editConfirm}
                        initialValues={this.state.roleInfo}
                        validateTrigger='onBlur'>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center', marginTop: 20}}>
                            <div style={{width:'100%', borderLeft: '4px solid #8F1D22',paddingLeft:5, fontSize:16,fontWeight:500}}>角色信息</div>
                            <div style={{width:'96%'}}>请填写角色信息</div>
                            <div style={{width:'96%'}}>
                                <Form.Item label="角色名称" name="role_name" colon={false}
                                    rules={[{
                                        required: !this.state.is_edit,
                                        message: '请输入角色名称'
                                    }]}>
                                    <RLInput placeholder='请输入姓名' style={{ width: 360 }} disabled={this.state.is_edit}/>
                                </Form.Item>
                                <RLFormItem label="角色描述" name="role_desc" colon={false}>
                                    <Input.TextArea placeholder="请输入内容" style={{width: 360, height: 110}}/>
                                </RLFormItem>
                            </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center', marginTop: 20}}>
                            <div style={{width:'100%',borderLeft: '4px solid #8F1D22',paddingLeft:5, fontSize:16,fontWeight:500}}>角色权限</div>
                            <div style={{width:'96%'}}>请选择角色信息</div>
                            <div style={{width: '90%'}}>
                                <CmpAuthTree  
                                    ref={ c => this.authTree = c }
                                    treeData={this.state.sysAuthData}
                                    checkedList={this.state.roleInfo.auth}
                                    readOnly={this.state.roleInfo.role_code === 'admin'}
                                />
                            </div>
                        </div>
                        <RLFormItem>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40}}>
                                <RLButton type="default" label='取消' width={80}
                                    style={{ display: 'inline-block' }}
                                    onClick={() => {
                                        this.props.changePage('list',{
                                            rolePage: this.rolePage
                                        })
                                    }} />
                                <RLButton type="primary"
                                    htmlType="submit" label={this.roleId ? '保存' : '添加'}
                                    style={{ marginLeft: 40, display: 'inline-block' }}
                                    loading={this.state.addLoading}
                                    width={80}
                                />
                            </div>
                        </RLFormItem>
                    </RLForm>
                </div>
            </WindowContainer>
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
    }
})(CmpRoleEdit)