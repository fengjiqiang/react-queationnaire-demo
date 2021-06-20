import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLSelect, RLButton, RLForm, RLFormItem, RLRadioGroup, RLTag
} from '@components/index.js'
import { Tabs, DatePicker } from 'antd'
import { createRef } from 'react'
import BraftEditor from 'braft-editor'
import actionInfoManage from '@actions/infoManage/actionInfoManage.js'
import actionInfoClassify from '@actions/infoManage/actionInfoClassify.js'
import CmpUpload from '@/pages/common/CmpUpload.js'
import { dealTime, dealDateTime } from '@/libs/utils.js'
import moment from 'moment'
import AddUser from '@/pages/common/meeting/AddUser.js'

import Uploader from '@/libs/Uploader.js';
import config from '@/config.js';
import { getFileType } from '@/libs/utils.js'
import commonActions from '@actions/commonActions'
import locale from 'antd/es/date-picker/locale/zh_CN'

import './CmpInfoEdit.less'

const { TabPane } = Tabs


class CmpInfoEdit extends BaseCmp {
    constructor(props) {
        super(props)
        if (props.infoId) {
            this.infoId = props.infoId
        }
        this.state = {
            showLargeModal: false,   // html片段容器
            addLoading: false,  // 添加按钮loading
            infoListInfo: {
                title: '',
                e_title: '',
                start_time: '',
                content: BraftEditor.createEditorState(null),
                e_content: BraftEditor.createEditorState(null),
                source: '',
                e_source: '',
                class_id: null,
                type: 1,
                status: 1,
                invite_uids: '',
                home_image: '',
                wx_image: ''
            },   // 资讯
            userList: [],   // 成员列表
            language: 'zh',   // 默认中文
            infoOptions: [],   // 资讯分类 下拉选择
            e_infoOptions: [],   // 资讯分类（英文） 下拉选择

            showAddUserModal: false,   // 添加人员弹框
            addUserConfig: {
                showSelectGroup: true,
                selectType: 'checkbox',
                originCanCancel: true,
                returnStyle: 'object',
                mustIdent: true
            }
        }
        this.form = createRef()
        // 获取资讯分类
        this.getInfoClassify()
    }
    componentDidMount() {
        if (this.infoId) {   // 编辑
            this.getInfoDetail(this.infoId)
        } else {
            this.setState({
                infoListInfo: {
                    ...this.state.infoListInfo
                }
            })
        }
    }

