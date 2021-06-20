import { Component } from 'react'
import { connect } from 'react-redux'
import { RLInput, RLFilterTool, RLButton, RLTable, RLPageTabs } from '@components/index.js'
import commonActions from '@actions/commonActions.js'
import CacheRoute, { dropByCacheKey, getCachingKeys } from 'react-router-cache-route'

import utils from '@/libs/utils.js'

class PageTabs extends Component {
    deleteTab = (menu) => {
        dropByCacheKey(menu.menu_code)
        commonActions.cacheRoutesChange({ type: 'delete', route: menu })
    }
    render() {
        let cacheRoutes = this.props.cacheRoutes
        let activeKey = ''
        for (let i = 0; i < cacheRoutes.length; i++) {
            if (cacheRoutes[i].active) {
                activeKey = cacheRoutes[i].menu_route
            }
        }
        // console.log('cacheRoutes:', cacheRoutes)
        return (
            <div className='page-tabs'>
                <RLPageTabs
                    // type="editable-card"
                    onChange={(route) => {
                        // console.log(route)
                        commonActions.cacheRoutesChange({ type: 'replace', route })
                        utils.pushVC({ pathname: route })
                    }}
                    activeKey={activeKey}
                    tabPanes={
                        cacheRoutes
                    }
                    deleteTab={this.deleteTab}
                />
            </div>
        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
        cacheRoutes: store.storeCommon.cacheRoutes
    }
})(PageTabs)
