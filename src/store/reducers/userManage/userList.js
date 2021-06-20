
import { PageLoading } from '@ant-design/pro-layout'
import actionTypes from '../../actionTypes.js'
let defaultState = {
    activeUserList: [],
    unactiveUserList: [],
    planAvailable: 0,
    allUserInfo: []
}
function userList(state = defaultState, payload) {
    switch (payload.type) {
        case actionTypes.ACT_USERLIST_CHANGE:
            return {
                ...state, activeUserList: payload.data
            }
        case actionTypes.UNACT_USERLIST_CHANGE:
            return {
                ...state, unactiveUserList: payload.data
            }
        case actionTypes.INIT_ALL_PLAN:
            return {
                ...state, planAvailable: payload.data
            }
        case actionTypes.INIT_ALL_USERS:
            return {
                ...state, allUserInfo: payload.data
            }
        default:
            return state;
    }
}

export default userList;