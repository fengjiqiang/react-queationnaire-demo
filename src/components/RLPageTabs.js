
/*
defaultActiveKey
onChange
tabPanes

*/

import { Component } from 'react'
import { Tabs } from 'antd';

import { CloseOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

class RLPageTabs extends Component {
    getTab = (item) => {
        return <div>
            {item.tab}
            <CloseOutlined onClick={(e) => {
                e.stopPropagation()
                this.props.deleteTab(item)
            }} />
        </div>
        // { item.tab }
    }
    render() {
        return (
            <Tabs {...this.props}
                onChange={(route) => {
                    this.props.onChange(route)
                }}
                className={this.props.className ? this.props.className + ' rl-page-tabs' : 'rl-page-tabs'}
            >
                {
                    this.props.tabPanes && this.props.tabPanes.map((item) => {
                        return <Tabs.TabPane tab={this.getTab(item)} key={item.id}>
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
export default RLPageTabs