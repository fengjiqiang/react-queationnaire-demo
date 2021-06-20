


/*
    type :primary/default
*/
import React from 'react';
import { Tooltip } from 'antd';

const RLTooltip = React.forwardRef(
    (props, ref) => {
        return (
            <Tooltip {...props} ref={ref}
                placement={props.placement || 'bottomLeft'}
                className={props.className ? props.className + ' rl-tooltip' : 'rl-tooltip'}
                style={{ ...props.style }}
                color={props.color || '#f0f0f0'}
                overlayClassName='rl-tooltip-card'
            >
                {props.children}
            </Tooltip>
        )
    }
)
export default RLTooltip