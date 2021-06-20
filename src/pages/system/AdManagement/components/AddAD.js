import React from 'react';
import {
    RLInput,
    RLButton,
    RLForm,
    RLFormItem,
    RLDatePicker,
    RLSelect,
    RLDisplayBoard,
    RLTag
} from '@components/index.js'
import './AddAD.less'
import WindowContainer from '@components/WindowContainer.js'
import moment from 'moment'
import BaseCmp from '@components/BaseCmp.js'
import locale from 'antd/es/date-picker/locale/zh_CN';
import SystemUpload from '@/pages/system/AdManagement/components/SystemUpload.js'
import { getADDetail, addAD, editAD } from '@actions/system/system.js'
import { dealSearchTime, dealTableTime } from '@/libs/utils'

const argumentList = [
    {
        label: '会议',
        value: '1'
    },
    {
        label: '直播',
        value: '2'
    },
    {
        label: '链接地址',
        value: '3'
    },
    {
        label: '点播',
        value: '4'
    }
]

class AddAD extends BaseCmp {
    constructor(props) {
        super(props);
        this.ADid = this.props.id;
        this.state = {
            mobileBanner: [],
            webBanner: [],
            appointParam: {
                title: '',
                type: 'index',
                argument: '',
                argue_type: undefined,
                webapp: '',
                website: ''
            },
            endTime: undefined,
            startTime: undefined,
            disclaimer: false,
            pageTitle: '',
            submitLoading: false // 提交按钮正在loading
        };
        this.appointForm = React.createRef();
    }

