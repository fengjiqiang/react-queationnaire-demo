import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import CacheRoute, { dropByCacheKey, getCachingKeys } from 'react-router-cache-route'
import eventBus from '@/libs/EventBus.js'
import config from '../config';

const PrivateRoute = ({ component: Component, ...rest }) => {
    let cacheRoute = config.cacheRoute
    console.log('rest:', rest)
    // if (cacheRoute && !rest.menu.children) {
    if (cacheRoute) {
        return <CacheRoute
            {...rest}
            exact
            // cacheKey={rest.menu_code}
            render={props => {
                if (rest.path) {
                    eventBus.emit('router-change', {
                        menu_code: rest.menu_code,
                    })
                }
                return <Component {...props} />
            }}
        />
    } else {
        return <Route
            {...rest}
            exact
            render={props => {
                if (rest.path) {
                    eventBus.emit('router-change', {
                        menu_route: rest.path,
                    })
                }
                return <Component {...props} />
            }}
        />
    }

}

export default PrivateRoute