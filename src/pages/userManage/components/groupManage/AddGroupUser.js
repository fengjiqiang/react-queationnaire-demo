import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import {
    RLInput, RLSelect, RLButton, RLTable, LargeModal, RLFilterTool
} from '@components/index.js'

import actionGroupManage from '@actions/userManage/actionGroupManage.js'


class AddGroupUser extends BaseCmp {
    constructor(props) {
        super(props)
        this.urlParam = props
        this.state = {
            searchParam: {
                type: 'add',   // type 非当前组下的分页用户列表
                keyword: null,   // 选择 姓名或手机号
                value: '',   // 姓名或手机号 值
                uuid: this.urlParam.uuid
            },
            // 非当前组成员列表
            addGroupUserList: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1      // 当前第几页
            },
            showAddMemberModal: true,   // 添加成员模态框
            addLoading: false,   // 确定按钮loading
            selectedMemberKeys: []   // 当前选中的成员
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'uuid',
                key: 'uuid',
                width: '10%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
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
                dataIndex: 'corp_name',
                key: 'corp_name',
                width: '20%'
            }
        ]
        // 添加成员 选择框
        this.memberOptions = [
            { keyword: 'nickname', label: '姓名' },
            { keyword: 'mobile', label: '手机号' }
        ]
        this.getAddGroupUserList({ page: 1, uuid: this.urlParam.uuid })
    }
    // 分页获取非当前组成员列表
    getAddGroupUserList({ page = this.state.addGroupUserList.page } = { page: this.state.addGroupUserList.page }) {
        this.setState({
            addGroupUserList: {
                ...this.state.addGroupUserList,
                page,
            }
        })
        actionGroupManage.getGroupUserList({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                this.setState({
                    addGroupUserList: {
                        list: res.data.list,
                        page,
                        count: res.data.count,
                        pageNum: Math.ceil(res.data.count / this.pageSize)
                    }
                })
            } else {
                this.showToast({ content: '获取成员列表失败', type: 'error' })
            }
        })
    }

    pageChange = (page, pageSize) => {
        console.log('翻页了', page, pageSize)
        this.getAddGroupUserList({ page })
    }
    // 复选框选择
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
        this.setState({
            selectedMemberKeys: selectedRowKeys
        })
    }

    getRightItems = () => {
        const { keyword, value } = this.state.searchParam
        return ([
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
            />,
            <RLButton
                label='搜索'
                type='primary'
                key='search'
                onClick={() => {
                    this.getAddGroupUserList()
                }}
                style={{ marginLeft: 20, marginRight: 20 }}
            />
        ])
    }

    addGroupUserConfirm = () => {
        console.log(this.state.selectedMemberKeys)
        if (this.state.selectedMemberKeys.length) {
            this.setState({
                addLoading: true
            })
            actionGroupManage.groupUserAdd({
                group_uuid: this.urlParam.uuid,
                users: this.state.selectedMemberKeys
            }).then(res => {
                if (res.code === 200) {
                    this.showToast({ type: 'success', content: '添加成功' })
                    this.props.toggleAddGroupUserModal()
                } else {
                    this.showToast({ type: 'error', content: '添加失败' })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        } else {
            this.showToast({ type: 'warning', content: '请选择成员' })
        }
    }

    render() {
        const { addGroupUserList } = this.state
        return (
            <LargeModal
                visible={this.state.showAddMemberModal}
                title='添加成员'
                className='large-modal-add-user'
                onCancel={() => {
                    this.props.toggleAddGroupUserModal()
                }}
            >
                <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <RLFilterTool rightItems={this.getRightItems} />
                    <div style={{ flex: 1, overflow: 'auto', marginBottom: 20 }}>
                        <RLTable
                            dataSource={addGroupUserList.list}
                            rowKey='uuid'
                            columns={this.columns}
                            rowSelection={{
                                type: 'checkbox',
                                onChange: this.onSelectChange,
                            }}
                            pagination={false}
                            paginationInfo={{
                                selectedRowKeys: this.state.selectedMemberKeys,
                                total: addGroupUserList.count,
                                pageSize: this.pageSize,
                                onChange: this.pageChange,
                                current: addGroupUserList.page
                            }}
                        />
                    </div>

                    <div className='btn-container' style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 40 }}>
                        <RLButton
                            label='取消'
                            type='default'
                            onClick={() => {
                                this.props.toggleAddGroupUserModal()
                            }}
                        />
                        <RLButton
                            label='添加'
                            type='primary'
                            style={{ marginLeft: 20 }}
                            onClick={this.addGroupUserConfirm}
                        />
                    </div>
                </div>
            </LargeModal>
        )
    }

}
export default connect((store, props) => {
    return {
        ...props
    }
})(AddGroupUser)
