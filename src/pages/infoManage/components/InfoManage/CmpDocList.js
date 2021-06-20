import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { createRef } from 'react'
import { Upload } from 'antd'
import utils from '@/libs/utils.js'
import {
    RLInput, RLButton, RLTable, RLModal, RLForm, RLFormItem, RLFilterTool, RLSwitch, RLTooltip
} from '@components/index.js'
import { dealTableTime, getFileType } from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import actionInfoManage from '@actions/infoManage/actionInfoManage.js'
import commonActions from '@actions/commonActions'
import images from '@/libs/images/index.js'

const commonImg = images.commonImg


class CmpDocList extends BaseCmp {
    constructor(props) {
        super(props)
        this.infoId = props.infoId
        this.state = {
            infoDocListInfo: {
                list: []
            },
            showModal: {
                EDIT_TITLE: false,   // 修改名称
                IMPORT_DOC: false,   // 添加资料
                UPLOAD_SUCCESS: false,   // 上传成功
                UPLOAD_FAIL: false   // 上传失败
            },
            record: {
                id: '',   // 修改名称-文档id
                title: '',   // 修改名称-文档title 不包括后缀名
                type: ''   // 文档后缀
            },
            getListLoading: true,   // 获取列表loading
            uploadFile: null
        }
        this.form = createRef()
        this.columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '8%',
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '资料名称',
                dataIndex: 'title',
                key: 'title',
                width: '30%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.title}>
                    <div className='line-clamp-noColor'>
                        {record.title}
                    </div>
                </RLTooltip>
            },
            {
                title: '是否可下载',
                dataIndex: 'doc_type',
                key: 'doc_type',
                width: '10%',
                render: (text, record) => {
                    return <RLSwitch
                        defaultChecked={record.doc_type === 1}
                        onChange={e => {
                            // 调用更新接口
                            this.updateValue(record, e)
                        }}
                    />
                }
            },
            {
                title: '下载次数',
                dataIndex: 'down_num',
                key: 'down_num',
                width: '10%'
            },
            {
                title: '上传时间',
                dataIndex: 'create_at',
                key: 'create_at',
                width: '14%',
                render: (text, record) => {
                    return <div>
                        {dealTableTime(record.create_at)}
                    </div>
                }
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '16%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            <RLButton
                                type='link'
                                label='删除'
                                onClick={e => {
                                    this.showModal({
                                        content: '确认删除后，该资料将被彻底删除，是否确认删除？',
                                        title: '是否删除该资料？',
                                        okText: '确定',
                                        cancelText: '取消',
                                        onOk: () => {
                                            this.docDelConfirm(record)
                                        },
                                        onCancel: () => { },
                                        size: 'big'
                                    })
                                }}
                            />
                        }
                        {
                            <RLButton
                                type='link'
                                label='修改名称'
                                onClick={e => {
                                    this.setState({
                                        showModal: {
                                            ...this.state.showModal,
                                            EDIT_TITLE: true
                                        },
                                        record: {
                                            id: record.id,
                                            title: this.getFileName(record.title),
                                            type: this.getFileType(record.title)
                                        }
                                    })
                                }}
                            />
                        }
                        {
                            <RLButton label="复制链接"
                                type="link"
                                onClick={() => {
                                    //复制链接到剪贴板
                                    utils.copy(record.doc_url, () => {
                                        this.showToast({ type: 'success', content: '链接已复制到剪贴板' })
                                    })
                                }}
                            />
                        }
                    </div>
                )
            }
        ]
    }
    componentDidMount() {
        this.getInfoDocList()
        eventBus.addListener('info_res_update', () => {
            this.getInfoDocList()
        })
    }
    componentWillUnmount() {
        eventBus.removeListener('info_res_update')
    }

    getInfoDocList({ sign } = { sign: true }) {
        if (sign) {
            this.setState({
                getListLoading: true
            })
        }
        actionInfoManage.infoDocList({
            id: this.infoId
        }).then(res => {
            if (res.code === 200) {
                this.setState({
                    infoDocListInfo: {
                        list: res.data
                    }
                })
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }

    // 更新是否可下载
    updateValue = (record, value) => {
        const params = {
            id: record.id,
            doc_type: value ? 1 : 2
        }
        return actionInfoManage.infoDocUpdateStatus(params).then(res => {
            if (res.code === 200) {
                this.getInfoDocList({ sign: false })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 获取文件名后缀
    getFileType = (fileName) => {
        let index = fileName.lastIndexOf(".")
        if (index !== -1)
            return fileName.substr(index).toLowerCase()
        else
            return ""
    }

    // 获取文件名（不包括后缀）
    getFileName = (fileName) => {
        let index = fileName.lastIndexOf(".")
        if (index !== -1)
            return fileName.substring(0, index)
        else
            return fileName
    }

    // 修改名称
    editTitleConfirm = (values) => {
        if (!values.title.trim()) {
            return
        }
        const { id, type } = this.state.record
        const params = {
            id,
            title: values.title.trim() + type
        }
        return actionInfoManage.infoDocEdit(params).then(res => {
            if (res.code === 200) {
                this.setState({
                    showModal: {
                        ...this.state.showModal,
                        EDIT_TITLE: false
                    }
                }, () => {
                    this.getInfoDocList({ sign: false })
                })
                this.showToast({ type: 'success', content: '修改成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 删除
    docDelConfirm = (record) => {
        const params = {
            id: record.id
        }
        return actionInfoManage.infoDocDelete(params).then(res => {
            if (res.code === 200) {
                this.getInfoDocList({ sign: false })
                this.showToast({ type: 'success', content: '删除成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    getRightItems = () => {
        return ([
            <RLButton
                label='添加资料'
                type='primary'
                key='add'
                onClick={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            IMPORT_DOC: true
                        }
                    })
                }}
                style={{ marginLeft: 20 }}
            />
        ])
    }

    // 修改名称弹框渲染
    renderEditTitle = () => {
        return (
            <RLModal
                title='修改名称'
                maskClosable={false}
                visible={this.state.showModal.EDIT_TITLE}
                footer={null}
                onCancel={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            EDIT_TITLE: false
                        }
                    })
                }}
            >
                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <RLForm
                        validateTrigger='onBlur'
                        onFinish={this.editTitleConfirm}
                        initialValues={this.state.record}
                        ref={this.form}
                    >
                        <RLFormItem
                            colon={false}
                            label="资料名称"
                            name='title'
                        >
                            <RLInput
                                placeholder='请输入资料名称'
                                defaultValue={this.state.record.title}
                            >
                            </RLInput>
                        </RLFormItem>
                    </RLForm>
                </div>
                <div className='modal-btnContainer'>
                    <RLButton label='取消'
                        onClick={() => {
                            this.setState({
                                showModal: {
                                    ...this.state.showModal,
                                    EDIT_TITLE: false
                                }
                            })
                        }}
                    />
                    <RLButton
                        label='确定'
                        type='primary'
                        htmlType="submit"
                        style={{ marginLeft: 50 }}
                        onClick={() => {
                            this.form.current.submit()
                        }}
                    />
                </div>
            </RLModal>
        )
    }

    // 图片上传
    imageUpload = (file) => {
        let formData = new FormData()
        formData.append('resource', file)
        formData.append('type', 'picture')
        commonActions.fileUpload(formData).then(res => {
            console.log('上传图片返回--res:', res)
            if (res.code === 200) {
                // 上传成功
                this.setState({
                    showModal: {
                        ...this.state.showModal,
                        UPLOAD_SUCCESS: true
                    }
                })
                let data = {
                    information_id: this.infoId,
                    title: file.name,
                    doc_url: res.data.fileurl
                }
                actionInfoManage.infoDocAdd(data).then(res => {
                    console.log('资讯资料-------------', res)
                    if (res.code === 200) {
                        this.getInfoDocList({ sign: false })
                    } else {
                        this.showToast({ type: 'error', content: res.msg })
                    }
                })
            } else {
                this.setState({
                    showModal: {
                        ...this.state.showModal,
                        UPLOAD_FAIL: true
                    }
                })
            }
        })
    }

    // 添加资料弹框渲染
    renderImportDoc = () => {
        return (
            <RLModal
                title="添加资料"
                closable={true}
                visible={this.state.showModal.IMPORT_DOC}
                footer={null}
                onCancel={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            IMPORT_DOC: false
                        }
                    })
                }}
            >
                <div>
                    <RLForm 
                        validateTrigger='onBlur'
                    >
                        <RLFormItem
                            label="上传资料(支持doc、xls、ppt、pdf、rar、zip、jpg、png、bmp、tiff格式)"
                            name="file"
                            colon={false}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <RLInput style={{ width: 300 }} value={this.state.uploadFile && this.state.uploadFile.name} />
                                <Upload
                                    accept='.doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar, .jpg, .jpeg, .png, .bmp, .tif, .tiff'
                                    multiple={false}
                                    showUploadList={false}
                                    beforeUpload={file => {
                                        this.setState({
                                            uploadFile: file,
                                            uploadingFile: file
                                        })
                                        return false
                                    }}>
                                    <RLButton label="选择资料"
                                        style={{ marginLeft: 20 }}
                                    />
                                </Upload>
                            </div>
                        </RLFormItem>
                        <RLFormItem>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                <RLButton label="取消"
                                    onClick={() => {
                                        this.setState({
                                            showModal: {
                                                ...this.state.showModal,
                                                IMPORT_DOC: false
                                            }
                                        })
                                    }}
                                    style={{ marginRight: 40 }}
                                />
                                <RLButton label="开始上传"
                                    type="primary"
                                    htmlType="submit"
                                    onClick={e => {
                                        e.stopPropagation()
                                        const file = this.state.uploadFile
                                        if (!file) {
                                            this.showToast('请先选择资料')
                                            return
                                        }
                                        if (file.size > 500 * 1024 * 1024) {
                                            this.showToast('资料大小不应大于500M')
                                            return
                                        }
                                        let fileType = getFileType(file.name)
                                        let dtype   // 0 视频 /1 音频 /2 图片 /3 文档 /4 压缩包 /5 其他
                                        switch (fileType) {
                                            case 'video':
                                                dtype = 0
                                                break
                                            case 'radio':
                                                dtype = 1
                                                break
                                            case 'image':
                                                dtype = 2
                                                break
                                            case 'pdf': case 'txt': case 'word': case 'excel': case 'ppt':
                                                dtype = 3
                                                break
                                            case 'zip':
                                                dtype = 4
                                                break
                                            case 'other':
                                                dtype = 5
                                                break
                                            default:
                                                dtype = 0
                                                break
                                        }
                                        if (![2, 3, 4].includes(dtype)) {
                                            this.showToast('请选择支持的格式资料')
                                            return
                                        }

                                        if (file.type.includes('image') && !file.name.match(/\.(png|jpe?g|bmp|tif?f)(\?.*)?$/)) {
                                            this.showToast('请选择支持的图片格式')
                                            return
                                        }
                                        eventBus.emit('upload-video', file, {
                                            type: 'info',
                                            info_id: this.infoId,
                                            dtype,
                                            dtranscode: false
                                        })
                                        this.setState({
                                            showModal: {
                                                ...this.state.showModal,
                                                IMPORT_DOC: false
                                            },
                                            uploadFile: null
                                        })
                                    }}
                                />
                            </div>
                        </RLFormItem>
                    </RLForm>
                </div>
            </RLModal>
        )
    }

    // 上传成功/失败结果页
    renderUploadResult = (value) => {
        let visible = value === 'success' ? 'UPLOAD_SUCCESS' : 'UPLOAD_FAIL'
        return (
            <RLModal
                title="上传结果"
                visible={this.state.showModal[visible]}
                onCancel={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            [visible]: false
                        }
                    })
                }}
                footer={null}
            >
                <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                    <img
                        alt=''
                        src={value === 'success' ? commonImg.success : commonImg.fail}
                        style={{ width: 80, height: 80, marginBottom: 20 }}
                    />
                    <div style={{ color: '#333333' }}>
                        {
                            value === 'success' ? `${this.state.uploadingFile.name || ''} 上传成功` :
                                `${this.state.uploadingFile.name || ''} 上传失败，请重新上传`
                        }
                    </div>
                </div>
                <div className='modal-btnContainer'>
                    <RLButton
                        label='确定'
                        type='primary'
                        htmlType="submit"
                        style={{ margin: 'auto' }}
                        onClick={() => {
                            this.setState({
                                showModal: {
                                    ...this.state.showModal,
                                    [visible]: false
                                }
                            })
                        }}
                    />
                </div>
            </RLModal>
        )
    }

    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>资料管理</span>
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

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.infoDocListInfo.list}
                        rowKey='id'
                        columns={this.columns}
                        rowClassName='rl-table-click-row'
                    />
                    {this.state.showModal.EDIT_TITLE && this.renderEditTitle()}
                    {this.state.showModal.IMPORT_DOC && this.renderImportDoc()}
                    {this.state.showModal.UPLOAD_SUCCESS && this.renderUploadResult('success')}
                    {this.state.showModal.UPLOAD_FAIL && this.renderUploadResult('fail')}
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpDocList)
