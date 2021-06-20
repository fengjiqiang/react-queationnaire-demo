import { Component } from 'react';
import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'

class SeminarManage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    changePage = (page, props = {}) => {
        this.setState({
            showPage: page,
            props
        })
    }
    render() {

        return (
            <WindowContainer title='直播管理'>
                直播管理
            </WindowContainer>
        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
    }
})(SeminarManage);