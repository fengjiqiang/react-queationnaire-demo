import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'


const actionInfoManage = {

    // 资讯管理-列表
    getInfoList(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_LIST,
            data
        })
    },
    // 资讯管理-添加
    infoAdd(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_ADD,
            data
        })
    },
    // 资讯管理-编辑
    infoEdit(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_EDIT,
            data
        })
    },
    // 资讯管理-详情
    getInfoDetail(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_DETAIL,
            data
        })
    },
    // 资讯管理-删除
    infoDelete(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_DELETE,
            data
        })
    },
    // 资讯管理-上/下架
    infoUpdateStatus(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_UPDATE_STATUS,
            data
        })
    },
    // 资讯管理-文档列表
    infoDocList(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_DOC_LIST,
            data
        })
    },
    // 资讯管理-文档修改名称
    infoDocEdit(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_DOC_EDIT,
            data
        })
    },
    // 资讯管理-文档删除
    infoDocDelete(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_DOC_DELETE,
            data
        })
    },
    // 资讯管理-文档是否可下载
    infoDocUpdateStatus(data) {
        return getData({
            method: 'get',
            url: interfaces.INFO_DOC_UPDATE_STATUS,
            data
        })
    },
    // 资讯管理-添加资料
    infoDocAdd(data) {
        return getData({
            method: 'post',
            url: interfaces.INFO_DOC_ADD,
            data
        })
},

}

export default actionInfoManage
