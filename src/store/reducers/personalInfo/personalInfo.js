
import actionTypes from '../../actionTypes.js'

let defaultUserInfo = {
    avatar: '',
    id: '',
    info: {
        mobile: '',
        email: null,
        is_default_pwd: 0,
    },
    is_handle: '',
    meeting: {},
    nickname: 'name',
    target_type: [],
    type: 'user',
}


function personalInfo(state = { userInfo: defaultUserInfo, personalHash: '' }, payload) {
    switch (payload.type) {
        case actionTypes.CHANGE_NAME:
            return {
                ...state, name: payload.name
            }
        case actionTypes.USERINFO_INIT:
            return {
                ...state, userInfo: payload.data
            }
        case actionTypes.MEETING_HASH_CHANGE:
            return {
                ...state, personalHash: payload.data
            }
        default:
            return state;
    }
}

export default personalInfo;