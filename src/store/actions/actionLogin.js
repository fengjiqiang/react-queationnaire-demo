import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import interfaces from '@/api/interfaces'

const actionLogin = {
    // 群组管理-用户组列表
    // type group 群组列表获取 user 组下成员列表获取 add 获取非当前组下的分页用户列表
    login({ username, password }) {
        return getData({
            method: 'POST',
            url: interfaces.LOG_IN,
            data: {
                username,
                password
            }
        })
    },
    logout(){
        return getData({
            method:'POST',
            url: interfaces.LOG_OUT,
            data: {}
        })
    }
}
export default actionLogin
