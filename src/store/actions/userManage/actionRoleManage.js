import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import config from '@/config.js'
import interfaces from '@/api/interfaces'


const actionRoleManage = {
    /**
     * 获取角色列表
     * 下选框列表
    */
    getAllRoles() {
        return getData({ method: 'get', url: interfaces.ALLROLES }).then(res => {
            console.log('roleList---res:', res)
            if (res.code === 200) {
                store.dispatch({
                    type: actionTypes.ALL_ROLES_CHANGE,
                    data: res.data
                });
            }
            return res
        })
    },
    /**
     * 删除用户
     * 
    */
    delUser({ }) {
    },

    /**
     * 分页获取角色列表
     * 
    */
    getRoleList({ page = 1, pagesize = config.pageSize }) {
        return getData({ method: 'get', url: interfaces.ROLE_LIST, data: { page, pagesize } })
    },

    // 更换角色
    changeRole({ role_code, users }) {
        return getData({ method: 'post', url: interfaces.ROLE_CHANGE, data: { role_code, users } })
    },

    getSystemAuth(){
        return getData({method: 'post', url: interfaces.GET_SYSTEM_AUTH })
    },

    addRole(data){
        return getData({method:'post', url: interfaces.ROLE_ADD, data: data})
    },

    deleteRole(data){
        return getData({method:'post',url: interfaces.ROLE_DELETE, data: data})
    },
    editRole(data){
        return getData({method:'post', url: interfaces.ROLE_EDIT, data: data})
    },
}
export default actionRoleManage