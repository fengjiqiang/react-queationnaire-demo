import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'

const actionSeminar = {
    /**
     * 获取所有直播的列表
     */
    getAllLiveList(param) {
        return getData({
            method: 'get',
            url: interfaces.LIVE_ALLLIVELIST,
            data: param
        })
    },
    /**
     * 获取直播详情
     */
    getLiveDetail(param) {
        return getData({
            method: 'get',
            url: interfaces.LIVE_DETAIL,
            data: param
        })
    },
    /**
     * 创建直播
     */
    createNewLive(param) {
        return getData({
            method: 'post',
            url: interfaces.LIVE_CREATE,
            data: param
        })
    },
    /**
     * 编辑直播
     */
    editNewLive(param) {
        // mustmaster 是否允许在主持人之前入会 1 可以 0 不可以
        param.mustmaster = 0
        return getData({
            method: 'post',
            url: interfaces.LIVE_EDIT,
            data: param
        })
    },
    /**
     * 审核直播
     */
    examineLive(param) {
        // mustmaster 是否允许在主持人之前入会 1 可以 0 不可以
        param.mustmaster = 0
        return getData({
            method: 'post',
            url: interfaces.LIVE_EXAMINE,
            data: param
        })
    },
    /**
     * 我的直播
     */
    myLiveList(param) {
        return getData({
            method: 'get',
            url: interfaces.LIVE_MYLIVELIST,
            data: param
        })
    },
    /**
     * 审核直播列表
     */
    examineLiveList(param) {
        return getData({
            method: 'get',
            url: interfaces.LIVE_EXAMINELIVELIST,
            data: param
        })
    },
    /**
     * 获取审核结果详情
     */
    getExamineResult(param) {
        return getData({
            method: 'get',
            url: interfaces.LIVE_EXAMINE_DETAIL,
            data: param
        })
    },
    /**
     * 删除/取消研讨会
     */
    seminarDelete(param) {
        return getData({
            method: 'post',
            url: interfaces.SEMINAR_DELETE,
            data: param
        })
    },
    /**
     * 结束研讨会
     */
    seminarClose(param) {
        return getData({
            method: 'post',
            url: interfaces.SEMINAR_END,
            data: param
        })
    },
    /**
     * 研讨会详情
     */
    seminarDetail(param) {
        return getData({
            method: 'get',
            url: interfaces.SEMINAR_DETAIL,
            data: param
        })
    },
    /**
     * 创建研讨会
     */
    seminarCreate(param) {
        return getData({
            method: 'post',
            url: interfaces.SEMINAR_CREATE,
            data: param
        })
    },
    /**
     * 编辑研讨会
     */
    seminarEdit(param) {
        return getData({
            method: 'post',
            url: interfaces.SEMINAR_EDIT,
            data: param
        })
    },
    /**
     * 研讨会发送邀请
     */
    seminarSend(param) {
        return getData({
            method: 'post',
            url: interfaces.SEMINAR_SEND,
            data: param
        })
    },
    /**
     * 保存研讨会邀请嘉宾列表
     */
    seminarInvite(param) {
        return getData({
            method: 'post',
            url: interfaces.SEMINAR_INVITE,
            data: param
        })
    },
}
export default actionSeminar