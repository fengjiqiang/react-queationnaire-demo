
/*
options

*/
import { Input } from 'antd';
import BaseCmp from '@components/BaseCmp.js'
const { TextArea } = Input;
const RLTextarea = (props) => {
    return (
        <TextArea   {...props}
            className={props.className ? props.className + ' rl-textarea' : 'rl-textarea'}
            style={{ border: '1px solid #dcdfe6', borderRadius: 3, padding: 7, background: '#fff', ...props.style }}
        />
    )
}
export default RLTextarea