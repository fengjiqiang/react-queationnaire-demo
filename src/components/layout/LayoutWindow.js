// import { IndexRoute } from 'react-router';
import { Route, Redirect } from 'react-router'
import BaseCmp from '../BaseCmp'
import PageTabs from '@components/layout/PageTabs.js'  // 顶部标签栏
import { connect } from 'react-redux'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
// import actionPersonalInfo from '@actions/myMeeting/actionPersonalInfo.js'
import route_cmp from '@/pages/route_cmp.js'
import eventBus from '@/libs/EventBus.js'
import config from '../../config'
import utils from '@/libs/utils.js'

class LayoutWindow extends BaseCmp {
    componentWillMount() {
        console.log('layoutWindow', this.props.history.location.pathname)
        let pathname = this.props.history.location.pathname
        if (pathname === '/') {
            utils.pushVC({ pathname: '/personalinfo' })
        }
        if (!pathname.includes('myMeeting')) {
            // utils.pushVC({ pathname: '/myMeeting/personalinfo' })
        }

    }
    getAppRoutes = () => {
        let routes = []
        let cacheRoute = config.cacheRoute

        for (let i = 0; i < this.props.menuData.length; i++) {
            this.iterRouter(this.props.menuData[i], routes, cacheRoute)
        }
        console.log('routes:', routes, this.props.menuData)
        return routes
    }
    iterRouter = (menu, routes, cacheRoute) => {
        if (menu.children && menu.children.length) {
            for (let i = 0; i < menu.children.length; i++) {
                this.iterRouter(menu.children[i], routes, cacheRoute)
            }
        } else {
            let Component = route_cmp[menu.menu_code]
            if (cacheRoute) {
                routes.push(<CacheRoute
                    path={menu.menu_route}
                    key={menu.menu_code}
                    name={menu.name}
                    cacheKey={menu.menu_code}
                    menu_code={menu.menu_code}
                    // component={route_cmp[menu.menu_code]}
                    render={props => {

                        eventBus.emit('router-change', {
                            menu_code: menu.menu_code,
                        })
                        return <Component {...props} />
                    }}
                    menu={menu}
                />)
            } else {
                routes.push(<Route
                    path={menu.menu_route}
                    key={menu.menu_code}
                    name={menu.name}
                    cacheKey={menu.menu_code}
                    menu_code={menu.menu_code}
                    // component={route_cmp[menu.menu_code]}
                    render={props => {

                        eventBus.emit('router-change', {
                            menu_code: menu.menu_code,
                        })
                        return <Component {...props} />
                    }}
                    menu={menu}
                />)
            }

        }
    }
    render() {
        let cacheRoute = config.cacheRoute;
        if (cacheRoute) {
            return (
                <div className='layoutWindow'
                    style={{ ...this.props.style, background: this.layoutBgColor, display: 'flex', flexDirection: 'column' }}>
                    <PageTabs />
                    <div className='area'>
                        <CacheSwitch>
                            {
                                this.getAppRoutes()
                            }
                            {/* <Redirect key='/' from="" to="/personalinfo"></Redirect> */}
                        </CacheSwitch>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='layoutWindow'
                    style={{ ...this.props.style, background: this.layoutBgColor, display: 'flex', flexDirection: 'column' }}>
                    {
                        this.getAppRoutes()
                    }
                    <Redirect key='/' from="" to="/personalinfo"></Redirect>
                </div>
            )
        }

    }
}
// export default LayoutWindow
export default connect((store, props) => {
    return {
        ...props,
        menuData: store.storeCommon.menuData,
    }
})(LayoutWindow)