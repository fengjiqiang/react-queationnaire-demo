import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces'
const deviceManage = {
    // 获取设备列表
    getDeviceList(data) {
        console.log('getDeviceList:')
        return getData({
            method: 'get',
            url: interfaces.DEVICE_LIST,
            data
        })
    },
    // 获取设备信息
    getDeviceDetail(device_id) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_DETAIL,
            data: { device_id }
        })
    },
    // 添加设备
    deviceAdd(params) {
        return getData({
            method: 'post',
            url: interfaces.DEVICE_ADD,
            data: params
        })
    },
    // 删除设备
    deviceDelete(params) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_DELETE,
            data: params
        })
    },
    // 重启设备
    deviceRestart(params) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_RESTART,
            data: params
        })
    },
    // 添加设备
    deviceEdit(params) {
        return getData({
            method: 'post',
            url: interfaces.DEVICE_EDIT,
            data: params
        })
    },
    // 获取设备下会议列表
    deviceMeetingList({ type = 1, room = '', page = 1, pagesize = 20 }) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_MEETING_LIST,
            data: { type, room, page, pagesize }
        })
    },
    // 网络诊断
    deviceNetCheck({ sn, url }) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_NET_CHECK,
            data: { sn, url }
        })
    },
    // 获取设备日志列表
    getDeviceLog({ sn, page, pagesize }) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_LOG_LIST,
            data: { sn, page, pagesize }
        })
    },
    // 提交日志
    logSubmit(sn) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_LOG_SUBMIT,
            data: { sn }
        })
    },
    // 设备绑定广告
    bindAdvertise({ advert_id, dstr }) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_BIND_ADVER,
            data: { advert_id, dstr }
        })
    },
    // 设备解除绑定广告
    unbindAdvertise(sn) {
        return getData({
            method: 'get',
            url: interfaces.DEVICE_UNBIND_ADVER,
            data: { sn }
        })
    }
}
export default deviceManage