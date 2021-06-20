import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLTable, RLFilterTool, RLSwitch, RLTooltip, RLModal
} from '@components/index.js'
import utils, { downloadUrl, downloadFile } from '@/libs/utils.js'
import config from '@/config.js'
import interfaces from '@/api/interfaces.js'
import { dealTableTime, dealDateTime } from '@/libs/utils.js'
import locale from 'antd/es/date-picker/locale/zh_CN'

import actionQuestionnaire from '@actions/marketingTool/actionQuestionnaire.js'


class CmpQnaireList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            title: '',   // 问卷名称
            qnaireListInfo: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.page || 1,     // 当前第几页
            },
            shareModal: false,   // 问卷分享弹框
            shareImg: '',   // 分享二维码
            shareUrl: '',   // 分享url

            getListLoading: true,   // 获取列表loading
        }
        this.columns = [
            {
                title: '问卷调查',
                dataIndex: 'title',
                key: 'title',
                width: '25%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.title}>
                    <div className='line-clamp-noColor'>
                        {record.title}
                    </div>
                </RLTooltip>
            },
            {
                title: '参与人数',
                dataIndex: 'join_num',
                key: 'join_num',
                width: '10%'
            },
            {
                title: '截止时间',
                dataIndex: 'end_time_at',
                key: 'end_time_at',
                width: '15%',
                render: (text, record) => {
                    return (
                        <div>
                            {dealTableTime(record.end_time_at)}
                        </div>
                    )
                }
            },
            {
                title: '问卷状态',
                dataIndex: 'q_status',
                key: 'q_status',
                width: '10%',
                render: (text, record) => {
                    return (
                        <div>
                            {record.q_status === 1 ? '未开始' : (record.q_status === 2 ? '进行中' : (record.q_status === 3 ? '已结束' : '-'))}
                        </div>
                    )
                }
            },
            {
                title: '标签',
                dataIndex: 'status',
                key: 'status',
                width: '15%',
                render: (text, record) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: 70, marginBottom: 5 }}>上架/下架</div>
                            {
                                interfaces.QNAIRE_UPDATE_STATUS && <RLSwitch
                                    key={record.id}
                                    defaultChecked={record.status === 1}
                                    disabled={record.q_status === 3}
                                    onChange={value => {
                                        // 调用更新接口
                                        this.updateValue(record, value)
                                    }}
                                />
                            }
                        </div>
                    )
                }
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '15%',
                render: (text, record) => {
                    return <div>
                        {dealTableTime(record.created_at)}
                    </div>
                }
            },
            {
                title: '创建者',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '15%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.nickname}>
                    <div className='line-clamp-noColor'>
                        {record.nickname}
                    </div>
                </RLTooltip>
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '15%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {
                                interfaces.QNAIRE_DELETE && <RLButton
                                    type='link'
                                    label='删除'
                                    onClick={e => {
                                        this.showModal({
                                            content: '确认删除后，该问卷将被彻底删除，是否确认删除？',
                                            title: '是否删除该问卷？',
                                            okText: '确定',
                                            cancelText: '取消',
                                            onOk: () => {
                                                this.eventDelConfirm(record)
                                            },
                                            onCancel: () => { },
                                            size: 'big'
                                        })
                                    }}
                                />
                            }
                            {
                                record.q_status === 3 && <RLButton
                                    type='link'
                                    label='导出'
                                    onClick={e => {
                                        actionQuestionnaire.surveyResultExport({ qid: record.id }).then(res => {
                                            if (res.code === 200) {
                                                downloadFile(res.data, '问卷调查结果.xlsx')
                                            } else {
                                                this.showToast({ type: 'error', content: '导出文件出错' })
                                            }
                                        }).catch(err => {
                                            console.log(err)
                                        })
                                    }}
                                />
                            }
                            {
                                record.q_status !== 3 && <RLButton
                                    type='link'
                                    label='问卷分享'
                                    onClick={() => {
                                        const url = config.host + `/#/out/qnairedetail?qnaireId=${record.id}`
                                        console.log('链接---------------------', url)
                                        actionQuestionnaire.getQRCode({ url: encodeURIComponent(url) }).then(res => {
                                            if (res.code === 200) {
                                                this.setState({
                                                    shareImg: res.data.share,
                                                    shareUrl: url,
                                                    shareModal: true
                                                })
                                            } else {
                                                this.showToast({ type: 'error', content: res.msg })
                                            }
                                        })
                                    }}
                                />
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {
                                interfaces.QNAIRE_EDIT && record.q_status === 1 && <RLButton
                                    type='link'
                                    label='编辑'
                                    onClick={() => {
                                        this.props.changePage('edit', {
                                            qnaireId: record.id,
                                            page: this.state.qnaireListInfo.page
                                        })
                                    }}
                                />
                            }
                            {
                                interfaces.QNAIRE_RESULT && record.q_status !== 1 && <RLButton
                                    label="调查结果"
                                    type="link"
                                    onClick={() => {
                                        this.props.changePage('survey', {
                                            qnaireId: record.id,
                                            page: this.state.qnaireListInfo.page
                                        })
                                    }}
                                />
                            }
                        </div>
                    </div>
                )
            }
        ]
    }
    componentDidMount() {
        this.getQnaireList()
    }
    componentWillUnmount() {

    }

    getQnaireList({ sign, page = this.state.qnaireListInfo.page } = { sign: true, page: this.state.qnaireListInfo.page }) {
        if (sign) {
            this.setState({
                getListLoading: true
            })
        }
        actionQuestionnaire.getQnaireList({
            title: this.state.title,
            page,
            page_size: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getQnaireList({ page: page - 1 })
                } else {
                    let newState = {
                        qnaireListInfo: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        }
                    }
                    this.setState(newState)
                }
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }

    // 更新上下架
    updateValue = (record, value) => {
        const params = {
            id: record.id,
            status: value ? 1 : 2
        }
        return actionQuestionnaire.qnaireUpdateStatus(params).then(res => {
            if (res.code === 200) {
                record.status = value ? 1 : 2
                this.getQnaireList({ sign: false })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).catch(e => {
            this.showToast({ type: 'error', content: '操作失败' })
        })
    }

    // 删除
    eventDelConfirm = (record) => {
        const params = {
            id: record.id
        }
        return actionQuestionnaire.qnaireDelete(params).then(res => {
            if (res.code === 200) {
                this.getQnaireList({ sign: false })
                this.showToast({ type: 'success', content: '删除成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 渲染问卷分享弹框
    renderShare = () => {
        return (
            <RLModal
                title='问卷分享'
                className="share-modal"
                maskClosable={false}
                visible={this.state.shareModal}
                footer={null}
                onCancel={() => {
                    this.setState({
                        shareModal: false
                    })
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 48, marginLeft: 16 }}>
                    <div style={{ marginRight: 20 }}>
                        <img
                            alt=''
                            src={this.state.shareImg}
                            style={{ height: 170, width: 170 }}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 28 }}>
                            <RLInput
                                style={{ width: 260, height: 40 }}
                                value={this.state.shareUrl}
                            />
                            <RLButton
                                label='复制链接'
                                type='primary'
                                onClick={() => {
                                    utils.copy(this.state.shareUrl, () => {
                                        this.showToast({ type: 'success', content: '链接已复制到剪贴板' })
                                    })
                                }}
                            />
                        </div>
                        <RLButton
                            label='下载问卷二维码'
                            onClick={() => {
                                downloadUrl(this.state.shareImg, '问卷二维码')
                            }}
                        />
                    </div>
                </div>
            </RLModal>
        )
    }

    getRightItems = () => {
        return ([
            <RLInput placeholder='请输入问卷名称'
                style={{ width: 240, marginRight: 12 }}
                key='title'
                value={this.state.title}
                onChange={e => {
                    this.setState({
                        title: e.target.value
                    })
                }}
            />,
            <RLButton
                label='搜索'
                type="primary"
                key='search'
                onClick={() => {
                    this.getQnaireList()
                }}
                style={{ marginLeft: 20, marginRight: 20 }}
            />,
            <RLButton
                label='重置'
                type='default'
                key='reset'
                onClick={() => {
                    this.setState({
                        title: ''
                    })
                }}
            />
        ])
    }

    listOperate = () => {
        return ([
            interfaces.QNAIRE_CREATE && <RLButton
                label='创建问卷'
                type='primary'
                key='add'
                onClick={() => {
                    this.props.changePage('edit', {
                        page: this.state.qnaireListInfo.page
                    })
                }}
            />,
            <RLButton
                label='刷新'
                key='refresh'
                onClick={() => {
                    this.getQnaireList()
                }}
                style={{ marginLeft: 20 }}
            />
        ])
    }

    pageChange = (page, pageSize) => {
        this.getQnaireList({ page })
    }

    render() {
        const { list, count, page } = this.state.qnaireListInfo
        return (
            <WindowContainer>
                <div className="page-info-list">
                    <RLFilterTool rightItems={this.getRightItems} />
                    <RLFilterTool rightItems={this.listOperate} />
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={list}
                        rowKey='id'
                        columns={this.columns}
                        paginationInfo={{
                            total: count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: page
                        }}
                        rowClassName='rl-table-click-row'
                    />
                    {
                        this.state.shareModal && this.renderShare()
                    }
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpQnaireList)
