
/*
afterFix

*/

import { Radio } from 'antd';
import BaseCmp from '@components/BaseCmp.js'


class RLRadio extends BaseCmp {
    render() {

        return (
            <Radio className={this.props.className ? this.props.className + ' rl-radio' : 'rl-radio'} {...this.props} value={this.props.value}>{this.props.label}</Radio>
        )
    }
}
export default RLRadio