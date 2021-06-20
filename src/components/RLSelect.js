
/*
options

*/

import { Select } from 'antd';
import BaseCmp from '@components/BaseCmp.js'


class RLSelect extends BaseCmp {
    constructor(props) {
        super(props)
        this.value = props.value || props.defaultValue
    }
    render() {
        let options = this.props.options.map(item => {
            if (typeof item === 'string') {
                return { label: item, value: item }
            }
            let obj = JSON.parse(JSON.stringify(item));
            if (this.props.labelkey) {
                obj = {
                    ...obj, label: item[this.props.labelkey]
                }
            }
            if (this.props.valuekey) {
                obj = {
                    ...obj, value: item[this.props.valuekey]
                }
            }
            return obj
        })
        let defaultValue
        if (this.value !== undefined) {
            let dv = options.filter(item => {
                return String(item.value) === String(this.value)
            })[0]
            if (dv) {
                defaultValue = dv.label
            }
        }

        return (
            <Select
                {...this.props}
                className={this.props.className ? this.props.className + ' rl-select' : 'rl-select'}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...this.props.style }}
                options={undefined}
                defaultValue={defaultValue}
                onChange={(val) => {
                    this.value = val
                    this.props.onChange && this.props.onChange(val)
                }}
            >
                {
                    options.map(opt => {
                        return (
                            <Select.Option value={opt.value} key={opt.value} disabled={opt.disabled}
                            >
                                {opt.label}
                            </Select.Option>
                        )
                    })
                }
            </Select>

        )
    }
}
export default RLSelect