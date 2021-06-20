
/*
defaultActiveKey
onChange
tabPanes

*/

import { Component } from 'react'
import { Tabs } from 'antd';

// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

class RLTabs extends Component {

    render() {
        return (
            <Tabs {...this.props}
                onChange={(route) => {
                    this.props.onChange(route)
                }}
                className={this.props.className ? this.props.className + ' rl-tabs' : 'rl-tabs'}
            >
                {
                    this.props.tabPanes && this.props.tabPanes.map((item) => {
                        return <Tabs.TabPane tab={item.tab} key={item.id}>
                            {(() => {
                                if (item.content) {
                                    if (typeof item.content === 'function') {
                                        return item.content()
                                    } else if (typeof item.content === 'object') {
                                        return item.content
                                    }
                                } else {
                                    return null
                                }
                            })()}
                        </Tabs.TabPane>
                    })
                }
            </Tabs>
        )
    }
}
export default RLTabs