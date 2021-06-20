import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces'
const actionAdvertiseManage = {
    // 获取广告列表
    getAdvertiseList({ page = 1, pagesize, status = '' }) {
        return getData({
            method: 'get',
            url: interfaces.ADVER_LIST,
            data: { page, pagesize, status }
        })
    },
    // 获取广告详情
    getAdvertiseDetail(advert_id) {
        return getData({
            method: 'get',
            url: interfaces.ADVER_DETAIL,
            data: { advert_id }
        })
    },
    // 添加广告
    advertiseAdd({ title, status, image, interval }) {
        return getData({
            method: 'post',
            url: interfaces.ADVER_ADD,
            data: { title, status, image, interval }
        })
    },
    // 编辑广告
    advertiseEdit({ advert_id, title, status, image, interval }) {
        return getData({
            method: 'post',
            url: interfaces.ADVER_EDIT,
            data: { advert_id, title, status, image, interval }
        })
    },
    // 广告上下线
    advertiseStatus({ advert_id, status }) {
        return getData({
            method: 'post',
            url: interfaces.ADVER_STATUS,
            data: { advert_id, status }
        })
    },
    // 删除广告
    advertiseDelete(advert_id) {
        return getData({
            method: 'post',
            url: interfaces.ADVER_DELETE,
            data: { advert_id }
        })
    },
    // 广告图片上传
    advertiseImgUpload(file) {
        return getData({
            method: 'post',
            url: interfaces.ADVER_IMG_UPLOAD,
            data: file
        })
    },
}
export default actionAdvertiseManage