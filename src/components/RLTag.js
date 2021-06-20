
import { Tag } from 'antd';

const RLTag = (props) => {
    let label = props.label
    if (typeof label === 'function') {
        label = label()
    }
    return (
        <Tag {...props}
            className={props.className ? props.className + ' rl-tag' : 'rl-tag'}

        // DCDFE6
        // style={{ background: '#DCDFE6', ...props.style }}
        >{label}</Tag>
    )
}
export default RLTag