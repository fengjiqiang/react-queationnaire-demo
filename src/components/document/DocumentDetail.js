import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import './DocumentDetail.less'
import { RLTable } from '@components/index.js'
import { getData } from '@/libs/utils.js'
import interfaces from '@/api/interfaces'
import { Upload } from 'antd'
import Uploader from '@/libs/Uploader.js';
import DocumentProgress from './DocumentProgress';
import actionSeminar from '@actions/seminar/actionSeminar.js'
import config from '@/config.js';

class DocumentDetail extends BaseCmp {
    constructor(props) {
        super(props)
        this.room = this.props.room
        this.state = {
            listLoading: true,
            upLoading: false,
            documentList: [],
            showProgress: false,
            meetingTitle: '',
            meetingTime: '',
            currentListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                page: 1,     // 当前第几页
            },
        }
        this.pageSize = 20
    }
    componentDidMount = () => {
        this.seminarDetail()
        this.getDocumentList()
    }
    getColumns = () => {
        return [
            {
                title: '文档名称',
                dataIndex: 'title',
                key: 'title',
                width: '46%',
                render: (text, record) => {
                    return <div className='tableTitle'>
                        {record.title}
                    </div>
                }
            },
            {
                title: '创建者',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '13%',
                render: (text, record) => {
                    return <div className='tableNickname'>
                        {record.nickname}
                    </div>
                }
            },
            {
                title: '修改时间',
                dataIndex: 'update',
                key: 'update',
                width: '24%',
                render: (text, record) => {
                    return <div className='tableUpdate'>
                        {this.createUpdateTime(record)}
                        <div className='tableUpdateNickname'>{record.update_nickname}</div>
                    </div>
                }
            },
            {
                title: '操作',
                dataIndex: 'control',
                key: 'control',
                render: (text, record) => {
                    return <div className='tableUpdate'>
                        <div className='documentControlBtn' onClick={this.documentDownLoad(record.url)}>下载</div>
                        <div className='documentControlBtn documentControlBtnRight' onClick={this.documentDelete(record.id)}>删除</div>
                    </div>
                }
            },
        ]
    }
    createUpdateTime = (record) => {
        let date = new Date(parseInt(record.updated_at) * 1000).toLocaleDateString() && new Date(parseInt(record.updated_at) * 1000).toLocaleDateString().replace(/\//g, '.')
        let time = new Date(parseInt(record.updated_at) * 1000).toTimeString() && new Date(parseInt(record.updated_at) * 1000).toTimeString().split(':').slice(0, 2).join(':')
        let dateTime = date + ' ' + time
        return <div style={{ marginRight: 20 }}>
            {dateTime}
        </div>
    }
    seminarDetail = async () => {
        let res = await actionSeminar.seminarDetail({ room: this.room }).catch(err => {
            this.showToast('获取详情失败')
        })
        if (!res) return
        this.setState({
            meetingTitle: res.data.info.title,
            meetingTime: res.data.info.start_date + ' ' + res.data.info.start_time
        })
    }
    getDocumentList = async () => {
        this.setState({
            listLoading: true
        })
        let res = await getData({
            method: 'get',
            url: interfaces.DOCUMENT_GET_LIST,
            data: {
                room: this.room,
                page: this.state.currentListInfo.page,
                page_size: this.pageSize
            }
        }).catch(err => {
            this.showToast('加载列表失败')
            this.setState({
                listLoading: false
            })
        })
        if (!res) return
        console.log('oooeee', res);
        let pageNum = Math.ceil(res.data.count / this.pageSize)
        this.setState({
            listLoading: false,
            documentList: res.data.list,
            currentListInfo: {
                ...this.state.currentListInfo,
                pageNum,
                count: res.data.count,
            }
        })
    }
    refresh = () => {
        this.getDocumentList()
    }
    pageChange = (page, pageSize) => {
        this.setState({
            currentListInfo: {
                ...this.state.currentListInfo,
                page
            }
        }, () => {
            this.getDocumentList()
        })
    }
    documentDownLoad = (url) => {
        return () => {
            window.open(url)
        }
    }
    documentDelete = (id) => {
        return async () => {
            let res = await getData({
                method: 'get',
                url: interfaces.DOCUMENT_DELETE,
                data: { id }
            }).catch(err => {
                this.showToast('删除失败')
            })
            if (!res) return
            this.getDocumentList()
        }
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
                    showProgress: true,
                    upLoading: true
                })
            },
            onSuccess: (res) => {
                this.setState({
                    upLoading: false
                })
                this.upDocToBackEnd(res)
                this.documentProgress && this.documentProgress.changeType(2)
                this.documentProgress && this.documentProgress.changeProgressNum(100)
                console.log('--------上传成功-------', res)
            },
            onError: () => {
                this.setState({
                    upLoading: false
                })
                this.documentProgress && this.documentProgress.changeType(0)
                this.documentProgress && this.documentProgress.changeProgressNum(100)
                console.log('--------上传失败-------')
            },
            onProgress: (progress) => {
                this.documentProgress && this.documentProgress.changeType(1)
                this.documentProgress && this.documentProgress.changeProgressNum(progress)
                console.log('-------上传进度---------', progress)
                // 进度条
            },
            onCancel: () => {
                this.setState({
                    upLoading: false
                })
                console.log('-------上传取消---------')
            }
        })
        let dtype = 3
        uploader.upload({
            dtype,
            dtranscode: false
        })
    }
    upDocToBackEnd = async (endData) => {
        let docData = {
            url: endData.url,
            title: endData.name,
            room: this.room
        }
        let res = await getData({
            method: 'post',
            url: interfaces.DOCUMENT_UP_LOAD,
            data: docData
        }).catch(err => {
            this.documentProgress && this.documentProgress.changeType(0)
            this.documentProgress && this.documentProgress.changeProgressNum(100)
        })
        if (!res) return
        this.getDocumentList()
    }
    cancelProgress = () => {
        this.setState({
            showProgress: false
        })
        this.documentProgress && this.documentProgress.changeType(1)
        this.documentProgress && this.documentProgress.changeProgressNum(0)
    }
    cancelProgressOk = () => {
        this.setState({
            showProgress: false
        })
        this.documentProgress && this.documentProgress.changeType(1)
        this.documentProgress && this.documentProgress.changeProgressNum(0)
    }
    render() {
        return <div className='documentBox'>
            <div className='documentBoxCon'>
                <div className='documentFirst'>
                    <div className='documentFirstText'> {this.state.meetingTitle}</div>
                    <div className='documentFirstBtn' onClick={() => {
                        this.props.closeDoc && this.props.closeDoc()
                    }}>返回</div>
                </div>
                <div className='documentSecond'>
                    <div className='documentSecondLeft'>
                        <div>
                            {'会议号：' + this.room}
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            {'会议时间：' + this.state.meetingTime}
                        </div>
                    </div>
                    <div className='documentSecondLeft'>
                        {this.state.upLoading ? <div
                            className='documentSecondRightUpLoadBtn'
                            onClick={() => {
                                this.setState({
                                    showProgress: true
                                })
                            }}
                        >导入中...</div> : <Upload
                            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                            // showUploadList={true}
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
                            onRemove={() => { }
                            }
                        >
                                <div
                                    className='documentSecondRightUpLoadBtn'
                                >导入文档</div>
                            </Upload>}
                        <div className='documentSecondRightRefreshBtn' onClick={this.refresh}>刷新</div>
                    </div>
                </div>
                <div className='documentTable'>
                    <RLTable
                        loading={this.state.listLoading}
                        dataSource={this.state.documentList}
                        rowKey='meeting_id'
                        columns={this.getColumns()}
                        paginationInfo={{
                            total: this.state.currentListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.currentListInfo.page
                        }}
                    />
                </div>
            </div>
            <DocumentProgress
                cancelProgress={this.cancelProgress}
                cancelProgressOk={this.cancelProgressOk}
                isShow={this.state.showProgress}
                ref={(e) => { this.documentProgress = e }}
                t={this.props.t}
            />
        </div>
    }

}
export default connect((store, props) => {
    return {
        ...props
    }
})(DocumentDetail)