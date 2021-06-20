import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import CmpUnauthedUserList from './components/unauthedUser/CmpUnauthedUserList.js'
import CmpAuthedDetail from './components/unauthedUser/CmpAuthedDetail.js'
import CmpAuthed from './components/unauthedUser/CmpAuthed.js'

import './UnauthedUserList.less'

import { Route } from 'react-router-dom';

export default class UnauthedUserList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'list',   // 要显示的页面 list：认证列表/detail：详情/approval：认证页面
            props
        }
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
            showCmp = <CmpUnauthedUserList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'detail') {
            showCmp = <CmpAuthedDetail
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'approval') {
            showCmp = <CmpAuthed
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
