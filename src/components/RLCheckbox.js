
/*
afterFix

*/

import { Checkbox } from 'antd';
import BaseCmp from '@components/BaseCmp.js'

class RLCheckbox extends BaseCmp {
    render() {
        return (
            <Checkbox className={this.props.className ? this.props.className + ' rl-checkbox' : 'rl-checkbox'}
                {...this.props}
                style={{ ...this.props.checkboxStyle }}>
                {this.props.label}
            </Checkbox>
        )
    }
}
export default RLCheckbox