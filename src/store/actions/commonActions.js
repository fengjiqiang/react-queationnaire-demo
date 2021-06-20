import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import Cookies from 'js-cookie'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'
import iframeMessage from '@/libs/IframeMessage.js'
import config from '@/config.js'
import utils from '@/libs/utils.js'
import CacheRoute, { dropByCacheKey, getCachingKeys } from 'react-router-cache-route'
const cacheRoute = config.cacheRoute

let commonAction = {
    searchPath(menuData, keyPath) {
        if (keyPath.startsWith('/')) {
            keyPath = keyPath.substring(1);
        }
        keyPath = keyPath.split('/');
        let pathArr = [];
        // if (!menuData) return []
        for (let i = 0; i < keyPath.length; i++) {
            let item = menuData.filter(item => {
                return item.menu_code.indexOf(keyPath[i]) >= 0
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

        return pathArr
    },
    getPath(keyPath) {
        let pathArr = this.searchPath(store.getState().storeCommon.menuData, keyPath);
        if (pathArr.length) {
            store.dispatch({ type: actionTypes.MENU_PATH, data: pathArr });
        } else {
            // enterpriseMenu
            pathArr = this.searchPath(store.getState().storeCommon.menuData, keyPath);
            store.dispatch({ type: actionTypes.MENU_PATH, data: pathArr });
        }

        // return pathArr
    },
    catchFrom(from) {
        store.dispatch({ type: actionTypes.FROM, data: from })
    },
    menuDataManage(menus) {
        if (Array.isArray(menus) && menus.length) {
            for (let i = 0; i < menus.length; i++) {
                if (menus[i].children && menus[i].children.length) {
                    delete menus[i].menu_route
                    this.menuDataManage(menus[i].children)
                }
            }
        }
    },
    getMenuData() {
        return getData({
            method: 'POST',
            url: interfaces.MENU
        }).then(res => {
            if (res.code === 200) {
                let menus = res.data
                if (!cacheRoute) {
                    this.menuDataManage(menus)
                }
                store.dispatch({
                    type: actionTypes.MENU_INIT,
                    data: menus || [],
                })
            }
            return res
        })
    },
    envInit(env) {
        store.dispatch({
            type: actionTypes.REQUEST_HOST,
            env
        })
        localStorage.setItem('env', env)
    },
    // 合法性校验
    textCheck({ type = 'nickname', content }) {
        let token = Cookies.get('token')
        return getData({
            method: 'post', url: interfaces.TEXT_CHECK, data: { type, content, token }
        })
    },
    getCode({ mobile, type }) {   // 获取短信验证码
        if (!mobile) {
            return Promise.reject({ code: 400, msg: '请输入手机号' })
        }
        return getData({
            method: 'POST',
            url: interfaces.SMS_SEND,
            data: { mobile, type },
            extraCheckdelay: mobile
        })
    },
    getImageCode({ mobile }) {  // 获取图片验证码
        return getData({
            method: 'get',
            url: interfaces.GET_IMAGE_CODE,
            data: { mobile }
        })
    },
    mobileVerify({ mobile, msg_code }) { // 验证短信验证码
        return getData({
            method: 'post',
            url: interfaces.MOBILE_VERIFY,
            data: {
                mobile, msg_code
            }
        })
    },
    imgCodeCheck({ mobile, code }) {    // 验证图形验证码
        return getData({
            method: 'get',
            url: interfaces.IMAGE_CODE_CHECK,
            data: {
                mobile, code
            }
        })
    },
    // 获取登录账号类型
    getAccountType() {
        return getData({ method: 'post', url: interfaces.ACCOUNT_TYPE }).then(res => {
            if (res.code === 200) {
                let loginType = res.data.login_type
                if (loginType === 'person') {
                    loginType = 'personal'
                }
                store.dispatch({ type: actionTypes.INIT_ACCOUNT_TYPE, data: loginType });
            }
        })
    },
    // 更新树数据
    updateTreeData(treeData) {
        store.dispatch({ type: actionTypes.INVITE_TREE_DATA, data: treeData });
    },
    fileUpload(data) {
        return getData({
            method: 'post',
            url: interfaces.FilE_UPLOAD,
            data: data,
            contentType: 'multipart/form-data'
        })
    },
    // 上传图片
    imgUpload(file) {
        return getData({
            method: 'post',
            url: interfaces.IMAGE_UPLOAD,
            data: file,
            contentType: 'multipart/form-data'
        })
    },
    // 更新个人资料的头像
    avatarUpdate(avatar) {
        return getData({
            method: 'post',
            url: interfaces.PERSON_AVATAR_UPDATE,
            data: avatar,
            contentType: 'multipart/form-data'
        })
    },
    // 获取行业类型/企业规模选项
    // 
    getCompanySelections() {
        return getData({
            method: 'GET',
            url: interfaces.ACCOUNT_SELECTION,
        }).then(res => {
            if (res.code === 200) {
                store.dispatch({
                    type: actionTypes.INIT_COMPANY_SELECTIONS,
                    data: res.data
                })
            }

        })
    },
    getAreaCodeList() {
        return getData({
            method: 'GET',
            url: interfaces.GET_AREA_CODE,
        }).then(res => {
            // let areaCode = {...res.data,'#':res.data.public}
            let areacodeList = []
            for (let key in res.data) {
                let title = key === 'public' ? '#' : key
                areacodeList.push({
                    title,
                    subList: res.data[key]
                })
            }
            store.dispatch({ type: actionTypes.INIT_AREACODE_LIST, data: areacodeList });
            return res

        })
    },
    // 获取权限列表
    getPermission() {
        return getData({
            method: 'POST',
            url: interfaces.PERMISSION_LIST
        }).then(res => {
            if (res.code === 200) {
                interfaces.mixin(res.data)
            }
        })
    },

    // 从父窗口获取token
    getToken() {
        const token = Cookies.get('token')
        config.initToken(token)
        return token
        // if (window.parent === window) {
        //     let token = Cookies.get('token')
        //     config.initToken(token)
        //     return Promise.resolve(token)
        // }
        // return iframeMessage.send({}, 'GET_TOKEN').then(res => {
        //     config.initToken(res)
        //     return res
        // })
    },
    // 更新缓存路由数据
    cacheRoutesChange({ type, route }) {
        let cacheRoute = config.cacheRoute
        //let cacheRoute = localStorage.getItem('cacheRoute')
        if (!cacheRoute) {
            return
        }
        let cacheRoutes = store.getState().storeCommon.cacheRoutes
        cacheRoutes = JSON.parse(JSON.stringify(cacheRoutes))
        if (type === 'add') {
            let has = false
            for (let i = 0; i < cacheRoutes.length; i++) {
                if (cacheRoutes[i].menu_route === route.menu_route) {
                    has = true
                    cacheRoutes[i].active = true
                } else if (cacheRoutes[i].active) {
                    cacheRoutes[i].active = false
                }
            }
            if (!has && route) {
                cacheRoutes.push({ ...route, active: true, tab: route.name, id: route.menu_route })
            }
        } else if (type === 'delete') {

            for (let i = cacheRoutes.length - 1; i >= 0; i--) {
                if (cacheRoutes[i].menu_route === route.menu_route) {
                    let deleteRoute = cacheRoutes.splice(i, 1)[0]

                    if (cacheRoutes.length > 0) {
                        if (deleteRoute.active) {
                            if (cacheRoutes[i]) {
                                cacheRoutes[i].active = true
                            } else {
                                i -= 1
                                cacheRoutes[i].active = true
                            }
                            utils.pushVC({ pathname: cacheRoutes[i].menu_route })
                        }

                    } else {
                        cacheRoutes.push({
                            active: true,
                            id: '/personalinfo',
                            name: '个人资料',
                            tab: '个人资料',
                            menu_icon: "personalInfo",
                            menu_code: 'personalinfo',
                            menu_route: '/personalinfo',
                            tag: 'personalinfo',
                        })
                        i = 0
                        utils.pushVC({ pathname: cacheRoutes[i].menu_route })
                    }



                    break
                }

            }
            // cacheRoutes = cacheRoutes.filter(r => {
            //     return r.menu_route !== route.menu_route
            // })
            // dropByCacheKey(route.menu_route)
        } else if (type === 'replace') {
            cacheRoutes = cacheRoutes.map(r => {
                if (r.menu_route === route) {
                    return { ...r, active: true }
                }
                return { ...r, active: false }
            })
        }
        store.dispatch({ type: actionTypes.CACHE_ROUTES_CHANGE, data: cacheRoutes });
    }
}
export default commonAction