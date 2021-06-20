import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'

const actionPersonalMeeting = {
    // 获取个人会议号
    getPersonalMeetingInfo() {
        return getData({
            method: 'post', url: interfaces.PERSONAL_MEETING_INFO
        }).then(res => {
            // console.log('getPersonalMeetingInfo:', res.data)
            if (res.code === 200) {
                store.dispatch({ type: actionTypes.INIT_PERSONAL_INFO, data: res.data })
            }
            return res
        })
    },
    // 编辑个人会议号
    personalMeetingUpdate({ is_join, meeting_pwd, meeting_number }) {
        return getData({
            method: 'post', url: interfaces.PERSONAL_MEETING_UPDATE, data: { is_join, meeting_pwd, meeting_number }
        })
    }
}
export default actionPersonalMeeting