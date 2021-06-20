import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import CmpUserFieldsSetting from './components/userFieldsSetting/CmpUserFieldsSetting.js'

import CmpAuthed from './components/unauthedUser/CmpAuthed.js'

import './UserFieldsSetting.less'

import { Route } from 'react-router-dom';

export default class UserFieldsSetting extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
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

        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <CmpUserFieldsSetting
                    changePage={this.changePage}
                    {...this.state.props}
                />
            </div>
        )
    }
}