    // 资讯详情
    getInfoDetail = (id) => {
        actionInfoManage.getInfoDetail({id}).then(res => {
            if (res && res.code === 200) {
                const data = res.data
                let userList = data.invite_uids
                this.setState({
                    userList,
                    infoListInfo: {
                        ...data,
                        start_time: moment(dealTime(data.start_time, 'YYYY-MM-DD HH:mm')),
                        content: BraftEditor.createEditorState(data.content),
                        e_content: BraftEditor.createEditorState(data.e_content)
                    }
                }, () => {
                    // 给表单重置值
                    this.form && this.form.setFieldsValue(this.state.infoListInfo)
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 资讯分类
    getInfoClassify = () => {
        actionInfoClassify.getAllInfoClassify().then(res => {
            if (res && res.code === 200) {
                let e_data = []
                res.data.map(item => {
                    if (!item.e_name) {
                        return e_data.push({
                            id: item.id,
                            name: item.name
                        })
                    } else {
                        return e_data.push({
                            id: item.id,
                            name: item.e_name
                        })
                    }
                })
                this.setState({
                    infoOptions: res.data,
                    e_infoOptions: e_data
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    editFailed = (res) => {
        this.showToast({ content: '您有必填项未填写', type: 'success' })
    }

    editConfirm = (values) => {
        console.log('onFinish', values)
        this.setState({
            addLoading: true
        })
        let { start_time, class_id, type, status } = values
        const { title, e_title, content, e_content, source, e_source, home_image, wx_image } = this.state.infoListInfo
        let zh_content = content.toHTML() && content.toHTML() === '<p></p>'   // 中文正文为空
        let en_content = e_content.toHTML() && e_content.toHTML() === '<p></p>'   // 英文正文为空
        if (this.state.language === 'zh') {
            if ((!e_title && en_content) || (e_title && !en_content)) {

            } else {
                this.showToast('英文必填项请填写完整')
                this.setState({
                    addLoading: false
                })
                return
            }
        } else if (this.state.language === 'en') {
            if ((!title && zh_content) || (title && !zh_content)) {

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
            start_time: dealDateTime(start_time.format('YYYY-MM-DD HH:mm')),
            content: content.toHTML(),
            e_content: e_content.toHTML(),
            source,
            e_source,
            class_id,
            type,
            status,
            home_image,
            wx_image
        }
        let userStr = []
        this.state.userList.forEach(ele => {
            userStr.push(ele.id)
        })
        params.invite_uids = userStr.join(',')
        console.log('添加编辑资讯参数--params:', params)
        if (this.infoId) {   // 编辑
            actionInfoManage.infoEdit({ ...params, id: this.infoId }).then(res => {
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
            actionInfoManage.infoAdd(params).then(res => {
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
        let title = '创建资讯'
        if (this.infoId) {
            title = '编辑资讯'
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

    range = (start, end) => {
        const result = []
        for (let i = start; i < end; i++) {
            result.push(i)
        }
        return result
    }

    disabledDate = (current) => {
        return current && current < moment().startOf('day')
    }

    disabledDateTime = (dates) => {
        let hours = moment().hours()
        let minutes = moment().minutes()
        // 当日只能选择当前时间之后的时间点
        if (dates && moment(dates[1]).date() === moment().date()) {
            return {
                disabledHours: () => this.range(0, 24).splice(0, hours),
                disabledMinutes: () =>this.range(0, 60).splice(0, minutes)
            }
        }
        return {
            disabledHours: () => [],
            disabledMinutes: () => []
        }
    }

    // 成员添加
    addSuccess = (data) => {
        let originUsers = this.state.userList;
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
            userList: finalUsers
        }, () => {
            this.form.validateFields(['invite_uids'])
        })
    }

    // 音视频上传
    audioVideoUpload = (upload) => {
        let uploader = new Uploader({
            file: upload.file,
            method: 'POST',
            baseURL: config.uploadBaseUrl,
            url: '/api/playback/upload',
            chunkSize: 2 * 1024 * 1024,   // 切片大小 2M
            onStart: () => {
            },
            onSuccess: (res) => {
                console.log('--------上传成功-------', res)
                upload.success({
                    url: res.url,
                    meta: {
                        id: res.id,
                        title: upload.file.name,
                        alt: '',
                        loop: false, // 指定音视频是否循环播放
                        autoPlay: false, // 指定音视频是否自动播放
                        controls: true, // 指定音视频是否显示控制栏
                        poster: '', // 指定视频播放器的封面
                    }
                })
            },
            onError: () => {
                console.log('--------上传失败-------')
                upload.error({ msg: '上传失败' })
            },
            onProgress: (progress) => {
                console.log('-------上传进度---------', progress)
                // 进度条
                upload.progress(progress)
            },
            onCancel: () => {
                console.log('-------上传取消---------')
            }
        })
        let dtype = 0
        if (upload.file.type.includes('audio')) {
            dtype = 1
        }
        uploader.upload({
            dtype,
            dtranscode: false
        })
    }

    // 图片上传
    imageUpload = (upload) => {
        let formData = new FormData()
        formData.append('resource', upload.file)
        formData.append('type', 'picture')
        commonActions.fileUpload(formData).then(res => {
            console.log('上传图片返回--res:', res)
            if (res.code === 200) {
                upload.success({
                    url: res.data.fileurl,
                    meta: {
                        id: res.data.fileurl,
                        title: upload.file.name,
                        alt: ''
                    }
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
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
                        wrapperCol={{ style: { span: 24, marginRight: 30 }}}
                        onFinish={this.editConfirm}
                        onFinishFailed={this.editFailed}
                        initialValues={this.state.infoListInfo}
                        validateTrigger='onBlur'
                    >
                        {
                            this.state.language === 'zh' ?
                                <RLFormItem
                                    name='title'
                                    label='资讯主题'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入资讯主题'
                                        }, {
                                            max: 50,
                                            message: '资讯主题最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLInput 
                                        placeholder='请输入资讯主题'
                                        style={{ width: 360 }}
                                        value={this.state.infoListInfo.title}
                                        onChange={e => {
                                            this.setState({
                                                infoListInfo: {
                                                    ...this.state.infoListInfo,
                                                    title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem> :
                                <RLFormItem
                                    name='e_title'
                                    label='资讯主题'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入资讯主题'
                                        }, {
                                            max: 50,
                                            message: '资讯主题最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLInput
                                        placeholder='请输入资讯主题'
                                        style={{ width: 360 }}
                                        value={this.state.infoListInfo.e_title}
                                        onChange={e => {
                                            this.setState({
                                                infoListInfo: {
                                                    ...this.state.infoListInfo,
                                                    e_title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>
                        }
                        <RLFormItem
                            name='start_time'
                            label='发布时间'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择发布时间'
                                }
                            ]}
                        >
                            <DatePicker
                                allowClear
                                locale={locale}
                                showTime
                                disabledDate={this.disabledDate}
                                // disabledTime={this.disabledDateTime}
                                format={'YYYY-MM-DD HH:mm'}
                                placeholder='请选择日期时间'
                            />
                        </RLFormItem>
                        {
                            this.state.language === 'zh' ?
                                <RLFormItem
                                    name='content'
                                    label='正文内容'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            validator: (rule, value) => {
                                                if (value.isEmpty()) {
                                                    return Promise.reject('请输入正文内容')
                                                } else {
                                                    return Promise.resolve()
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    <BraftEditor
                                        // language={this.state.language}
                                        value={this.state.infoListInfo.content}
                                        onChange={editorState => {
                                            this.setState({
                                                infoListInfo: {
                                                    ...this.state.infoListInfo,
                                                    content: editorState
                                                }
                                            })
                                        }}
                                        // onSave={this.submitContent}
                                        // placeholder="请输入正文内容"
                                        media={{
                                            accepts: {
                                                image: 'image/jpeg,image/png',
                                                video: 'video/mp4',
                                                audio: 'audio/mpeg,audio/mp3',
                                            },
                                            uploadFn: (upload) => {
                                                console.log('media-upload--file:', upload)
                                                const fileType = upload.file && upload.file.type   // 文件类型
                                                if (!fileType) {
                                                    return
                                                }
                                                // 音视频上传
                                                if (fileType.includes('video') || fileType.includes('audio')) {
                                                    this.audioVideoUpload(upload)
                                                }
                                                // 图片上传
                                                else if (fileType.includes('image')) {
                                                    this.imageUpload(upload)
                                                }
                                            },
                                            // validateFn: (file) => {
                                            //     console.log('media-upload--file:', file)
                                            //     const fileName = file && file.name
                                            //     console.log(`fileName----------------`, fileName)
                                            //     if (!fileName) {
                                            //         return false
                                            //     }
                                            //     let fileType = getFileType(fileName)
                                            //     let dtype   // 0 视频 /1 音频 /2 图片 /3 文档 /4 压缩包 /5 其他
                                            //     switch (fileType) {
                                            //         case 'video':
                                            //             dtype = 0
                                            //             break
                                            //         case 'radio':
                                            //             dtype = 1
                                            //             break
                                            //         case 'image':
                                            //             dtype = 2
                                            //             break
                                            //         case 'pdf': case 'txt': case 'word': case 'excel': case 'ppt':
                                            //             dtype = 3
                                            //             break
                                            //         case 'zip':
                                            //             dtype = 4
                                            //             break
                                            //         case 'other':
                                            //             dtype = 5
                                            //             break
                                            //         default:
                                            //             dtype = 0
                                            //             break
                                            //     }
                                            //     if (dtype === 0 && !fileName.endsWith('.mp4')) {
                                            //         return false
                                            //     } else if (dtype === 1 && !fileName.endsWith('.mp3')) {
                                            //         return false
                                            //     } else if ([3, 4, 5].includes(dtype)) {
                                            //         return false
                                            //     } else {
                                            //         return true
                                            //     }
                                            // }

                                            // onChange(...rest) {
                                            //     console.log('onChange---rest', rest)
                                            // }
                                        }}
                                        style={{ border: '1px solid #d1d1d1', borderRadius: 3, background: '#fff' }}
                                    />
                                </RLFormItem> :
                                <RLFormItem
                                    name='e_content'
                                    label='正文内容'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            validator: (rule, value) => {
                                                if (value.isEmpty()) {
                                                    return Promise.reject('请输入正文内容')
                                                } else {
                                                    return Promise.resolve()
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    <BraftEditor
                                        // language={this.state.language}
                                        value={this.state.infoListInfo.e_content}
                                        onChange={editorState => {
                                            this.setState({
                                                infoListInfo: {
                                                    ...this.state.infoListInfo,
                                                    e_content: editorState
                                                }
                                            })
                                        }}
                                        // onSave={this.submitContent}
                                        // placeholder="请输入正文内容"
                                        media={{
                                            accepts: {
                                                image: 'image/jpeg,image/png',
                                                video: 'video/mp4',
                                                audio: 'audio/mpeg',
                                            },
                                            uploadFn: (upload) => {
                                                console.log('media-upload--file:', upload)
                                                const fileType = upload.file.type   // 文件类型
                                                // 音视频上传
                                                if (fileType === 'video/mp4' || fileType === 'audio/mpeg') {
                                                    this.audioVideoUpload(upload)
                                                }
                                                // 图片上传
                                                else if (fileType === 'image/jpeg' || fileType === 'image/png') {
                                                    this.imageUpload(upload)
                                                }
                                            },
                                            onChange(...rest) {
                                                console.log('onChange---rest', rest)
                                            }
                                        }}
                                        style={{ border: '1px solid #d1d1d1', borderRadius: 3, background: '#fff' }}
                                    />
                                </RLFormItem>
                        }
                        
                        <RLFormItem
                            name='class_id'
                            label='资讯分类'
                            colon={false}
                            rules={[{
                                required: true,
                                message: "请选择资讯分类"
                            }]}
                        >
                            <RLSelect
                                options={this.state.language === 'zh' ? this.state.infoOptions : this.state.e_infoOptions}
                                style={{ width: 200, marginRight: 12 }}
                                key='class_id'
                                placeholder='请选择'
                                valuekey='id'
                                labelkey='name'
                                value={this.state.infoListInfo.class_id}
                            />
                        </RLFormItem>
                        <RLFormItem
                            name='type'
                            label='发布范围'
                            colon={false}
                            rules={[{
                                required: true,
                                message: "请选择发布范围"
                            }]}
                        >
                            <RLRadioGroup
                                items={[
                                    { value: 1, label: '公开' },
                                    { value: 0, label: '非公开' }
                                ]}
                                value={this.state.infoListInfo.type}
                                onChange={e => {
                                    this.setState({
                                        infoListInfo: {
                                            ...this.state.infoListInfo,
                                            type: e.target.value
                                        }
                                    }, () => {
                                        this.form.validateFields(['invite_uids'])
                                    })
                                }}
                            />
                        </RLFormItem>
                        <RLFormItem
                            label={this.createLabel('可见名单', this.state.infoListInfo.type === 1 ? false : true)}
                            colon={false}
                            name='invite_uids'
                            rules={[
                                {
                                    validator: () => {
                                        if (this.state.infoListInfo.type === 0) {
                                            if (this.state.userList.length === 0) {
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
                                    {this.state.userList.map(ele => {
                                        return <div style={{ height: 19, marginTop: 4 }} key={ele.id}>
                                            <RLTag
                                                label={ele.nickname}
                                                closable
                                                onClose={() => {
                                                    let all = [...this.state.userList]
                                                    let index = all.findIndex(clc => { return clc.id === ele.id })
                                                    all.splice(index, 1)
                                                    this.setState({
                                                        userList: all
                                                    })
                                                }}
                                            />
                                        </div>
                                    })}
                                </div>
                                <RLButton
                                    label='添加用户'
                                    type='primary'
                                    disabled={this.state.infoListInfo.type === 1}
                                    onClick={() => {
                                        this.setState({
                                            showAddUserModal: true
                                        })
                                    }}
                                    style={{ marginLeft: 20 }}
                                />
                            </div>
                        </RLFormItem>
                        {
                            this.state.language === 'zh' ?
                            <RLFormItem
                                name='source'
                                label='发布机构落款'
                                colon={false}
                            >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <RLInput
                                        placeholder='请输入内容'
                                        style={{ width: 200 }}
                                        value={this.state.infoListInfo.source}
                                        onChange={e => {
                                            this.setState({
                                                infoListInfo: {
                                                    ...this.state.infoListInfo,
                                                    source: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                        <div style={{ marginLeft: 5 }}>若不填写，默认为z止于至善</div>
                                </div>
                            </RLFormItem> :
                            <RLFormItem
                                name='e_source'
                                label='发布机构落款'
                                colon={false}
                            >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <RLInput
                                        placeholder='请输入内容'
                                        style={{ width: 200 }}
                                        value={this.state.infoListInfo.e_source}
                                        onChange={e => {
                                            this.setState({
                                                infoListInfo: {
                                                    ...this.state.infoListInfo,
                                                    e_source: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                    <div style={{ marginLeft: 5 }}>若不填写，默认为chinabond</div>
                                </div>
                            </RLFormItem>
                        }
                        <RLFormItem
                            name='home_image'
                            label='资讯封面图'
                            colon={false}
                        >
                            <CmpUpload
                                aspect={4 / 3}
                                saveUrl={fileurl => {
                                    this.setState({
                                        infoListInfo: {
                                            ...this.state.infoListInfo,
                                            home_image: fileurl,
                                            wx_image: this.state.infoListInfo.wx_image || fileurl
                                        }
                                    })
                                }}
                                src={this.state.infoListInfo.home_image}
                                imgStyle={{ width: 120, height: 90, borderRadius: 4, cursor: 'pointer' }}
                                default={require('../../../../assets/images/upload.png').default}
                            />
                            <div style={{ marginTop: 10 }}>只能上传jpg/png，大小不超过2M，图片比例4：3</div>
                        </RLFormItem>
                        <RLFormItem
                            name='wx_image'
                            label='微信分享图'
                            colon={false}
                        >
                            <CmpUpload
                                saveUrl={fileurl => {
                                    this.setState({
                                        infoListInfo: {
                                            ...this.state.infoListInfo,
                                            wx_image: fileurl
                                        }
                                    })
                                }}
                                src={this.state.infoListInfo.wx_image}
                                imgStyle={{ width: 90, height: 90, borderRadius: 4, cursor: 'pointer' }}
                                default={require('../../../../assets/images/default.png').default}
                            />
                            <div style={{ marginTop: 10 }}>只能上传jpg/png，大小不超过2M</div>
                        </RLFormItem>
                        <RLFormItem
                            name='status'
                            label='资讯状态'
                            colon={false}
                        >
                            <RLRadioGroup
                                items={[
                                    { value: 1, label: '上架' },
                                    { value: 0, label: '下架' }
                                ]}
                            />
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
                                    label={this.infoId ? '保存' : '创建'}
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
                        originArr={this.state.userList}
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
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpInfoEdit)
