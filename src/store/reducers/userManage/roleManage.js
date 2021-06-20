
import actionTypes from '../../actionTypes.js'
function roleManage(state = { roleList: [] }, payload) {
    switch (payload.type) {
        case actionTypes.ALL_ROLES_CHANGE:
            return {
                ...state, roleList: payload.data
            }
        default:
            return state;
    }
}

export default roleManage;