    componentWillMount() {
        if (this.ADid) {
            this.setState({
                pageTitle: '编辑广告'
            })
        } else {
            this.setState({
                pageTitle: '创建广告'
            })
        }
    }
    componentDidMount() {
        this.appointForm.current.setFieldsValue(this.state.appointParam);
        if (this.ADid) {
            this.getDetail(this.ADid)
        }
    }
    getDetail = (id) => {
        getADDetail({ id: id }).then(res => {
            if (res.code !== 200) {
                this.showToast({ type: 'error', content: '获取广告详情失败' })
            } else {
                console.log('广告详情：', res)
                let {
                    title,
                    type,
                    argument,
                    argue_type,
                    webapp,
                    website,
                    start_at,
                    end_at
                } = res.data;
                let startTime = dealTableTime(start_at);
                let endTime = dealTableTime(end_at);
                this.setState({
                    startTime,
                    endTime,
                    mobileBanner: [{ url: webapp }],
                    webBanner: [{ url: website }],
                    appointParam: {
                        title,
                        type,
                        argument,
                        argue_type: argue_type + '',
                        webapp,
                        website,
                        start_at,
                        end_at
                    }
                }, () => {
                    this.appointForm.current.setFieldsValue(this.state.appointParam);
                    this.appointForm.current.setFieldsValue({
                        start_date: moment(startTime),
                        start_time: moment(startTime),
                        end_date: moment(endTime),
                        end_time: moment(endTime),
                    })
                })
            }
        })
    }
    addConfirm = (users) => {
        this.setState({
            appointParam: {
                ...this.state.appointParam,
                userlist: users
            }
        })
    }
    startDateChange = (m) => {
        this.appointForm.current.validateFields(['start_time', 'end_date', 'end_time'])
    }
    startTimeChange = (m) => {
        this.appointForm.current.validateFields(['start_date', 'end_date', 'end_time'])
    }
    appointFailed = (res) => {
        this.showToast({ content: '您有必填项未填写', type: 'success' })
    }
    appointConfirm = (values) => {
        let start_date, start_time, end_date, end_time;
        start_date = values.start_date.format('YYYY-MM-DD')
        start_time = values.start_time.format('HH:mm')
        end_date = values.end_date.format('YYYY-MM-DD')
        end_time = values.end_time.format('HH:mm')
        let param = {}
        for (let key in this.state.appointParam) {
            if (key !== 'start_at' && key !== 'end_at') {
                param[key] = this.state.appointParam[key]
            }
        }
        param['start_at'] = new Date(start_date + ' ' + start_time).getTime() / 1000
        param['end_at'] = new Date(end_date + ' ' + end_time).getTime() / 1000
        this.setState({
            submitLoading: true,
            disclaimer: true
        })
        if (this.ADid) {
            param.id = this.ADid;
            editAD(param).then(res => {
                if (res.code === 200) {
                    this.showToast({ content: '编辑成功', type: 'success' })
                    this.props.return && this.props.return(true)
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
            addAD(param).then(res => {
                if (res.code === 200) {
                    this.showToast({ content: '创建成功', type: 'success' })
                    this.props.return && this.props.return(true)
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
                        this.props.return && this.props.return()
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
    meetingBtn = () => {
        return <div className='argumentItem heng'>
            <RLButton
                type="default"
                label='选择可推广的会议'
                width={140}
                height={40}
                onClick={() => {
                    this.props.displayRoomList && this.props.displayRoomList({
                        type: 0
                    })
                }}
            />
            {this.state.appointParam.argument && <RLTag label={`会议ID:${this.state.appointParam.argument}`} closable onClose={() => {
                this.setState({
                    appointParam: {
                        ...this.state.appointParam,
                        argument: ''
                    }
                }, () => {
                    this.appointForm.current.validateFields(['argument'])
                })
            }} />}
        </div>
    }
    liveBtn = () => {
        return <div className='argumentItem heng'>
            <RLButton
                type="default"
                label='选择可推广的直播'
                width={140}
                height={40}
                onClick={() => {
                    this.props.displayRoomList && this.props.displayRoomList({
                        type: 1
                    })
                }}
            />
            {this.state.appointParam.argument && <RLTag label={`直播ID:${this.state.appointParam.argument}`} closable onClose={() => {
                this.setState({
                    appointParam: {
                        ...this.state.appointParam,
                        argument: ''
                    }
                }, () => {
                    this.appointForm.current.validateFields(['argument'])
                })
            }} />}
        </div>
    }
    demandInput = () => {
        return <div className='argumentItem'>
            <RLInput
                style={{ width: 120 }}
                placeholder={'请输入点播ID'}
                value={this.state.appointParam.argument}
                onChange={(e) => {
                    let text = e.target.value
                    this.setState({
                        appointParam: {
                            ...this.state.appointParam,
                            argument: text
                        }
                    })
                }}
            />
        </div>
    }
    hrefInput = () => {
        return <div className='argumentItem'>
            <RLInput
                style={{ width: 360 }}
                placeholder={'请输入链接地址'}
                value={this.state.appointParam.argument}
                onChange={(e) => {
                    let text = e.target.value
                    this.setState({
                        appointParam: {
                            ...this.state.appointParam,
                            argument: text
                        }
                    })
                }}
            />
        </div>
    }
    addRoomNum = (id) => {
        this.setState({
            appointParam: {
                ...this.state.appointParam,
                argument: id
            }
        }, () => {
            this.appointForm.current.validateFields(['argument'])
        })
    }
    createArgument = () => {
        if (this.state.appointParam.argue_type == 1) {
            return this.meetingBtn()
        } else if (this.state.appointParam.argue_type == 2) {
            return this.liveBtn()
        } else if (this.state.appointParam.argue_type == 3) {
            return this.hrefInput()
        } else if (this.state.appointParam.argue_type == 4) {
            return this.demandInput()
        }
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>{this.state.pageTitle}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.return && this.props.return()
                    }}
                    label='返回'
                />
            </div>
        )
    }
    startDisabledDate = (current) => {
        return current && current < moment().startOf('day')
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
                                onFinish={this.appointConfirm}
                                onFinishFailed={this.appointFailed}
                                className='appointment-form'
                                ref={this.appointForm}
                                validateTrigger='onBlur'
                            >
                                <RLFormItem label={this.createLabel('标题', true)} colon={true}
                                    name='title'
                                    rules={[{
                                        validator: (rule, val) => {
                                            if (!val) {
                                                return Promise.reject('广告标题不可为空')
                                            }
                                            return Promise.resolve()
                                        }
                                    }
                                    ]}
                                >
                                    <RLInput
                                        placeholder='请输入内容'
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
                                </RLFormItem>
                                <RLFormItem label={this.createLabel('广告位置', true)} colon={true}
                                    name='type'
                                >
                                    <RLSelect
                                        options={[{
                                            label: '首页banner',
                                            value: 'index'
                                        }]}
                                        style={{ width: 120 }}
                                        placeholder='请选择'
                                        value={this.state.appointParam.type}
                                        onChange={(e) => {
                                            this.setState({
                                                appointParam: {
                                                    ...this.state.appointParam,
                                                    type: e
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>
                                <RLFormItem label={this.createLabel('开始时间', true)} colon={true}>
                                    <div className='form-item-gropu'>
                                        <RLFormItem
                                            name='start_date'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择开始日期'
                                                }
                                            ]}
                                            initialValue={this.state.startTime ? moment(this.state.startTime) : undefined}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                onChange={this.startDateChange}
                                                locale={locale}
                                                inputReadOnly={true}
                                                disabledDate={this.startDisabledDate}
                                            />
                                        </RLFormItem>
                                        <RLFormItem
                                            name='start_time'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择开始时间'
                                                }
                                            ]}
                                            initialValue={this.state.startTime ? moment(this.state.startTime) : undefined}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                picker='time'
                                                showNow={false}
                                                format='HH:mm'
                                                onChange={this.startTimeChange}
                                                locale={locale}
                                                inputReadOnly={true}
                                            />
                                        </RLFormItem>
                                    </div>
                                </RLFormItem>
                                <RLFormItem label={this.createLabel('结束时间', true)} colon={true}>
                                    <div className='form-item-gropu'>
                                        <RLFormItem
                                            name='end_date'
                                            rules={[{
                                                validator: (rule, val) => {
                                                    if (!val) {
                                                        return Promise.reject('请选择结束日期')
                                                    }
                                                    let { start_date, start_time, end_time } = this.appointForm.current.getFieldsValue(['start_date', 'start_time', 'end_time'])
                                                    if (start_date && start_time && end_time) {
                                                        let startTime = moment(start_date.format('YYYY-MM-DD') + ' ' + start_time.format('HH:mm'))
                                                        let endTime = moment(val.format('YYYY-MM-DD') + ' ' + end_time.format('HH:mm'))
                                                        if (startTime >= endTime) {
                                                            return Promise.reject('结束时间不能小于开始时间')
                                                        }
                                                    }
                                                    return Promise.resolve()
                                                }
                                            }]}
                                            initialValue={this.state.endTime ? moment(this.state.endTime) : undefined}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                locale={locale}
                                                inputReadOnly={true}
                                                disabledDate={this.startDisabledDate}
                                                onChange={() => {
                                                    this.appointForm.current.validateFields(['end_time', 'start_date', 'start_time'])
                                                }}
                                            />
                                        </RLFormItem>
                                        <RLFormItem
                                            name='end_time'
                                            rules={[
                                                {
                                                    validator: (rule, val) => {
                                                        if (!val) {
                                                            return Promise.reject('请选择结束时间')
                                                        }
                                                        // let { start_date, start_time, end_date } = this.appointForm.current.getFieldsValue(['start_date', 'start_time', 'end_date'])
                                                        // if (start_date && start_time && end_date) {
                                                        //     let startTime = moment(start_date.format('YYYY-MM-DD') + ' ' + start_time.format('HH:mm'))
                                                        //     let endTime = moment(end_date.format('YYYY-MM-DD') + ' ' + val.format('HH:mm'))
                                                        //     if (startTime >= endTime) {
                                                        //         return Promise.reject('结束时间不能小于开始时间')
                                                        //     }
                                                        // }
                                                        return Promise.resolve()
                                                    },
                                                }
                                            ]}
                                            initialValue={this.state.endTime ? moment(this.state.endTime) : undefined}
                                        >
                                            <RLDatePicker
                                                allowClear={false}
                                                showNow={false}
                                                picker='time'
                                                format='HH:mm'
                                                locale={locale}
                                                inputReadOnly={true}
                                                onChange={(e) => {
                                                    this.appointForm.current.validateFields(['end_date', 'start_date', 'start_time'])
                                                }}
                                            />
                                        </RLFormItem>
                                    </div>
                                </RLFormItem>
                                <RLFormItem label={this.createLabel('轮播图片', true)} colon={true}>
                                    <p>只能上传jpg/png，大小不超过2M</p>
                                    <RLFormItem
                                        name='webapp'
                                        rules={[{
                                            validator: (rule, val) => {
                                                if (!val) {
                                                    return Promise.reject('请上传移动端banner')
                                                }
                                                return Promise.resolve()
                                            }
                                        }
                                        ]}
                                    >
                                        <div className='systemPic'>
                                            <SystemUpload
                                                picList={this.state.mobileBanner}
                                                aspect={16 / 9}
                                                remove={() => {
                                                    this.setState({
                                                        mobileBanner: [],
                                                        appointParam: {
                                                            ...this.state.appointParam,
                                                            webapp: ''
                                                        }
                                                    })
                                                }}
                                                showUploadList={{}}
                                                upload={(res) => {
                                                    this.setState({
                                                        mobileBanner: [{ url: res.data.fileurl }],
                                                        appointParam: {
                                                            ...this.state.appointParam,
                                                            webapp: res.data.fileurl
                                                        }
                                                    })
                                                }}
                                                accept={'.png,.jpg'}
                                                fileType={'image'}
                                            />
                                            <p>移动端banner，图片比例16:9（建议：750*422px)</p>
                                        </div>
                                    </RLFormItem>
                                    <RLFormItem
                                        name='website'
                                        rules={[{
                                            validator: (rule, val) => {
                                                if (!val) {
                                                    return Promise.reject('请上传web网页banner')
                                                }
                                                return Promise.resolve()
                                            }
                                        }
                                        ]}
                                    >
                                        <div className='systemPic' style={{ marginTop: 30 }}>
                                            <SystemUpload
                                                picList={this.state.webBanner}
                                                aspect={192 / 40}
                                                remove={() => {
                                                    this.setState({
                                                        webBanner: [],
                                                        appointParam: {
                                                            ...this.state.appointParam,
                                                            website: ''
                                                        }
                                                    })
                                                }}
                                                showUploadList={{}}
                                                upload={(res) => {
                                                    this.setState({
                                                        webBanner: [{ url: res.data.fileurl }],
                                                        appointParam: {
                                                            ...this.state.appointParam,
                                                            website: res.data.fileurl
                                                        }
                                                    })
                                                }}
                                                accept={'.png,.jpg'}
                                                fileType={'image'}
                                            />
                                            <p>web网页banner（建议：1920*400px)</p>
                                        </div>
                                    </RLFormItem>
                                </RLFormItem>
                                <RLFormItem label={this.createLabel('图片关联', true)} colon={true}>
                                    <RLFormItem
                                        name='argue_type'
                                        rules={[{
                                            validator: (rule, val) => {
                                                if (!this.state.appointParam.argue_type) {
                                                    return Promise.reject('请选择要关联的信息')
                                                }
                                                return Promise.resolve()
                                            }
                                        }]}
                                    >
                                        <div>
                                            <RLSelect
                                                options={argumentList}
                                                style={{ width: 120 }}
                                                placeholder='请选择'
                                                value={this.state.appointParam.argue_type}
                                                onChange={(e) => {
                                                    this.setState({
                                                        appointParam: {
                                                            ...this.state.appointParam,
                                                            argument: '',
                                                            argue_type: e
                                                        }
                                                    })
                                                }}
                                            />
                                        </div>
                                    </RLFormItem>
                                    {this.state.appointParam.argue_type && <RLFormItem
                                        name='argument'
                                        rules={[{
                                            validator: (rule, val) => {
                                                if (!this.state.appointParam.argument) {
                                                    return Promise.reject('请选择要关联的信息')
                                                }
                                                return Promise.resolve()
                                            }
                                        }]}
                                    >
                                        {this.createArgument()}
                                    </RLFormItem>}
                                </RLFormItem>
                                <div style={{ width: '100%', display: 'flex', flex: 1, justifyContent: 'center' }}>
                                    <RLButton
                                        type="default"
                                        label='取消'
                                        width={80}
                                        onClick={() => {
                                            this.props.return && this.props.return()
                                        }}
                                    />
                                    <RLButton type="primary"
                                        htmlType="submit"
                                        label={this.ADid ? '保存' : '创建'}
                                        style={{ marginLeft: 40 }}
                                        width={80}
                                        loading={this.state.submitLoading}
                                        disabled={this.state.disclaimer}
                                    />
                                </div>
                            </RLForm>
                        </RLDisplayBoard>
                    </div>
                </WindowContainer >
            </div >
        );
    }
}

export default AddAD