import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import interfaces from '@/api/interfaces'

const actionUserFieldsSetting = {
    // 字段设置-获取
    // type register 注册字段 certification 认证字段
    getUserFieldsSetting({ type, page, pagesize }) {
        return getData({
            method: 'POST',
            url: interfaces.FIELD_SETTING_LIST,
            data: {
                type,
                page,
                pagesize
            }
        })
    },
    // 字段设置- 更新
    // type register 注册字段 certification 认证字段
    updateUserFieldsSetting({ uuid, value, type }) {
        return getData({
            method: 'POST',
            url: interfaces.FIELD_SET,
            data: {
                uuid,
                value,
                type
            }
        })
    }
}
export default actionUserFieldsSetting
