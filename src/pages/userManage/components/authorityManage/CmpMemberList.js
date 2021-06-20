import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup } from '@components/index.js'
import actionUserList from '@actions/userManage/actionUserList.js'
import actionRoleManage from '@actions/userManage/actionRoleManage.js';
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js';
import config from '@/config.js';
import eventBus from '@/libs/EventBus.js'
import { DatePicker, Input } from 'antd';
// import CmpAddUser from '@pages/common/meeting/AddUser.js';
import AddUser from '../../../common/meeting/AddUser';

class CmpMemberList extends BaseCmp {
    constructor(props) {
        super(props);
        this.role_code = props.role_code;
        this.rolePage = props.rolePage;
        this.state = {
            keyword: null,
            value: '',
            roleList: [],
            memberListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            selectedMemberKeys: [],  // 选中的用户
            getListLoading: true,       // 获取列表loading,

            showSwitchRoleModal: false,
            selected_users: [],
            selected_role: '',

            showAddUserModal: false,
        }
        this.userAddModal = createRef();
        this.columns = [
            {
                title: '序号',
                width: '10%',
                render: (text, record, index) => {
                    return <div>{(this.state.memberListInfo.page - 1) * this.pageSize + index + 1 }</div>
                },
            },
            {
                title: '姓名',
                dataIndex:'nickname',
                key: 'nickname',
                width: '15%',
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
                width: '15%'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: '15%',
            },
            {
                title: '机构名称',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '15%',
            },
            {
                title: '提交时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '15%',
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '15%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            <RLButton
                                type='link'
                                label='更换角色'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.setState({
                                        selected_users: [record.uuid],
                                        showSwitchRoleModal: true
                                    })
                                }}
                            />
                        }
                    </div>
                )
            },
        ];
        this.getMemberList(); 
        this.getAllRoles();
    }
    getMemberList({ page = this.state.memberListInfo.page } = { page: this.state.memberListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionUserList.getUserList({
            keyword: this.state.keyword || '',
            value: this.state.value || '',
            role_code: this.role_code || '',
            approval_status: '',
            start_date: '',
            end_date:'',
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.data && res.data.list.length === 0 && page > 1) {
                    this.getMemberList({ page: page - 1 })
                } else {
                    this.setState({
                        memberListInfo: {
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
    getAllRoles(){
        actionRoleManage.getAllRoles().then( res => {
            if(res.code === 200){
                this.setState({
                    roleList: res.data
                })
            }else{
                
            }
        }).catch(err => {
           
        })
    }
    getLeftItems = () => {
        return ([
            <RLSelect 
                placeholder="请选择"
                value={this.state.keyword}
                options={config.keywordType}
                style={{width: 160, marginRight:20}}
                onChange={(val)=>{
                    this.setState({
                        keyword: val,
                    })
                }}/>,
            <RLInput placeholder="请输入" 
                    value={this.state.value}
                    onChange={ (e)=>{
                        this.setState({
                            value: e.target.value
                        })
                    }}
                    style={{width: 260}}/>
        ])
    }
    getRightItems = () => {
        return ([
            <RLButton label="搜索" 
                type="primary"
                onClick={ ()=> {
                    this.getMemberList();
                }} 
                style={{marginRight: 20}}
            />,
            <RLButton label="重置" 
                onClick={ ()=>{
                    this.setState({
                        keyword:null,
                        value: ''
                    }, ()=>{
                        this.getMemberList();
                    })
                }}/>
        ])
    }

    getRightSecondItems = () => {
        return (
            [
               this.role_code !== 'ordinary' && <RLButton
                    label='添加角色成员'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.setState({
                            showAddUserModal: true
                        })
                    }}
                    style={{ marginRight: 20 }}
                />,
                <RLButton 
                    label="批量更换角色"
                    disabled = {this.state.selectedMemberKeys.length <= 0 }
                    onClick={() =>{
                        this.state.selected_users = this.state.selectedMemberKeys;
                        this.setState({
                            showSwitchRoleModal: true
                        });
                    }}
                />
            ]
        )
    }
    getGoBackItems = () => {
        return [
                <RLButton 
                    label="返回"
                    onClick={()=>{
                        this.props.changePage('list',{
                            rolePage: this.rolePage
                        })
                    }}
                />
        ]
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedMemberKeys: selectedRowKeys,
        })
    }
    pageChange = (page, pageSize) => {
        this.getMemberList({ page })
    }
    AddUser = (users) => {
        let user_ids = users.map(item => item.uuid);
        actionRoleManage.changeRole({role_code:this.role_code, users: user_ids}).then( res=> {
            if(res.code === 200){
                this.showToast({type:'success',content:'成员添加成功！'});
                this.getMemberList();
            }else{
                this.showToast({type:'error',content: '成员添加失败！'});
            }
        }).catch(err => {
            this.showToast({type:'error',content: '成员添加失败！'});
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>{this.props.role_name || '角色成员'}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list',{
                            rolePage: this.rolePage,
                        })
                    }}
                    label='返回'
                />
            </div>
        )
    }
    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='content-user'>      
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems}/>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightSecondItems}/>
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.memberListInfo.list}
                        rowKey='uuid'
                        columns={this.columns}
                        rowSelection={{
                            type: 'checkbox',
                            onChange: this.onSelectChange,
                            getCheckboxProps: (record) => ({
                                disabled: false
                            })
                        }}
                        paginationInfo={{
                            selectedRowKeys: this.state.selectedMemberKeys,
                            total: this.state.memberListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.memberListInfo.page
                        }}
                        rowClassName='rl-table-click-row'
                    />
                </div>
              { this.state.showAddUserModal && <AddUser 
                    ref={c => this.userAddModal = c }
                    visible={this.state.showAddUserModal}
                    selectType = "checkbox"
                    showSelectGroup={false}
                    originArr={this.state.memberListInfo.list}
                    originCanCancel={false}
                    returnStyle="object"
                    onCancel={()=>{
                        this.setState({showAddUserModal: false})
                    }}
                    onAdd={this.AddUser}
                    mustIdent={true}
                    // * originArr    原数组  
                    // * originCanCancel  原数据是否可取消
                    // * returnStyle   点击添加返回的数据类型 'object'返回数据所有属性，'arr'返回id数组
                    // * onCancel   取消回调函数
                    // * onAdd     添加回调函数
                />}
               { this.state.showSwitchRoleModal && <RLModal
                    title="更换角色"
                    visible={this.state.showSwitchRoleModal}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            selected_role:'',
                            selected_users: [],
                            showSwitchRoleModal: false
                        });
                    }}
                    >
                    <div style={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <RLSelect 
                            options={this.state.roleList} 
                            placeholder="请选择角色"
                            onChange={( val )=>{
                                this.state.selected_role = val;
                            }}
                            labelkey="role_name"
                            valuekey="role_code"
                            style={{width:260}}/>
                        <div style={{display:'flex', flexDirection:'row',justifyContent:'center',marginTop:40}}>
                            <RLButton 
                                label="取消"
                                onClick={()=>{
                                    this.setState({
                                        selected_role:'',
                                        selected_users: [],
                                        showSwitchRoleModal: false
                                    })
                                }}
                                style={{marginRight: 40}}/>
                            <RLButton 
                                label="确定"
                                type="primary"
                                onClick={()=>{
                                    if(!this.state.selected_role){
                                        this.showToast({type:'error',content:'请选择角色！'});
                                        return;
                                    }
                                    actionRoleManage.changeRole({
                                        role_code: this.state.selected_role,
                                        users: this.state.selected_users
                                    }).then( res => {
                                        if(res.code === 200){
                                            this.showToast({type:'error', content:'角色替换成功！'});
                                            this.setState({
                                                showSwitchRoleModal: false
                                            });
                                            this.getMemberList();
                                        }else{
                                            this.showToast({type:'error',content:'角色替换失败！'});
                                            this.setState({
                                                showSwitchRoleModal: false
                                            });
                                        }
                                    }).catch( err => {
                                        this.showToast({type:'error',content:'角色替换失败！'});
                                        this.setState({
                                            showSwitchRoleModal: false
                                        });
                                    })

                                }}/>
                        </div>
                    </div>
                </RLModal>}
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
    }
})(CmpMemberList)