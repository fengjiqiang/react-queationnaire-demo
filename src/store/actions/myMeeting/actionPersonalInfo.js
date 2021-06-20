import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'

const actionPersonalInfo = {
    getUserInfo() {
        return getData({
            method: 'get', url: interfaces.PERSON_INFO
        }).then(res => {
            let userInfo = res.data
            if (res.code === 200) {
                store.dispatch({ type: actionTypes.USERINFO_INIT, data: userInfo })
                // this.getHash({ nickName: userInfo.nickname, userNumber: userInfo.meeting.meeting_number, userId: userInfo.id })
            } else {

            }
            return res
        })
    },
    getHash({ nickName, userNumber, userId }) {
        getData({
            method: 'post', url: interfaces.MEETING_HASH,
            data: {
                fullurl: JSON.stringify({ nickName, roomNumber: userNumber, userId })
            }

        }).then(res => {
            if (res.code === 200) {
                store.dispatch({ type: actionTypes.MEETING_HASH_CHANGE, data: res.data })
            }
        })
    },

    updateNickName(nickname) {
        return getData({
            method: 'post', url: interfaces.NICKNAME_UPDATE, data: { nickname }
        })
    },
    // 设置密码
    setPassword({ password, confirm_password }) {
        return getData({
            method: 'post',
            url: interfaces.SET_PASSWORD,
            data: { password, confirm_password }
        })
    }
}
export default actionPersonalInfo