import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLForm, RLFormItem, RLRadioGroup, RLRadio } from '@components/index.js'
import PhoneRegionView from '@/pages/common/PhoneRegionView.js'
import actionUserList from '@actions/userManage/actionUserList.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import config from '@/config.js'

import { Upload } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

import CmpUpload from '@/pages/common/CmpUpload.js';
import { createRef } from 'react'
import RLCheckbox from '../../../../components/RLCheckbox.js'
import CmpFile from '@/pages/marketingTool/components/QAManage/CmpFile.js';
class CmpUserEdit extends BaseCmp {
    constructor(props) {
        super(props)
        // this.urlParam = this.getParams(props.location.search)
        this.userId = props.userId;
        this.userPage = props.userPage;
        this.state = {
            userInfo: {},
            fieldSettings: [],
            is_edit: this.userId ? true : false,
            user_type: this.userId ? 0 : 1,  //创建时使用 国内用户：1， 国外用户：2
            showSubForm: false,  // 是否显示专业版选择计划框
            addLoading: false,  // 添加按钮loading
            showAreaList: false, // 显示手机号区号列表
            // areacodeSelected: {
            //     name: '中国',
            //     value: '+86'
            // },
        }

        this.form = createRef()
    }
    componentWillMount() {
        //获取必填字段
        this.getFieldSetting();
        if (this.userId) {
            this.getUserInfo()
        } else {
            this.setState({
                userInfo: {
                    type: 'cn',
                    nickname: '',
                    mobile: '',
                    email: '',
                    company_name: '',
                    avatar: '',
                    department: '',
                    position: '',
                    id_number: '',
                    positive_card: '',
                    reverse_card: '',
                    business_card: '',
                    in_job: '',
                    in_job_desc: '',
                    job_card: '',
                    job_card_desc: '',
                    other: '',
                    other_desc: '',
                    is_approval: false
                }
            });
        }
    }
    isRequired(field) {
        let setting = this.state.fieldSettings.find(item => item.form_title === field)
        return setting && setting.value === 1
    }
    getFieldSetting = () => {
        actionUserList.getFieldsSetting().then(res => {
            if (res.code === 200) {
                this.setState({
                    fieldSettings: res.data
                });
            } else {
                this.showToast({ type: 'error', content: '获取字段设置失败！' })
            }
        })
    }
    getUserInfo = () => {
        actionUserList.getUserDetail({ uuid: this.userId }).then(res => {
            if (res.code === 200) {
                this.setState({
                    userInfo: res.data
                }, () => {
                    //给表单重置值
                    this.form && this.form.setFieldsValue(this.state.userInfo)
                });
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    editConfirm = (values) => {
        console.log('onFinish', values, this.state.areacodeSelected)
        this.setState({
            addLoading: true
        })
        values.is_approval = values.is_approval ? 1 : 0;
        values.in_job_desc = this.state.userInfo.in_job_desc;
        values.job_card_desc = this.state.userInfo.job_card_desc;
        values.other_desc = this.state.userInfo.other_desc;
        if (this.userId) {
            values.uuid = this.state.userInfo.uuid;
            values.type = this.state.userInfo.reg_type === 1 ? 'cn' : 'en';
            actionUserList.editUser(values).then(res => {
                if (res.code === 200) {
                    this.showToast({ content: '编辑用户成功', type: 'success' })
                    this.props.changePage('list', {
                        userPage: this.userPage,
                    })
                } else {
                    this.showToast({ type: 'error', content: res.msg })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        } else {
            actionUserList.addUser(values).then(res => {
                if (res.code === 200) {
                    this.props.changePage('list', {
                        userPage: this.userPage
                    })
                } else {
                    this.showToast({ type: 'error', content: res.msg })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        }
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
                        this.props.changePage('list', {
                            userPage: this.userPage
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
                    {
                        <RLForm ref={form => this.form = form}
                            labelCol={{ style: { width: 150, marginRight: 20, marginLeft: 30, textAlign: 'right' } }}
                            labelAlign='left'
                            wrapperCol={
                                { span: 24 }
                            }
                            onFinish={this.editConfirm}
                            initialValues={this.state.userInfo}
                            validateTrigger='onBlur'
                        >
                            {
                                !this.state.is_edit ?
                                    <RLFormItem name='type' label='用户类型' colon={false} layout={'vertical'}
                                        rules={
                                            [{ required: true }]
                                        }>
                                        <RLRadioGroup
                                            items={[
                                                { value: 'cn', label: '国内用户', disabled: false },
                                                { value: 'en', label: '国外用户', disabled: false },
                                            ]}
                                            onChange={(e) => {
                                                if (e.target.value === 'en') {
                                                    this.setState({ user_type: 2 });
                                                } else if (e.target.value === 'cn') {
                                                    this.setState({ user_type: 1 });
                                                }
                                            }}
                                        />
                                    </RLFormItem> : null
                            }

                            <RLFormItem name='nickname'
                                label='姓名' colon={false}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入姓名',
                                    }, {
                                        max: 40,
                                        message: '姓名最多40个字符',
                                    }, {
                                        pattern: /\S+/,
                                        message: '姓名格式不对'
                                    }
                                ]}
                            >
                                <RLInput placeholder='请输入姓名' style={{ width: 360 }} />
                            </RLFormItem>

                            <RLFormItem name='mobile' label="手机号" colon={false}
                                rules={[
                                    {
                                        required: (!this.is_edit && this.state.user_type === 1) || this.state.userInfo.reg_type === 1,
                                        message: '请输入手机号'
                                    }, {
                                        pattern: /^1[0-9]{10}$/,
                                        message: '请输入正确的手机号'
                                    }
                                ]}>

                                <RLInput placeholder="请输入手机号" style={{ width: 360 }} disabled={this.state.is_edit && this.state.userInfo.reg_type === 1} />
                            </RLFormItem>

                            <RLFormItem name='company_name' label='机构全称' colon={false}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入机构全称'
                                    }, {
                                        max: 100,
                                        message: '机构名称最多100个字符'
                                    }
                                ]}>
                                <RLInput placeholder='请输入机构全称' style={{ width: 360 }} />
                            </RLFormItem>

                            <RLFormItem name='avatar' label='头像' colon={false}
                                ref={c => this.avatarInput = c}
                                rules={[
                                    {
                                        required: this.isRequired('avatar'),
                                        message: '请上传头像'
                                    },
                                ]}
                            >
                                <CmpUpload saveUrl={(fileurl) => {
                                    this.form.setFieldsValue({
                                        avatar: fileurl,
                                    })
                                }}
                                    src={this.state.userInfo.avatar}
                                    imgStyle={{ width: 56, height: 56, borderRadius: '50%' }}
                                    default={require('../../../../assets/images/avatar_upload.png').default}
                                />
                            </RLFormItem>


                            <RLFormItem name='department' label='部门' colon={false}
                                rules={[{
                                    required: this.isRequired('department'),
                                    message: '请输入部门'
                                },
                                {
                                    max: 40,
                                    message: '部门最多40个字符'
                                }
                                ]
                                }>
                                <RLInput placeholder='请输入职位' style={{ width: 360 }} />
                            </RLFormItem>

                            <RLFormItem name='position' label='职务' colon={false}
                                rules={[
                                    {
                                        required: this.isRequired('position'),
                                        message: '请输入职务'
                                    },
                                    {
                                        max: 40,
                                        message: '职务最多40个字符'
                                    }
                                ]
                                }>
                                <RLInput placeholder='请输入职务' style={{ width: 360 }} />
                            </RLFormItem>

                            <RLFormItem name='email' label='邮箱' colon={false}
                                rules={[
                                    {
                                        required: (!this.is_edit && this.state.user_type === 2) || this.state.userInfo.reg_type === 2 || this.isRequired('email'),
                                        message: '请输入邮箱'
                                    },
                                    {
                                        pattern: config.emailReg,
                                        message: '邮箱格式错误'
                                    }
                                ]}
                            >
                                <RLInput placeholder="请输入邮箱地址" style={{ width: 360 }} disabled={this.state.is_edit && this.state.userInfo.reg_type === 2} />
                                {/* ?<RLInput placeholder='请输入邮箱地址' style={{ width: 360 }} readOnly={this.state.is_edit && this.state.userInfo.type === 'cn'}/> */}
                            </RLFormItem>

                            <RLFormItem name='id_number' label='身份证号' colon={false}
                                rules={[
                                    {
                                        required: this.isRequired('id_number'),
                                        message: '请输入身份证号'
                                    }, {
                                        pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                                        message: '身份证号格式错误'
                                    }
                                ]

                                }>
                                <RLInput placeholder='请输入身份证号' style={{ width: 360 }} />
                            </RLFormItem>
                            <RLFormItem label="身份证正反面照片" name="card" rules={
                                [{
                                    required: this.isRequired('positive_card') || this.isRequired('reverse_card'),
                                    message: ''
                                }]
                            } colon={false}>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <RLFormItem name='positive_card' colon={false}
                                        rules={[
                                            {
                                                required: this.isRequired('positive_card'),
                                                message: '请上传身份证正面照片'
                                            }
                                        ]}>
                                        <CmpUpload
                                            aspect={5 / 3}
                                            saveUrl={(fileurl) => {
                                                this.form.setFieldsValue({
                                                    positive_card: fileurl,
                                                })
                                            }}
                                            clearFile={() => {

                                            }}
                                            src={this.state.userInfo.positive_card}
                                            imgStyle={{ width: 202, height: 118, borderRadius: 4, marginRight: 20 }}
                                            default={require('../../../../assets/images/id_card_positive.png').default}
                                        />
                                    </RLFormItem>

                                    <RLFormItem name='reverse_card' colon={false}
                                        rules={[
                                            {
                                                required: this.isRequired('reverse_card'),
                                                message: '请上传身份证反面照片'
                                            }
                                        ]} style={{ marginRight: 20 }}>
                                        <CmpUpload
                                            aspect={5 / 3}
                                            saveUrl={(fileurl) => {
                                                this.form.setFieldsValue({
                                                    reverse_card: fileurl,
                                                })
                                            }}
                                            src={this.state.userInfo.reverse_card}
                                            imgStyle={{ width: 202, height: 118, borderRadius: 4 }}
                                            default={require('../../../../assets/images/id_card_reverse.png').default}
                                        />
                                    </RLFormItem>
                                </div>
                            </RLFormItem>

                            <RLFormItem name='in_job' label='公司在职证明' colon={false}
                                rules={[{
                                    required: this.isRequired('in_job'),
                                    message: '请上传公司在职证明'
                                }]
                                }>
                                <div>
                                    <div style={{display:'flex',flexDirection:'row',alignItems:'flex-end'}}>
                                        <Upload 
                                            accept=".jpeg, .png, .pdf"
                                            showUploadList={false}
                                            customRequest={(upload) =>{
                                                if(! /^.*\.(jpg|JPG|png|PNG|pdf|PDF)$/.test(upload.file.name)){
                                                    this.showToast({type:'error', content:'上传文件类型应为jpg、png、pdf'});
                                                    return;
                                                }
                                                if (upload.file.size > 2 * 1024 * 1024) {
                                                    this.showToast({type:'error',content:'文件大小不应大于2M'});
                                                    return;
                                                }
                                                let formData = new FormData();
                                                formData.append('type', 'doc')
                                                formData.append('resource', upload.file);
                                                commonAction.fileUpload(formData).then(res => {
                                                    if(res.code === 200){
                                                        this.setState({
                                                            userInfo: {
                                                                ...this.state.userInfo,
                                                                in_job: res.data.fileurl,
                                                                in_job_desc: upload.file.name
                                                            }   
                                                        });
                                                        this.form.setFieldsValue({
                                                            in_job: res.data.fileurl,
                                                        })
                                                    }else{
                                                        this.showToast({type:'error',content:res.msg})
                                                    }
                                                    
                                                })
                                            }}
                                        >
                                            <RLButton label="上传文件"/>
                                        </Upload>
                                        <div style={{marginLeft:10}}>凭证提交的图片不超过2M, jpg、png、pdf格式</div>
                                    </div>
                                    <div>
                                        {
                                            this.state.userInfo.in_job &&
                                            <CmpFile name={this.state.userInfo.in_job_desc} src={this.state.userInfo.in_job} 
                                                editable={true}
                                                onDelete={()=>{
                                                    this.setState({
                                                        userInfo: {
                                                            ...this.state.userInfo,
                                                            in_job: '',
                                                            in_job_desc: '',
                                                        }
                                                       
                                                    });
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                            </RLFormItem>

                            <RLFormItem name='job_card' label='工卡及名片同框照片' colon={false}
                                rules={[{
                                    required: this.isRequired('job_card'),
                                    message: '请上传工卡及名片同框照片'
                                }]
                                }>
                                <div>
                                    <div style={{display:'flex',flexDirection:'row',alignItems:'flex-end'}}>
                                        <Upload 
                                            accept=".jpeg, .png, .pdf"
                                            showUploadList={false}
                                            customRequest={(upload) =>{
                                                if(! /^.*\.(jpg|JPG|png|PNG|pdf|PDF)$/.test(upload.file.name)){
                                                    this.showToast({type:'error', content:'上传文件类型应为jpg、png、pdf'});
                                                    return;
                                                }
                                                if (upload.file.size > 2 * 1024 * 1024) {
                                                    this.showToast({type:'error', content:'文件大小不应大于2M'});
                                                    return;
                                                }
                                                let formData = new FormData();
                                                formData.append('type', 'doc')
                                                formData.append('resource', upload.file);
                                                commonAction.fileUpload(formData).then(res => {
                                                    if(res.code === 200){
                                                        this.setState({
                                                            userInfo: {
                                                                ...this.state.userInfo,
                                                                job_card: res.data.fileurl,
                                                                job_card_desc: upload.file.name
                                                            }
                                                        });
                                                        this.form.setFieldsValue({
                                                            job_card: res.data.fileurl,
                                                        })
                                                    }else{
                                                        this.showToast({type:'error',content:res.msg})
                                                    }
                                                    
                                                })
                                            }}
                                        >
                                            <RLButton label="上传文件"/>
                                        </Upload>
                                        <div style={{marginLeft:10}}>凭证提交的图片不超过2M, jpg、png、pdf格式</div>
                                    </div>
                                    <div>
                                    {
                                            this.state.userInfo.job_card &&
                                            <CmpFile name={this.state.userInfo.job_card_desc} src={this.state.userInfo.job_card_desc} 
                                                editable={true}
                                                onDelete={()=>{
                                                    this.setState({
                                                        userInfo: {
                                                            ...this.state.userInfo,
                                                            job_card: '',
                                                            in_job: '',
                                                        }  
                                                    });
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                            </RLFormItem>

                            <RLFormItem name='other' label='其他有效证件' colon={false}
                                rules={[{
                                    required: this.isRequired('other'),
                                    message: '请上传其他有效证件'
                                }]
                                }>
                                <div>
                                    <div style={{display:'flex',flexDirection:'row',alignItems:'flex-end'}}>
                                        <Upload 
                                            accept=".jpeg,.JPEG, .png,.PNG, .pdf,.PDF"
                                            showUploadList={false}
                                            customRequest={(upload) =>{
                                                if(! /^.*\.(jpg|JPG|png|PNG|pdf|PDF)$/.test(upload.file.name)){
                                                    this.showToast({type:'error', content:'上传文件类型应为jpg、png、pdf'});
                                                    return;
                                                }
                                                if (upload.file.size > 2 * 1024 * 1024) {
                                                    this.showToast({type:'error', content:'文件大小不应大于2M'});
                                                    return;
                                                }
                                                let formData = new FormData();
                                                formData.append('type', 'doc')
                                                formData.append('resource', upload.file);
                                                commonAction.fileUpload(formData).then(res => {
                                                    if(res.code === 200){
                                                        this.setState({
                                                            userInfo: {
                                                                ...this.state.userInfo,
                                                                other: res.data.fileurl,
                                                                other_desc: upload.file.name
                                                            }   
                                                        });
                                                        this.form.setFieldsValue({
                                                            other: res.data.fileurl,
                                                        })
                                                    }else{
                                                        this.showToast({type:'error',content:res.msg})
                                                    }
                                                    
                                                })
                                            }}
                                        >
                                            <RLButton label="上传文件"/>
                                        </Upload>
                                        <div style={{marginLeft:10}}>凭证提交的图片不超过2M, jpg、png、pdf格</div>
                                    </div>
                                    <div>
                                        {
                                            this.state.userInfo.other &&
                                            <CmpFile name={this.state.userInfo.other_desc} src={this.state.userInfo.other} 
                                                editable={true}
                                                onDelete={()=>{
                                                    this.setState({
                                                        userInfo: {
                                                            ...this.state.userInfo,
                                                            other: '',
                                                            other_desc: '',
                                                        }    
                                                    });
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                            </RLFormItem>

                            {
                                !this.state.is_edit ?
                                    <RLFormItem name='is_approval' label='     ' colon={false} valuePropName="checked"
                                        rules={[]
                                        }>
                                        <RLCheckbox label="是否是认证用户" />
                                    </RLFormItem> : null
                            }

                            <RLFormItem>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <RLButton type="default" label='取消' width={80}
                                        style={{ display: 'inline-block' }}
                                        onClick={() => {
                                            this.props.changePage('list', {
                                                userPage: this.userPage
                                            })
                                        }} />
                                    <RLButton type="primary"
                                        htmlType="submit" label={this.userId ? '保存' : '添加'}
                                        style={{ marginLeft: 40, display: 'inline-block' }}
                                        loading={this.state.addLoading}
                                        width={80}
                                    />
                                </div>
                            </RLFormItem>
                        </RLForm>
                    }

                </div>
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
        roleList: store.roleManage.roleList,
    }
})(CmpUserEdit)