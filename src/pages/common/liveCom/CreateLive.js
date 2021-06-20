import React from 'react';

import { connect } from 'react-redux'
import {
    RLInput,
    RLButton,
    RLForm,
    RLFormItem,
    RLDatePicker,
    RLCheckbox,
    RLTag,
    RLDisplayBoard,
    RLRadioGroup,
    RLTextarea
} from '@components/index.js'
import RLdocument from '@components/document/RLDocument.js'
import '../meeting/Appointment.less'
import WindowContainer from '@components/WindowContainer.js'
import actionSeminar from '@actions/seminar/actionSeminar.js'
import commonActions from '@actions/commonActions.js'
import moment from 'moment'
import BaseCmp from '@components/BaseCmp.js'
import locale from 'antd/es/date-picker/locale/zh_CN';
import commonLocale from 'antd/lib/locale/zh_CN'
import config from '@/config.js';
import { Upload, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { dealSearchTime, dealTableTime, getFileTile } from '@/libs/utils'
// import ImgCrop from '@/pages/common/CmpImageCropper.js';
import Uploader from '@/libs/Uploader.js';
import ImgCrop from '@/pages/common/ImgCropper.js';

const limtSize = 2 * 1024 * 1024;
class CreateLive extends BaseCmp {
    constructor(props) {
        super(props);
        this.urlParam = props
        this.meetingId = this.urlParam.meetingId;
        this.isExamine = this.urlParam.isExamine;
        this.state = {
            appointParam: {
            },
            masterValue: '',
            userGroup: [],
            phoneList: [],   // 固话名单
            guestGroup: [],
            disclaimer: false,
            inviteUserModal: false,   // 显示邀请模态框
            pageTitle: '',
            submitLoading: false, // 提交按钮正在loading
            editStart: '',
            editEnd: '',
            picList: [],    //直播封面列表
            fileList: [],
            showUpDoc: false
        };
        this.count = 100001
        this.appointForm = React.createRef();
    }

    componentWillMount() {
        let appointParam
        if (this.meetingId) {  // 编辑直播
            if (this.isExamine) {
                this.setState({
                    pageTitle: '审核直播'
                })
            } else {
                this.setState({
                    pageTitle: '编辑直播'
                })
            }
            this.getMeetingDetail(this.meetingId)
        } else {
            let sMoment = this.getStartDate()
            let eMoment = this.getEndDate(sMoment)
            let start_date = moment(sMoment)
            let start_time = moment(sMoment)
            let end_date = moment(eMoment)
            let end_time = moment(eMoment)
            appointParam = {
                user_list: '',
                guest_list: '',
                image: '',
                title: '', // 直播主题
                start_time_at: '',
                end_time_at: '',
                max_user_limit: 50,
                meeting_type: 1,
                password: '',
                description: '',
                participants_description: '',
                host: '',
                popularize: 1,
                material: '',
                start_date,
                start_time,
                end_date,
                end_time
            }
            this.setState({
                appointParam,
                pageTitle: '创建直播'
            }, () => {
                this.appointForm.current.setFieldsValue(appointParam)
            })
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    getMeetingDetail = (meetingId) => {
        actionSeminar.getLiveDetail({ meeting_id: meetingId }).then(res => {
            if (res.code !== 200) {
                this.showToast({ type: 'error', content: '获取直播详情失败' })
            } else {
                console.log('直播详情：', res)
                if (res.data.meeting.status == 1) {
                    this.showToast('直播正在进行中');
                    this.props.closeCreat();
                    this.props.refeshAndhttp();
                    return
                } else if (res.data.meeting.status === 3) {
                    this.showToast('直播已结束')
                    this.props.closeCreat();
                    this.props.refeshAndhttp();
                    return
                }
                let {
                    meeting_id,
                    title,
                    end_time_at,
                    start_time_at,
                    password,
                    max_user_limit,
                    meeting_type,
                    popularize,
                    material,
                    description,
                    participants_description,
                    image
                } = res.data.meeting;

                let userGroup = res.data.user_list.map(user => {
                    return { id: Number(user.uid), ...user }
                })
                let phoneList = res.data.phone_list
                let picList = image ? [{ url: image }] : [];
                let guestGroup = res.data.guest_list.map(user => {
                    return { id: Number(user.uid), ...user }
                })
                let editStart = dealTableTime(start_time_at);
                let editEnd = dealTableTime(end_time_at);
                let host = res.data.host.uid;
                let masterValue = res.data.host.nickname;
                let fileList = res.data.doc_list.map(i => {
                    return {
                        id: i.id,
                        title: i.title + '.' + i.suffix,
                        doc_url: i.url,
                        lid: i.id,
                        size: '',
                        is_me: i.is_me
                    }
                })
                if (this.isExamine) {
                    this.setState({
                        userGroup,
                        phoneList,
                        editStart,
                        editEnd,
                        masterValue,
                        picList,
                        guestGroup,
                        fileList,
                        appointParam: {
                            image,
                            meeting_id,
                            title,
                            end_time_at,
                            start_time_at,
                            password,
                            max_user_limit,
                            meeting_type,
                            popularize,
                            material,
                            description,
                            participants_description,
                            user_list: '',
                            host,
                            aud_desc: '',
                            auditing: 1
                        }
                    }, () => {
                        this.appointForm.current.setFieldsValue(this.state.appointParam)
                    })
                } else {
                    this.setState({
                        userGroup,
                        phoneList,
                        editStart,
                        editEnd,
                        masterValue,
                        picList,
                        guestGroup,
                        fileList,
                        appointParam: {
                            image,
                            meeting_id,
                            title,
                            end_time_at,
                            start_time_at,
                            password,
                            max_user_limit,
                            meeting_type,
                            popularize,
                            material,
                            description,
                            participants_description,
                            user_list: '',
                            host
                        }
                    }, () => {
                        this.appointForm.current.setFieldsValue(this.state.appointParam)
                    })
                }

            }
        })
    }
    // 生成开始时间
    getStartDate = () => {
        let sMoment = moment().seconds(0)
        let minute = sMoment.minute()
        minute = (parseInt(minute / 15) + 1) * 15

        sMoment.set('minute', minute)
        console.log(22, sMoment.format())
        return sMoment
    }
    // 根据开始时间生成下一个整1小时
    getEndDate = (sMoment) => {
        let eMoment = moment(sMoment)
        let duration = 45
        // if (this.props.userInfo.target_type[0] && this.props.userInfo.target_type[0].target_type === 'basicset') {
        //   duration = 45
        // }
        let minute = eMoment.minute() + duration
        eMoment.set('minute', minute)
        return eMoment
    }
    addConfirm = (users) => {
        console.log(users)
        this.setState({
            appointParam: {
                ...this.state.appointParam,
                userlist: users
            }
        })
    }
    startDateChange = (m) => {
        let start_date = m;
        let start_time = moment(start_date.format('YYYY-MM-DD') + ' ' + this.appointForm.current.getFieldValue('start_time').format('HH:mm'))
        let end_date = this.getEndDate(start_time)
        let end_time = this.getEndDate(start_time)
        this.appointForm.current.setFieldsValue({ end_date, end_time })
        this.appointForm.current.validateFields(['start_time'])
    }
    startTimeChange = (m) => {
        let start_time = m;
        start_time = moment(this.appointForm.current.getFieldValue('start_date').format('YYYY-MM-DD') + ' ' + start_time.format('HH:mm'))
        console.log('astart_time:', start_time)
        let end_date = this.getEndDate(start_time)
        let end_time = this.getEndDate(start_time)
        this.appointForm.current.setFieldsValue({ end_date, end_time })
        this.appointForm.current.validateFields(['start_date'])
    }
    startDisabledDate = (current) => {
        return current && current < moment().startOf('day')  // .subtract(1, 'day');
    }
    endDisabledDate = (_current) => {
        let startDate = moment(this.appointForm.current.getFieldValue('start_date')).format('YYYY-MM-DD')
        let startDate2 = moment(startDate).add(2, 'days').format('YYYY-MM-DD')
        let current = _current.format('YYYY-MM-DD')
        return current &&
            (
                current < startDate
                ||
                current > startDate2
            )
    }
    updateDate = (values) => {
        if (!this.state.appointParam.image) {
            if (this.isExamine && this.state.appointParam.auditing == 2) {
                this.appointConfirm(values)
            } else {
                this.showModal({
                    title: '您未上传直播封面，若不上传则使用默认图片',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.appointConfirm(values)
                    },
                    onCancel: () => {

                    },
                    size: 'small'
                })
            }
        } else {
            this.appointConfirm(values)
        }
    }
    appointFailed = (res) => {
        this.showToast({ content: '您有必填项未填写', type: 'success' })
    }
    appointConfirm = (values) => {
        let start_date, start_time, end_date, end_time;
        if (!this.meetingId) {
            start_date = values.start_date.format('YYYY-MM-DD')
            start_time = values.start_time.format('HH:mm')
            end_date = values.end_date.format('YYYY-MM-DD')
            end_time = values.end_time.format('HH:mm')
        }
        let param = {};
        let userStr = [];
        let guestStr = [];
        let phoneStr = [];
        for (let key in this.state.appointParam) {
            if (key !== 'end_date' && key !== 'end_time' && key !== 'start_date' && key !== 'start_time' && key !== 'end_time_at' && key !== 'start_time_at') {
                param[key] = this.state.appointParam[key]
            } else if (key === 'start_time_at') {
                !this.meetingId && (param[key] = new Date(start_date + ' ' + start_time).getTime() / 1000);
                this.meetingId && (param[key] = this.state.appointParam[key]);
            } else if (key === 'end_time_at') {
                !this.meetingId && (param[key] = new Date(end_date + ' ' + end_time).getTime() / 1000);
                this.meetingId && (param[key] = this.state.appointParam[key]);
            }
        }
        this.state.userGroup.forEach(ele => {
            userStr.push(ele.id);
        })
        this.state.guestGroup.forEach(ele => {
            guestStr.push(ele.id)
        })
        // 固话名单
        this.state.phoneList.forEach(ele => {
            phoneStr.push(ele.id);
        })
        param.phone_list = phoneStr.join(',')
        param.user_list = userStr.join(',');
        param.guest_list = guestStr.join(',');
        param.doc_list = JSON.stringify(this.state.fileList)
        this.setState({
            submitLoading: true,
            disclaimer: true
        })
        if (this.meetingId) {
            param.meeting_id = this.meetingId;
            if (this.isExamine) {
                actionSeminar.examineLive(param).then(res => {
                    if (res.code === 200) {
                        this.props.closeCreat && this.props.closeCreat();
                        this.props.refeshAndhttp && this.props.refeshAndhttp()
                    } else {
                        this.showToast({ content: res.msg, type: 'error' })
                    }
                }).finally(() => {
                    this.setState({
                        submitLoading: false,
                        disclaimer: false
                    })
                })
            } else {
                actionSeminar.editNewLive(param).then(res => {
                    if (res.code === 200) {
                        this.showToast({ content: '编辑成功', type: 'success' });
                        this.props.closeCreat && this.props.closeCreat();
                        this.props.refeshAndhttp && this.props.refeshAndhttp();
                    } else {
                        this.showToast({ content: res.msg, type: 'error' })
                    }
                }).finally(() => {
                    this.setState({
                        submitLoading: false,
                        disclaimer: false
                    })
                })
            }
        } else {
            actionSeminar.createNewLive(param).then(res => {
                if (res.code === 200) {
                    this.showToast({ content: '创建成功', type: 'success' });
                    this.props.closeCreat && this.props.closeCreat();
                    this.props.refeshAndhttp && this.props.refeshAndhttp()
                } else {
                    this.showToast({ content: res.msg, type: 'error' })
                }
            }).finally(() => {
                this.setState({
                    submitLoading: false,
                    disclaimer: false
                })
            })
        }
    }
    /**
     * 页面头部
     */
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>{this.state.pageTitle}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.closeCreat()
                    }}
                    label='返回'
                />
            </div>
        )
    }
    /**
     * 创建表单的label
     */
    createLabel = (labelName, need, style = {}) => {
        return <div>
            {need ? <span style={{ color: '#ff4d4f' }}>*</span> : null}
            <span style={{ ...style }}>{labelName}</span>
        </div>
    }
    /**
     * 添加主持人
     */
    addMaster = () => {
        this.props.addMaster({
            showSelectGroup: true,
            selectType: 'radio',
            originArr: [],
            originCanCancel: true,
            returnStyle: 'object',
            successFunName: 'changeMeetingMaster',
            mustIdent: true
        })
    }
    setHost = (data) => {
        this.setState({
            masterValue: data[0].nickname,
            appointParam: {
                ...this.state.appointParam,
                host: data[0].id
            }
        })
    }
    setVisitor = (data) => {
        for (let i = 0; i < data.length; i++) {
            let isInOrigin = this.state.userGroup.findIndex(ele => { return ele.id === data[i].id })
            if (isInOrigin === -1) {
                this.state.userGroup.push(data[i])
            }
        }
        this.setState({
            userGroup: this.state.userGroup
        }, () => {
            this.appointForm.current.validateFields(['user_list'])
        })
    }
    setGuest = (data) => {
        this.setState({
            guestGroup: data
        })
    }
    addUser = () => {
        this.props.addMaster({
            showSelectGroup: true,
            selectType: 'checkbox',
            originArr: this.state.userGroup,
            originCanCancel: true,
            returnStyle: 'object',
            successFunName: 'changeVisit'
        })
    }
    addPhone = () => {
        this.props.addPhone({
            showSelectGroup: true,
            selectType: 'checkbox',
            originArr: this.state.phoneList,
            originCanCancel: true,
            returnStyle: 'object',
            successFunName: 'changeVisit'
        })
    }
    setPhone = (data) => {
        this.setState({
            phoneList: data
        }, () => {
            this.appointForm.current.validateFields(['user_list'])
        })
    }
    setActUser = (data) => {
        for (let i = 0; i < data.length; i++) {
            let isInOrigin = this.state.userGroup.findIndex(ele => { return ele.id === data[i].id })
            if (isInOrigin === -1) {
                this.state.userGroup.push(data[i])
            }
        }
        this.setState({
            userGroup: this.state.userGroup
        }, () => {
            this.appointForm.current.validateFields(['user_list'])
        })
    }
    addGuest = () => {
        this.props.addMaster({
            showSelectGroup: true,
            selectType: 'checkbox',
            originArr: this.state.guestGroup,
            originCanCancel: true,
            returnStyle: 'object',
            successFunName: 'changeGuest',
            maxNum: config.maxPersonNum,
            mustIdent: true
        })
    }
    documentUpload = (upload) => {
        let uploader = new Uploader({
            file: upload.file,
            method: 'POST',
            baseURL: config.uploadBaseUrl,
            url: '/api/playback/upload',
            chunkSize: 2 * 1024 * 1024,   // 切片大小 2M
            onStart: () => {
                this.setState({
                    showUpDoc: true
                })
            },
            onSuccess: (res) => {
                console.log('--------上传成功-------', res)
                let fileList = [...this.state.fileList, {
                    id: '',
                    title: res.name,
                    doc_url: res.url,
                    lid: this.count,
                    is_me: 1,
                    upLoad: 1,
                    size: ''
                }]
                this.count++
                this.setState({
                    fileList,
                    showUpDoc: false
                })
            },
            onError: () => {
                console.log('--------上传失败-------')
                this.showToast({ type: 'error', content: '上传文档失败' })
                this.setState({
                    showUpDoc: false
                })
            },
            onProgress: (progress) => {
                console.log('-------上传进度---------', progress)
                // 进度条
            },
            onCancel: () => {
                console.log('-------上传取消---------')
                this.setState({
                    showUpDoc: false
                })
            }
        })
        let dtype = 3
        uploader.upload({
            dtype,
            dtranscode: false
        })
    }
    docDelete = (id) => {
        let fileList = this.state.fileList.filter(i => {
            return (i.id !== id) && i.lid !== id
        })
        this.setState({
            fileList
        })
    }
    getUserListState = () => {
        if (this.state.appointParam.meeting_type == 1) {
            return false
        } else {
            if (this.isExamine) {
                if (this.state.appointParam.auditing == 2) {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        }
    }
    render() {
        return (
            <div className="floatBox">
                <WindowContainer title={this.pageTitle}>
                    <div className="meeting-appointment">
                        <RLDisplayBoard
                            style={{ padding: 70, paddingTop: 40 }}
                        >
                            <RLForm
                                labelCol={{ style: { width: 100, marginRight: 20 } }}
                                labelAlign='left'
                                wrapperCol={
                                    { span: 20 }
                                }
                                onFinish={this.updateDate}
                                onFinishFailed={this.appointFailed}
                                className='appointment-form'
                                ref={this.appointForm}
                                validateTrigger='onBlur'
                            >
                                {!this.meetingId && <RLFormItem label={this.createLabel('直播主题', true)} colon={true}
                                    name='title'
                                    rules={[{
                                        max: 50,
                                        message: '直播主题最多50位'
                                    }, {
                                        validator: (rule, val) => {
                                            if (!val) {
                                                return Promise.reject('直播主题不可为空')
                                            }
                                            return Promise.resolve()
                                        }
                                    }
                                    ]}
                                >
                                    <RLInput
                                        placeholder='请输入直播主题'
                                        style={{ width: 360 }}
                                        onChange={(e) => {
                                            let text = e.target.value
                                            this.setState({
                                                appointParam: {
                                                    ...this.state.appointParam,
                                                    title: text
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>}
                                {this.meetingId && <RLFormItem label={this.createLabel('直播主题', true)} colon={true}>
                                    <span>{this.state.appointParam.title}</span>
                                </RLFormItem>}
                                {!this.meetingId && <RLFormItem label={this.createLabel('开始时间', true)} colon={true}>
                                    <div className='form-item-gropu'>
                                        <RLFormItem
                                            name='start_date'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择开始日期'
                                                }, {
                                                    validator: (rule, val) => {
                                                        let { start_time } = this.appointForm.current.getFieldsValue(['start_time'])
                                                        let startTime = moment(val.format('YYYY-MM-DD') + ' ' + start_time.format('HH:mm'))
                                                        if (startTime < moment()) {
                                                            return Promise.reject('开始时间不能小于当前时间')
                                                        } else {
                                                            return Promise.resolve()
                                                        }
                                                    },
                                                }
                                            ]}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                onChange={this.startDateChange}
                                                disabledDate={this.startDisabledDate}
                                                locale={locale}
                                                inputReadOnly={true}
                                            />
                                        </RLFormItem>
                                        <RLFormItem
                                            name='start_time'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择开始时间'
                                                },
                                                {
                                                    validator: (rule, val) => {
                                                        let { start_date } = this.appointForm.current.getFieldsValue(['start_date'])
                                                        let startTime = moment(start_date.format('YYYY-MM-DD') + ' ' + val.format('HH:mm'))
                                                        if (startTime < moment()) {
                                                            return Promise.reject('')
                                                        }
                                                        return Promise.resolve()
                                                    },
                                                }
                                            ]}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                picker='time'
                                                showNow={false}
                                                format='HH:mm'
                                                minuteStep={15}
                                                onChange={this.startTimeChange}
                                                locale={locale}
                                                inputReadOnly={true}
                                            />
                                        </RLFormItem>
                                    </div>
                                </RLFormItem>}
                                {this.meetingId && <RLFormItem label={this.createLabel('开始时间', true)} colon={true}>
                                    <div>{this.state.editStart}</div>
                                </RLFormItem>}
                                {!this.meetingId && <RLFormItem label={this.createLabel('结束时间', true)} colon={true}>
                                    <div className='form-item-gropu'>
                                        <RLFormItem
                                            name='end_date'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择结束日期'
                                                }, {
                                                    validator: (rule, val) => {
                                                        let { start_date, start_time, end_time } = this.appointForm.current.getFieldsValue(['start_date', 'start_time', 'end_time'])
                                                        let startTime = moment(start_date.format('YYYY-MM-DD') + ' ' + start_time.format('HH:mm'))
                                                        let endTime = moment(val.format('YYYY-MM-DD') + ' ' + end_time.format('HH:mm'))
                                                        if (startTime >= endTime) {
                                                            return Promise.reject('结束时间不能小于开始时间')
                                                        }
                                                        let msg = '直播时长不能超过24小时'
                                                        let duration = endTime - startTime
                                                        let maxDuration = 1000 * 60 * 60 * 24
                                                        console.log('结束日期验证结果：', duration, maxDuration)
                                                        if (duration > maxDuration) {
                                                            return Promise.reject(msg)
                                                        }
                                                        return Promise.resolve()

                                                    },
                                                }
                                            ]}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                disabledDate={this.endDisabledDate}
                                                locale={locale}
                                                inputReadOnly={true}
                                                onChange={() => {
                                                    this.appointForm.current.validateFields(['end_time'])
                                                }}
                                            />
                                        </RLFormItem>
                                        <RLFormItem
                                            name='end_time'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择结束时间'
                                                },
                                                {
                                                    validator: (rule, val) => {
                                                        let { start_date, start_time, end_date } = this.appointForm.current.getFieldsValue(['start_date', 'start_time', 'end_date'])
                                                        let startTime = moment(start_date.format('YYYY-MM-DD') + ' ' + start_time.format('HH:mm'))
                                                        let endTime = moment(end_date.format('YYYY-MM-DD') + ' ' + val.format('HH:mm'))
                                                        let duration = endTime - startTime
                                                        let maxDuration = 1000 * 60 * 60 * 24

                                                        console.log('结束时间验证：', duration, maxDuration)
                                                        if (startTime >= endTime) {
                                                            return Promise.reject('')
                                                        }
                                                        if (duration > maxDuration) {
                                                            return Promise.reject('')
                                                        }
                                                        return Promise.resolve()
                                                    },
                                                }
                                            ]}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                showNow={false}
                                                picker='time'
                                                format='HH:mm'
                                                minuteStep={15}
                                                locale={locale}
                                                inputReadOnly={true}
                                                onChange={(e) => {
                                                    this.appointForm.current.validateFields(['end_date'])
                                                }}
                                            />
                                        </RLFormItem>
                                    </div>
                                </RLFormItem>}
                                {this.meetingId && <RLFormItem label={this.createLabel('结束时间', true)} colon={true}>
                                    <div>{this.state.editEnd}</div>
                                </RLFormItem>}
                                {!this.meetingId && <RLFormItem label={this.createLabel('直播人数', true)} colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLRadioGroup onChange={(e) => {
                                            this.setState({
                                                appointParam: {
                                                    ...this.state.appointParam,
                                                    max_user_limit: e.target.value
                                                }
                                            })
                                        }} items={config.liveMaxNum} value={this.state.appointParam.max_user_limit} />
                                    </div>
                                </RLFormItem>}
                                {this.meetingId && <RLFormItem label={this.createLabel('直播人数', true)} colon={true} >
                                    <div>{this.state.appointParam.max_user_limit + '人'}</div>
                                </RLFormItem>}
                                {!this.meetingId && <RLFormItem label={this.createLabel('直播性质', true)} colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLRadioGroup onChange={(e) => {
                                            this.setState({
                                                appointParam: {
                                                    ...this.state.appointParam,
                                                    meeting_type: e.target.value
                                                }
                                            }, () => {
                                                this.appointForm.current.validateFields(['user_list'])
                                            })
                                        }} items={config.meetingNature} value={this.state.appointParam.meeting_type} />
                                    </div>
                                </RLFormItem>}
                                {this.meetingId && <RLFormItem label={this.createLabel('直播性质', true)} colon={true} >
                                    <div>{this.state.appointParam.meeting_type == 1 ? '公开' : '非公开'}</div>
                                </RLFormItem>}
                                {!this.meetingId && <RLFormItem label='直播密码' colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLFormItem
                                            name='is_password'
                                            valuePropName="checked"
                                        >
                                            <RLCheckbox
                                                label='设置密码'
                                                onChange={(e) => {
                                                    console.log(e.target.checked)
                                                    this.setState({
                                                        appointParam: {
                                                            ...this.state.appointParam,
                                                            is_password: e.target.checked,
                                                            password: ''
                                                        }
                                                    }, () => {
                                                        if (this.state.appointParam.is_password) {
                                                            // console.log(this.refs)
                                                            this.passwordInput.focus()
                                                        }
                                                    })
                                                }}
                                            />
                                            {/* checked={Number(this.state.appointParam.is_password) === 1} */}
                                        </RLFormItem>
                                        {
                                            Number(this.state.appointParam.is_password) === 1 && (
                                                <RLFormItem
                                                    name='password'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入直播密码'
                                                        }, {
                                                            pattern: /^\d{4}$/,
                                                            message: '请输入四位数字'
                                                        }
                                                    ]}
                                                >
                                                    <RLInput
                                                        ref={ref => this.passwordInput = ref}
                                                        placeholder='请输入直播密码'
                                                        maxLength={4}
                                                        onChange={(e) => {
                                                            let text = e.target.value
                                                            text = text.replace(/[^\d]/g, '')
                                                            console.log(text);
                                                            this.setState({
                                                                appointParam: {
                                                                    ...this.state.appointParam,
                                                                    password: text
                                                                }
                                                            })
                                                        }}
                                                        type={'number'}
                                                        value={this.state.appointParam.password}
                                                    />
                                                </RLFormItem>
                                            )
                                        }
                                    </div>
                                </RLFormItem>}
                                {this.meetingId && <RLFormItem label='直播密码' colon={true} >
                                    {this.state.appointParam.password ? this.state.appointParam.password : '无'}
                                </RLFormItem>}
                                <RLFormItem label={this.createLabel('直播封面', false)}>
                                    <div className='form-item-gropu' style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <ConfigProvider locale={commonLocale}>
                                            <RLFormItem
                                                name='image'
                                            >
                                                <ImgCrop
                                                    className="img-crop"
                                                    modalTitle="裁剪图片"
                                                    modalCancel="取消"
                                                    modalOk="确定"
                                                    minZoom={0.5}
                                                    maxZoom={3}
                                                    aspect={4 / 3}
                                                >
                                                    <Upload
                                                        accept="image/*"
                                                        listType="picture-card"
                                                        onRemove={(ele) => {
                                                            this.setState({
                                                                picList: [],
                                                                appointParam: {
                                                                    ...this.state.appointParam,
                                                                    image: ''
                                                                }
                                                            })
                                                        }}
                                                        showUploadList={{
                                                            showPreviewIcon: false
                                                        }}
                                                        fileList={this.state.picList}
                                                        customRequest={(upload) => {
                                                            if (upload.file.size > limtSize) {
                                                                this.showToast({ type: 'error', content: '选择文件不可超过2M' })
                                                                return false
                                                            }
                                                            let formData = new FormData();
                                                            if (upload.file.type.indexOf('image') !== -1) {
                                                                formData.append('type', 'picture')
                                                            } else {
                                                                formData.append('type', 'doc')
                                                            }
                                                            formData.append('resource', upload.file);
                                                            commonActions.fileUpload(formData).then(res => {
                                                                this.setState({
                                                                    picList: [...this.state.picList, { url: res.data.fileurl }],
                                                                    appointParam: {
                                                                        ...this.state.appointParam,
                                                                        image: res.data.fileurl
                                                                    }
                                                                })
                                                            })
                                                        }}
                                                    >
                                                       <div>
                                                            <PlusOutlined />
                                                        </div>
                                                    </Upload>
                                                </ImgCrop>
                                            </RLFormItem>
                                            <p style={{
                                                fontSize: 12,
                                                color: '#999',
                                                marginTop: 10
                                            }}>只能上传jpg/png，大小不超过2M</p>
                                        </ConfigProvider>
                                    </div>
                                </RLFormItem>
                                <RLFormItem label='指定主持人' colon={true} >
                                    <div className='form-item-gropu' style={{
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}>
                                            <RLInput
                                                disabled
                                                placeholder='请添加主持人,必须是认证用户'
                                                style={{ width: 360 }}
                                                value={this.state.masterValue}
                                            />
                                            {(!this.meetingId || this.isExamine) && <RLButton
                                                label='添加'
                                                type='primary'
                                                onClick={this.addMaster}
                                                style={{ marginLeft: 20 }}
                                            />}
                                        </div>
                                        <p style={{
                                            fontSize: 12,
                                            color: '#999',
                                            marginTop: 10
                                        }}>您不在直播中时，该邀请成员优先成为主持人</p>
                                    </div>
                                </RLFormItem>
                                <RLFormItem label={this.createLabel('直播人员名单', this.getUserListState())} colon={true}
                                    name='user_list'
                                    rules={[
                                        {
                                            validator: () => {
                                                if (this.state.appointParam.meeting_type == 0) {
                                                    if (!this.state.userGroup.length && !this.state.phoneList.length) {
                                                        if (this.isExamine) {
                                                            if (this.state.appointParam.auditing == 2) {
                                                                return Promise.resolve()
                                                            } else {
                                                                return Promise.reject('如果直播性质选择的是非公开直播，参会者名单是必填项')
                                                            }
                                                        } else {
                                                            return Promise.reject('如果直播性质选择的是非公开直播，参会者名单是必填项')
                                                        }
                                                    } else {
                                                        return Promise.resolve()
                                                    }
                                                } else {
                                                    return Promise.resolve()
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <RLButton
                                                label='添加用户'
                                                type='primary'
                                                onClick={this.addUser}
                                                style={{ width: 110, marginBottom: 15 }}
                                            />
                                            <RLButton
                                                label='添加固话'
                                                type='primary'
                                                onClick={this.addPhone}
                                                style={{ width: 110, marginBottom: 15, marginLeft: 20 }}
                                            />
                                            <RLButton
                                                label='导入报名用户'
                                                type='primary'
                                                onClick={this.props.addActivityUser}
                                                style={{ width: 130, marginBottom: 15, marginLeft: 20 }}
                                            />
                                        </div>
                                        <div className='form-item-gropu'>
                                            <div style={{
                                                width: 500,
                                                minHeight: 60,
                                                border: '1px solid rgb(220, 223, 230)',
                                                borderRadius: 3,
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                padding: '10px 10px 10px 10px',
                                                boxSizing: 'border-box',
                                                overflowY: 'scroll'
                                            }}>
                                                {this.state.userGroup.map(ele => {
                                                    return <div style={{ height: 19, marginTop: 4 }} key={ele.id}>
                                                        <RLTag label={ele.nickname} closable onClose={() => {
                                                            let all = [...this.state.userGroup]
                                                            let index = all.findIndex(clc => { return clc.id == ele.id });
                                                            all.splice(index, 1);
                                                            this.setState({
                                                                userGroup: all
                                                            }, () => {
                                                                this.appointForm.current.validateFields(['user_list'])
                                                            })
                                                        }} />
                                                    </div>
                                                })}
                                                {this.state.phoneList.map(ele => {
                                                    return <div style={{ height: 19, marginTop: 4 }} key={ele.id}>
                                                        <RLTag label={ele.number} closable onClose={() => {
                                                            let all = [...this.state.phoneList]
                                                            let index = all.findIndex(clc => { return clc.id === ele.id });
                                                            all.splice(index, 1);
                                                            this.setState({
                                                                phoneList: all
                                                            }, () => {
                                                                this.appointForm.current.validateFields(['user_list'])
                                                            })
                                                        }} />
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </RLFormItem>
                                <RLFormItem label={this.createLabel('设置嘉宾', false)} colon={true}
                                    name='guest_list'
                                >
                                    <div className='form-item-gropu'>
                                        <div style={{
                                            width: 500,
                                            minHeight: 60,
                                            maxHeight: 150,
                                            border: '1px solid rgb(220, 223, 230)',
                                            borderRadius: 3,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            padding: '10px 10px 10px 10px',
                                            boxSizing: 'border-box',
                                            overflowY: 'scroll'
                                        }}>
                                            {this.state.guestGroup.map(ele => {
                                                return <div style={{ height: 19, marginTop: 4 }} key={ele.id}>
                                                    <RLTag label={ele.nickname} closable onClose={() => {
                                                        let all = [...this.state.guestGroup]
                                                        let index = all.findIndex(clc => { return clc.id == ele.id });
                                                        all.splice(index, 1);
                                                        this.setState({
                                                            guestGroup: all
                                                        })
                                                    }} />
                                                </div>
                                            })}
                                        </div>
                                        <RLButton
                                            label='添加'
                                            type='primary'
                                            onClick={this.addGuest}
                                            style={{ marginLeft: 20 }}
                                        />
                                    </div>
                                </RLFormItem>
                                <RLFormItem label='直播说明' colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLTextarea style={{
                                            width: 500,
                                            border: 'none',
                                            resize: 'none'
                                        }}
                                            autoSize={{
                                                minRows: 2, maxRows: 6
                                            }}
                                            showCount
                                            maxLength={200} value={this.state.appointParam.description} onChange={e => {
                                                this.setState({
                                                    appointParam: {
                                                        ...this.state.appointParam,
                                                        description: e.target.value
                                                    }
                                                })
                                            }} />
                                    </div>
                                </RLFormItem>
                                {/* <RLFormItem label='直播人员说明' colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLTextarea style={{
                                            width: 500,
                                            border: 'none',
                                            resize: 'none'
                                        }}
                                            autoSize={{
                                                minRows: 2, maxRows: 6
                                            }}
                                            showCount
                                            maxLength={200} value={this.state.appointParam.participants_description} onChange={e => {
                                                this.setState({
                                                    appointParam: {
                                                        ...this.state.appointParam,
                                                        participants_description: e.target.value
                                                    }
                                                })
                                            }} />
                                    </div>
                                </RLFormItem> */}
                                <RLFormItem label={this.createLabel('是否推广', true)} colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLRadioGroup onChange={(e) => {
                                            this.setState({
                                                appointParam: {
                                                    ...this.state.appointParam,
                                                    popularize: e.target.value
                                                }
                                            })
                                        }} items={config.meetingExtend} value={this.state.appointParam.popularize} />
                                    </div>
                                </RLFormItem>
                                <RLFormItem label='机构授权材料' colon={true} >
                                    <div className='form-item-gropu' style={{
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}>
                                            <RLInput
                                                disabled
                                                style={{ width: 360 }}
                                                value={this.state.appointParam.material}
                                            />
                                            <Upload accept=
                                                ".png,.jpg,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                customRequest={(upload) => {
                                                    let fileType = getFileTile(upload.file.name);
                                                    if (fileType !== 'doc' &&
                                                        fileType !== 'docx' && fileType !== 'xls' &&
                                                        fileType !== 'xlsx' && fileType !== 'pdf' &&
                                                        fileType !== 'png' && fileType !== 'jpg') {
                                                        this.showToast({ type: 'error', content: '上传文件格式不对' })
                                                        return
                                                    }
                                                    let formData = new FormData();
                                                    if (upload.file.type.indexOf('image') !== -1) {
                                                        formData.append('type', 'picture')
                                                    } else {
                                                        formData.append('type', 'doc')
                                                    }
                                                    formData.append('resource', upload.file);
                                                    commonActions.fileUpload(formData).then(res => {
                                                        this.setState({
                                                            appointParam: {
                                                                ...this.state.appointParam,
                                                                material: res.data.fileurl
                                                            }
                                                        })
                                                    })
                                                }}
                                                showUploadList={false}
                                            >
                                                <RLButton
                                                    label='上传文件'
                                                    type='primary'
                                                    onClick={this.getMeetingList}
                                                    style={{ marginLeft: 20 }}
                                                />
                                            </Upload>
                                        </div>
                                        <p style={{
                                            fontSize: 12,
                                            color: '#999',
                                            marginTop: 10
                                        }}>支持doc/docx/xls/xlsx/pdf/png/jpg格式</p>
                                    </div>
                                </RLFormItem>
                                <RLFormItem label='文档' colon={true}>
                                    <Upload
                                        accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                                        showUploadList={false}
                                        className="in-job-upload"
                                        customRequest={(upload) => {
                                            console.log('media-upload--file:', upload)
                                            const fileType = upload.file && upload.file.name   // 文件类型
                                            if (fileType) {
                                                let type = fileType.split('.').pop()
                                                console.log('-----文档类型-----', type);
                                                if (type != 'doc' && type != 'docx' && type != 'xls' && type != 'xlsx' && type != 'ppt' && type != 'pptx' && type != 'pdf') return this.showToast({ content: '文件格式不支持', type: 'error' })
                                            }
                                            this.documentUpload(upload)
                                        }}
                                        fileList={[]}
                                        maxCount={1}
                                        onRemove={() => { }}
                                    >
                                        {!this.state.showUpDoc ? <RLButton
                                            label='添加文档'
                                            type='primary'
                                        /> : <p style={{
                                            fontSize: 12,
                                            color: '#999',
                                            marginTop: 10
                                        }}>正在上传...</p>}
                                        <p style={{
                                            fontSize: 12,
                                            color: '#999',
                                            marginTop: 10
                                        }}>支持doc/docx、xls/xlsx、ppt/pptx、pdf格式</p>

                                    </Upload>
                                    <RLdocument
                                        fileList={this.state.fileList}
                                        docDelete={this.docDelete} />
                                </RLFormItem>
                                {/* {!this.isExamine ? <RLFormItem colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLCheckbox
                                            label='在线直播服务免责声明'
                                            onChange={(e) => {
                                                this.setState({
                                                    disclaimer: e.target.checked
                                                })
                                            }} checked={this.state.disclaimer}
                                        />
                                    </div>
                                </RLFormItem> : null} */}
                                {this.isExamine && <RLFormItem label={this.createLabel('直播审核', false, { fontWeight: 'bold' })} colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLRadioGroup onChange={(e) => {
                                            this.setState({
                                                appointParam: {
                                                    ...this.state.appointParam,
                                                    auditing: e.target.value
                                                }
                                            }, () => {
                                                this.appointForm.current.validateFields(['user_list'])
                                            })
                                        }} items={config.meetingExamine} value={this.state.appointParam.auditing} />
                                    </div>
                                </RLFormItem>}
                                {this.isExamine && < RLFormItem label={this.createLabel('审核详情', false, { fontWeight: 'bold' })} colon={true} >
                                    <div className='form-item-gropu'>
                                        <RLTextarea style={{
                                            width: 500,
                                            height: 170,
                                            resize: 'none'
                                        }} maxLength={200} value={this.state.appointParam.aud_desc} onChange={e => {
                                            this.setState({
                                                appointParam: {
                                                    ...this.state.appointParam,
                                                    aud_desc: e.target.value
                                                }
                                            })
                                        }} />
                                    </div>
                                </RLFormItem>}
                                <div style={{ width: '100%', display: 'flex', flex: 1, justifyContent: 'center' }}>
                                    <RLButton
                                        type="default"
                                        label='取消'
                                        width={80}
                                        onClick={() => {
                                            this.props.closeCreat()
                                        }}
                                    />
                                    <RLButton type="primary"
                                        htmlType="submit"
                                        label={this.meetingId ? (this.isExamine ? '确认' : '保存') : '创建'}
                                        style={{ marginLeft: 40 }}
                                        width={80}
                                        loading={this.state.submitLoading}
                                        disabled={this.state.disclaimer}
                                    />
                                </div>

                                {/* </RLFormItem> */}
                            </RLForm>
                        </RLDisplayBoard>
                    </div>
                </WindowContainer >
            </div >
        );
    }
}

export default connect((store, props) => {
    return {
        ...props,
        accountType: store.storeCommon.accountType
    }
})(CreateLive)