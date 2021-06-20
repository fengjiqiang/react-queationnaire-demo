
import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux';
import eventBus from '@/libs/EventBus.js'
import { RLInput, RLCheckbox } from '@components/index.js'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import './RLTree.less'
class RLTree extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            userIndeterminate: false,
            checkAll: false,
            showMembers: false,
            showDevices: false,
        }
        this.selected = this.props.selected



    }
    componentWillMount() {
        eventBus.addListener('tree_remove_check', (item) => {
            this.userCheckFn(false, item)
        })
    }
    componentWillReceiveProps(nextProps) {
        console.log('nextProps:', nextProps)
        if (nextProps.selected !== this.props.selected) {
            this.selected = nextProps.selected
            let { users, userIndeterminate, checkAll } = this.initCheckStatus(nextProps.selected, this.state.users)
            this.setState({
                users, userIndeterminate, checkAll
            })
        }
    }
    componentDidMount() {
        this.filterInput('')
    }
    filterInput = (keyword) => {
        let allUser = this.getAllUsers(keyword)
        console.log('this.props.selected:', this.props.selected)
        let { users, userIndeterminate, checkAll } = this.initCheckStatus(this.props.selected, allUser)
        console.log('usersusers:', users)
        this.setState({
            users, userIndeterminate, checkAll
        })
    }
    getAllUsers = (keyword) => {
        console.log(this.props.allUserInfo.list, keyword)
        let users = []
        if (this.props.allUserInfo.list) {
            users = this.props.allUserInfo.list.filter(user => {
                return user.name.includes(keyword)
            })
        }
        console.log('users-res:', users)

        return users
    }
    initCheckStatus(selected, users) {
        let userIndeterminate = false
        let checkAll = false
        for (let i = 0; i < users.length; i++) {
            users[i].checked = false
            for (let j = 0; j < selected.length; j++) {
                if (selected[j].id === users[i].id) {
                    users[i].checked = true
                    break
                }
            }
        }
        let selectedUsers = users.filter(user => {
            return user.checked
        })
        if (users.length > 0) {
            if (selectedUsers.length === users.length) {
                userIndeterminate = false
                checkAll = true
            } else if (selectedUsers.length > 0) {
                userIndeterminate = true
                checkAll = false
            } else {
                userIndeterminate = false
                checkAll = false
            }
        }


        return { users, userIndeterminate, checkAll }
    }
    userCheckFn = (checked, user) => {
        console.log(checked)
        // let users = JSON.parse(JSON.stringify(this.state.users))
        let users = this.state.users
        let selected = JSON.parse(JSON.stringify(this.props.selected))
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === user.id) {
                users[i].checked = checked
            }
        }
        console.log('users:', users)
        if (checked) {
            selected.push(user)
        } else {
            selected = selected.filter(item => {
                return item.id != user.id
            })
        }
        if (selected.length === 0) {
            this.setState({
                userIndeterminate: false,
                checkAll: false, users
            })
        } else if (selected.length === this.state.users.length) {
            this.setState({
                userIndeterminate: false,
                checkAll: true, users
            })
        } else {
            this.setState({
                userIndeterminate: true,
                checkAll: false, users
            })
        }
        this.props.onCheck(selected)
    }
    checkAllFn = (e) => {
        console.log('checAllFn--e:', e)
        e.stopPropagation()
        let checkAll = e.target.checked
        let users = this.state.users
        users = users.map(user => {
            return {
                ...user,
                checked: checkAll
            }
        })
        if (checkAll) {
            this.setState({
                userIndeterminate: false,
                checkAll, users
            })
            this.props.onCheck(users)
        } else {
            this.setState({
                userIndeterminate: false,
                checkAll, users
            })
            this.props.onCheck([])
        }

        // let userIndeterminate = false
        // for ()
    }
    render() {
        return (
            <div className='user-selector'>
                <div className='filter'>
                    <RLInput
                        placeholder='请输入内容'
                        allowClear
                        afterFix='SearchOutlined'
                        style={{ width: 224 }}
                        onChange={(e) => {
                            this.filterInput(e.target.value)
                        }}
                        afterFixClick={() => {
                            this.getAllUsers()
                        }}
                    />
                </div>
                <div className='origin-data-container'>
                    {/* <div className='folder'>
                        <RLCheckbox
                            label='选择设备'
                            checked={this.state.checked}
                            // indeterminate={}
                            className='folder-title'
                            onChange={this.checkAllFn}
                        />
                        <div className='items-container'>
                            <RLCheckbox
                                label='姓名1'
                                // checked={this.props.item.checked}
                                className='folder-item'
                                onChange={this.checkedFn}
                            />
                            <RLCheckbox
                                label='姓名2'
                                // checked={this.props.item.checked}
                                className='folder-item'
                                onChange={this.checkedFn}
                            />
                        </div>
                    </div> */}
                    <div className='folder'>
                        {/* <div className='title-container'
                            onClick={() => {
                                this.setState({
                                    showDevices: !this.state.showDevices
                                })
                            }}
                        >
                            <RLCheckbox
                                label='选择设备'
                                checked={this.state.checkAll}
                                indeterminate={this.state.userIndeterminate}
                                className='folder-title'
                                onChange={this.checkAllFn}
                            />
                            {
                                this.state.showDevices ? <DownOutlined /> : <UpOutlined />
                            }

                        </div>
                        {
                            this.state.showDevices && <div className='items-container'>
                                {
                                    this.state.users.map(user => {
                                        return <RLCheckbox
                                            disabled={this.props.userInfo.cu_id === user.id}
                                            label={user.nickname}
                                            checked={user.checked}
                                            key={user.id}
                                            className='folder-item'
                                            onChange={(e) => {
                                                this.userCheckFn(e.target.checked, user)
                                            }}
                                        />
                                    })
                                }
                            </div>
                        } */}

                        <div className='title-container'
                            onClick={() => {
                                this.setState({
                                    showMembers: !this.state.showMembers
                                })
                            }}
                        >
                            <RLCheckbox
                                label='选择用户'
                                checked={this.state.checkAll}
                                indeterminate={this.state.userIndeterminate}
                                className='folder-title'
                                onChange={this.checkAllFn}
                            />
                            {
                                this.state.showMembers ? <DownOutlined /> : <UpOutlined />
                            }
                        </div>
                        {
                            this.state.showMembers && <div className='items-container'>
                                {
                                    this.state.users.map(user => {
                                        return <RLCheckbox
                                            disabled={this.props.userInfo.cu_id === user.id}
                                            label={user.nickname}
                                            checked={user.checked}
                                            key={user.id}
                                            className='folder-item'
                                            onChange={(e) => {
                                                this.userCheckFn(e.target.checked, user)
                                            }}
                                        />
                                    })
                                }
                            </div>
                        }

                    </div>
                    {/* {
                        this.props.treeData.map(item => {
                            return this.getItem(item)
                        })
                    } */}
                </div>

            </div>


        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        userInfo: store.personalInfo.userInfo,
        treeData: store.storeCommon._treeData,
        allUserInfo: store.userList.allUserInfo
    }
})(RLTree);