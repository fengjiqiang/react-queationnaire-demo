
/*
afterFix

*/

import { Radio } from 'antd';
import RLRadioCustom from './RLRadioCustom.js'
const RLRadioGroupCustom = (props) => {
    let options = props.items.map(item => {
        let obj = JSON.parse(JSON.stringify(item))
        if (props.labelkey) {
            obj = { ...obj, label: item[props.labelkey] }
        }
        if (props.valuekey) {
            obj = { ...obj, value: item[props.valuekey] }
        }

        return obj
    })
    return (
        <Radio.Group  {...props} defaultValue={props.defaultValue}
            className={props.className ? props.className + ' rl-radioGroupCustom' : 'rl-radioGroupCustom'}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...props.style }}
        >
            {
                options.map(item => {
                    return (
                        <RLRadioCustom value={item.value}
                            key={item.value}
                            label={item.label}
                            disabled={item.disabled}
                            style={item.style ? item.style : {}}

                        />
                    )
                })
            }
        </Radio.Group>

    )
}
export default RLRadioGroupCustom