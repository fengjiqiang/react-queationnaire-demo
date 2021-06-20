import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLTextarea, RLButton, RLForm, RLFormItem, RLRadioGroup, RLTag, RLCheckboxGroup, RLTable, RLModal, RLSwitch
} from '@components/index.js'
import { Tabs, DatePicker, InputNumber, Checkbox } from 'antd'
import { createRef } from 'react'

import actionEventRegistration from '@actions/marketingTool/actionEventRegistration.js'
import CmpUpload from '@/pages/common/CmpUpload.js'
import { dealTime, dealDateTime } from '@/libs/utils.js'
import moment from 'moment'
import AddUser from '@/pages/common/meeting/AddUser.js'


import commonActions from '@actions/commonActions'
import locale from 'antd/es/date-picker/locale/zh_CN'

import './CmpEventEdit.less'

const { TabPane } = Tabs


class CmpEventEdit extends BaseCmp {
    constructor(props) {
        super(props)
        if (props.eventId) {
            this.eventId = props.eventId
        }
        this.state = {
            addLoading: false,  // 添加按钮loading
            eventInfo: {
                title: '',   // 活动主题
                e_title: '',
                desc: '',   // 活动简介
                e_desc: '',
                content: '',   // 活动描述
                e_content: '',
                image: '',
                start_time_at: '',
                end_time_at: '',
                user_limit: '',
                show_field: '',   // 活动字段
                default_field: '',   // 必填字段
                user_list: '',
                action_type: 1   // 默认公开
            },   // 活动
            userGroup: [],   // 成员列表
            formShowField: [],   // 显示字段
            defaultFields: [],   // 必填字段
            language: 'zh',   // 默认中文
            showFields: [],   // 活动字段

            showAddUserModal: false,   // 添加人员弹框
            fieldSettingModal: false,   // 活动字段必填项弹框
            addUserConfig: {
                showSelectGroup: true,
                selectType: 'checkbox',
                originCanCancel: true,
                returnStyle: 'object',
                mustIdent: true
            }
        }
        this.form = createRef()
        this.columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '20%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            },
            {
                title: '字段',
                dataIndex: 'name',
                key: 'name',
                width: '40%'
            },
            {
                title: '必填/非必填',
                dataIndex: 'key',
                key: 'key',
                width: '40%',
                render: (text, record) => {
                    return <RLSwitch
                        defaultChecked={this.state.defaultFields.includes(record.id)}
                        onChange={value => {
                            if (value) {
                                if (!this.state.defaultFields.includes(record.id)) {
                                    this.state.defaultFields.push(record.id)
                                    this.setState({
                                        defaultFields: this.state.defaultFields
                                    })
                                }
                            } else {
                                let index = this.state.defaultFields.findIndex(i => i === record.id)
                                if (index >= 0) {
                                    this.state.defaultFields.splice(index, 1)
                                    this.setState({
                                        defaultFields: this.state.defaultFields
                                    })
                                }
                            }
                            this.setState({
                                eventInfo: {
                                    ...this.state.eventInfo,
                                    default_field: this.state.defaultFields.join(',')
                                }
                            })
                        }}
                    />
                }
            }
        ]
        // 获取显示字段
        this.getShowField()
    }
    componentDidMount() {
        if (this.eventId) {   // 编辑
            this.getEventDetail(this.eventId)
        } else {
            this.setState({
                eventInfo: {
                    ...this.state.eventInfo
                }
            })
        }
    }

    // 活动详情
    getEventDetail = (id) => {
        actionEventRegistration.getEventDetail({ id }).then(res => {
            if (res.code === 200) {
                const data = res.data
                this.setState({
                    userGroup: data.user_list,   // 成员名单
                    formShowField: data.show_field,   // 显示字段
                    defaultFields: data.default_field,   // 必填字段
                    eventInfo: {
                        ...data,
                        start_time_at: moment(dealTime(data.start_time_at, 'YYYY-MM-DD HH:mm')),
                        end_time_at: moment(dealTime(data.end_time_at, 'YYYY-MM-DD HH:mm')),
                        show_field: data.show_field.join(','),
                        default_field: data.default_field.join(',')
                    }
                }, () => {
                    // 给表单重置值
                    this.form && this.form.setFieldsValue(this.state.eventInfo)
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 显示字段
    getShowField = () => {
        actionEventRegistration.getEventShowField().then(res => {
            if (res.code === 200) {
                let showFields = res.data.map(item => {
                    return { value: Number(item.id), label: item.name, ...item }
                })
                this.setState({
                    showFields
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    editConfirm = (values) => {
        console.log('onFinish', values)
        this.setState({
            addLoading: true
        })
        let { start_time_at, end_time_at, action_type } = values
        const { title, e_title, desc, e_desc, content, e_content, image, user_limit, show_field, default_field, user_list } = this.state.eventInfo
        if (!default_field) {
            this.showToast('活动字段收集请设置必填项')
            this.setState({
                addLoading: false
            })
            return
        }
        if (this.state.language === 'zh') {
            if ((!e_title && !e_desc && !e_content) || (e_title && e_desc && e_content)) {
                
            } else {
                this.showToast('英文必填项请填写完整')
                this.setState({
                    addLoading: false
                })
                return
            }
        } else if (this.state.language === 'en') {
            if ((!title && !desc && !content) || (title && desc && content)) {

            } else {
                this.showToast('中文必填项请填写完整')
                this.setState({
                    addLoading: false
                })
                return
            }
        }
        const params = {
            title,
            e_title,
            desc,
            e_desc,
            content,
            e_content,
            start_time_at: dealDateTime(start_time_at.format('YYYY-MM-DD HH:mm')),
            end_time_at: dealDateTime(end_time_at.format('YYYY-MM-DD HH:mm')),
            action_type,
            image,
            show_field,
            default_field,
            user_list,
            user_limit: user_limit || ''
        }
        let userStr = []
        this.state.userGroup.forEach(ele => {
            userStr.push(ele.id)
        })
        params.user_list = userStr.join(',')
        params.langeage = this.state.language === 'en' ? 2 : 1
        console.log('添加编辑活动参数--params:', params)
        if (this.eventId) {   // 编辑
            actionEventRegistration.eventEdit({ ...params, id: this.eventId }).then(res => {
                if (res.code === 200) {
                    this.showToast({ content: '编辑成功', type: 'success' })
                    this.props.changePage('list')
                } else {
                    this.showToast({ type: 'error', content: res.msg })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        } else {   // 创建
            actionEventRegistration.eventCreate(params).then(res => {
                if (res.code === 200) {
                    this.showToast({ type: 'success', content: '创建成功' })
                    this.props.changePage('list')
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
        let title = '创建活动'
        if (this.eventId) {
            title = '编辑活动'
        }
        return (
            <div className="custom-page-title">
                <span>{title}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list', { page: this.props.page })
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

    // 必填项设置弹框
    renderDefaultField = () => {
        return (
            <RLModal
                visible={this.state.fieldSettingModal}
                title='活动字段必填项设置'
                footer={null}
                width={800}
                onCancel={() => {
                    this.setState({
                        fieldSettingModal: false
                    })
                }}
            >
                <RLTable
                    columns={this.columns}
                    dataSource={this.state.showFields}
                    rowKey='id'
                />
                <div className='modal-btnContainer'>
                    <RLButton label='取消'
                        onClick={() => {
                            this.setState({
                                fieldSettingModal: false
                            })
                        }}
                    />
                    <RLButton label='确定'
                        type='primary'
                        style={{ marginLeft: 30 }}
                        onClick={() => {
                            this.setState({
                                fieldSettingModal: false
                            })
                        }}
                    />
                </div>
            </RLModal>
        )
    }

    range = (start, end) => {
        const result = []
        for (let i = start; i < end; i++) {
            result.push(i)
        }
        return result
    }

    disabledEndDate = (current) => {
        return current && current < moment().startOf('day')
    }

    disabledEndDateTime = (dates) => {
        let hours = moment().hours()
        let minutes = moment().minutes()
        // 当日只能选择当前时间之后的时间点
        if (dates && moment(dates[1]).date() === moment().date()) {
            return {
                disabledHours: () => this.range(0, 24).splice(0, hours),
                disabledMinutes: () => this.range(0, 60).splice(0, minutes)
            }
        }
        return {
            disabledHours: () => [],
            disabledMinutes: () => []
        }
    }

    // 成员添加
    addSuccess = (data) => {
        let originUsers = this.state.userGroup
        let returnUsers = data.map(item => {
            return {
                'id': item.id,
                'nickname': item.nickname
            }
        })
        let newUsers = []
        for (let user of returnUsers) {
            let index = originUsers.findIndex(item => item.id === user.id)
            if (index < 0) {
                newUsers.push(user)
            }
        }
        let finalUsers = originUsers.concat(newUsers)
        this.setState({
            userGroup: finalUsers
        }, () => {
            this.form.validateFields(['user_list'])
        })
    }

    render() {
        const { showSelectGroup, selectType, originCanCancel, returnStyle, mustIdent } = this.state.addUserConfig
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
                    <RLForm
                        ref={form => this.form = form}
                        labelCol={{ style: { width: 150, marginRight: 20, textAlign: 'right' } }}
                        labelAlign='left'
                        wrapperCol={{ style: { span: 24, marginRight: 30 } }}
                        onFinish={this.editConfirm}
                        initialValues={this.state.eventInfo}
                        validateTrigger='onBlur'
                    >
                        {
                            this.state.language === 'zh' ?
                                <RLFormItem
                                    name='title'
                                    label='活动主题'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入活动主题'
                                        }, {
                                            max: 50,
                                            message: '活动主题最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLInput
                                        placeholder='请输入活动主题'
                                        style={{ width: 400 }}
                                        value={this.state.eventInfo.title}
                                        onChange={e => {
                                            this.setState({
                                                eventInfo: {
                                                    ...this.state.eventInfo,
                                                    title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem> :
                                <RLFormItem
                                    name='e_title'
                                    label='活动主题'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入活动主题'
                                        }, {
                                            max: 50,
                                            message: '活动主题最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLInput
                                        placeholder='请输入活动主题'
                                        style={{ width: 400 }}
                                        value={this.state.eventInfo.e_title}
                                        onChange={e => {
                                            this.setState({
                                                eventInfo: {
                                                    ...this.state.eventInfo,
                                                    e_title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>
                        }
                        {
                            this.state.language === 'zh' ?
                                <RLFormItem
                                    name='desc'
                                    label='活动简介'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入活动简介'
                                        }, {
                                            max: 200,
                                            message: '活动简介最多200个字符'
                                        }
                                    ]}
                                >
                                    <RLTextarea
                                        placeholder='请输入活动简介'
                                        rows={2}
                                        style={{ width: 520 }}
                                        value={this.state.eventInfo.desc}
                                        onChange={e => {
                                            this.setState({
                                                eventInfo: {
                                                    ...this.state.eventInfo,
                                                    desc: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem> :
                                <RLFormItem
                                    name='e_desc'
                                    label='活动简介'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入活动简介'
                                        }, {
                                            max: 200,
                                            message: '活动简介最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLTextarea
                                        placeholder='请输入活动简介'
                                        rows={2}
                                        style={{ width: 520 }}
                                        value={this.state.eventInfo.e_desc}
                                        onChange={e => {
                                            this.setState({
                                                eventInfo: {
                                                    ...this.state.eventInfo,
                                                    e_desc: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>
                        }
                        <RLFormItem
                            name='image'
                            label='活动封面'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: '请上传活动封面'
                                }
                            ]}
                        >
                            <CmpUpload
                                aspect={4 / 3}
                                saveUrl={fileurl => {
                                    this.form.setFieldsValue({
                                        image: fileurl
                                    })
                                    this.setState({
                                        eventInfo: {
                                            ...this.state.eventInfo,
                                            image: fileurl
                                        }
                                    })
                                }}
                                src={this.state.eventInfo.image}
                                imgStyle={{ width: 120, height: 90, borderRadius: 4, cursor: 'pointer' }}
                                default={require('../../../../assets/images/upload.png').default}
                            />
                            <div style={{ marginTop: 10 }}>只能上传jpg/png，大小不超过2M，图片比例4：3</div>
                        </RLFormItem>
                        {
                            this.state.language === 'zh' ?
                                <RLFormItem
                                    label='活动描述'
                                    name='content'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入活动描述'
                                        },
                                        {
                                            max: 1000,
                                            message: '活动描述最多1000个字符'
                                        }
                                    ]}
                                >
                                    <div style={{ position: 'relative', width: 520 }}>
                                        <RLTextarea
                                            placeholder='请输入活动描述'
                                            rows={5}
                                            style={{ width: 520 }}
                                            value={this.state.eventInfo.content}
                                            onChange={e => {
                                                this.setState({
                                                    eventInfo: {
                                                        ...this.state.eventInfo,
                                                        content: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={`comment-count ${this.state.eventInfo.content.length >= 1000 ? 'overflow' : ''}`}
                                            style={{ position: 'absolute', bottom: 5, right: 5 }}
                                        >{this.state.eventInfo.content.length}/1000</div>
                                    </div>
                                </RLFormItem> :
                                <RLFormItem
                                    name='e_content'
                                    label='活动描述'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入活动描述'
                                        }, {
                                            max: 1000,
                                            message: '活动描述最多100个字符'
                                        }
                                    ]}
                                >
                                    <div style={{ position: 'relative', width: 520 }}>
                                        <RLTextarea
                                            placeholder='请输入活动描述'
                                            rows={5}
                                            style={{ width: 520 }}
                                            value={this.state.eventInfo.e_content}
                                            onChange={e => {
                                                this.setState({
                                                    eventInfo: {
                                                        ...this.state.eventInfo,
                                                        e_content: e.target.value
                                                    }
                                                })
                                            }}
                                        />
                                        <div className={`comment-count ${this.state.eventInfo.e_content.length >= 1000 ? 'overflow' : ''}`}
                                            style={{ position: 'absolute', bottom: 5, right: 5 }}
                                        >{this.state.eventInfo.e_content.length}/1000</div>
                                    </div>
                                </RLFormItem>
                        }
                        <RLFormItem
                            name='start_time_at'
                            label='开始时间'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择开始时间'
                                },
                                {
                                    validator: (rule, val) => {
                                        let { start_time_at, end_time_at } = this.form.getFieldsValue(['start_time_at', 'end_time_at'])
                                        if (start_time_at && end_time_at) {
                                            let startTime = moment(val.format('YYYY-MM-DD HH:mm'))
                                            let endTime = moment(end_time_at.format('YYYY-MM-DD HH:mm'))
                                            if (startTime >= endTime) {
                                                return Promise.reject('开始时间不能大于结束时间')
                                            } else {
                                                return Promise.resolve()
                                            }
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            ]}
                        >
                            <DatePicker
                                allowClear
                                locale={locale}
                                showTime
                                format={'YYYY-MM-DD HH:mm'}
                                placeholder='请选择日期时间'
                            />
                        </RLFormItem>
                        <RLFormItem
                            name='end_time_at'
                            label='结束时间'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择结束时间'
                                },
                                {
                                    validator: (rule, val) => {
                                        let { start_time_at, end_time_at } = this.form.getFieldsValue(['start_time_at', 'end_time_at'])
                                        if (start_time_at && end_time_at) {
                                            let startTime = moment(start_time_at.format('YYYY-MM-DD HH:mm'))
                                            let endTime = moment(val.format('YYYY-MM-DD HH:mm'))
                                            if (startTime >= endTime) {
                                                return Promise.reject('结束时间不能小于开始时间')
                                            } else {
                                                return Promise.resolve()
                                            }
                                        }
                                        return Promise.resolve()
                                    }
                                }
                            ]}
                        >
                            <DatePicker
                                allowClear
                                locale={locale}
                                showTime
                                disabledDate={this.disabledEndDate}
                                // disabledTime={this.disabledEndDateTime}
                                format={'YYYY-MM-DD HH:mm'}
                                placeholder='请选择日期时间'
                            />
                        </RLFormItem>
                        <RLFormItem
                            name='user_limit'
                            label='报名人数上限'
                            colon={false}
                        >
                            <InputNumber
                                placeholder='请输入报名人数上限'
                                max={10000}
                                min={1}
                                precision={0}
                                style={{ width: 175 }}
                                value={this.state.eventInfo.user_limit}
                                onChange={value => {
                                    this.setState({
                                        eventInfo: {
                                            ...this.state.eventInfo,
                                            user_limit: value
                                        }
                                    })
                                }}
                                onPressEnter={e => {
                                    e.preventDefault()
                                }}
                            />
                            {/* <RLInput
                                placeholder='请输入报名人数上限'
                                type='number'
                                max={10000}
                                min={1}
                                style={{ width: 175 }}
                                value={this.state.eventInfo.user_limit}
                                onChange={e => {
                                    this.setState({
                                        eventInfo: {
                                            ...this.state.eventInfo,
                                            user_limit: e.target.value
                                        }
                                    })
                                }}
                            /> */}
                        </RLFormItem>
                        <RLFormItem
                            name='show_field'
                            label={this.createLabel('活动字段收集', true)}
                            colon={false}
                            rules={[
                                {
                                    validator: () => {
                                        if (this.state.formShowField.length === 0) {
                                            return Promise.reject('请选择活动字段')
                                        } else {
                                            return Promise.resolve()
                                        }
                                    }
                                }
                            ]}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <RLCheckboxGroup
                                    items={this.state.showFields}
                                    labelkey='name'
                                    valuekey='id'
                                    value={this.state.formShowField}
                                    onChange={value => {
                                        let shortSet = new Set(this.state.formShowField)
                                        let longSet = new Set(value)
                                        let unionSet = new Set([...shortSet, ...longSet])   // 先把它们取并集
                                        let differenceSet = new Set([...unionSet].filter(x => !longSet.has(x)))   // 差集
                                        console.log('差集------------------：', differenceSet)
                                        let differenceArr = Array.from(differenceSet)   // 转数组
                                        if (differenceArr && differenceArr[0] && this.state.defaultFields.includes(differenceArr[0])) {
                                            this.showToast('该字段已设置为必填，不可取消')
                                            return
                                        }
                                        this.setState({
                                            formShowField: value,
                                            eventInfo: {
                                                ...this.state.eventInfo,
                                                show_field: value.join(',')
                                            }
                                        })
                                    }}
                                />
                                <div
                                    style={{ marginLeft: 10, color: '#8f1d22', cursor: 'pointer' }}
                                    onClick={() => {
                                        // 弹框
                                        this.setState({
                                            fieldSettingModal: true
                                        })
                                    }}
                                >
                                    必填项设置
                                </div>
                            </div>
                        </RLFormItem>
                        <RLFormItem
                            name='action_type'
                            label='发布范围'
                            colon={false}
                        >
                            <RLRadioGroup
                                items={[
                                    { value: 1, label: '公开' },
                                    { value: 2, label: '非公开' }
                                ]}
                                value={this.state.eventInfo.action_type}
                                onChange={e => {
                                    this.setState({
                                        eventInfo: {
                                            ...this.state.eventInfo,
                                            action_type: e.target.value
                                        }
                                    }, () => {
                                        this.form.validateFields(['user_list'])
                                    })
                                }}
                            />
                        </RLFormItem>
                        <RLFormItem
                            label={this.createLabel('可见名单', this.state.eventInfo.action_type === 1 ? false : true)}
                            colon={false}
                            name='user_list'
                            rules={[
                                {
                                    validator: () => {
                                        if (this.state.eventInfo.action_type === 2) {
                                            if (this.state.userGroup.length === 0) {
                                                return Promise.reject('如果发布范围选择的是非公开，可见名单是必填项')
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
                            <div className='form-item-gropu'>
                                <div style={{
                                    width: 520,
                                    minHeight: 60,
                                    border: '1px solid rgb(220, 223, 230)',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    padding: '10px 10px 10px 10px',
                                    boxSizing: 'border-box'
                                }}>
                                    {this.state.userGroup.map(ele => {
                                        return <div style={{ height: 19, marginTop: 4 }} key={ele.id}>
                                            <RLTag
                                                label={ele.nickname}
                                                closable
                                                onClose={() => {
                                                    let all = [...this.state.userGroup]
                                                    let index = all.findIndex(clc => { return clc.id === ele.id })
                                                    all.splice(index, 1)
                                                    this.setState({
                                                        userGroup: all
                                                    })
                                                }}
                                            />
                                        </div>
                                    })}
                                </div>
                                <RLButton
                                    label='添加用户'
                                    type='primary'
                                    disabled={this.state.eventInfo.action_type === 1}
                                    onClick={() => {
                                        this.setState({
                                            showAddUserModal: true
                                        })
                                    }}
                                    style={{ marginLeft: 20 }}
                                />
                            </div>
                        </RLFormItem>
                        <RLFormItem>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <RLButton
                                    type="default"
                                    label='取消'
                                    width={80}
                                    style={{ display: 'inline-block' }}
                                    onClick={() => {
                                        this.props.changePage('list')
                                    }}
                                />
                                <RLButton
                                    type="primary"
                                    htmlType="submit"
                                    label={this.eventId ? '保存' : '创建'}
                                    style={{ marginLeft: 40, display: 'inline-block' }}
                                    loading={this.state.addLoading}
                                    width={80}
                                />

                            </div>

                        </RLFormItem>
                    </RLForm>
                </div>
                {
                    this.state.showAddUserModal && <AddUser
                        visible={this.state.showAddUserModal}
                        showSelectGroup={showSelectGroup}
                        selectType={selectType}
                        originArr={this.state.userGroup}
                        originCanCancel={originCanCancel}
                        returnStyle={returnStyle}
                        mustIdent={mustIdent}
                        onCancel={() => {
                            this.setState({
                                showAddUserModal: false
                            })
                        }}
                        onAdd={data => {
                            this.addSuccess(data)
                        }}
                    />
                }
                {
                    this.state.fieldSettingModal && this.renderDefaultField()
                }
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpEventEdit)
