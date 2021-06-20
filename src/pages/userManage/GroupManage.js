import React from 'react'
import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import {
    RLTable, RLButton, RLFilterTool, RLModal, RLForm, RLFormItem, RLInput, RLDropdown, RLSelect, RLTooltip
} from '@components/index.js'
import actionGroupManage from '@actions/userManage/actionGroupManage.js'
import AddGroupUser from './components/groupManage/AddGroupUser.js'
import AddUser from '@/pages/common/meeting/AddUser.js'
import interfaces from '@/api/interfaces'
import './GroupManage.less'
import images from '@/libs/images/index.js'

const commonImg = images.commonImg

class GroupManage extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            empty: true, //成员组是否为空
            // 群组列表
            groupList: {
                uuid: '',   // 修改群组（用户组成员修改群组）
                data: []
            },
            // 群组成员列表
            groupUserList: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1      // 当前第几页
            },
            // 非当前组成员列表
            addGroupUserList: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1      // 当前第几页
            },
            more_group: {
                uuid: '',   // 用户组id--点击左侧‘三个点’
                title: '',   // 用户组title--点击左侧‘三个点’
            },
            group_uuid: '',   // 用户组id--点击左侧列表群组名称
            group_title: '',   // 用户组名称--点击左侧列表群组名称
            // 弹框
            showModal: {
                ADD_GROUP: false,   // 新建群组弹框
                EDIT_GROUP: false,   // 编辑群组（群组名称修改）弹框
                ADD_GROUP_USER: false,   // 添加成员
                EDIT_GROUP_USER: false   // 修改群组（用户组成员修改群组）弹框
            },
            userList: [],   // 成员列表
            selectUser: [],
            addUserConfig: {
                showSelectGroup: false,
                selectType: 'checkbox',
                originCanCancel: true,
                returnStyle: 'object',
                mustIdent: true
            },
            selectedMemberKeys: [],   // 选中的用户
            getListLoading: true   // 获取列表loading
        }

        this.addGroupForm = React.createRef()
        this.editGroupForm = React.createRef()
        this.editGroupUserForm = React.createRef()

        // table 字段
        this.columns = [
            {
                title: '序号',
                dataIndex: 'uuid',
                key: 'uuid',
                width: '10%',
                render: (text, record, index) => {
                    return (<div>
                        {(this.state.groupUserList.page - 1) * this.pageSize + index + 1}
                    </div>)
                }
            },
            {
                title: '姓名',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '14%'
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
                width: '14%'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: '18%'
            },
            {
                title: '机构名称',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '20%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.company_name}>
                    <div className='line-clamp-noColor'>
                        {record.company_name}
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
                            <RLButton
                                type='link'
                                label='删除'
                                onClick={(e) => {
                                    console.log('record', record)
                                    this.showModal({
                                        title: '是否移除该用户？',
                                        content: '确认删除后，该用户将被移除此群组，是否确认删除？',
                                        className: 'group-confirm-modal',
                                        okText: '确认',
                                        cancelText: '取消',
                                        onOk: () => {
                                            this.removeGroupUserConfirm(this.state.group_uuid, [record.uuid])
                                        },
                                        onCancel: () => { },
                                        size: 'small'
                                    })
                                }}
                            />
                        }
                    </div>
                )
            },
        ]
    }
    componentDidMount() {
        this.getGroupList(true);
        // this.getGroupUserList()
    }

    // 获取群组列表
    getGroupList() {
        this.setState({
            getListLoading: true
        })
        actionGroupManage.getGroupUserList({
            type: 'group'
        }).then(res => {
            if (res.code === 200) {
                let isEmpty = res.data.length === 0;
                let item = res.data.find(item => item.uuid === this.state.groupList.uuid);

                //如果当前群组为空
                if(isEmpty){
                    this.setState({
                        empty: true,
                        group_uuid: '',
                        group_title: '',
                        groupList: {
                            uuid: '',
                            data: []
                        }
                    });
                }
                //群组非空，并且当前已选中的群组不存在
                else if( !isEmpty && !item && !this.state.groupList.uuid){
                    this.setState({
                        empty: false,
                        group_uuid: res.data[0].uuid,
                        group_title: res.data[0].title,
                        groupList: {
                            uuid: res.data[0].uuid,
                            data: res.data
                        }
                    }, () => {
                        this.getGroupUserList();
                    });
                }
                //群组非空，并且当前选中的群组存在
                else if(!isEmpty && item){
                    this.setState({
                        empty: false,
                        group_uuid: item.uuid,
                        group_title: item.title,
                        groupList: {
                            uuid: item.uuid,
                            data: res.data
                        }
                    })
                }
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }

    // 获取群组成员列表
    getGroupUserList({ page = this.state.groupUserList.page } = { page: this.state.groupUserList.page }) {
        this.setState({
            getListLoading: true
        })
        actionGroupManage.getGroupUserList({
            type: 'user',
            uuid: this.state.group_uuid,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.data.list.length === 0 && page > 1) {
                    this.getGroupUserList({ page: page - 1 })
                } else {
                    let newState = {
                        groupUserList: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        },
                        userList: res.data.list
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

    // 获取非当前组成员列表
    getAddGroupUserList({ page = this.state.addGroupUserList.page } = { page: this.state.addGroupUserList.page }) {
        this.setState({
            getListLoading: true
        })
        actionGroupManage.getGroupUserList({
            type: 'add',
            uuid: this.state.group_uuid,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.data.list.length === 0 && page > 1) {
                    this.getGroupUserList({ page: page - 1 })
                } else {
                    let newState = {
                        addGroupUserList: {
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

    // 新建群组
    addGroupConfirm = (value) => {
        console.log('value', value)
        actionGroupManage.groupAdd({
            title: value.title
        }).then(res => {
            if (res.code === 200) {
                this.setState({
                    showModal: {
                        ...this.state.showModal,
                        ADD_GROUP: false
                    }
                }, () => {
                    this.getGroupList();
                })
                this.showToast({ type: 'success', content: '创建成功' })
            } else {
                this.showToast({ type: 'error', content: '创建失败' })
            }
        })
    }

    // 编辑群组（群组名称修改）
    editGroupConfirm = (value) => {
        console.log('value', value)
        actionGroupManage.groupEdit({
            uuid: this.state.more_group.uuid,
            title: value.title
        }).then(res => {
            if (res.code === 200) {
                this.setState({
                    showModal: {
                        ...this.state.showModal,
                        EDIT_GROUP: false
                    }
                }, () => {
                    this.getGroupList();
                })
                this.showToast({ type: 'success', content: '修改成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 删除群组
    removeGroupConfirm = (uuid) => {
        actionGroupManage.groupRemove({
            uuid
        }).then(res => {
            if (res.code === 200) {
                this.getGroupList()
                this.showToast({ type: 'success', content: '删除成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 用户组人员移除
    removeGroupUserConfirm = (group_uuid, users) => {
        actionGroupManage.groupUserRemove({
            group_uuid,
            users
        }).then(res => {
            if (res.code === 200) {
                this.getGroupUserList()
                // 清除选中
                this.setState({
                    selectedMemberKeys: []
                })
                this.showToast({ type: 'success', content: '移除成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 修改群组（用户组成员修改群组）
    editGroupUserConfirm = (value) => {
        const { selectedMemberKeys } = this.state
        actionGroupManage.groupUserEdit({
            group_uuid: value.group_uuid,
            current: this.state.group_uuid,
            users: selectedMemberKeys
        }).then(res => {
            if (res.code === 200) {
                this.setState({
                    selectedMemberKeys: [],   // 清除选中
                    showModal: {
                        ...this.state.showModal,
                        EDIT_GROUP_USER: false
                    }
                }, () => {
                    this.getGroupUserList()
                })
                this.showToast({ type: 'success', content: '修改成功' })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    // 新建群组弹框渲染
    renderAddGroup = () => {
        const { ADD_GROUP } = this.state.showModal
        return (
            <RLModal
                title='新建群组'
                className='modal-approval'
                maskClosable={false}
                visible={ADD_GROUP}
                footer={null}
                onCancel={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            ADD_GROUP: false
                        }
                    })
                }}
            >
                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <RLForm
                        validateTrigger='onBlur'
                        onFinish={this.addGroupConfirm}
                        ref={this.addGroupForm}
                    >
                        <RLFormItem
                            colon={false}
                            label="群组名称"
                            name='title'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入群组名称',
                                },
                                {
                                    max: 20,
                                    message: '群组名称最多20个字符'
                                }
                            ]}
                        >
                            <RLInput
                                placeholder='请输入群组名称'
                                onChange={(e) => {
                                    
                                }}
                            >
                            </RLInput>
                        </RLFormItem>
                    </RLForm>
                </div>
                <div className='modal-btnContainer'>
                    <RLButton label='取消'
                        onClick={() => {
                            this.setState({
                                showModal: {
                                    ...this.state.showModal,
                                    ADD_GROUP: false
                                }
                            })
                        }}
                    />
                    <RLButton
                        label='确定'
                        type='primary'
                        style={{ marginLeft: 50 }}
                        onClick={() => {
                            this.addGroupForm.current.submit()
                        }}
                    />
                </div>
            </RLModal>
        )
    }

    // 编辑群组（群组名称修改）弹框渲染
    renderEditGroup = () => {
        const { EDIT_GROUP } = this.state.showModal
        return (
            <RLModal
                title='编辑群组'
                className='modal-approval'
                maskClosable={false}
                visible={EDIT_GROUP}
                footer={null}
                onCancel={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            EDIT_GROUP: false
                        }
                    })
                }}
            >
                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <RLForm
                        validateTrigger='onBlur'
                        onFinish={this.editGroupConfirm}
                        initialValues={this.state.more_group}
                        ref={this.editGroupForm}
                    >
                        <RLFormItem
                            colon={false}
                            label="群组名称"
                            name='title'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入群组名称',
                                },
                                {
                                    max: 20,
                                    message: '群组名称最多20个字符'
                                }
                            ]}
                        >
                            <RLInput
                                placeholder='请输入群组名称'
                                defaultValue={this.state.more_group.title}
                                onChange={(e) => {

                                }}
                            >
                            </RLInput>
                        </RLFormItem>
                    </RLForm>
                </div>
                <div className='modal-btnContainer'>
                    <RLButton label='取消'
                        onClick={() => {
                            this.setState({
                                showModal: {
                                    ...this.state.showModal,
                                    EDIT_GROUP: false
                                }
                            })
                        }}
                    />
                    <RLButton
                        label='确定'
                        type='primary'
                        style={{ marginLeft: 50 }}
                        onClick={() => {
                            this.editGroupForm.current.submit()
                        }}
                    />
                </div>
            </RLModal>
        )
    }

    // 修改群组（用户组成员修改群组）弹框渲染
    renderEditGroupUser = () => {
        const { EDIT_GROUP_USER } = this.state.showModal
        const { uuid, data} = this.state.groupList
        return (
            <RLModal
                title='修改群组'
                className='modal-approval'
                maskClosable={false}
                visible={EDIT_GROUP_USER}
                footer={null}
                onCancel={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            EDIT_GROUP_USER: false
                        }
                    })
                }}
            >
                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <RLForm
                        validateTrigger='onBlur'
                        onFinish={this.editGroupUserConfirm}
                        ref={this.editGroupUserForm}
                    >
                        <RLFormItem
                            colon={false}
                            label="选择群组"
                            name='group_uuid'
                            rules={[
                                {
                                    required: true,
                                    message: '请选择群组',
                                }
                            ]}
                        >
                            <RLSelect
                                options={data}
                                placeholder='请选择群组'
                                valuekey='uuid'
                                labelkey='title'
                                value={uuid}
                            />
                        </RLFormItem>
                    </RLForm>
                </div>
                <div className='modal-btnContainer'>
                    <RLButton label='取消'
                        onClick={() => {
                            this.setState({
                                showModal: {
                                    ...this.state.showModal,
                                    EDIT_GROUP_USER: false
                                }
                            })
                        }}
                    />
                    <RLButton
                        label='确定'
                        type='primary'
                        style={{ marginLeft: 50 }}
                        onClick={() => {
                            this.editGroupUserForm.current.submit()
                        }}
                    />
                </div>
            </RLModal>
        )
    }

    // 左侧群组名称后的‘更多’操作
    leftMoreOperate = (item) => {
        let btns = [];
        if(interfaces.GROUNP_EDIT){
            btns.push({ label: '编辑群组', key: 'edit', value: item.uuid });
        }
        if(interfaces.GROUP_DELETE){
            btns.push({ label: '删除群组', key: 'remove', value: item.uuid })
        }
        return (
            <RLDropdown
                subBtns={btns}
                label={
                    <img alt=''
                        style={{ height: 16, width: 16, marginRight: 3, cursor: 'pointer' }}
                        src={commonImg.more}
                    />
                }
                onClick={(e, key, value) => {
                    e.stopPropagation()
                    const groupObj = this.state.groupList.data.find(item => item.uuid === value)
                    switch (key) {
                        case 'edit':
                            // 编辑群组（群组名称修改）
                            this.setState({
                                more_group: {
                                    title: (groupObj && groupObj.title) || '',
                                    uuid: value
                                },
                                showModal: {
                                    ...this.state.showModal,
                                    EDIT_GROUP: true
                                }
                            })
                            break
                        case 'remove':
                            // 删除群组
                            this.showModal({
                                title: '是否删除该群组？',
                                content: '确认删除后，该群组将被解散，是否确认删除？',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () => {
                                    this.removeGroupConfirm(value)
                                },
                                onCancel: () => { },
                                size: 'small'
                            })
                            break
                        default:
                            break
                    }
                }}
            />
        )
    }

    // 左侧群组列表及操作
    leftGroup = () => {
        return (
            <div style={{ width: 220, borderRight: '1px solid #e5e5e5' }}>
                <div className="groupManageTitle" >
                    <div style={{ fontSize: 18, fontWeight: '400', color: '#333333' }}>群组管理</div>
                    { 
                        interfaces.GROUNP_ADD && <img alt=''
                            style={{ height: 16, width: 16, cursor: 'pointer' }}
                            src={commonImg.add}
                            onClick={(e) => {
                                // 新建群组
                                this.setState({
                                    showModal: {
                                        ...this.state.showModal,
                                        ADD_GROUP: true
                                    }
                                })
                            }}
                        />
                    }
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {
                        this.state.groupList.data.map(item => {
                            return <div className={item.uuid === this.state.group_uuid ? 'groupRow active': 'groupRow'}
                                onClick={(e) => {
                                    this.setState({
                                        group_uuid: item.uuid,
                                        group_title: item.title
                                    }, () => {
                                        this.getGroupUserList()
                                    })
                                }}
                            >
                                <img alt=''
                                    style={{ marginLeft: 16, marginRight: 10, height: 16, width: 16 }}
                                    src={commonImg.groupUser}
                                />
                                <span style={{ flex: 1, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {item.title}
                                </span>
                                { (interfaces.GROUNP_EDIT || interfaces.GROUP_DELETE) && this.leftMoreOperate(item) }
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }

    // 列表操作按钮
    getLeftItems = () => {
        const { group_uuid, selectedMemberKeys } = this.state
        return ([
            interfaces.GROUNP_PARTICIPANT_ADD && <RLButton
                label='+添加成员'
                type='primary'
                key='add'
                onClick={() => {
                    this.toggleAddGroupUserModal()
                }}
                style={{ marginRight: 10 }}
            />,
            interfaces.LWM_REMOVE_GROUNP_PARTICIPANT_ADD && <RLButton
                label='移除成员'
                type='default'
                key='remove'
                disabled={selectedMemberKeys.length <= 0}
                onClick={() => {
                    this.showModal({
                        title: '是否移除该用户？',
                        content: '确认删除后，该用户将被移除此群组，是否确认删除？',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            this.removeGroupUserConfirm(group_uuid, selectedMemberKeys)
                        },
                        onCancel: () => {},
                        size: 'small'
                    })
                }}
                style={{ marginRight: 10 }}
            />,
            interfaces.LWM_EDIT_GROUNP_PARTICIPANT_ADD && <RLButton
                label='修改群组'
                type='default'
                key='edit'
                disabled={selectedMemberKeys.length <= 0}
                onClick={() => {
                    this.setState({
                        showModal: {
                            ...this.state.showModal,
                            EDIT_GROUP_USER: true
                        }
                    })
                }}
            />
        ])
    }

    // 成员添加
    addSuccess = (data) => {
        let originUsers = this.state.userList
        let returnUsers = data.map(item => {
            return {
                'id': item.id,
                'uuid': item.uuid,
                'nickname': item.nickname
            }
        })
        let newUsers = []
        for (let user of returnUsers) {
            let index = originUsers.findIndex(item => item.id === user.id)
            if (index < 0) {
                newUsers.push(user)
            }
        }
        let finalUsers = originUsers.concat(newUsers)
        let userArr = []
        for (let user of finalUsers) {
            userArr.push(user.uuid)
        }
        console.log(`userArr--------------`, userArr)
        this.setState({
            userList: finalUsers,
            selectUser: userArr
        }, () => {
            actionGroupManage.groupUserAdd({
                group_uuid: this.state.group_uuid,
                users: this.state.selectUser
            }).then(res => {
                if (res.code === 200) {
                    this.getGroupUserList()
                    this.showToast({ type: 'success', content: '添加成功' })
                } else {
                    this.showToast({ type: 'error', content: res.msg })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        })

    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
        this.setState({
            selectedMemberKeys: selectedRowKeys
        })
    }

    pageChange = (page, pageSize) => {
        console.log('翻页了', page, pageSize)
        this.getGroupUserList({ page })
    }

    toggleAddGroupUserModal = () => {
        this.setState({
            showModal: {
                ...this.state.showModal,
                ADD_GROUP_USER: !this.state.showModal.ADD_GROUP_USER
            }
        }, () => {
            if (!this.state.showModal.ADD_GROUP_USER) {
                this.getGroupUserList()
            }
        })
    }

    render() {
        const { getListLoading, group_title, groupUserList } = this.state
        const { showSelectGroup, selectType, originCanCancel, returnStyle, mustIdent } = this.state.addUserConfig
        return (
            <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                { this.leftGroup() }
               {!this.state.empty ? 
                    <div style={{ flex: 1 }}>
                        <div className="groupTitleRight">
                            <div style={{ marginRight: 10 }}>{group_title}</div>
                            <img alt=''
                                style={{ height: 14, width: 14, marginRight: 4 }}
                                src={commonImg.userCount}
                            />
                            <div>{groupUserList.count}</div>
                        </div>
                        <div style={{ marginLeft: 21, marginRight: 21, paddingBottom: 21 }}>
                            <RLFilterTool leftItems={this.getLeftItems} />
                            <RLTable
                                loading={getListLoading}
                                dataSource={groupUserList.list}
                                rowKey='uuid'
                                columns={this.columns}
                                rowSelection={{
                                    selectedRowKeys: this.state.selectedMemberKeys,
                                    type: 'checkbox',
                                    onChange: this.onSelectChange
                                }}
                                paginationInfo={{
                                    total: groupUserList.count,
                                    pageSize: this.pageSize,
                                    onChange: this.pageChange,
                                    current: groupUserList.page
                                }}
                                rowClassName='rl-table-click-row'
                            />
                        </div>
                    </div>  : null}
                
                {/* 弹框 */}
                {
                    this.state.showModal.ADD_GROUP && this.renderAddGroup()
                }
                {
                    this.state.showModal.EDIT_GROUP &&  this.renderEditGroup()
                }
                {/* {
                    this.state.showModal.ADD_GROUP_USER &&
                    <AddGroupUser
                        toggleAddGroupUserModal={this.toggleAddGroupUserModal}
                        uuid={this.state.group_uuid}
                    />
                } */}
                {
                    this.state.showModal.ADD_GROUP_USER && <AddUser
                        visible={this.state.showModal.ADD_GROUP_USER}
                        showSelectGroup={showSelectGroup}
                        selectType={selectType}
                        originArr={this.state.userList}
                        originCanCancel={originCanCancel}
                        returnStyle={returnStyle}
                        mustIdent={mustIdent}
                        onCancel={() => {
                            this.setState({
                                showModal: {
                                    ...this.state.showModal,
                                    ADD_GROUP_USER: false
                                }
                            })
                        }}
                        onAdd={data => {
                            this.addSuccess(data)
                        }}
                    />
                }
                {
                    this.state.showModal.EDIT_GROUP_USER && this.renderEditGroupUser()
                }
            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(GroupManage)
