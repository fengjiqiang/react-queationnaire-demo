import { Component } from 'react';
import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'
import MySeminar from '@/pages/common/seminar/mySeminar/MySeminar.js'
class Seminar extends Component {
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
            <WindowContainer title='网络研讨会'>
                <MySeminar />
            </WindowContainer>

        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
    }
})(Seminar);