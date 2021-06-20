
/*
afterFix

*/

import { DatePicker, TimePicker } from 'antd';
import BaseCmp from '@components/BaseCmp.js'
import locale from 'antd/es/date-picker/locale/zh_CN';

class RLDatePicker extends BaseCmp {
    render() {
        if (this.props.picker === 'time') {
            return (
                <TimePicker
                    className={this.props.className ? this.props.className + ' rl-datePicker' : 'rl-datePicker'}
                    {...this.props}
                    locale = {locale}
                    value={this.props.value}
                />
            )
        }
        return (
            <DatePicker
                className={this.props.className ? this.props.className + ' rl-datePicker' : 'rl-datePicker'}
                {...this.props}
                locale = {locale}
                value={this.props.value}
            />
        )
    }
}
export default RLDatePicker