import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import CmpEventList from './components/EventRegistration/CmpEventList.js'
import CmpEventEdit from './components/EventRegistration/CmpEventEdit.js'
import CmpRegistrationList from './components/EventRegistration/CmpRegistrationList.js'

class EventRegistration extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'list',     // 要显示的页面list：列表/edit：创建/编辑/registration: 报名信息
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
            showCmp = <CmpEventList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'edit') {
            showCmp = <CmpEventEdit
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'registration') {
            showCmp = <CmpRegistrationList
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
        ...props
    }
})(EventRegistration)
