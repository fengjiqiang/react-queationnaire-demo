import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker
} from '@components/index'
import locale from 'antd/es/date-picker/locale/zh_CN'

import actionUnauthedUserList from '@actions/userManage/actionUnauthedUserList.js'

import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js'

import './UnauthedList.less'

class ProcessedList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            // ‘我已处理’ 筛选条件
            searchParam: {
                type: 2,       // type 1 待认证列表 2 我已处理列表
                keyword: null,   // 选择 姓名或手机号
                value: '',   // 姓名或手机号 值
                operate_status: null, // 认证状态
                start_time: '', // 开始时间
                end_time: '' //结束时间
            },
            processedList: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.page || 1      // 当前第几页
            },
            start_date: null,  // moment对象
            end_date: null,
            selectedMemberKeys: [],  // 选中的用户
            getListLoading: true,    // 获取列表loading
        }

        // table 字段
        this.columns = [
            {
                title: '序号',
                dataIndex: 'uuid',
                key: 'uuid',
                width: '8%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            },
            {
                title: '申请人',
                // dataIndex: 'nickname',
                key: 'nickname',
                width: '10%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.nickname}>
                        <div className='line-clamp-noColor'>
                            {record.nickname}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '手机号',
                key: 'mobile',
                width: '10%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.mobile}>
                        <div className='line-clamp-noColor'>
                            {record.mobile}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '邮箱',
                key: 'email',
                width: '14%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.email}>
                        <div className='line-clamp-noColor'>
                            {record.email}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '机构名称',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '14%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.company_name}>
                        <div className='line-clamp-noColor'>
                            {record.company_name}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '申请时间',
                dataIndex: 'apply_time',
                key: 'apply_time',
                width: '12%'
            },
            {
                title: '认证时间',
                dataIndex: 'approval_time',
                key: 'approval_time',
                width: '12%'
            },
            {
                title: '认证状态',
                dataIndex: 'operate_status_desc',
                key: 'operate_status_desc',
                width: '10%'
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
                                label='查看'
                                onClick={(e) => {
                                    this.rowClick(e, record)
                                }}
                            />
                        }
                    </div>
                )
            }
        ]

        // 选择框
        this.memberOptions = [
            { keyword: 'nickname', label: '姓名' },
            { keyword: 'mobile', label: '手机号' }
        ]

        // 认证状态
        this.approveStatusOptions = [
            { id: 1, label: '已同意' },
            { id: 2, label: '已拒绝' }
        ]
    }
    componentWillMount() {
        this.getProcessedList()
    }
    // ‘我已处理’列表
    getProcessedList({ page = this.state.processedList.page } = { page: this.state.processedList.page }) {
        this.setState({
            getListLoading: true
        })
        actionUnauthedUserList.getUserUnauthedList({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.data.list.length === 0 && page > 1) {
                    this.getProcessedList({ page: page - 1 })
                } else {
                    let newState = {
                        processedList: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        }
                    }
                    this.setState(newState)
                }
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }

    getLeftItems = () => {
        const { keyword, value, operate_status } = this.state.searchParam
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
                                start_time: dateString
                            }
                        })
                    }}
                    disabledDate={this.startDisabledDate}
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
                                end_time: dateString
                            }
                        })
                    }}
                    disabledDate={this.startDisabledDate}
                    locale={locale}
                    style={{ width: 160, marginRight: 20 }}
                    inputReadOnly={true}
                    format="YYYY-MM-DD"
                    placeholder='请选择日期'
                    value={end_date}
                />
            </div>,
            <RLSelect
                options={this.memberOptions}
                style={{ width: 150, marginRight: 12 }}
                key='keyword'
                placeholder='请选择'
                valuekey='keyword'
                labelkey='label'
                value={keyword}
                onChange={(val) => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            keyword: val
                        }
                    })
                }}
            />,
            <RLInput placeholder='请输入姓名或手机号'
                // allowClear afterFix='SearchOutlined'
                style={{ width: 200, marginRight: 20 }}
                key='value'
                value={value}
                onChange={(e) => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            value: e.target.value
                        }
                    })
                }}
                // afterFixClick={() => {
                //     this.getProcessedList()
                // }}
            />,
            <RLSelect
                allowClear
                options={this.approveStatusOptions}
                style={{ width: 150 }}
                key='operate_status'
                placeholder='认证状态'
                valuekey='id'
                labelkey='label'
                value={operate_status}
                onChange={(val) => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            operate_status: val
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
                type='primary'
                key='search'
                onClick={() => {
                    this.getProcessedList({ type: 2 })
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
                            keyword: '',
                            operate_status: null,
                            start_time: '',
                            end_time: ''
                        }
                    })
                }}
            />
        ])
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
        this.setState({
            selectedMemberKeys: selectedRowKeys
        })
    }
    pageChange = (page, pageSize) => {
        console.log('翻页了', page, pageSize)
        this.getProcessedList({ page })
    }
    rowClick = (e, record) => {
        console.log('点击行----record:', record)
        this.props.changePage('detail', {
            uuid: record.uuid,
            approvalId: record.approval_id,
            tabKey: 'processed',
            page: this.state.processedList.page
        })
    }
    render() {
        return (
            <div className='content-user'>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLTable
                    loading={this.state.getListLoading}
                    dataSource={this.state.processedList.list}
                    rowKey='uuid'
                    columns={this.columns}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: this.onSelectChange
                    }}
                    paginationInfo={{
                        total: this.state.processedList.count,
                        pageSize: this.pageSize,
                        onChange: this.pageChange,
                        current: this.state.processedList.page
                    }}
                    // onRow={(record) => {
                    //     return {
                    //         onClick: (e) => {
                    //             this.rowClick(e, record)
                    //         }
                    //     }
                    // }}
                    rowClassName='rl-table-click-row'
                />
            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(ProcessedList)
