import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'

const actionInfoClassify = {

    // 资讯分类-列表
    getInfoClassifyList(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_CLASSIFY_LIST,
            data
        })
    },
    // 资讯分类-添加
    infoClassifyAdd(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_CLASSIFY_ADD,
            data
        })
    },
    // 资讯分类-编辑
    infoClassifyEdit(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_CLASSIFY_EDIT,
            data
        })
    },
    // 资讯分类-删除
    infoClassifyDelete(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_CLASSIFY_DELETE,
            data
        })
    },
    // 资讯分类-显示/隐藏
    infoClassifyHide(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_CLASSIFY_HIDE,
            data
        })
    },
    getAllInfoClassify() {
        return getData({
            method: 'get',
            url: interfaces.INFO_CLASSIFY_ALL
        })
    }
}

export default actionInfoClassify
