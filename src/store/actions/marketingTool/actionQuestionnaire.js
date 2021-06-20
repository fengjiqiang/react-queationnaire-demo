import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'

const actionQuestionnaire = {

    // 根据链接获取二维码
    getQRCode(data) {
        return getData({
            method: 'get',
            url: interfaces.GET_QRCODE,
            data
        })
    },
    // 获取问卷列表
    getQnaireList(data) {
        return getData({
            method: 'get',
            url: interfaces.QNAIRE_LIST,
            data
        })
    },
    // 问卷创建
    qnaireCreate(data) {
        return getData({
            method: 'post',
            url: interfaces.QNAIRE_CREATE,
            data
        })
    },
    // 问卷编辑
    qnaireEdit(data) {
        return getData({
            method: 'post',
            url: interfaces.QNAIRE_EDIT,
            data
        })
    },
    // 问卷详情
    getQnaireDetail(data) {
        return getData({
            method: 'get',
            url: interfaces.QNAIRE_DETAIL,
            data
        })
    },
    // 问卷删除
    qnaireDelete(data) {
        return getData({
            method: 'get',
            url: interfaces.QNAIRE_DELETE,
            data
        })
    },
    // 问卷上下架
    qnaireUpdateStatus(data) {
        return getData({
            method: 'get',
            url: interfaces.QNAIRE_UPDATE_STATUS,
            data
        })
    },
    // 调查结果
    getSurveyList(data) {
        return getData({
            method: 'get',
            url: interfaces.QNAIRE_RESULT,
            data
        })
    },
    // 导出调查结果
    surveyResultExport(data) {
        return getData({
            method: 'get',
            url: interfaces.QNAIRE_EXPORT,
            data,
            responseType: 'blob'
        })
    }

}

export default actionQuestionnaire
