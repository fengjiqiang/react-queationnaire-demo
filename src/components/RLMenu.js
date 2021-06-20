import { Component } from 'react';
import { Menu } from 'antd';

import { connect } from 'react-redux'
import images from '@/libs/images/index.js'
const { SubMenu } = Menu;
const menuIcon = images.menuIcon
class RLMenu extends Component {
    componentDidMount() {
        console.log(1234567655, this.props.menuData)
    }
    getMenuTitle = (menu) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {menu.menu_icon && menuIcon[menu.menu_icon] && <img
                    alt=''
                    src={menuIcon[menu.menu_icon]} style={{ width: 20, height: 20, marginRight: 2, position: 'relative', left: -5 }}
                />}
                {menu.name}
            </div>
        )
    }
    recursion(dataSource) {
        console.log('dataSource:', dataSource)
        return (
            dataSource.map((menu, index) => {
                if (menu.children && menu.children.length) {
                    if (menu.type === 'ItemGroup') {
                        return <Menu.ItemGroup key={menu.menu_code} title={this.getMenuTitle(menu)}>
                            {this.recursion(menu.children)}
                        </Menu.ItemGroup>
                    } else {
                        return (
                            <SubMenu key={menu.menu_code} title={this.getMenuTitle(menu)}>
                                {this.recursion(menu.children)}
                            </SubMenu>
                        )
                    }

                } else {
                    return (
                        <Menu.Item key={menu.menu_code} onClick={() => {
                            this.handleClick(menu)
                        }}>
                            {this.getMenuTitle(menu)}
                            {/* <img alt=''
                                src={require('../assets/images/copy.png').default}
                                style={{ width: 24, height: 24 }}
                            /> */}
                            {/* {menu.name} */}
                        </Menu.Item>
                    )
                }
            })

        )

    }
    handleClick(menu) {
        this.props.menuItemClick(menu)
    }
    render() {
        // console.log('-----------------menuData---------------', this.props.menuData)
        return (
            <Menu
                {...this.props}
                mode="inline"
                style={{ width: 240, height: '100%', ...this.props.style }}
                onClick={(e) => {
                    this.props.menuClick(e)
                }}
            >
                {this.recursion(this.props.menuData)}
            </Menu>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        menuData: store.storeCommon.menuData,
        // enterpriseMenu: store.storeCommon.enterpriseMenu,
        menuPath: store.storeCommon.menuPath,
        // accountType: store.storeUser.accountType
    }
})(RLMenu)
