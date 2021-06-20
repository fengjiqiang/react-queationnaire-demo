import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'

import CmpVODList from './components/VODManage/CmpVODList.js'
import CmpVODEdit from './components/VODManage/CmpVODEdit.js'
import CmpChapterList from './components/VODManage/CmpChapterList.js'
import CmpChapterEdit from './components/VODManage/CmpChapterEdit.js'
import CmpCommentList from './components/VODManage/CmpCommentList.js'
import CmpCommentEdit from './components/VODManage/CmpCommentEdit.js'
import CmpPlayList from './components/VODManage/CmpPlayList.js'
import CmpResourceList from './components/VODManage/CmpResourceList.js'
// import CmpUserImport from './components/userList/CmpUserImport.js';

class VODManage extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showPage: 'vod_list',     // 要现实的页面appoint：预约会议/detail：会议详情/list：会议列表
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
        if (this.state.showPage === 'vod_list') {
            showCmp = <CmpVODList
                changePage={this.changePage}
                {...this.state.props}
            />
        } 
        else if (this.state.showPage === 'vod_edit') {
            showCmp = <CmpVODEdit
                changePage={this.changePage}
                {...this.state.props}
            />
        }
        else if(this.state.showPage === 'chapter_list'){
            showCmp = <CmpChapterList
                changePage={this.changePage}
                {...this.state.props}
            />
        }
        else if(this.state.showPage === 'chapter_edit'){
            showCmp = <CmpChapterEdit
                changePage={this.changePage}
                {...this.state.props}
            />
        }
        else if(this.state.showPage === 'user_list'){
            showCmp = <CmpPlayList 
                changePage={this.changePage}
                {...this.state.props}
                />
        }
        else if(this.state.showPage === 'comment_list'){
            showCmp = <CmpCommentList
                changePage={this.changePage}
                {...this.state.props}
            />
        }
        else if(this.state.showPage === 'comment_edit'){
            showCmp = <CmpCommentEdit 
                    changePage={this.changePage}
                    {...this.state.props}
                />
        }
        else if(this.state.showPage === 'res_list'){
            showCmp = <CmpResourceList
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
    }
})(VODManage)