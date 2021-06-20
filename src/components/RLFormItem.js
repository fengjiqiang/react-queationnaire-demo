
/*
    type :primary/default
*/

import { Form } from 'antd';
import BaseCmp from '@components/BaseCmp.js'

class RLFormItem extends BaseCmp {

    render() {
        return (
            <Form.Item  {...this.props}
                className={this.props.className ? (this.props.className + ' rl-formItem') : 'rl-formItem'}
                style={{ ...this.props.style }} >{this.props.children}</Form.Item>

        )
    }
}
export default RLFormItem