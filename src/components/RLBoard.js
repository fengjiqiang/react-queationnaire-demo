
/*
options

*/

import BaseCmp from '@components/BaseCmp.js'
class RLBoard extends BaseCmp {
    render() {
        return (
            <div
                className={this.props.className ? this.props.className + ' rl-board' : 'rl-board'}
                style={{ border: '1px solid #dcdfe6', borderRadius: 8, padding: 20, background: '#fff', ...this.props.style }}>
                {this.props.children}
            </div>

        )
    }
}
export default RLBoard