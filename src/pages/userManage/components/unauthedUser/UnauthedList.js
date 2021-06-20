import BaseCmp from '@components/BaseCmp.js'
import { Radio } from 'antd';
import { connect } from 'react-redux'
import {
    RLSelect, RLInput, RLButton, RLModal, RLForm, RLFormItem, RLTable, RLFilterTool, RLTooltip, RLTextarea, RLDatePicker, RLRadioGroup
} from '@components/index.js'
import locale from 'antd/es/date-picker/locale/zh_CN'

import actionUnauthedUserList from '@actions/userManage/actionUnauthedUserList.js'
import interfaces from '@/api/interfaces'

import './UnauthedList.less'

class UnauthedList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            searchParam: {
                type: 1,   // type 1 待认证列表 2 我已处理列表
                start_time: '',
                end_time: '',
                keyword: null,   // 选择 姓名或手机号
                value: '',   // 姓名或手机号 值
            },
            unauthedListInfo: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.page || 1,     // 当前第几页
            },
            start_date: null,  // moment对象
            end_date: null,
            showModal: false,  // 弹框
            approval_status: null, // 用户认证
            remark: '',   // 认证详情
            selectedMemberKeys: [],  // 选中的用户id数组
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
                title: '姓名',
                // dataIndex: 'nickname',
                key: 'nickname',
                width: '14%',
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
                width: '14%',
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
                width: '18%',
                render: (text, record) => {
                    return <RLTooltip placement="bottomLeft" title={record.company_name}>
                        <div className='line-clamp-noColor'>
                            {record.company_name}
                        </div>
                    </RLTooltip>
                }
            },
            {
                title: '提交时间',
                dataIndex: 'apply_time',
                key: 'apply_time',
                width: '14%'
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
                        {
                            interfaces.USER_APPROVE && <RLButton
                                type='link'
                                label='认证'
                                onClick={(e) => {
                                    this.approve(e, record)
                                }}
                            />
                        }
                    </div>
                )
            },
        ]

        // 选择框
        this.memberOptions = [
            { keyword: 'nickname', label: '姓名' },
            { keyword: 'mobile', label: '手机号' }
        ]
    }
    componentWillMount() {
        this.getUnauthedList()
    }
    // 待认证用户列表
    getUnauthedList({ page = this.state.unauthedListInfo.page } = { page: this.state.unauthedListInfo.page }) {
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
                    this.getUnauthedList({ page: page - 1 })
                } else {
                    let newState = {
                        unauthedListInfo: {
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
        const { keyword, value } = this.state.searchParam
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
                style={{ width: 200 }}
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
                //     this.getUnauthedList()
                // }}
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
                    this.getUnauthedList()
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
                            start_time: '',
                            end_time: ''
                        }
                    })
                }}
            />
        ])
    }
    // 列表操作按钮
    listOperate = () => {
        return ([
            interfaces.USER_APPROVE && <RLButton
                label='批量认证'
                type="primary"
                key='batchapprove'
                onClick={() => {
                    this.setState({
                        showModal: true
                    })
                }}
                style={{ marginRight: 20 }}
                disabled={this.state.selectedMemberKeys.length <= 0}
            />,
            <RLButton
                label='刷新' type='default'
                key='refresh'
                onClick={() => {
                    this.getUnauthedList()
                }}
            />
        ])
    }

    // 批量认证 方法
    batchApprove = (values) => {
        let { selectedMemberKeys: users } = this.state
        let { approval_status: status, remark } =values;
        actionUnauthedUserList.approvedOperate({
            users,
            status,
            remark
        }).then(res => {
            if (res.code === 200) {
                this.setState({
                    showModal: false
                }, () => {
                    this.getUnauthedList()
                })
                this.showToast({ type: 'success', content: '认证成功' })
            }
        })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('onSelectChange', selectedRowKeys)
        this.setState({
            selectedMemberKeys: selectedRowKeys
        })
    }
    pageChange = (page, pageSize) => {
        console.log('翻页了', page, pageSize)
        this.getUnauthedList({ page })
    }
    // 查看
    rowClick = (e, record) => {
        console.log('点击行----record:', record)
        this.props.changePage('detail', {
            uuid: record.uuid,
            approvalId: record.approval_id,
            tabKey: 'unauthed',
            page: this.state.unauthedListInfo.page
        })
    }
    // 认证
    approve = (e, record) => {
        this.props.changePage('approval', {
            uuid: record.uuid,
            tabKey: 'unauthed',
            page: this.state.unauthedListInfo.page
        })
    }

    render() {
        return (
            <div className='unauthed-user-content'>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLFilterTool rightItems={this.listOperate} />
                <RLTable
                    loading={this.state.getListLoading}
                    dataSource={this.state.unauthedListInfo.list}
                    rowKey='uuid'
                    columns={this.columns}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: this.onSelectChange,
                    }}
                    paginationInfo={{
                        total: this.state.unauthedListInfo.count,
                        pageSize: this.pageSize,
                        onChange: this.pageChange,
                        current: this.state.unauthedListInfo.page
                    }}
                />
                <RLModal
                    title='批量认证'
                    className='modal-approval'
                    maskClosable={false}
                    visible={this.state.showModal}
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            showModal: false
                        })
                    }}
                >
                    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <RLForm 
                            validateTrigger='onBlur'
                            initialValues={{approval_status: 1}}
                            onFinish={this.batchApprove}>
                            <RLFormItem
                                colon={false}
                                label="用户认证"
                                name='approval_status'
                                rules={[{
                                    required: true,
                                    message: '请选择是否同意'
                                }]}
                            >
                                <RLRadioGroup
                                    items={[
                                        { value: 1, label: '同意' },
                                        { value: 2, label: '拒绝' },
                                    ]} />
                            </RLFormItem>
                            <RLFormItem
                                colon={false}
                                label="认证详情"
                                name='remark'
                            >
                                <RLTextarea rows={4} />
                            </RLFormItem>
                            <RLFormItem>
                            <div className='modal-btnContainer'>
                                <RLButton label='取消'
                                    onClick={() => {
                                        this.setState({
                                            showModal: false
                                        })
                                    }}
                                />
                                <RLButton label='确定' type='primary'
                                    style={{ marginLeft: 50 }}
                                    htmlType="submit"
                                />
                            </div>
                    </RLFormItem>
                        </RLForm>
                    </div>
                </RLModal>
            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(UnauthedList)
