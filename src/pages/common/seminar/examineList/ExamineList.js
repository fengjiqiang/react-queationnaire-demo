import { Component } from 'react';
import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'

class ExamineSeminarList extends Component {
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
            <WindowContainer title='审核列表'>
                审核列表
            </WindowContainer>

        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
    }
})(ExamineSeminarList)