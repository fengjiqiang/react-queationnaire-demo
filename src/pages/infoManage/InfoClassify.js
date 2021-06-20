import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import CmpInfoClassifyList from './components/InfoClassify/CmpInfoClassifyList.js'
import CmpInfoClassifyEdit from './components/InfoClassify/CmpInfoClassifyEdit.js'

class InfoClassify extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'list',     // 要显示的页面list：列表/edit：添加/编辑
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
            showCmp = <CmpInfoClassifyList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'edit') {
            showCmp = <CmpInfoClassifyEdit
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
})(InfoClassify)
