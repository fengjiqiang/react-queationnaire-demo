
/*
    type :primary/default
*/
import React from 'react';
import { Form } from 'antd';

const RLForm = React.forwardRef(
    (props, ref) => {
        return (
            <Form {...props} ref={ref}
                className={props.className ? props.className + ' rl-form' : 'rl-form'}
                style={{ ...props.style, ...props.formStyle }} >{props.children}</Form>

        )
    }
)
export default RLForm