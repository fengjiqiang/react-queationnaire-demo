import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLTable, RLFilterTool, RLSelect, RLDatePicker, RLSwitch, RLTooltip
} from '@components/index.js'
import utils from '@/libs/utils.js'
import config from '@/config.js'
import interfaces from '@/api/interfaces.js'
import { dealTableTime, dealSearchTime } from '@/libs/utils.js'
import locale from 'antd/es/date-picker/locale/zh_CN'

import actionInfoManage from '@actions/infoManage/actionInfoManage.js'
import actionInfoClassify from '@actions/infoManage/actionInfoClassify.js'


class CmpInfoList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            searchParam: {   // 筛选资讯管理列表项
                status: undefined,   // 1 上架 2 下架
                start_time: '',
                end_time: '',
                class_id: undefined,   // 资讯分类
                title: '',   // 资讯主题
            },
            start_date: null,  // moment对象
            end_date: null,
            infoOptions: [],   // 资讯分类 下拉选择
            infoListInfo: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },

            getListLoading: true,   // 获取列表loading
        }
        this.columns = [
            {
                title: '资讯主题',
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
                title: '发布范围',
                dataIndex: 'type',
                key: 'type',
                width: '10%',
                render: (text, record) => {
                    return <div>
                        {record.type === 1 ? '公开' : '非公开'}
                    </div>
                }
            },
            {
                title: '阅读人数',
                dataIndex: 'user_num',
                key: 'user_num',
                width: '10%'
            },
            {
                title: '标签',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{ width: 70, marginBottom: 5 }}>上架/下架</div>
                            {
                                interfaces.INFO_UPDATE_STATUS && <RLSwitch
                                    defaultChecked={record.status === 1}
                                    onChange={e => {
                                        // 调用更新接口
                                        this.updateValue(record, e)
                                    }}
                                />
                            }
                        </div>
                    )
                }
            },
            {
                title: '资讯分类',
                dataIndex: 'class',
                key: 'class',
                width: '10%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.class}>
                    <div className='line-clamp-noColor'>
                        {record.class}
                    </div>
                </RLTooltip>
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
                width: '12%',
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
                                interfaces.INFO_DELETE && <RLButton
                                    type='link'
                                    label='删除'
                                    onClick={e => {
                                        if (record.status === 1) {
                                            this.showToast({ type: 'warning', content: '请先把该资讯下架' })
                                        } else {
                                            this.showModal({
                                                content: '确认删除后，该资讯将被彻底删除，是否确认删除？',
                                                title: '是否删除该资讯？',
                                                okText: '确定',
                                                cancelText: '取消',
                                                onOk: () => {
                                                    this.infoDelConfirm(record)
                                                },
                                                onCancel: () => { },
                                                size: 'big'
                                            })
                                        }
                                    }}
                                />
                            }
                            {
                                interfaces.INFO_DOC_LIST && <RLButton
                                    type='link'
                                    label='资料管理'
                                    onClick={e => {
                                        e.stopPropagation()
                                        this.props.changePage('download', {
                                            infoId: record.id,
                                            page: this.state.infoListInfo.page
                                        })
                                    }}
                                />
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {
                                interfaces.INFO_EDIT && <RLButton
                                    type='link'
                                    label='编辑'
                                    onClick={e => {
                                        e.stopPropagation()
                                        this.props.changePage('edit', {
                                            infoId: record.id,
                                            page: this.state.infoListInfo.page
                                        })
                                    }}
                                />
                            }
                            {
                                <RLButton label="复制链接"
                                    type="link"
                                    onClick={() => {
                                        console.log('链接---------------------', config.host+`/#/out/newsdetail?infoId=${record.id}`)
                                        const url = config.host + `/#/out/newsdetail?infoId=${record.id}`
                                        //复制链接到剪贴板
                                        utils.copy(url, () => {
                                            this.showToast({ type: 'success', content: '链接已复制到剪贴板' })
                                        })
                                    }}
                                />
                            }
                        </div>
                    </div>
                )
            }
        ]
        // 获取资讯分类
        this.getInfoClassify()
    }
    componentDidMount() {
        this.getInfoList()
    }
    componentWillUnmount() {

    }

    getInfoList({ sign, page = this.state.infoListInfo.page } = { sign: true, page: this.state.infoListInfo.page }) {
        if (sign) {
            this.setState({
                getListLoading: true
            })
        }
        const { status, class_id } = this.state.searchParam
        actionInfoManage.getInfoList({
            ...this.state.searchParam,
            status: status !== 0 ? (status || '') : status,
            class_id: class_id || '',
            page,
            page_size: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getInfoList({ page: page - 1 })
                } else {
                    let newState = {
                        infoListInfo: {
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

    // 资讯分类
    getInfoClassify = () => {
        actionInfoClassify.getAllInfoClassify().then(res => {
            if (res.code === 200) {
                this.setState({
                    infoOptions: res.data
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 更新上下架
    updateValue = (record, value) => {
        const params = {
            id: record.id,
            status: value ? 1 : 0
        }
        return actionInfoManage.infoUpdateStatus(params).then(res => {
            if (res.code === 200) {
                this.getInfoList({ sign: false })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 删除
    infoDelConfirm = (record) => {
        const params = {
            id: record.id
        }
        return actionInfoManage.infoDelete(params).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' })
                this.getInfoList({ sign: false })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    getLeftItems = () => {
        const { status, title, class_id } = this.state.searchParam
        const { start_date, end_date } = this.state
        return ([
            <div className="newDateArea">
                <p>从</p>
                <RLDatePicker
                    allowClear
                    onChange={(date, dateString) => {
                        this.setState({
                            start_date: date,
                            searchParam: {
                                ...this.state.searchParam,
                                start_time: dealSearchTime(dateString, true)
                            }
                        })
                    }}
                    locale={locale}
                    style={{ width: 160 }}
                    inputReadOnly={true}
                    format="YYYY-MM-DD"
                    placeholder='请选择日期'
                    value={start_date}
                />
                <p>至</p>
                <RLDatePicker
                    allowClear
                    onChange={(date, dateString) => {
                        this.setState({
                            end_date: date,
                            searchParam: {
                                ...this.state.searchParam,
                                end_time: dealSearchTime(dateString)
                            }
                        })
                    }}
                    locale={locale}
                    style={{ width: 160, marginRight: 20 }}
                    inputReadOnly={true}
                    format="YYYY-MM-DD"
                    placeholder='请选择日期'
                    value={end_date}
                />
            </div>,
            <RLSelect
                options={[
                    { id: 1, label: '上架' },
                    { id: 0, label: '下架' }
                ]}
                style={{ width: 100, marginRight: 12 }}
                allowClear
                key='status'
                placeholder='请选择'
                valuekey='id'
                labelkey='label'
                value={status}
                onChange={val => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            status: val
                        }
                    })
                }}
            />,
            <RLInput placeholder='请输入资讯主题'
                style={{ width: 240, marginRight: 12 }}
                key='title'
                value={title}
                onChange={e => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            title: e.target.value
                        }
                    })
                }}
            />,
            <RLSelect
                options={this.state.infoOptions}
                style={{ width: 160 }}
                allowClear
                key='class_id'
                placeholder='资讯分类'
                valuekey='id'
                labelkey='name'
                value={class_id}
                onChange={val => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            class_id: val
                        }
                    })
                }}
            />
        ])
    }

    getRightItems = () => {
        return ([
            <RLButton
                label='搜索'
                type="primary"
                key='search'
                onClick={() => {
                    this.getInfoList({ sign: false })
                }}
                style={{ marginLeft: 20, marginRight: 20 }}
            />,
            <RLButton
                label='重置'
                type='default'
                key='reset'
                onClick={() => {
                    this.setState({
                        start_date: null,
                        end_date: null,
                        searchParam: {
                            title: '',
                            class_id: null,
                            status: null,
                            start_time: '',
                            end_time: ''
                        }
                    })
                }}
            />
        ])
    }

    listOperate = () => {
        return ([
            interfaces.INFO_ADD && <RLButton
                label='创建资讯'
                type='primary'
                key='add'
                onClick={() => {
                    this.props.changePage('edit', {
                        page: this.state.infoListInfo.page
                    })
                }}
            />,
            <RLButton
                label='刷新'
                key='refresh'
                onClick={() => {
                    this.getInfoList()
                }}
                style={{ marginLeft: 20 }}
            />
        ])
    }

    pageChange = (page, pageSize) => {
        this.getInfoList({ page })
    }

    render() {
        const { list, count, page } = this.state.infoListInfo
        return (
            <WindowContainer>
                <div className="page-info-list">
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
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
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpInfoList)
