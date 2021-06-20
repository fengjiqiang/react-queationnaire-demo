import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces.js'
import config from '@/config.js'

const actionQAManage = {

    getQuestionList(data){
        return getData({
            method: 'get',
            url: interfaces.QUESTION_LIST,
            data: data
        })
    },

    getQuestionDetail(data){
        return getData({
            method: 'get',
            url: interfaces.QUESTION_DETAIL,
            data: data
        })
    },

    toggleShow(data){
        return getData({
            method: 'get',
            url: interfaces.QUESTION_SHOW_TOGGLE,
            data: data
        })
    },

    replyCommit(data){
        return getData({
            method: 'post',
            url: interfaces.QUESTION_REPLY,
            data: data
        })
    },

    replyEdit(data){
        return getData({
            method: 'post',
            url: interfaces.QUESTION_REPLY_EDIT,
            data: data
        })
    }






}

export default actionQAManage;
