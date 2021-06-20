
/*
afterFix

*/

import { DatePicker } from 'antd';
import BaseCmp from '@components/BaseCmp.js'
const { RangePicker } = DatePicker;

class RLRangePicker extends BaseCmp {
    render() {
        return (
            <RangePicker
                className={this.props.className ? this.props.className + ' rl-rangePicker' : 'rl-rangePicker'}
                {...this.props}
            // value={this.props.value}
            />
        )
    }
}
export default RLRangePicker