import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'

const actionMeetingList = {
    /**
     * @param {*} { room, order, meeting_status, nickname, page, pagesize }
     * @return {*} 
     */
    getMeetingList({ room, order, meeting_status, nickname, start_time, end_time, page, pagesize, isMyMeeting }) {
        let url = '';
        if (!isMyMeeting) {
            url = interfaces.MEETING_ALLMEETINGLIST;
        } else {
            url = interfaces.MEETING_MYMEETINGLIST;
        }

        return getData({
            method: 'get', url,
            data: {
                room, order, meeting_status, nickname, page, start_time, end_time, pagesize,
            }
        })
    },
    // 预约会议
    appointMeeting(params) {
        return getData({
            method: 'POST',
            url: interfaces.MEETING_CREATE,
            data: params
        })
    },
    //会议内用户列表信息获取接口
    getUserMeeting(params) {
        return getData({
            method: 'get',
            url: interfaces.MEETING_GETUSER,
            data: params
        })
    },
    // 编辑会议
    updateMeeting(param) {
        return getData({
            method: 'POST',
            url: interfaces.MEETING_EDIT,
            data: param
        })
    },
    // 获取会议详情
    getMeetingDetail(meeting_id) {
        return getData({
            method: 'get',
            url: interfaces.MEETING_DETAIL,
            data: { meeting_id }
        })
    },
    // 列表邀请参会者
    listInviteUser(params) {
        return getData({
            method: 'post',
            url: interfaces.MEETING_LISTINVITE,
            data: params
        })
    },
    /**
     * 文档模块获取-会议列表
     */
    getDocumentsMeeting(params) {
        return getData({
            method: 'get',
            url: interfaces.DOCUMENTS_MEETING,
            data: params
        })
    },
    /**
     * 获取会议对应的文档列表
     */
    getDocumentsList(params) {
        return getData({
            method: 'get',
            url: interfaces.DOCUMENTS_MEETING_LIST,
            data: params
        })
    },
    /**
     * 修改文档权限
     */
    changeDocRight(params) {
        return getData({
            method: 'post',
            url: interfaces.DOCUMENTS_CHANGE_RIGHTS,
            data: params
        })
    },
    /**
     * 获取会议审核列表
     */
    getMeetingExamineList(params) {
        return getData({
            method: 'get',
            url: interfaces.MEETING_EXAMINEMEETINGLIST,
            data: params
        })
    },
    /**
     * 发送审核信息
     */
    examineMeeting(params) {
        return getData({
            method: 'post',
            url: interfaces.MEETING_APPROVE,
            data: params
        })
    },
    /**
     * 获取审核详情
     */
    getExmineDetail(params) {
        return getData({
            method: 'get',
            url: interfaces.MEETING_EXMINE_DETAIL,
            data: params
        })
    },
    /**
     * 结束会议（结束进行中的会议）
     */
    endMeeting(params) {
        return getData({
            method: 'get',
            url: interfaces.MEETING_ENDMEETING,
            data: params
        })
    },
    /**
     * 删除取消会议
     */
    deleteMeeting(params) {
        return getData({
            method: 'post',
            url: interfaces.MEETING_CANCEL,
            data: params
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
    exportMemberList( ids) {
        return getData({
            method: 'GET',
            url: interfaces.MEETING_EXPORTMEETINGUSER + '?meeting_id=' + ids,
            // meeting_id
            // data: { bid }
            responseType: 'blob'
        })
        // window.open(config.requestHosts + interfaces.MEETING_EXPORTMEETINGUSER + '?meeting_id=' + meetingId)
    },
    /**
     * 导出会议列表
    */
    exportMeetingList(meetingId) {
        return getData({
            method: 'GET',
            url: interfaces.MEETING_EXPORTMEETINGLIST + '?meeting_ids=' + meetingId,
            // meeting_id
            // data: { bid }
            responseType: 'blob'
        })
        // window.open(config.requestHosts + interfaces.MEETING_EXPORTMEETINGLIST + '?ids=' + ids)
    }
}
export default actionMeetingList