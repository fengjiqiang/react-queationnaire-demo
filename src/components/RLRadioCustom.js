
/*
afterFix

*/

import { Radio } from 'antd';


const RLRadioCustom = (props) => {

    return (
        <Radio {...props}
            className={props.className ? props.className + ' rl-radioCustom' : 'rl-radioCustom'}
            value={props.value}
            style={{ ...props.style }}
        >
            {props.label}
        </Radio>
    )
}
export default RLRadioCustom