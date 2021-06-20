
/*
afterFix

*/

import { Component } from 'react'
import { Pagination } from 'antd';
class RLPagination extends Component {
    render() {

        return (
            <Pagination
                className={this.props.className ? this.props.className + ' rl-pagination' : 'rl-pagination'}
                {...this.props} count={60} />
        )
    }
}
export default RLPagination