import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea, RLCheckbox } from '@components/index.js'
import actionUserList from '@actions/userManage/actionUserList.js'
import actionRoleManage from '@actions/userManage/actionRoleManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils, { downloadFile } from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import config from '@/config.js';
import { DatePicker, Input } from 'antd';
import axios from 'axios';

class UserList extends BaseCmp {
    constructor(props) {
        super(props)
        let select = [];
        let selectList = [];
        this.state = {
            searchParam: {  // 筛选用户列表项
                keyword: null,
                value: '',
                role_code: null,
                approval_state: null,
                start_date: '',
                end_date: ''
            },
            userListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.userPage || 1,     // 当前第几页
            },
            showSubForm: false,  // 是否显示专业版选择计划框
            selectedMemberKeys: [],  // 选中的用户
            corp_id: '',
            getListLoading: true,       // 获取列表loading,

            showAuthDetailModal: false,
            showBatchAuthModal: false,
            showBatchSMSModal: false,
            showBatchEmailModal: false,
            showDeleteConformModal: false,

            start_date: null,
            end_date: null,

            approval_detail: [],

            emailLoading: false,
            approvalLoading: false,
            allSelect: [...select],    //所有选择UUID集合
            allSelectList: [...selectList],   //所有选择列表集合
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'uuid',
                key: 'uuid',
                width: '10%',
                render: (text, record, index) => {
                    return <div>{(this.state.userListInfo.page - 1) * this.pageSize + index + 1}</div>
                }
            },
            {
                title: '姓名',
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
                title: '角色',
                dataIndex: 'role_name',
                key: 'role_name',
                width: '10%'
            },
            {
                title: '手机号',
                key: 'mobile',
                width: '12%',
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
                title: '机构名称',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '12%'
            },
            {
                title: '认证状态',
                key: 'status',
                width: '12%',
                render: (text, record) => {
                    return <div>
                        <div style={{ color: this.getColor(record.approval_status) }}> {record.approval_status_desc} </div>
                        {record.approval_status === 3 || record.approval_status === 4 ?
                            <div style={{ color: '#8F1D22', cursor: 'pointer' }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    actionUserList.getApprovalDetail(record.uuid).then(res => {
                                        if (res.code === 200) {
                                            this.setState({
                                                approval_detail: res.data.approval,
                                                showAuthDetailModal: true
                                            })
                                        } else {
                                            this.showToast({ type: 'error', content: '获取认证详情失败' });
                                        }
                                    }).catch(err => {
                                        this.showToast({ type: 'error', content: '获取认证详情失败' });
                                    });
                                }}>
                                认证详情
                            </div> : null}
                    </div>
                }
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '12%'
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
                                    e.stopPropagation()
                                    this.props.changePage('detail', {
                                        userId: record.uuid,
                                        userPage: this.state.userListInfo.page
                                    })
                                }}
                                style={{ color: '#8F1D22' }}
                            />
                        }
                        {
                            interfaces.USER_EDIT &&
                            record.role_code !== 'admin' &&
                            record.approval_status !== 4 &&
                            <RLButton
                                type='link'
                                label='编辑'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('edit', {
                                        userId: record.uuid,
                                        userPage: this.state.userListInfo.page
                                    })
                                }}
                                style={{ color: '#8F1D22' }}
                            />
                        }
                        {
                            interfaces.USER_DELETE &&
                            record.role_code !== 'admin' &&
                            (
                                <RLButton
                                    type='link' label='删除'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.delUser(record)
                                    }}
                                    style={{ color: '#8F1D22' }}
                                />
                            )
                        }
                    </div>
                )
            },
        ]
        this.approve_culumns = [
            {
                title: '审核员',
                dataIndex: 'approval_operator',
                key: 'approval_operator',
                width: '20%'
            },
            {
                title: '审核时间',
                dataIndex: 'approval_time',
                key: 'approval_time',
                width: '30%'
            },
            {
                title: '审核结果',
                dataIndex: 'operate_status',
                key: 'operate_status',
                width: '15%',
                render: (text, record, index) => {
                    return (<span style={{ color: record.operate_status === 1 ? '#09b391' : '#000000' }}>
                        {record.operate_status === 1 ? '已同意' : '已拒绝'}
                    </span>)
                }
            },
            {
                title: '认证详情',
                dataIndex: 'remark',
                key: 'remark',
                width: '35%'
            },
        ];
        this.getUserList();
        if (!this.props.roleList.length) {
            actionRoleManage.getAllRoles().then(res => {
                if (res.code === 200) {

                } else {

                }
            })
        }
    }
    componentWillMount() {
    }
    componentWillUnmount() {

    }
    batchExport = () => {
        actionUserList.userExport(this.state.allSelect).then(res => {
            if (res.code === 200) {
                downloadFile(res.data, '用户名单.xlsx');
                this.setState({
                    allSelect: [],
                    allSelectList: []
                })
            }

        }).catch(err => {
            console.log(err);
        });
    }
    batchApprove = (values) => {
        this.setState({
            approvalLoading: true
        });
        return actionUserList.userApprove({
            status: values.status,
            remark: values.remark || '',
            users: this.state.allSelect
        }).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '认证成功' });
                this.setState({
                    showBatchAuthModal: false,
                    allSelect: [],
                    allSelectList: []
                });
                this.getUserList();
            } else {
                this.showToast({ type: 'error', content: '认证失败' });
                this.setState({
                    showBatchAuthModal: false
                })
            }
            this.setState({
                approvalLoading: true
            });
        }).catch(err => {
            this.showToast({ type: 'error', content: err.msg });
            this.setState({
                showBatchAuthModal: false
            });
            this.setState({
                approvalLoading: true
            });
        })
    }
    batchSendEmail = (values) => {
        this.setState({
            emailLoading: true
        });
        actionUserList.sendEmail({ ...values, users: this.state.allSelect }).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '邮件发送成功！' });
                this.setState({
                    showBatchEmailModal: false,
                    allSelect: [],
                    allSelectList: []
                });
            } else {
                this.showToast({ type: 'error', content: '请求失败' });
                this.setState({
                    showBatchEmailModal: false
                });
            }
            this.setState({
                emailLoading: false
            });
        }).catch(err => {
            this.showToast({ type: 'error', content: '请求失败' });
            this.setState({
                showBatchEmailModal: false
            });
            this.setState({
                emailLoading: false
            });
        })
    }
    // 删除用户
    delUser = (record) => {
        let is_batch = !record;
        let users = is_batch ? this.state.allSelect : [record.uuid];
        this.showModal({
            content: <div>
                <div>确认删除后，员工信息将被销毁，将不可登录应用，是否确认删除?</div>
                <RLCheckbox
                    label="清空用户数据"
                    defaultChecked={true}
                />
            </div>,
            title: `确定删除${is_batch ? '选中的' : '该'}用户?`,
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                return this.userDelConfirm(users)
            },
            onCancel: () => { },
            size: 'big'
        })
    }

    userDelConfirm = (users) => {

        return actionUserList.userDel(users).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' })
                this.setState({
                    allSelect: [],
                    allSelectList: []
                });
                this.getUserList();
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }

    getUserList({ page = this.state.userListInfo.page } = { page: this.state.userListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionUserList.getUserList({
            keyword: this.state.searchParam.keyword || '',
            value: this.state.searchParam.value || '',
            role_code: this.state.searchParam.role_code || '',
            approval_status: this.state.searchParam.approval_state || '',
            start_time: this.state.searchParam.start_date || '',
            end_time: this.state.searchParam.end_date || '',
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.data && res.data.list.length === 0 && page > 1) {
                    this.getUserList({ page: page - 1 })
                } else {
                    let newState = {
                        getListLoading: false,
                        userListInfo: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        }
                    }
                    if (res.data.list && res.data.list[0]) {
                        newState.corp_id = res.data.list[0].corp_id
                    }
                    this.setState(newState);
                }
            }
        }).finally(() => {
            // this.setState({
            //     getListLoading: false
            // })
        })
    }

    getLeftItems = () => {
        return (
            [
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <span style={{ marginRight: 5 }}>从</span>
                    <RLDatePicker placeholder="请选择日期"
                        allowClear
                        ref={c => this.startDateInput = c}
                        picker="date"
                        style={{ width: 130, marginRight: 5 }}
                        format="YYYY-MM-DD"
                        value={this.state.start_date}
                        onChange={(val, dateString) => {
                            this.setState({
                                start_date: val,
                                searchParam: {
                                    ...this.state.searchParam,
                                    start_date: dateString
                                }
                            })
                        }} />
                    <span style={{ marginRight: 5 }}>至</span>
                    <RLDatePicker placeholder="请选择日期"
                        allowClear
                        ref={c => this.endDateInput = c}
                        picker="date"
                        style={{ width: 130, marginRight: 20 }}
                        format="YYYY-MM-DD"
                        value={this.state.end_date}
                        onChange={(val, dateString) => {
                            this.setState({
                                end_date: val,
                                searchParam: {
                                    ...this.state.searchParam,
                                    end_date: dateString
                                }
                            })
                        }} />
                </div>,
                <RLSelect
                    ref={c => this.keywordInput = c}
                    allowClear
                    options={[
                        {
                            label: '手机号',
                            value: 'mobile'
                        },
                        {
                            label: '姓名',
                            value: 'nickname'
                        },
                        {
                            label: '邮箱',
                            value: 'email'
                        }
                    ]}
                    style={{ width: 100, marginRight: 20 }}
                    placeholder='请选择'
                    value={this.state.searchParam.keyword}
                    onChange={(val) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                keyword: val
                            }
                        })
                    }}
                    key='type'
                />,
                <RLInput
                    ref={c => this.valueInput = c}
                    placeholder='请输入'
                    allowClear
                    key='keyword'
                    style={{ width: 150, marginRight: 20 }}
                    value={this.state.searchParam.value}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                value: e.target.value
                            }
                        })
                    }}
                />,
                <RLSelect
                    ref={c => this.roleInput = c}
                    allowClear
                    options={[...this.props.roleList]}
                    style={{ width: 150, marginRight: 20 }}
                    placeholder='请选择角色类型'
                    valuekey='role_code'
                    labelkey='role_name'
                    value={this.state.searchParam.role_code}
                    onChange={(val) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                role_code: val
                            }
                        })
                    }}
                    key='type'
                />,
                <RLSelect
                    ref={c => this.stateInput = c}
                    allowClear
                    options={config.approvalStatus}
                    style={{ width: 150, marginRight: 20 }}
                    placeholder='请选择认证状态'
                    value={this.state.searchParam.approval_state}
                    onChange={(val) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                approval_state: val
                            }
                        })
                    }}
                    key='type'
                />,

                <RLButton label='搜索'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.getUserList();
                    }}
                    style={{ marginRight: 20 }}
                />,

                <RLButton label='重置'
                    key='add'
                    onClick={() => {
                        this.setState({
                            start_date: null,
                            end_date: null,
                            searchParam: {
                                keyword: null,
                                value: '',
                                role_code: null,
                                approval_state: null,
                                start_date: '',
                                end_date: ''
                            }
                        }, () => {
                            this.getUserList();
                        });
                    }}
                    style={{ marginRight: 20 }} />,
                <RLButton />
            ]
        )
    }

    getRightItems = () => {
        return (
            [
                interfaces.USER_ADD && <RLButton
                    label='新增用户'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.props.changePage('edit', {
                            userPage: this.state.userListInfo.page
                        })
                    }}
                    style={{ marginLeft: 20 }}
                />,
                interfaces.USER_IMPORT && <RLButton
                    type="default"
                    label="批量导入"
                    key="batch_import"
                    onClick={() => {
                        this.props.changePage('batch_import', {
                            userPage: this.state.userListInfo.page
                        });
                    }}
                    style={{ marginLeft: 20 }}
                />,
                interfaces.USER_EXPORT && <RLButton
                    type="default"
                    label="批量导出"
                    key="batch_export"
                    onClick={() => {
                        this.batchExport();
                    }}
                    disabled={this.state.allSelectList.length <= 0}
                    style={{ marginLeft: 20 }}
                />,
                interfaces.USER_APPROVE && <RLButton
                    type="default"
                    label="批量认证"
                    key="batch_approve"
                    onClick={() => {
                        this.setState({ showBatchAuthModal: true })
                    }}
                    disabled={this.state.allSelectList.length <= 0}
                    style={{ marginLeft: 20 }}
                />,
                interfaces.USER_DELETE && <RLButton
                    type="default"
                    label="批量删除"
                    key="batch_delete"
                    onClick={() => {
                        this.delUser();
                    }}
                    disabled={this.state.allSelectList.length <= 0}
                    style={{ marginLeft: 20 }}
                />,
                interfaces.USER_SEND_EMAIL && <RLButton
                    type="default"
                    label="群发邮件"
                    key="batch_email"
                    onClick={() => {
                        this.setState({ showBatchEmailModal: true });
                    }}
                    disabled={this.state.allSelectList.length <= 0}
                    style={{ marginLeft: 20 }}
                />,
            ]
        )
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let i = 0;
        let currentPage = this.state.userListInfo.list;
        let allSelect = [...this.state.allSelect];
        let allSelectList = [...this.state.allSelectList];
        for (i; i < currentPage.length; i++) {
            let isInSelect = selectedRowKeys.findIndex(ele => { return ele == currentPage[i].uuid })
            let isInOrigin = allSelect.findIndex(ele => { return ele == currentPage[i].uuid })
            let isInList = allSelectList.findIndex(ele => { return ele.uuid == currentPage[i].uuid })
            if (isInSelect === -1 && isInOrigin !== -1) {
                allSelect.splice(isInOrigin, 1);
                if (isInList !== -1) {
                    allSelectList.splice(isInList, 1);
                }
            } else if (isInSelect !== -1 && isInOrigin === -1) {
                allSelect.push(selectedRowKeys[isInSelect]);
                if (isInList === -1) {
                    allSelectList.push(currentPage[i]);
                }
            }
            this.setState({
                allSelect: [...allSelect],
                allSelectList: [...allSelectList]
            })
        }
    }
    pageChange = (page, pageSize) => {
        this.getUserList({ page })
    }

    getColor(code) {
        switch (code) {
            case 1: //未提交
                return '#216BFF';
            case 2: //待认证
                return '#FF8921';
            case 3: //已同意
                return '#999999';
            case 4: //已拒绝
                return 'DB0B00';
            default:
                return '';
        }
    }
    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='content-user'>
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={[]} />
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.userListInfo.list}
                        rowKey='uuid'
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
                            // selectedRowKeys: this.state.allSelectList,
                            total: this.state.userListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.userListInfo.page
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
                    {this.state.showAuthDetailModal && <RLModal
                        title="认证详情"
                        visible={this.state.showAuthDetailModal}
                        width="640px"
                        height="480px"
                        footer={null}
                        onCancel={() => {
                            this.setState({
                                showAuthDetailModal: false
                            })
                        }}>
                        <div style={{}}>
                            <RLTable
                                columns={this.approve_culumns}
                                dataSource={this.state.approval_detail}
                                rowKey='uuid'
                            />
                        </div>
                    </RLModal>}
                    {this.state.showBatchAuthModal && <RLModal
                        title="批量认证"
                        visible={this.state.showBatchAuthModal}
                        footer={null}
                        width={640}
                        onCancel={() => {
                            this.setState({
                                showBatchAuthModal: false
                            })
                        }}>
                        <div style={{}}>
                            <RLForm onFinish={this.batchApprove} validateTrigger='onBlur' initialValues={{ status: 1 }}>
                                <RLFormItem label="用户认证" name="status" colon={false}>
                                    <RLRadioGroup
                                        items={[
                                            { value: 1, label: '同意' },
                                            { value: 2, label: '拒绝' },
                                        ]} />
                                </RLFormItem>
                                <RLFormItem label="认证详情" name="remark" rules={[]}>
                                    <RLTextarea placeholder="请输入认证详情" style={{ width: 508, height: 219 }} />
                                </RLFormItem>
                                <RLFormItem>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                        <RLButton label="取消"
                                            onClick={() => {
                                                this.setState({
                                                    showBatchAuthModal: false
                                                })
                                            }}
                                            style={{ marginRight: 40 }} />
                                        <RLButton label="确定"
                                            type="primary"
                                            htmlType="submit" 
                                            loading={this.state.approvalLoading}
                                        />
                                    </div>
                                </RLFormItem>
                            </RLForm>
                        </div>
                    </RLModal>}
                    {this.state.showBatchEmailModal && <RLModal
                        title="群发邮件"
                        visible={this.state.showBatchEmailModal}
                        footer={null}
                        width={640}
                        onCancel={() => {
                            this.setState({
                                showBatchEmailModal: false
                            })
                        }}>
                        <div style={{}}>
                            <RLForm onFinish={this.batchSendEmail}>
                                <RLFormItem label="邮件主题" name="title"
                                    rules={[{
                                        required: true,
                                        message: '请输入邮件标题'
                                    }]}>
                                    <RLInput name="" placeholder="请输入通知栏标题" style={{ width: 360 }} />
                                </RLFormItem>
                                <RLFormItem label="邮件内容" name="content"
                                    rules={[{
                                        required: true,
                                        message: '请输入邮件内容'
                                    }]}>
                                    <Input.TextArea name="" placeholder="请输入邮件内容" style={{ width: 508, height: 219 }} />
                                </RLFormItem>
                                <div style={{ fontSize: 12, color: '#666666', marginLeft: 80, marginTop: -5 }}>邮件内容不能为空，长度限不能超过4000个字符</div>
                                <RLFormItem>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                        <RLButton label="取消"
                                            type="normal"
                                            onClick={() => { this.setState({ showBatchEmailModal: false }) }}
                                            style={{ marginRight: 40 }} />
                                        <RLButton label="确定"
                                            htmlType="submit"
                                            type="primary" 
                                            loading={this.state.emailLoading}
                                        />
                                    </div>
                                </RLFormItem>
                            </RLForm>
                        </div>
                    </RLModal>}
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        roleList: store.roleManage.roleList,
    }
})(UserList)