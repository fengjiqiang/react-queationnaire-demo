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

import actionEventRegistration from '@actions/marketingTool/actionEventRegistration.js'


class CmpEventList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            title: '',   // 活动主题
            eventListInfo: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            shareModal: false,   // 活动分享弹框
            shareImg: '',   // 活动分享二维码
            shareUrl: '',   // 活动分享url

            getListLoading: true,   // 获取列表loading
        }
        this.columns = [
            {
                title: '活动主题',
                dataIndex: 'title',
                key: 'title',
                width: '20%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.title}>
                    <div className='line-clamp-noColor'>
                        {record.title || record.e_title}
                    </div>
                </RLTooltip>
            },
            {
                title: '报名人数',
                dataIndex: 'current_num',
                key: 'current_num',
                width: '10%',
                render: (text, record) => {
                    return (
                        record.user_limit === -1 ? <div>{record.current_num}</div> :
                        <div>
                            {record.current_num}/{record.user_limit}
                        </div>
                    )
                }
            },
            {
                title: '活动时间',
                dataIndex: 'end_time_at',
                key: 'end_time_at',
                width: '27%',
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: 65 }}>开始时间:</div>
                                {dealTableTime(record.start_time_at)}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
                                <div style={{ width: 65 }}>结束时间:</div>
                                {dealTableTime(record.end_time_at)}
                            </div>
                        </div>
                    )
                }
            },
            {
                title: '活动状态',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{ width: 70 }}>{record.status === 1 ? '未开始' : (record.status === 2 ? '进行中' : (record.status === 3 ? '已结束' : '-'))}</div>
                            {
                                record.status === 2 && record.user_limit === record.current_num &&
                                <div style={{ color: '#FF8921', fontSize: 14 }}>已报满</div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '标签',
                dataIndex: 'tag',
                key: 'tag',
                width: '10%',
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{ width: 70, marginBottom: 5 }}>上架/下架</div>
                            {
                                interfaces.EVENT_UPDATE_TAG && <RLSwitch
                                    key={record.id}
                                    defaultChecked={record.tag === 1}
                                    disabled={record.status === 3 && record.tag === 2}
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
                dataIndex: 'create_at',
                key: 'create_at',
                width: '13%',
                render: (text, record) => {
                    return <div>
                        {dealTableTime(record.create_at)}
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
                                interfaces.EVENT_DELETE && <RLButton
                                    type='link'
                                    label='删除'
                                    onClick={e => {
                                        this.showModal({
                                            content: '确认删除后，该活动将被彻底删除，是否确认删除？',
                                            title: '是否删除该活动？',
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
                                interfaces.REGISTRATION_INFO_EXPORT && record.status === 3 && <RLButton
                                    type='link'
                                    label='导出'
                                    onClick={e => {
                                        actionEventRegistration.registrationInfoExport({ aid: record.id }).then(res => {
                                            if (res.code === 200) {
                                                downloadFile(res.data, '活动报名信息.xlsx')
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
                                record.status !== 3 && <RLButton
                                    type='link'
                                    label='活动分享'
                                    onClick={() => {
                                        const url = config.host + `/#/out/eventdetail?eventId=${record.hashid}`
                                        console.log('链接---------------------', url)
                                        actionEventRegistration.getQRCode({ url: encodeURIComponent(url) }).then(res => {
                                            if (res.code === 200) {
                                                this.setState({
                                                    shareImg: res.data.share,
                                                    shareUrl: url,
                                                    shareModal: true
                                                })
                                            }
                                        })
                                    }}
                                />
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {
                                interfaces.EVENT_EDIT && (record.status === 1 || (record.status === 2 && record.tag === 2)) && <RLButton
                                    type='link'
                                    label='编辑'
                                    onClick={() => {
                                        this.props.changePage('edit', {
                                            eventId: record.id,
                                            page: this.state.eventListInfo.page
                                        })
                                    }}
                                />
                            }
                            {
                                interfaces.REGISTRATION_INFO && record.status !== 1 && <RLButton
                                    label="报名信息"
                                    type="link"
                                    onClick={() => {
                                        this.props.changePage('registration', {
                                            eventId: record.id,
                                            eventTitle: record.title,
                                            page: this.state.eventListInfo.page
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
        this.getEventList()
    }
    componentWillUnmount() {

    }

    getEventList({ sign, page = this.state.eventListInfo.page } = { sign: true, page: this.state.eventListInfo.page }) {
        if (sign) {
            this.setState({
                getListLoading: true
            })
        }
        actionEventRegistration.getEventList({
            title: this.state.title,
            page,
            page_size: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getEventList({ page: page - 1 })
                } else {
                    let newState = {
                        eventListInfo: {
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
            tag: value ? 1 : 2
        }
        return actionEventRegistration.eventUpdateTag(params).then(res => {
            if (res.code === 200) {
                record.tag = value ? 1 : 2
                this.getEventList({ sign: false })
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
        return actionEventRegistration.eventDelete(params).then(res => {
            if (res.code === 200) {
                this.getEventList({ sign: false })
                this.showToast({ type: 'success', content: '删除成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 渲染活动分享弹框
    renderShare = () => {
        return (
            <RLModal
                title='活动分享'
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
                            label='下载活动二维码'
                            onClick={() => {
                                downloadUrl(this.state.shareImg, '活动二维码')
                            }}
                        />
                    </div>
                </div>
            </RLModal>
        )
    }

    getRightItems = () => {
        return ([
            <RLInput placeholder='请输入活动主题'
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
                    this.getEventList({ sign: false })
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
            interfaces.EVENT_CREATE && <RLButton
                label='创建活动'
                type='primary'
                key='add'
                onClick={() => {
                    this.props.changePage('edit', {
                        page: this.state.eventListInfo.page
                    })
                }}
            />,
            <RLButton
                label='刷新'
                key='refresh'
                onClick={() => {
                    this.getEventList()
                }}
                style={{ marginLeft: 20 }}
            />
        ])
    }

    pageChange = (page, pageSize) => {
        this.getEventList({ page })
    }

    render() {
        const { list, count, page } = this.state.eventListInfo
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
})(CmpEventList)
