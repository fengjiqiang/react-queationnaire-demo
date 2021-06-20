import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import CmpQuestionList from './components/QAManage/CmpQuestionList.js';
import CmpQuestionEdit from './components/QAManage/CmpQuestionEdit.js';

class QAManage extends BaseCmp {
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
            showCmp = <CmpQuestionList
                changePage={this.changePage}
                {...this.state.props}
            />
        } 
        else if (this.state.showPage === 'edit') {
            showCmp = <CmpQuestionEdit
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
    }
})(QAManage)