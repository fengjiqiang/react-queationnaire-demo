import RLMenu from '../RLMenu.js';
import { connect } from 'react-redux'
import BaseCmp from '../BaseCmp'
import commonActions from '@actions/commonActions.js'
import eventBus from '@/libs/EventBus.js'
class LayoutMenu extends BaseCmp {
    constructor(props) {
        super(props)
        this.menuData = []
        this.state = {
            currentMenuCode: ['myMeeting.personalmeeting']
        }
        eventBus.addListener('router-change', ({ menu_code }) => {
            this.setState({
                currentMenuCode: [menu_code]
            })
        })
    }
    componentDidMount() {
        let env = localStorage.getItem('env')
        this.envChange(env)
    }
    menuClick = (e) => {
    }
    getPath(keyPath) {
        commonActions.getPath(keyPath)
    }
    menuItemClick = (menu) => {
        this.props.history.push(menu.menu_route)
        commonActions.cacheRoutesChange({ type: 'add', route: menu })
    }
    getMenuArr(keyPath) {
        let pathArr;
        pathArr = this.searchPath(this.props.menuData.persoanl, keyPath);
        if (pathArr.length) {
            return pathArr;
        } else {
            pathArr = this.searchPath(this.props.menuData.enterprise, keyPath);
            return pathArr;
        }
    }
    searchPath(menuData, keyPath) {
        if (keyPath.startsWith('/')) {
            keyPath = keyPath.substring(1);
        }

        keyPath = keyPath.split('/');
        let pathArr = [];

        for (let i = 0; i < keyPath.length; i++) {
            let item = menuData.filter(item => {
                return item.memenu_codenuId.indexOf(keyPath[i]) >= 0
            })[0];
            if (!item) {
                break;
            }
            pathArr.push(item);
            menuData = item.children;
            if (!menuData) {
                break;
            }
        }
        return pathArr;
    }
    getDefaultSelectedKeys() {
        let pathArr = this.getMenuArr(this.props.menuData, this.props.history.location.pathname);
        if (pathArr.length >= 1) {
            return [pathArr[pathArr.length - 1].menu_route];
        } else {
            return [];
        }
    }
    getDefaultOpenKeys() {
        let pathArr = this.getMenuArr(this.props.history.location.pathname);
        if (pathArr.length >= 2) {
            return [pathArr[pathArr.length - 2].menu_route];
        } else if (pathArr.length === 1) {
            return [pathArr[0].menu_route];
        } else {
            return [];
        }
    }

    envChange = (val) => {
        commonActions.envInit(val)
    }
    render() {
        return (
            <div style={{ ...this.props.style, backgroundColor: this.layoutBgColor }} className='menuContainer'>
                <RLMenu
                    style={{ width: '100%', backgroundColor: this.layoutBgColor }}
                    // defaultSelectedKeys={['/myMeeting/personalinfo']}
                    selectedKeys={this.state.currentMenuCode}
                    defaultOpenKeys={[]}
                    mode="inline"
                    // menuData={this.props.menuData}
                    menuClick={this.menuClick}
                    menuItemClick={this.menuItemClick}
                />
            </div>
        )
    }
}
// export default LayoutMenu
export default connect((store, props) => {
    return {
        ...props,
        menuData: store.storeCommon.menuData,
        env: store.storeCommon.env
    }
})(LayoutMenu)