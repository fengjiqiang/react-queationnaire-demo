
/*
afterFix

*/

import { Radio } from 'antd';
import RLRadio from './RLRadio'
import BaseCmp from '@components/BaseCmp.js'
class RLRadioGroup extends BaseCmp {

    render() {
        let options = this.props.items.map(item => {
            let obj = JSON.parse(JSON.stringify(item))
            if (this.props.labelkey) {
                obj = { ...obj, label: item[this.props.labelkey] }
            }
            if (this.props.valuekey) {
                obj = { ...obj, value: item[this.props.valuekey] }
            }

            return obj
        })


        return (
            <Radio.Group  {...this.props} defaultValue={this.props.defaultValue}
                className={this.props.className ? this.props.className + ' rl-radioGroup' : 'rl-radioGroup'}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...this.props.style }}
            >
                {
                    options.map(item => {
                        return (
                            <RLRadio value={item.value}
                                key={item.value}
                                label={item.label}
                                disabled={item.disabled}
                            />
                        )
                    })
                }
            </Radio.Group>

        )
    }
}
export default RLRadioGroup