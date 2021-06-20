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
    // updateCorpName(corp_name){
    //     return getData({
    //         method: 'post', url: interfaces.CORPNAME_UPDATE, data: { corp_name }
    //     })
    // },
    // updateNickName(nickname) {
    //     return getData({
    //         method: 'post', url: interfaces.NICKNAME_UPDATE, data: { nickname }
    //     })
    // },
    updateInfo(data){
        return getData({
            method: 'post', url: interfaces.INFO_UPDATE, data: data
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