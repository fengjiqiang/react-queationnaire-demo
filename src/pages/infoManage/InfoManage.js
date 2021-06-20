import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import CmpInfoList from './components/InfoManage/CmpInfoList.js'
import CmpInfoEdit from './components/InfoManage/CmpInfoEdit.js'
import CmpDocList from './components/InfoManage/CmpDocList.js'

class InfoManage extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'list',     // 要显示的页面list：列表/edit：创建/编辑/download: 资料下载
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
            showCmp = <CmpInfoList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'edit') {
            showCmp = <CmpInfoEdit
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'download') {
            showCmp = <CmpDocList
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
})(InfoManage)
