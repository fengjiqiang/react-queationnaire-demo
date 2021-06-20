import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import CmpQnaireList from './components/Questionnaire/CmpQnaireList.js'
import CmpQnaireEdit from './components/Questionnaire/CmpQnaireEdit.js'
import CmpQnaireResList from './components/Questionnaire/CmpQnaireResList.js'
// import CmpRegistrationList from './components/Questionnaire/CmpRegistrationList.js'

class Questionnaire extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'list',     // 要显示的页面list：列表/edit：创建/编辑/survey: 调查结果
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
            showCmp = <CmpQnaireList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'edit') {
            showCmp = <CmpQnaireEdit
                changePage={this.changePage}
                {...this.state.props}
            />
        } 
        else if (this.state.showPage === 'survey') {
            showCmp = <CmpQnaireResList
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
})(Questionnaire)
