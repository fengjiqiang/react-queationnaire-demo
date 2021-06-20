
import actionTypes from '../actionTypes.js'
let defaultState = {
    env: 'dev', // 当前环境
    accountType: 'company',    // 当前登录版本 personal:个人版/company：企业版
    menuData: [],
    menuPath: [],
    _treeData: [
        {
            type: 'folder',
            name: '我的设备',
            checked: false,
            id: 'device',
            children: [
                {
                    type: 'file',
                    name: '像个里拉',
                    checked: true,
                    id: 1
                }, {
                    type: 'file',
                    name: '实验',
                    id: 2
                }, {
                    type: 'folder',
                    name: 'sub',
                    id: 10,
                    children: [
                        {
                            type: 'file',
                            name: '孵化器1',
                            id: 3
                        }, {
                            type: 'file',
                            name: '孵化器2',
                            id: 4
                        },
                    ]
                }
            ]
        }, {
            type: 'folder',
            name: '用户',
            id: 'user',
            children: [
                {
                    type: 'file',
                    name: '张晓满',
                    id: 5
                }, {
                    type: 'file',
                    name: '张晓满',
                    id: 6
                }, {
                    type: 'file',
                    name: '张晓满',
                    id: 7
                },
            ]
        }
    ],
    companyInfoSelections: {
        enterprise_size: [], // 企业规模
        industry: [],    // 行业类型
    },
    areacodeList: [],    // 手机号区号列表
    cacheRoutes: [],     // 本地缓存的路由列表

    uploading: false
}
function storeCommon(state = defaultState, payload) {
    switch (payload.type) {
        case actionTypes.REQUEST_HOST:
            return {
                ...state, env: payload.env
            }
        case actionTypes.MENU_INIT:
            return {
                ...state,
                menuData: payload.data,
            }
        case actionTypes.MENU_PATH:
            return {
                ...state, menuPath: payload.data
            }
        case actionTypes.INIT_ACCOUNT_TYPE:
            return {
                ...state, accountType: payload.data
            }
        case actionTypes.INVITE_TREE_DATA:
            return {
                ...state, _treeData: payload.data
            }
        case actionTypes.INIT_COMPANY_SELECTIONS:
            return {
                ...state, companyInfoSelections: payload.data
            }
        case actionTypes.INIT_AREACODE_LIST:
            return {
                ...state, areacodeList: payload.data
            }
        case actionTypes.CACHE_ROUTES_CHANGE:
            return {
                ...state, cacheRoutes: payload.data
            }
        case actionTypes.UPLOAD_STATE_CHANGE:
            return {
                ...state, uploading: payload.data
            }
        default:
            return state;
    }
}

export default storeCommon;