import { getData } from '@/libs/utils.js'
import interfaces from '@/api/interfaces.js'

export function getLoginLog(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_LOGINLOG,
        data: param
    })
}
export function getHandleLog(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_HANDLELOG,
        data: param
    })
}
export function getMessageMail(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_MESSAGEMAIL,
        data: param
    })
}
export function deleteMessageMail(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_MESSAGEMAIL_DELETE,
        data: param
    })
}
export function getMessageNet(param) {
    return getData({
        method: 'get',
        url: interfaces.SYSTEM_MESSAGENET,
        data: param
    })
}
export function deleteMessageNet(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_MESSAGENET_DELETE,
        data: param
    })
}
export function publishMessageNet(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_MESSAGENET_PUBLISH,
        data: param
    })
}
export function deleteAD(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_AD_DELETE,
        data: param
    })
}
export function addAD(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_AD_ADD,
        data: param
    })
}
export function editAD(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_AD_EDIT,
        data: param
    })
}
export function sortAD(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_AD_SORT,
        data: param
    })
}
export function unLineADList(param) {
    return getData({
        method: 'get',
        url: interfaces.SYSTEM_AD_UNLINELIST,
        data: param
    })
}
export function getRoomList(param) {
    return getData({
        method: 'get',
        url: interfaces.SYSTEM_AD_ROOM,
        data: param
    })
}
export function getADDetail(param) {
    return getData({
        method: 'get',
        url: interfaces.SYSTEM_AD_DETAIL,
        data: param
    })
}
export function showOrHide(param) {
    return getData({
        method: 'post',
        url: interfaces.SYSTEM_AD_UNUP,
        data: param
    })
}