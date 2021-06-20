import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces'

const actionUnauthedUserList = {
    // 用户认证列表
    // type 1 待认证列表 2 我已处理列表
    getUserUnauthedList({ type, start_time, end_time, keyword, value, operate_status, pagesize, page }) {
        return getData({
            method: 'get',
            url: interfaces.APPROVE_LIST,
            data: {
                type,
                start_time,
                end_time,
                keyword: keyword || '',
                value,
                operate_status: operate_status || '',
                pagesize,
                page
            }
        })
    },
    // 用户认证-认证操作
    approvedOperate({ users = [], status, remark = '' }) {
        return getData({
            method: 'post',
            url: interfaces.USER_APPROVE,
            data: {
                users,
                status,
                remark
            }
        })
    },
    // 用户认证-认证详情
    approvedDetail(data) {
        return getData({
            method: 'post',
            url: interfaces.APPROVE_DETAIL,
            data
        })
    }
}
export default actionUnauthedUserList
