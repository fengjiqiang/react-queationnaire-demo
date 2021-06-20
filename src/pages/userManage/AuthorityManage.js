import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLDisplayBoard, RLForm, RLFormItem, RLRadioGroup
} from '@components/index.js'

import actionUserList from '@actions/userManage/actionUserList.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import interfaces from '@/api/interfaces';

import CmpRoleEdit from './components/authorityManage/CmpRoleEdit.js';
import CmpRoleDetail from './components/authorityManage/CmpRoleDetail.js';
import CmpRoleList from './components/authorityManage/CmpRoleList.js';
import CmpMemberList from './components/authorityManage/CmpMemberList.js';
class AuthorityManage extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'list',  
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
            showCmp = <CmpRoleList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'detail') {
            showCmp = <CmpRoleDetail
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'edit') {
            showCmp = <CmpRoleEdit
                changePage={this.changePage}
                {...this.state.props}
            />
        }else if(this.state.showPage === 'member'){
            showCmp = <CmpMemberList
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
        // roleList: store.roleManage.roleList,
        // planAvailable: store.userList.planAvailable
    }
})(AuthorityManage)