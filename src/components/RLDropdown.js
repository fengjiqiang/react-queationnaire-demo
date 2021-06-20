
/*
    type :primary/default
*/

import { Dropdown, Menu } from 'antd';
import RLButton from './RLButton.js'
import BaseCmp from '@components/BaseCmp.js'

class RLDropdown extends BaseCmp {
    constructor(props) {
        super(props)
        this.menu = (
            <Menu>
                {this.props.subBtns.map(btn => {
                    return (
                        <Menu.Item key={btn.key}>
                            <RLButton
                                type='link'
                                key={btn.key}
                                label={btn.label}
                                onClick={(e) => {
                                    this.props.onClick(e, btn.key, btn.value)
                                }}
                            />
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
    }
    render() {
        return (
            <div style={{ ...this.props.style }}
                className={this.props.className ? this.props.className + ' rl-dropdown' : 'rl-dropdown'}
            >
                <Dropdown {...this.props}
                    overlay={this.menu}
                    overlayClassName='rl-dropdown-overlay'
                >
                    <RLButton
                        type='link'
                        key='more'
                        label={this.props.label}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    />

                </Dropdown>
            </div>

        )
    }
}
export default RLDropdown