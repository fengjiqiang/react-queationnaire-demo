import { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Button, message } from 'antd';
import SeminarList from './components/SeminarList.js';
import SeminarDetail from './components/SeminarDetail.js';
import SeminarEdit from './components/SeminarEdit.js';
const { TabPane } = Tabs;

class MySeminar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            /**
             * list:        研讨会列表
             * detail:      研讨会详情
             * edit:        编辑/添加研讨会
            
            */
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
            showCmp = <SeminarList
                changePage={this.changePage}
                {...this.state.props}
                pageType={this.pageType}
            />
        } else if (this.state.showPage === 'detail') {
            showCmp = <SeminarDetail
                changePage={this.changePage}
                {...this.state.props}
                pageType={this.pageType}
            />
        } else if (this.state.showPage === 'edit') {
            showCmp = <SeminarEdit
                changePage={this.changePage}
                {...this.state.props}
                pageType={this.pageType}
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
})(MySeminar);