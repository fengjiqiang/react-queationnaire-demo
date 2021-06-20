import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup } from '@components/index.js'
import actionUserList from '@actions/userManage/actionUserList.js'
import actionRoleManage from '@actions/userManage/actionRoleManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import { DatePicker, Input } from 'antd';

class RoleList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            roleListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.rolePage || 1,     // 当前第几页
            },
            selectedMemberKeys: [],  // 选中的用户
            getListLoading: true,       // 获取列表loading,
        }
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'role_name',
                key: 'role_name',
                width: '15%',
            },
            {
                title: '角色说明',
                dataIndex:'role_desc',
                key: 'role_desc',
                width: '20%',
            },
            {
                title: '用户数',
                dataIndex: 'user_count',
                key: 'user_count',
                width: '10%'
            },
            {
                title: '更新时间',
                dataIndex: 'updated_at',
                key: 'updated_at',
                width: '15%',
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '40%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            <RLButton
                                type='link'
                                label='查看'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('detail', {
                                        roleId: record.uuid,
                                        rolePage: this.state.roleListInfo.page,
                                        roleDetail: {
                                            role_name: record.role_name,
                                            role_desc: record.role_desc,
                                            auth: record.auth,
                                        }
                                    })
                                }}
                            />
                        }
                        {
                            interfaces.ROLE_EDIT && 
                            record.role_code !== 'admin' && 
                            <RLButton
                                type='link'
                                label='编辑'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('edit',{
                                        roleId: record.role_code,
                                        rolePage: this.state.roleListInfo.page,
                                        roleDetail: {
                                            role_name: record.role_name,
                                            role_desc: record.role_desc,
                                            role_code: record.role_code,
                                            auth: record.auth,
                                        }
                                    })
                                }}
                            />
                        }
                        {
                            interfaces.ROLE_SEARCH &&
                            <RLButton
                                type='link'
                                label='查看用户'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('member',{
                                        role_code: record.role_code,
                                        rolePage: this.state.roleListInfo.page,
                                        role_name: record.role_name,
                                        role_desc: record.role_desc,
                                    })
                                }}
                            />
                        }
                        {
                            interfaces.ROLE_DELETE &&
                            record.role_code !== 'admin'  && record.role_code !== 'apply_admin' && record.role_code !== 'audit_admin' &&
                            record.role_code !== 'ordinary' && 
                            (
                                <RLButton
                                    type='link' label='删除'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.delRole(record)
                                    }}
                                />
                            )
                        }
                    </div>
                )
            },
        ];
        this.getRoleList(); 
    }
    componentWillMount() {
        
    }
    componentWillUnmount() {
        // eventBus.removeListener('userlist-tab-change')
    }

    getRoleList({ page = this.state.roleListInfo.page } = { page: this.state.roleListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionRoleManage.getRoleList({
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.data && res.data.list.length === 0 && page > 1) {
                    this.getRoleList({ page: page - 1 })
                } else {

                    this.setState({
                        roleListInfo: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        }
                    });
                }

            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }

    delRole = (record) => {
        this.showModal({
            content: '角色删除后，该角色下的用户将被设置成普通用户，并将同步删除该角色下的用户所分配的权限，删除后信息不可恢复。',
            title: '是否删除该角色？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                return this.roleDelConfirm(record.role_code)
            },
            onCancel: () => { },
            size: 'big'
        })
    }
    
    roleDelConfirm = (role_code) => {

        return actionRoleManage.deleteRole({role_code}).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' })
                this.getRoleList()
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }
  
    getRightItems = () => {
        return (
            [
                interfaces.ROLE_ADD && <RLButton
                    label='+创建角色'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.props.changePage('edit')
                    }}
                    style={{ marginRight: 0 }}
                />,
            ]
        )
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedMemberKeys: selectedRowKeys,
        })
    }
    pageChange = (page, pageSize) => {
        this.getRoleList({ page })
    }

    render() {
        return (
            <WindowContainer >
                <div className='content-user'>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems}/>
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.roleListInfo.list}
                        rowKey='uuid'
                        columns={this.columns}
                        // rowSelection={{
                        //     type: 'checkbox',
                        //     onChange: this.onSelectChange,
                        //     getCheckboxProps: (record) => ({
                        //         disabled: false
                        //     })
                        // }}
                        paginationInfo={{
                            total: this.state.roleListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.roleListInfo.page
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
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        // roleList: store.roleManage.roleList,
    }
})(RoleList)