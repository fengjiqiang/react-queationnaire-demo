import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import Cookies from 'js-cookie'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'


const actionMemberManage = {
    /**
     *获取成员列表
     *
     * @param {*} meeting_id
     * @return {*} 
     */
    getMemberList(meeting_id) {
        return getData({
            method: 'get',
            url: interfaces.MEETING_MEMBERLIST,
            data: { meeting_id }
        })
    },
    /**对房间控制
     *
     *
     * @param {*} { type, action }
     */
    roomOption({ type, action, meeting_id, option }) {
        if (type === 'mute') {
            let param = { status: action ? 0 : 1, meeting_id, openSelf: option.openSelf }
            if (action) {
                param.openSelf = option.openSelf
            }
            return getData({
                method: 'post',
                url: interfaces.MEETING_ALL_MUTE,
                data: param
            })
        } else if (type === 'lock') {
            // MEETING_LOCK
            return getData({
                method: 'post',
                url: interfaces.MEETING_LOCK,
                data: { status: action ? 1 : 0, meeting_id }
            })
        } else {
            return Promise.reject({ msg: '出错了' })
        }
    },
    /**
     * 对用户操作
     *
     * @param {*} {type,action,meeting_id,uid}
     */
    userOption({ type, action, meeting_id, uid, ...rest }) {
        if (type === 'mic') {
            // 麦克风操作
            return getData({
                method: 'post',
                url: interfaces.MEETING_CTRL_MIC,
                data: { meeting_id, status: action, uid }
            })
        } else if (type === 'remove') {
            // 移除会议室
            return getData({
                method: 'post',
                url: interfaces.MEETING_CTRL_REMOVE,
                data: { meeting_id, uid }
            })
        } else if (type === 'relationmaster') {
            // 联席主持人操作
            return getData({
                method: 'post',
                url: interfaces.MEETING_CTRL_RELATIONMASTER,
                data: { meeting_id, status: action, uid }
            })
        } else if (type === 'master') {
            // 主持人操作
        } else if (type === 'camera') {
            // 摄像头操作

        } else if (type === 'rename') {
            // 改名
            return getData({
                method: 'post',
                url: interfaces.MEETING_CTRL_RENAME,
                data: { meeting_id, nickname: rest.nickname, uid }
            })
        }
    },

}
export default actionMemberManage