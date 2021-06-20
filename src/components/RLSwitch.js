
import React from 'react';
import { Switch } from 'antd';

const RLSwitch = React.forwardRef(
    (props, ref) => {
        return (
            <Switch {...props} ref={ref}
                className={props.className ? props.className + ' rl-switch' : 'rl-switch'}
                style={{ ...props.style, ...props.formStyle }} />

        )
    }
)
export default RLSwitch