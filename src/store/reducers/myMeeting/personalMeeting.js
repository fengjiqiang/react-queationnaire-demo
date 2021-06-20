
import actionTypes from '../../actionTypes.js'
let defaultState = {
    personalMeetingInfo: {
        "meeting_number": "",
        "is_join": 0,
        "meeting_pwd": "",
        "join_url": ""
    }
}
function personalMeeting(state = defaultState, payload) {
    switch (payload.type) {
        case actionTypes.INIT_PERSONAL_INFO:
            return {
                ...state, personalMeetingInfo: payload.data
            }
        default:
            return state;
    }
}

export default personalMeeting;