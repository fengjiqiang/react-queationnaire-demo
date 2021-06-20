import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { Tooltip } from 'antd'
import {
    RLButton, RLTable, RLFilterTool, RLSwitch, RLTooltip
} from '@components/index.js'
import { dealTableTime } from '@/libs/utils.js'
import interfaces from '@/api/interfaces'

import actionInfoClassify from '@actions/infoManage/actionInfoClassify.js'


class CmpInfoClassifyList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            infoClassifyListInfo: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            getListLoading: true,   // 获取列表loading
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '8%',
                render: (text, record, index) => {
                    return <div>
                        {(this.state.infoClassifyListInfo.page - 1) * this.pageSize + index + 1}
                    </div>
                }
            },
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.name}>
                    <div className='line-clamp-noColor'>
                        {record.name}
                    </div>
                </RLTooltip>
            },
            {
                title: '是否显示',
                dataIndex: 'is_show',
                key: 'is_show',
                width: '10%',
                render: (text, record) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {
                                interfaces.INFO_CLASSIFY_HIDE && <RLSwitch
                                    defaultChecked={record.is_show === 1}
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
                title: '资讯数',
                dataIndex: 'info_count',
                key: 'info_count',
                width: '10%'
            },
            {
                title: '创建时间',
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
                title: '创建者',
                dataIndex: 'creator',
                key: 'creator',
                width: '18%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.creator}>
                    <div className='line-clamp-noColor'>
                        {record.creator}
                    </div>
                </RLTooltip>
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '16%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            interfaces.INFO_CLASSIFY_EDIT && <RLButton
                                type='link'
                                label='编辑'
                                onClick={e => {
                                    e.stopPropagation()
                                    this.props.changePage('edit', {
                                        record,
                                        page: this.state.infoClassifyListInfo.page
                                    })
                                }}
                                style={{ color: '#8F1D22' }}
                            />
                        }
                        {
                            interfaces.INFO_CLASSIFY_DELETE && <RLButton
                                type='link'
                                label='删除'
                                onClick={e => {
                                    if (record.info_count !== 0) {
                                        this.showModal({
                                            title: '请先删除该分类下的资讯',
                                            singleText: '确定',
                                            size: 'small'
                                        })
                                    } else {
                                        this.showModal({
                                            content: '确认删除后，该资讯分类将被彻底删除，是否确认删除？',
                                            title: '是否删除该资讯分类',
                                            okText: '确定',
                                            cancelText: '取消',
                                            onOk: () => {
                                                this.infoClassifyDelConfirm(record)
                                            },
                                            onCancel: () => { },
                                            size: 'big'
                                        })
                                    }
                                }}
                                style={{ color: '#8F1D22' }}
                            />
                        }
                    </div>
                )
            }
        ]
    }
    componentDidMount() {
        this.getInfoClassifyList()
    }
    componentWillUnmount() {

    }

    getInfoClassifyList({ sign, page = this.state.infoClassifyListInfo.page } = { sign: true, page: this.state.infoClassifyListInfo.page }) {
        if (sign) {
            this.setState({
                getListLoading: true
            })
        }
        actionInfoClassify.getInfoClassifyList({
            page,
            page_size: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getInfoClassifyList({ page: page - 1 })
                } else {
                    let newState = {
                        infoClassifyListInfo: {
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

    // 更新显隐
    updateValue = (record, value) => {
        const params = {
            id: record.id,
            is_show: value ? 1 : 0
        }
        return actionInfoClassify.infoClassifyHide(params).then(res => {
            if (res.code === 200) {
                this.getInfoClassifyList({ sign: false })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 删除
    infoClassifyDelConfirm = (record) => {
        const params = {
            id: record.id
        }
        return actionInfoClassify.infoClassifyDelete(params).then(res => {
            if (res.code === 200) {
                this.getInfoClassifyList({ sign: false })
                this.showToast({ type: 'success', content: '删除成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    getRightItems = () => {
        return ([
            interfaces.INFO_CLASSIFY_ADD && <RLButton
                label='添加分类'
                type='primary'
                key='add'
                onClick={() => {
                    this.props.changePage('edit', {
                        page: this.state.infoClassifyListInfo.page
                    })
                }}
            />,
            <RLButton
                label='刷新'
                key='refresh'
                onClick={() => {
                    this.getInfoClassifyList()
                }}
                style={{ marginLeft: 20 }}
            />
        ])
    }

    pageChange = (page, pageSize) => {
        this.getInfoClassifyList({ page })
    }

    render() {
        const { list, count, page } = this.state.infoClassifyListInfo
        return (
            <WindowContainer>
                <div>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems} />
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
})(CmpInfoClassifyList)
