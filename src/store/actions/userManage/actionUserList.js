import { getData, getFile } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces'
import config from '@/config.js'
const actionUserList = {
    /**
     * 获取用户列表
     * param1 active: Number 0/1
     * param2 role_id: String
     * param3 keyword: string
    */
    getUserList(data) {
        return getData({ method: 'get', url: interfaces.USER_LIST, data: data})
    },
    getUserDetail(data){
        return getData({method: 'post', url: interfaces.GET_USER_DETAIL, data: data})
    },
    getApprovalDetail(uid){
        return getData({ method: 'post', url: interfaces.APPROVE_DETAIL, data: {uuid: uid}})
    },
    // 获取所有用户
    getAllUserList(keyword) {
        return getData({
            method: 'get',
            url: interfaces.USER_LIST,
            data: { status: 1, keyword, pagesize: 99999, page: 1 }
        }).then(res => {
            if (res.code === 200) {
                let users = res.data.list.map(user => {
                    user.type = 'file'
                    user.name = user.nickname
                    return user
                })
                store.dispatch({
                    type: actionTypes.INIT_ALL_USERS,
                    data: {
                        list: users,
                        count: res.data.count
                    }
                });
                return users
            }
        })
    },
    getFieldsSetting(){
        return getData({ 
            method: 'post', url: interfaces.FIELD_SETTING_LIST, data: {type: 'register'}
        })
    },
    /**
     * 
     * @param {*} uidList 
     */
    userApprove(data){
        return getData({
            method: 'post', url: interfaces.USER_APPROVE, data: data
        })
    },
    /**
     * 删除用户
    */
    userDel( uidList ) {
        return getData({
            method: 'post', url: interfaces.USER_DELETE, data: { users: uidList }
        })
    },
    /**
     * 添加用户
    */
    addUser(data) {
        return getData({
            method: 'post',
            url: interfaces.USER_ADD,
            data: data
        })
    },
    /**
     * 编辑用户
    */
    editUser(data) {
        return getData({ method: 'post', url: interfaces.USER_EDIT, data: data})
    },

    userExport(users){
        // window.open(config.requestHosts + interfaces.USER_EXPORT + '?users=' + users);
        return getData({ 
            method: 'post',
            url: interfaces.USER_EXPORT,
            data: {users: users},
            responseType: 'blob'
        })
    },

    downloadTemplate(){
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = '';
        link.setAttribute('download', '中债e联-导入用户模版.xlsx');
        document.body.appendChild(link);
        link.click();
    },

    sendEmail(data ){
        return getData({ method:'post', url: interfaces.USER_SEND_EMAIL, data: data})
    },

    uploadPicture(data){
        return getData({method:'post', url: interfaces.FilE_UPLOAD, data: data})
    },

    userImport(data){
        return getData({method:'POST', url: interfaces.USER_IMPORT, data: data})
    }
}
export default actionUserList