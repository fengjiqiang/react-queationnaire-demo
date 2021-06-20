import { Component } from 'react';
import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'

class MySeminar extends Component {
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
            <WindowContainer title='我的直播'>
                我的直播
            </WindowContainer>
        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
    }
})(MySeminar);