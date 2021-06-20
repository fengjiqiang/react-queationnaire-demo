import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'

const actionMeetingList = {
    /**
     * @param {*} { type, room, order, page, pagesize, accountType = 'personal':个人版还是企业版, isMyMeeting = false:如果是企业版，是自己相关的还是企业所有的 }
     * @return {*} 
     */
    getMeetingList({ type, room, order, page, pagesize, accountType = 'personal', isMyMeeting = false, start_time = '', end_time = '' }) {
        console.log('accountType,isMyMeeting:', accountType, isMyMeeting)
        let url
        if (accountType === 'personal') {
            url = interfaces.MEETING_LIST_PERSONAL
        } else if (isMyMeeting) {
            url = interfaces.MEETING_LIST_CMP_MINE
        } else {
            url = interfaces.MEETING_LIST_CMP
        }
        return getData({
            method: 'get', url,
            data: {
                type, room, order, page, pagesize, start_time, end_time
            }
        })
    },
    // 预约会议
    appointMeeting({
        title, start_date, start_time, end_date, end_time, is_password, password, mustmaster, userlist, accountType
    }) {
        if (accountType === 'company') {
            return getData({
                method: 'POST',
                url: interfaces.MEETING_APPOINT_COMPANY,
                data: { title, start_date, start_time, end_date, end_time, is_password, password, mustmaster, userlist }
            })
        } else {
            return getData({
                method: 'POST',
                url: interfaces.MEETING_APPOINT,
                data: { title, start_date, start_time, end_date, end_time, is_password, password, mustmaster, userlist }
            })
        }

    },
    // 编辑会议
    updateMeeting({
        meeting_id,
        title,
        start_date,
        start_time,
        end_date,
        end_time,
        is_password,
        password, mustmaster, userlist
    }) {
        return getData({
            method: 'POST',
            url: interfaces.MEETING_UPDATE,
            data: {
                meeting_id,
                title,
                start_date,
                start_time,
                end_date,
                end_time,
                is_password,
                password, mustmaster, userlist
            }
        })
    },
    // 获取会议详情
    getMeetingDetail(meeting_id) {
        return getData({
            method: 'get',
            url: '/api/v1/meeting/detail',
            data: { meeting_id }
        })
    },
    // 根据都好隔开的id字符串获取用户对象的数组
    getUserObjList(idString) {
        let idList = idString.split(',')

        console.log(123, store.getState().userList.allUserInfo)
        let allUser = store.getState().userList.allUserInfo.list

        let resList = allUser.filter(user => {
            return idList.includes(String(user.id))
        })
        return resList
    },
    getMeetingHash({ roomId, startTime, endTime, title, password, is_appointment }) {
        return getData({
            method: 'post', url: interfaces.MEETING_HASH,
            data: {
                fullurl: JSON.stringify({ roomId, startTime, endTime, title, password, is_appointment })
            }
        })
    },

    // 取消会议
    cancelMeeting(meeting_id) {
        return getData({
            method: 'POST',
            url: interfaces.MEETING_CANCEL,
            data: { meeting_id }
        })
    },
    // 删除会议
    delMeeting(meeting_id, bid) {
        return getData({
            method: 'POST',
            url: interfaces.MEETING_DELETE,
            // meeting_id
            data: { bid }
        })
    },
    /**
     *导出参会者列表
     *
     */
    exportMemberList(meetingId) {
        window.open(config.requestHosts + interfaces.MEMBER_EXPORT_PERSONAL + '?meeting_id=' + meetingId)
        // return getData({
        //     method: 'get',
        //     url: interfaces.MEMBER_EXPORT,
        //     data: { ids }
        // })
    },
    /**
     * 导出会议列表
    */
    exportMeetingList(ids) {
        window.open(config.requestHosts + interfaces.MEETING_EXPORT_PERSONAL + '?ids=' + ids)
    }

}
export default actionMeetingList