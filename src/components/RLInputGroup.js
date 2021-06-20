
/*
afterFix

*/

import { Input } from 'antd';
import BaseCmp from '@components/BaseCmp.js'

class RLInputGroup extends BaseCmp {
    render() {
        return (
            <Input.Group className={this.props.className ? this.props.className + ' rl-inputGroup' : 'rl-inputGroup'} {...this.props} value={this.props.value}>{this.props.children}</Input.Group>
        )
    }
}
export default RLInputGroup