import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import interfaces from '@/api/interfaces'

const actionGroupManage = {
    // 群组管理-用户组列表
    // type group 群组列表获取 user 组下成员列表获取 add 获取非当前组下的分页用户列表
    getGroupUserList({ type, uuid, keyword, value, page, pagesize }) {
        return getData({
            method: 'GET',
            url: interfaces.GROUP_USER_LIST,
            data: {
                type,
                uuid: uuid || '',
                keyword: keyword || '',
                value: value || '',
                page: page || '',
                pagesize: pagesize || ''
            }
        })
    },
    // 群组管理-用户组创建
    groupAdd({ title }) {
        return getData({
            method: 'POST',
            url: interfaces.GROUNP_ADD,
            data: {
                title
            }
        })
    },
    // 群组管理-用户组编辑
    groupEdit({ uuid, title }) {
        return getData({
            method: 'POST',
            url: interfaces.GROUNP_EDIT,
            data: {
                uuid,
                title
            }
        })
    },
    // 群组管理-用户组删除
    groupRemove({ uuid }) {
        return getData({
            method: 'POST',
            url: interfaces.GROUP_DELETE,
            data: {
                uuid
            }
        })
    },
    // 群组管理-用户组成员添加
    groupUserAdd({ group_uuid, users }) {
        return getData({
            method: 'POST',
            url: interfaces.GROUNP_PARTICIPANT_ADD,
            data: {
                group_uuid,
                users
            }
        })
    },
    // 群组管理-用户组成员移除
    groupUserRemove({ group_uuid, users }) {
        return getData({
            method: 'POST',
            url: interfaces.LWM_REMOVE_GROUNP_PARTICIPANT_ADD,
            data: {
                group_uuid,
                users
            }
        })
    },
    // 群组管理-用户组成员修改群组
    groupUserEdit({ group_uuid, current, users }) {
        return getData({
            method: 'POST',
            url: interfaces.LWM_EDIT_GROUNP_PARTICIPANT_ADD,
            data: {
                group_uuid,
                current,
                users
            }
        })
    }
}
export default actionGroupManage
