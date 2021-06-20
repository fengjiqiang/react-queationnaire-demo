
/*
afterFix

*/

import { Input } from 'antd';
import BaseCmp from '@components/BaseCmp.js'
import {
    SearchOutlined
} from '@ant-design/icons';
class RLInput extends BaseCmp {
    constructor(props) {
        super(props)
        // this.state = {
        //     data: 1
        // }
        this.value = this.props.value || this.props.defaultValue
    }
    getValue = () => {
        console.log(this.refs.rlInput)
        return this.refs.rlInput.value
    }
    focus = () => {
        this.refs.rlInput.focus()
    }
    render() {
        return (
            <div
                className={this.props.className ? this.props.className + ' rl-input' : 'rl-input'}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...this.props.style }}>
                <Input ref='rlInput'
                    {...this.props}
                    autoComplete={this.props.autoComplete || "off"}
                    style={{ flex: 1, ...this.props.inputStyle }}
                    onChange={e => {
                        this.value = e.target.value
                        this.props.onChange && this.props.onChange(e)
                    }}
                />
                {(() => {
                    if (this.props.afterFix) {
                        if (typeof this.props.afterFix === 'function') {
                            return this.props.afterFix()
                        } else if (typeof this.props.afterFix === 'object') {
                            return this.props.afterFix
                        } else if (typeof this.props.afterFix === 'string') {
                            switch (this.props.afterFix) {
                                case 'SearchOutlined':
                                    return (
                                        <SearchOutlined style={{ width: 30, height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', background: this.themeColor, color: '#fff' }}
                                            onClick={() => {
                                                if (typeof this.props.afterFixClick === 'function') {
                                                    this.props.afterFixClick()
                                                }
                                            }}
                                        />
                                    )
                                default:
                                    break;
                            }
                        }
                    }
                })()}
            </div>

        )
    }
}
export default RLInput