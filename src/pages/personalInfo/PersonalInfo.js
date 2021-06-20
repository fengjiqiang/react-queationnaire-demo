
import React from 'react';
import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import { HashRouter, BrowserRouter, Route } from 'react-router-dom';
import { Divider, Tooltip, Upload, Input } from 'antd'

import './PersonalInfo.less'
import WindowContainer from '@components/WindowContainer.js'
import { RLDisplayBoard, RLInput, RLButton, RLTipList, RLModal, RLForm, RLFormItem } from '@components/index.js'
import actionPersonalInfo from '@actions/personalInfo/actionPersonalInfo.js'
import commonActions from '@actions/commonActions.js'
import iframeMessage from '@/libs/IframeMessage.js'
import config from '@/config.js'
import utils from '@/libs/utils.js'
import images from '@/libs/images'
import ImgCrop from '../common/ImgCropper.js';
import Cookies from 'js-cookie';
import actionTypes from '@/store/actionTypes.js'
import store from '@/store/index.js'
// import ImgCrop from 'antd-img-crop';

import CmpFile from '@/pages/marketingTool/components/QAManage/CmpFile.js';

class PersonalInfo extends BaseCmp {
    constructor(props) {
        super(props);

        this.state = {
            editNickname: false,
            editDepartment: false,
            editEmail: false,
            verifyIdentify: false,
            setPwdParam: {          // 设置密码
                password: '',
                passwordConfirm: ''
            },
            verifyParam: {   // 身份验证模态框参数
                code: '',
                imgCode: '',
                imgBlob: '',    // 'data:image/png;base64,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'
            },
            // showBindMobileModal: false,         // 显示绑定手机号模态框
            // showBindEmailModal: false,          // 显示绑定邮箱模态框
            // showIDVerifyModal: false,           // 显示身份验证模态框
            showSetPwdModal: false,             // 显示设置密码模态框
            imgUpdateIcon: '',  // 

        };
        this.setPwdForm = React.createRef();
        this.verifyForm = React.createRef();
    }
    componentDidMount() {
        actionPersonalInfo.getUserInfo();
    }
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);

    }
    handleChange(info) {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };
    
    updateNickName = (values) => {
        let nickname = values.nickname
        if (nickname === this.props.userInfo.nickname) {
            this.showToast({ type: 'info', content: '没有修改' })
            this.setState({
                editNickname: false
            })
            return
        }
        actionPersonalInfo.updateInfo({
            type: 'nickname',
            nickname: values.nickname
        }).then( res => {
            if(res.code === 200){
                this.showToast({ type: 'success', content: '更新成功' });
                actionPersonalInfo.getUserInfo();
                this.setState({
                    editNickname: false
                })
            }else{
                this.showToast({ type: 'error', content: res.msg });
                this.setState({
                    editNickname: false
                })
            }
        }).catch( err =>{
            this.showToast({ type: 'error', content: '更新失败' });
            this.setState({
                editNickname: false
            });
        })
    }
    updateDepartment = (values) => {
        let company = values.company_name;
        if (company === this.props.userInfo.company_name) {
            this.showToast({ type: 'info', content: '没有修改' })
            this.setState({
                editDepartment: false
            })
            return
        }
        actionPersonalInfo.updateInfo({
            type: 'company_name',
            company_name: values.company_name
        }).then( res => {
            if(res.code === 200){
                this.showToast({ type: 'success', content: '更新成功' });
                actionPersonalInfo.getUserInfo();
                this.setState({
                    editDepartment: false
                })
            }else{
                this.showToast({ type: 'error', content: res.msg });
                this.setState({
                    editDepartment: false
                })
            }
        }).catch( err =>{
            this.showToast({ type: 'error', content: '更新失败' });
            this.setState({
                editDepartment: false
            })
        })
    }

    // 获取短信验证码
    getCode = (mobile, type = 'register', areacode = '+86') => {
        console.log('getCode---param-type:', type)
        return commonActions.getCode({ mobile, areacode, type }).then(res => {
            console.log('获取短信验证码：', res)
            return res
        })
    }
    // 获取邮箱验证码
    getEmailCode = () => {
        console.log(this.state.bindEmailParam)
    }
    // 设置密码
    // status:1：未设置；2:修改
    setPassword = (status) => {
        this.setState({
            showIDVerifyModal: true
        })
    }
    getImgCode = (mobile) => {
        return commonActions.getImageCode({ mobile }).then(res => {
            console.log('图片验证码-res:', res)
            if (res.code === 200) {
                return res
            } else {
                this.showToast(res.msg)
            }

        })
    }
    // 验证徒刑验证码
    imgCodeCheck = (mobile, code) => {
        return commonActions.imgCodeCheck({ mobile, code }).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '验证成功' })
            } else {
                this.showToast({ type: 'error', content: '验证码错误' })
            }
            return res
        })
    }
    // 绑定手机号手机号输入框
    bindMobileMInput = (e) => {
        this.setState({
            bindMobileParam: {
                ...this.state.bindMobileParam,
                mobile: e.target.value
            }
        })
    }
    // 绑定手机号-获取验证码
    bindMobileGetCode = () => {
        this.getCode(this.state.bindMobileParam.mobile).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '发送成功' })
            } else if (res.code === 451) {
                this.getImgCode(this.state.bindMobileParam.mobile).then(res => {
                    if (res.code === 200) {
                        this.setState({
                            bindMobileParam: {
                                ...this.state.bindMobileParam,
                                imgBlob: res.data.img
                            }
                        }, () => {
                            console.log(this.state.bindMobileParam.imgBlob)
                        })
                    }
                })
            }
        })
    }
    // 绑定手机号图片验证码输入框
    bindMobileImgInput = (e) => {
        let imgCode = e.target.value
        this.setState({
            bindMobileParam: {
                ...this.state.bindMobileParam,
                imgCode
            }
        }, () => {
            if (imgCode.length === 4) {
                this.imgCodeCheck(this.state.bindMobileParam.mobile, this.state.bindMobileParam.imgCode).then(res => {
                    if (res.code === 200) {
                        this.getCode(this.state.bindMobileParam.mobile)
                    } else {
                        this.setState({
                            bindMobileParam: {
                                ...this.state.bindMobileParam,
                                imgCode: ''
                            }
                        })
                        this.getImgCode(this.state.bindMobileParam.mobile)
                    }
                })
            }
        })
    }
    //图形验证码验证
    verifyImgInput = (e) => {
        let text = e.target.value;
        text = text.replace(/[^\d]/g, '');
        if (text.length > 4) {
            return
        }
        this.setState({
            verifyParam: {
                ...this.state.verifyParam,
                imgCode: text
            }
        }, () => {
            if (text.length === 4) {
                this.imgCodeCheck(this.props.userInfo.mobile, this.state.verifyParam.imgCode).then(res => {
                    if (res.code === 200) {
                        this.verifyGetCode()
                        // this.getCode(this.props.userInfo.info.mobile)
                        console.log(1111)
                        // this.verifyModalGetCodeBtn.startTimer(60)
                    } else {
                        this.setState({
                            verifyParam: {
                                ...this.state.verifyParam,
                                imgCode: ''
                            }
                        })
                        this.showToast(res.msg)
                        this.getImgCode(this.props.userInfo.mobile)
                    }
                })
            }
        })
    }
    // 身份验证-短信验证码输入
    verifyCodeInput = (e) => {
        let text = e.target.value;
        text = text.replace(/[^\d]/g, '');
        if (text.length > 4) {
            return
        }
        this.setState({
            verifyParam: {
                ...this.state.verifyParam,
                code: text
            }
        })
    }
    // 身份验证的图片验证码获取
    verifyCodeImgGet = () => {
        this.getImgCode(this.props.userInfo.mobile).then(res => {
            if (res.code === 200) {
                this.setState({
                    verifyParam: {
                        ...this.state.verifyParam,
                        imgBlob: res.data.img
                    }
                })
            }
        })
    }
    // 身份验证获取短信验证码
    verifyGetCode = () => {
        return this.getCode(this.props.userInfo.mobile, 'forgetpass').then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '发送成功' })
                this.verifyModalGetCodeBtn.startTimer(60)
                return true
            } else if (res.code === 451) {
                if (this.state.verifyParam.imgBlob) {
                    this.showToast('请输入图形验证码')
                } else {
                    this.verifyCodeImgGet()
                }

            } else {
                this.showToast(res.msg)
            }
        })
    }
    // 身份验证-发送验证
    verifySend = (values) => {

        this.setState({
            showIDVerifyModal: false,
            showSetPwdModal: true
        })
        
        // let msg_code = this.state.verifyParam.code
        // let msg_code = values.code

        // let mobile = this.props.userInfo.info.mobile
        // if (!msg_code || !mobile || msg_code.length < 4) {
        //     this.showToast({ type: 'warning', content: '请输入验证码' })
        //     return
        // }
        // commonActions.mobileVerify({ mobile, msg_code }).then(res => {
        //     if (res.code === 200) {
        //         this.setState({
        //             showIDVerifyModal: false,
        //             showSetPwdModal: true
        //         })
        //         this.showToast({ type: 'success', content: '验证成功' })
        //     } else {
        //         this.showToast(res.msg)
        //     }
        // })
    }
    // 设置密码-密码输入
    setPwdPwdInput = (e) => {
        // console.log(e.target.value)
        let text = e.target.value
        text = text.replace(/\s/g, '')
        this.setState({
            setPwdParam: {
                ...this.state.setPwdParam,
                password: text
            }
        })
    }
    // 设置密码-再次密码输入
    setPwdPwdConfirmInput = (e) => {
        console.log(e.target.value)
        let text = e.target.value
        text = text.replace(/\s/g, '')
        this.setState({
            setPwdParam: {
                ...this.state.setPwdParam,
                passwordConfirm: text
            }
        })
    }
    // 设置密码-保存
    setPwdSend = (values) => {
        console.log('this.state.setPwdParam:', values, this.state.setPwdParam)
        if (!this.state.setPwdParam.passwordConfirm || !this.state.setPwdParam.password) {
            this.showToast({ type: 'warning', content: '请输入密码并确认' })
            return
        }
        if (this.state.setPwdParam.passwordConfirm !== this.state.setPwdParam.password) {
            this.showToast({ type: 'warning', content: '两次输入密码不一致' })
            return
        }
        if (!config.pwdReg.reg.test(this.state.setPwdParam.passwordConfirm) || this.state.setPwdParam.passwordConfirm.length < config.pwdReg.minLength) {
            // this.showToast({ type: 'warning', content: '密码应包含数字/字母/特殊字符至少两种' })
            this.showToast({ type: 'warning', content: '密码不符合规则' })
            return
        }
        let password = this.state.setPwdParam.password
        let confirm_password = this.state.setPwdParam.passwordConfirm
        actionPersonalInfo.setPassword({ password, confirm_password }).then(res => {
            console.log('设置密码--res:', res);
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '设置密码成功,请重新登录！' })
                // this.setState({
                //     showSetPwdModal: false
                // });
                Cookies.remove('token');
                sessionStorage.removeItem('token');
                store.dispatch({ type: actionTypes.CACHE_ROUTES_CHANGE, data: [] });
                this.props.history.push('/login');
                // actionPersonalInfo.getUserInfo()

            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }
    baseUserInfo = () => {
        let valueBtnStyle = {
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'row'
        }
        let labelStyle = {
            color: '#999',
            fontSize: 14,
            lineHeight: '20px',
            textAlign: 'right',
            // marginTop: 12,
            marginRight: 30,
            flex: 'none',
            width: 140
        }
        let userInfoBoardItems = [
            {
                title: '基本信息',
                list: [
                    {
                        label: <div className="baseInfo-left" style={{ width: 140, height: 40, textAlign: 'right', marginRight:30}}>
                            <ImgCrop
                                className="img-crop"
                                modalTitle="裁剪图片"
                                modalCancel="取消"
                                modalOk="确定"
                                qulaity={1}
                                aspect ={ 1 / 1 }
                                minZoom={0.8}
                                maxZoom={2}
                                beforeCrop={()=>{
                                    return true;
                                }}
                            >
                                <Upload
                                    accept='image/jpg,image/png'
                                    action='/api/v1/auth/avatar/update'
                                    showUploadList={false}
                                    customRequest={(upload) => {
                                        console.log('upload:', upload.file.size)
                                        if (upload.file.size > 2 * 1024 * 1024) {
                                            this.showToast('图片尺寸不应大于2M')
                                            return;
                                        }
                                        let formData = new FormData();
                                        formData.append('type', 'picture');
                                        formData.append('resource', upload.file);
                                        commonActions.fileUpload(formData).then(res => {
                                            if (res.code === 200) {
                                                actionPersonalInfo.updateInfo({
                                                    type: 'avatar',
                                                    avatar: res.data.fileurl,
                                                }).then(res => {
                                                    if(res.code === 200){
                                                        this.showToast('头像上传成功！');
                                                        actionPersonalInfo.getUserInfo();
                                                    }
                                                })
                                            } else {
                                                this.showToast(res.msg)
                                            }
                                        })
                                    }}
                                >
                                    <img
                                        onMouseOverCapture={() => {
                                            this.setState({
                                                imgUpdateIcon: images.commonImg.imgUpdateIcon
                                            })
                                        }}
                                        onMouseOutCapture={() => {
                                            this.setState({
                                                imgUpdateIcon: null
                                            })
                                        }}
                                        alt=''
                                        src={this.state.imgUpdateIcon || this.props.userInfo.avatar || require('../../assets/images/common/default_avatar.png').default}
                                        style={{ height: 40, width: 40, borderRadius: '50%', cursor: 'pointer' }}
                                    />
                                </Upload>
                            </ImgCrop>
                        </div>,
                        value: <div className="rightContainer" style={{ height: 40, paddingLeft: 20, display: 'flex', flexDirection: 'row' }}>
                            {
                                this.state.editNickname ?
                                    <RLForm
                                        onFinish={this.updateNickName}
                                        initialValues={{ nickname: this.props.userInfo.nickname }}
                                        validateTrigger='onBlur'
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <RLFormItem
                                                name='nickname'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请输入昵称'
                                                    }, {
                                                        max: 40,
                                                        message: '昵称最多40个字符'
                                                    }
                                                ]}
                                            >
                                                <RLInput autoFocus
                                                    placeholder='请输入昵称'
                                                />
                                            </RLFormItem>
                                            <RLFormItem>
                                                <div style={{ display: 'flex', justifyContent: 'center', }}>
                                                    <RLButton type="primary"
                                                        htmlType="submit"
                                                        style={{ marginLeft: 20 }} label='确定'
                                                    />
                                                    <RLButton type="primary"
                                                        onClick={() => { this.setState({ editNickname: false }) }}
                                                        style={{ marginLeft: 20 }} label='取消'>
                                                    </RLButton>
                                                </div>
                                            </RLFormItem>
                                        </div>
                                    </RLForm>

                                    :
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <span>{this.props.userInfo.nickname}</span>
                                        {
                                            this.props.userInfo.approval_status === 3 ? 
                                            <span style={{marginLeft:10, backgroundColor:'rgba(143,29,34,0.15)', borderRadius:2, width:46, textAlign:'center', fontSize: 12}}>已认证</span> :null
                                        }
                                        <img alt=''
                                            style={{ marginLeft: 10, height: 15, width: 15, cursor: 'pointer' }}
                                            src={require("../../assets/images/edit.png").default}
                                            onClick={() => { this.setState({ editNickname: true }) }}
                                        />
                                    </div>
                            }
                        </div>,
                    }, {
                        label: '账    号',
                        value: <div style={valueBtnStyle}>
                           <div>{this.props.userInfo.reg_type === 1 ? this.props.userInfo.mobile: this.props.userInfo.email}</div>
                        </div>,
                        labelStyle,
                        valueStyle: { flex: 1, fontSize: 14, lineHeight: '20px', color: '#333', paddingLeft: 20 }
                    }, {
                        label: '账号密码',
                        value: <div style={valueBtnStyle}>
                           <div> {this.props.userInfo.is_handle ===1 ? '已设置': '未设置'}</div>
                           <div style={{marginLeft: 10, color:'#8f1d22',cursor:'pointer'}} 
                                onClick={()=>{
                                    this.setState({ showSetPwdModal: true}, ()=>{
                                        this.setPwdForm && this.setPwdForm.current.resetFields();
                                    })}}>
                                更改
                            </div>
                        </div>
                        ,
                        labelStyle,
                    },
                    {
                        label: '机构全称',
                        value: <div>
                            {
                                this.state.editDepartment ? 
                                <div className="rightContainer" style={{ height: 40, paddingLeft: 20, display: 'flex', flexDirection: 'row' }}>
                                    <RLForm
                                        onFinish={this.updateDepartment}
                                        initialValues={{ company_name: this.props.userInfo.company_name }}
                                        validateTrigger='onBlur'
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <RLFormItem
                                                name='company_name'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请输入部门名称'
                                                    }, {
                                                        max: 40,
                                                        message: '部门名称最多40个字符'
                                                    }
                                                ]}
                                            >
                                                <RLInput autoFocus
                                                    placeholder='请输入部门名称'
                                                />
                                            </RLFormItem>
                                            <RLFormItem>
                                                <div style={{ display: 'flex', justifyContent: 'center', }}>
                                                    <RLButton type="primary"
                                                        htmlType="submit"
                                                        style={{ marginLeft: 20 }} label='确定'
                                                    />
                                                    <RLButton type=""
                                                        onClick={() => { this.setState({ editDepartment: false }) }}
                                                        style={{ marginLeft: 20 }} label='取消'>

                                                    </RLButton>

                                                </div>

                                            </RLFormItem>
                                        </div>
                                    </RLForm>
                                </div>: 
                                <div style={valueBtnStyle}>
                                    <div> {this.props.userInfo.company_name } </div>
                                    <div style={{marginLeft:10, color:'#8f1d22',cursor:'pointer'}} onClick={()=>{this.setState({editDepartment:true})}}>更改</div>
                                </div>
                            }
                        </div>,
                        labelStyle,
                        separator: true
                    },
                    {
                        label: '部    门',
                        value: <div style={valueBtnStyle}>
                            <div>{this.props.userInfo.department}</div>
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '职    务',
                        value: <div style={valueBtnStyle}>
                            <div>{this.props.userInfo.position }</div>
                        </div> ,
                        labelStyle
                    },
                    {
                        label: '邮    箱',
                        value: <div style={valueBtnStyle}>
                            <div>{this.props.userInfo.email}</div>
                        </div>,
                        labelStyle
                    },
                    {
                        label: '身份证号',
                        value: <div style={valueBtnStyle}>
                            <div>{this.props.userInfo.id_number}</div>
                        </div>,
                        labelStyle
                    },
                    {
                        label: '身份证正反照片',
                        value: <div style={valueBtnStyle}>
                            {
                               !this.props.userInfo.positive_card && !this.props.userInfo.reverse_card ?
                               <span>未上传</span>:
                               <>
                                    <img src={this.props.userInfo.positive_card || require('../../assets/images/card_positive.png')} alt='' style={{width: 202,height:118}}></img>
                                    <img src={this.props.userInfo.reverse_card || require('../../assets/images/card_reverse.png')}  alt='' style={{width: 202,height:118, marginLeft:10}}></img>
                               </>

                            }
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '公司在职证明',
                        value: <div style={valueBtnStyle}>
                            {
                                this.props.userInfo.in_job ?
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={this.props.userInfo.in_job}
                                        name={this.props.userInfo.in_job_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(this.props.userInfo.in_job);
                                        }}
                                    />
                                </div>:
                                <span>未上传</span>
                            }
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '工卡及名片同框照片',
                        value: <div style={valueBtnStyle}>
                            {
                                this.props.userInfo.job_card ? 
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={this.props.userInfo.job_card}
                                        name={this.props.userInfo.job_card_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(this.props.userInfo.job_card);
                                        }}
                                    />
                                </div>:
                                <span>未上传</span>
                            }
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '其他有效证件',
                        value: <div style={valueBtnStyle}>
                            {
                                this.props.userInfo.other ? 
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={this.props.userInfo.other}
                                        name={this.props.userInfo.other_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(this.props.userInfo.other);
                                        }}
                                    />
                                </div>: 
                                <span>未上传</span>
                            }
                        </div>,
                        labelStyle,
                    }

                ]
            },  
        ]
        return (
            <RLDisplayBoard style={{ width: '100%' }} className='base-info' items={userInfoBoardItems}></RLDisplayBoard>
        )
    }
    render() {
        const mobileRef = /(.{4}).+(.{3}.+)/g;
        const emailRef = /(.{1}).+(.{2}@.+)/g;
 
        return (
            <WindowContainer title=''>
                <div className="personal-info">
                    {this.baseUserInfo()}
                </div>
                {/* 设置密码 */}
               { this.state.showSetPwdModal && <RLModal wrapClassName='large-modal-wrap'
                    title='设置密码'
                    maskClosable={false}
                    visible={this.state.showSetPwdModal}
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            showSetPwdModal: false
                        })
                    }}
                >
                    <div className='modal-content' style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <RLForm
                            ref={this.setPwdForm}
                            onFinish={() => {
                                console.log('this.setPwdSend submit')
                                this.setPwdSend()
                            }}
                        >
                            <RLFormItem
                                name='password'
                                validateFirst={true}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码'
                                    }, {
                                        pattern: /^((?!\s).)*$/,
                                        message: '密码不能含有空格'
                                    }, {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,24}$/,
                                        message: '密码格式不符'
                                    }, {
                                        min: 6,
                                        message: '密码至少6位'
                                    }
                                ]}
                            >
                                <Input.Password placeholder='请输入密码'
                                    value={this.state.setPwdParam.password}
                                    visibilityToggle={false}
                                    onChange={(e) => {
                                        this.setPwdPwdInput(e)
                                    }}
                                />
                            </RLFormItem>
                            <RLFormItem
                                name='passwordConfirm'
                                rules={[
                                    // {
                                    //     required: true,
                                    //     message: '请确认密码'
                                    // },
                                    {
                                        validator: (rule, val) => {
                                            let pwd = this.setPwdForm.current.getFieldValue('password')
                                            if (pwd !== val) {
                                                return Promise.reject()
                                            } else {
                                                return Promise.resolve()
                                            }
                                        },
                                        message: '两次密码不一致'
                                    }
                                ]}
                            >
                                <Input.Password placeholder='请再次输入密码'
                                    value={this.state.setPwdParam.passwordConfirm}
                                    onChange={(e) => {
                                        this.setPwdPwdConfirmInput(e)
                                    }}
                                />
                            </RLFormItem>
                            <RLTipList list={[
                                { text: '长度为8-24个字符' },
                                { text: '至少包含大小写字母和数字' }
                            ]} />
                        </RLForm>
                    </div>
                    <div className='modal-btnContainer'>
                        <RLButton label='取消'
                            onClick={() => {
                                this.setState({
                                    showSetPwdModal: false
                                })
                            }}
                        />
                        <RLButton label='保存' type='primary'
                            style={{ marginLeft: 30 }}
                            onClick={() => {
                                console.log(this.setPwdForm.current.getFieldValue('password'))
                                console.log(this.setPwdForm.current.getFieldValue('passwordConfirm'))
                                this.setPwdForm.current.submit()
                            }}
                        />
                    </div>
                </RLModal>}
                {/* 身份验证 */}
               { this.state.showIDVerifyModal && <RLModal wrapClassName='large-modal-wrap id-verify-modal'
                    title='身份验证'
                    visible={this.state.showIDVerifyModal}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({
                            showIDVerifyModal: false,
                        })

                    }}
                    destroyOnClose={true}
                >
                    <div className='modal-content' style={{ padding: '0 20px' }}>
                        <span className='tips tips1'>为了您的账号安全，请验证身份，验证成功后进行下一步操作</span>
                        {
                            this.props.userInfo.reg_type === 1 ?
                            <>
                                <span className='tips'>使用以下手机号验证</span>
                                <div className='mobile-info'>
                                    <span>+86</span>
                                    <span className='mobile'>{this.props.userInfo.mobile && this.props.userInfo.mobile.replace(mobileRef,"$1****$2")}</span>
                                </div>
                            </>:
                            <>
                                <span className='tips'>使用以下邮箱验证</span>
                                <div className='mobile-info'>
                                    <span className='mobile'>{this.props.userInfo.email && this.props.userInfo.email.replace(emailRef,"$1****$2")}</span>
                                </div>
                            </>
                        }
                        {
                            this.state.verifyParam.imgBlob && (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', marginBottom: 25, alignItems: 'flex-end' }}>
                                    <RLInput placeholder='请输入图片验证码' style={{ flex: 1, }}
                                        value={this.state.verifyParam.imgCode}
                                        onChange={(e) => {
                                            this.verifyImgInput(e)
                                        }}
                                    />
                                    {/* {require('../../../assets/images/edit.png').default} */}
                                    <img
                                        alt=''
                                        src={this.state.verifyParam.imgBlob}
                                        style={{ width: 140, height: 48 }}
                                        onClick={() => {
                                            this.verifyCodeImgGet()
                                        }}
                                    />
                                </div>
                            )
                        }
                        <RLForm
                            ref={this.verifyForm}
                            onFinish={this.verifySend}
                        >
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', }}>
                                <RLFormItem
                                    name='code'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入验证码'
                                        }, {
                                            pattern: /^\d{4}$/,
                                            message: '请输入正确的验证码'
                                        }
                                    ]}
                                >
                                    <RLInput placeholder='请输入验证码' style={{ flex: 1 }}
                                        value={this.state.verifyParam.code}
                                        maxLength={4}
                                        onChange={(e) => {
                                            this.verifyCodeInput(e)
                                        }}
                                    />
                                </RLFormItem>

                                <RLButton
                                    label='获取验证码'
                                    rLabel='重新获取'
                                    type='default'
                                    ref={ref => this.verifyModalGetCodeBtn = ref}
                                    style={{ marginLeft: 8 }}
                                    onClick={() => {
                                        this.verifyGetCode()
                                    }} />
                            </div>
                        </RLForm>

                    </div>
                    <div className='modal-btnContainer'>
                        <RLButton label='取消'
                            onClick={() => {
                                this.setState({
                                    showIDVerifyModal: false,
                                    verifyParam: {   // 身份验证模态框参数
                                        code: '',
                                        imgCode: '',
                                        imgBlob: '',    // 'data:image/png;base64,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'
                                    },
                                })
                            }}
                        />
                        <RLButton label='验证' type='primary' style={{ marginLeft: 30 }}
                            onClick={() => {
                                this.verifyForm.current.submit()
                                // this.verifySend()
                            }}
                        />
                    </div>
                </RLModal>}
            </WindowContainer>

        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        userInfo: store.personalInfo.userInfo,
    }
})(PersonalInfo)