import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import './UserList.less'
import CmpUserEdit from './components/userList/CmpUserEdit.js'
import CmpUserList from './components/userList/CmpUserList.js'
import CmpUserDetail from './components/userList/CmpUserDetail.js'
import CmpUserImport from './components/userList/CmpUserImport.js';

import { Route } from 'react-router-dom';

class UserList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'list',     // 要现实的页面appoint：预约会议/detail：会议详情/list：会议列表
            props
        };
    }
    changePage = (page, props = {}) => {
        this.setState({
            showPage: page,
            props
        })
    }
    render() {
        let showCmp
        if (this.state.showPage === 'list') {
            showCmp = <CmpUserList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'detail') {
            showCmp = <CmpUserDetail
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'edit') {
            showCmp = <CmpUserEdit
                changePage={this.changePage}
                {...this.state.props}
            />
        }
        else if(this.state.showPage === 'batch_import'){
            showCmp = <CmpUserImport
                changePage={this.changePage}
                {...this.state.props}
            />
        }
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                {showCmp}
            </div>

        )

    }

}
// export default UserList
export default connect((store, props) => {
    return {
        ...props,
        userList: store.userList.allUserInfo.list,
        roleList: store.roleManage.roleList,
    }
})(UserList)