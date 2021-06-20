import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'

const actionEventRegistration = {

    // 根据链接获取二维码
    getQRCode(data) {
        return getData({
            method: 'get',
            url: interfaces.GET_QRCODE,
            data
        })
    },
    // 获取活动列表
    getEventList(data) {
        return getData({
            method: 'get',
            url: interfaces.EVENT_LIST,
            data
        })
    },
    // 获取显示字段
    getEventShowField() {
        return getData({
            method: 'get',
            url: interfaces.EVENT_SHOW_FIELD
        })
    },
    // 活动创建
    eventCreate(data) {
        return getData({
            method: 'post',
            url: interfaces.EVENT_CREATE,
            data
        })
    },
    // 活动编辑
    eventEdit(data) {
        return getData({
            method: 'post',
            url: interfaces.EVENT_EDIT,
            data
        })
    },
    // 活动详情
    getEventDetail(data) {
        return getData({
            method: 'get',
            url: interfaces.EVENT_DETAIL,
            data
        })
    },
    // 活动删除
    eventDelete(data) {
        return getData({
            method: 'get',
            url: interfaces.EVENT_DELETE,
            data
        })
    },
    // 活动上下架
    eventUpdateTag(data) {
        return getData({
            method: 'get',
            url: interfaces.EVENT_UPDATE_TAG,
            data
        })
    },
    // 报名信息
    getRegistrationList(data) {
        return getData({
            method: 'get',
            url: interfaces.REGISTRATION_INFO,
            data
        })
    },
    // 导出报名信息
    registrationInfoExport(data) {
        return getData({
            method: 'get',
            url: interfaces.REGISTRATION_INFO_EXPORT,
            data,
            responseType: 'blob'
        })
    },

    getActionUser(data){
        return getData({
            method: 'get',
            url: interfaces.REGISTRATION_USER_GET,
            data: data
        })
    }

}

export default actionEventRegistration
