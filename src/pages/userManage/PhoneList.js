import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import CmpPhoneList from './components/phoneList/CmpPhoneList.js'
import CmpPhoneImport from './components/phoneList/CmpPhoneImport.js'

class PhoneList extends BaseCmp {
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
            showCmp = <CmpPhoneList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'import') {
            showCmp = <CmpPhoneImport
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

export default connect((store, props) => {
    return {
        ...props,
        userList: store.userList.allUserInfo.list,
        roleList: store.roleManage.roleList,
    }
})(PhoneList)