import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLSwitch, RLTooltip
} from '@components/index.js'
import utils, { downloadFile } from '@/libs/utils.js'
import config from '@/config.js'
import { dealTableTime, dealDateTime } from '@/libs/utils.js'
import locale from 'antd/es/date-picker/locale/zh_CN'

import actionEventRegistration from '@actions/marketingTool/actionEventRegistration.js'


class CmpRegistrationList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            searchParam: {   // 筛选报名信息
                id: props.eventId,
                user_type: undefined,   // 用户类型
            },
            registrationInfo: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            selectedMemberKeys: [],  // 选中的用户

            getListLoading: true,   // 获取列表loading
            allSelect: [],    //所有选择ID集合
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '8%',
                render: (text, record, index) => {
                    return <div>{(this.state.registrationInfo.page - 1) * this.pageSize + index + 1}</div>
                }
            },
            {
                title: '用户昵称',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '15%',
                render: (text, record) => {
                    return (
                        <div>
                            <RLTooltip placement="bottomLeft" title={record.nickname}>
                                <div className='line-clamp-noColor'>
                                    {record.nickname}
                                </div>
                            </RLTooltip>
                            {
                                record.user_type === 2 &&
                                <div style={{ fontSize: 14 }}>(认证用户)</div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                width: '8%',
                render: (text, record) => {
                    switch (record.sex) {
                        case 0:
                            return <div>-</div>
                        case 1:
                            return <div>男</div>
                        case 2:
                            return <div>女</div>
                        default:
                            return <div>-</div>
                    }
                }
            },
            {
                title: '邮箱',
                key: 'email',
                width: '12%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.email}>
                        <div className='line-clamp-noColor'>
                            {record.email}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '手机号',
                key: 'phone',
                width: '12%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.phone}>
                        <div className='line-clamp-noColor'>
                            {record.phone}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '证件号',
                key: 'certificates',
                width: '12%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.certificates}>
                        <div className='line-clamp-noColor'>
                            {record.certificates}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '机构名称',
                dataIndex: 'company',
                key: 'company',
                width: '12%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.company}>
                        <div className='line-clamp-noColor'>
                            {record.company}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '提交时间',
                dataIndex: 'create_at',
                key: 'create_at',
                width: '13%',
                render: (text, record) => {
                    return <div>
                        {dealTableTime(record.create_at)}
                    </div>
                }
            }
        ]
    }
    componentDidMount() {
        this.getRegistrationList()
    }
    componentWillUnmount() {

    }

    getRegistrationList({ sign, page = this.state.registrationInfo.page } = { sign: true, page: this.state.registrationInfo.page }) {
        if (sign) {
            this.setState({
                getListLoading: true
            })
        }
        actionEventRegistration.getRegistrationList({
            ...this.state.searchParam,
            user_type: typeof(this.state.searchParam.user_type) === 'undefined' ? '' : this.state.searchParam.user_type,
            page,
            page_size: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getRegistrationList({ page: page - 1 })
                } else {
                    let newState = {
                        registrationInfo: {
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

    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>报名信息</span>
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

    getleftItems = () => {
        return ([
            <div>活动主题：{this.props.eventTitle}</div>
        ])
    }

    getRightItems = () => {
        return ([
            <RLSelect
                options={[
                    { value: 2, label: '认证用户' },
                    { value: 1, label: '普通用户' }
                ]}
                style={{ width: 200, marginRight: 12 }}
                allowClear
                key='user_type'
                placeholder='用户类型'
                value={this.state.searchParam.user_type}
                onChange={val => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            user_type: val
                        }
                    }, () => {
                        this.getRegistrationList()
                    })
                }}
            />,
            <RLButton
                label='批量导出'
                key='export'
                disabled={this.state.allSelect.length <= 0}
                onClick={() => {
                    actionEventRegistration.registrationInfoExport({ ids: this.state.allSelect.join(',') }).then(res => {
                        if (res.code === 200) {
                            downloadFile(res.data, '活动报名信息.xlsx')
                            this.setState({
                                allSelect: []
                            })
                        } else {
                            this.showToast({ type: 'error', content: '导出文件出错' })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }}
            />
        ])
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        let i = 0
        let currentPage = this.state.registrationInfo.list
        let allSelect = [...this.state.allSelect]
        for (i; i < currentPage.length; i++) {
            let isInSelect = selectedRowKeys.findIndex(ele => { return ele == currentPage[i].id })
            let isInOrigin = allSelect.findIndex(ele => { return ele == currentPage[i].id })
            // 取消勾选
            if (isInSelect === -1 && isInOrigin !== -1) {
                allSelect.splice(isInOrigin, 1)
            }
            // 勾选
            else if (isInSelect !== -1 && isInOrigin === -1) {
                allSelect.push(selectedRowKeys[isInSelect])
            }
            this.setState({
                allSelect: [...allSelect]
            })
        }
    }

    pageChange = (page, pageSize) => {
        this.getRegistrationList({ page })
    }

    render() {
        const { list, count, page } = this.state.registrationInfo
        return (
            <WindowContainer title={this.pageTitle}>
                <div className="page-info-list">
                    <RLFilterTool leftItems={this.getleftItems} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={list}
                        rowKey='id'
                        columns={this.columns}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys: this.state.allSelect,
                            onChange: this.onSelectChange,
                            getCheckboxProps: (record) => ({
                                disabled: false
                            })
                        }}
                        paginationInfo={{
                            // selectedRowKeys: this.state.selectedMemberKeys,
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
})(CmpRegistrationList)
