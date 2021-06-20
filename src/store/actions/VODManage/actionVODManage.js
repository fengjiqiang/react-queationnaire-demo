import { getData } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces'
import config from '@/config.js'

const actionVODManage = {
    getVODList(data){
        return getData({
            method:'POST',
            url: interfaces.DEMAND_LIST,
            data: data
        })
    },
    getVODDetail(id){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_DETAIL,
            data: {course_id: id}
        })
    },
    VODDel(id){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_DELETE,
            data: {course_id: id}
        })
    },
    addVOD(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_ADD,
            data: data
        })
    },
    editVOD(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_EDIT,
            data: data
        })
    },
    editVODAttr(data){
        return getData({
            method: 'post',
            url:interfaces.DEMAND_ATTR_EDIT,
            data: data
        })
    },
    getChapterList(data){
        return getData({
            method:'POST',
            url: interfaces.DEMAND_CHAPTER_LIST,
            data: data
        })
    },
    getChapterInfo(id){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_CHAPTER_DETAIL,
            data: {id: id}
        })
    },
    chapterAdd(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_CHAPTER_ADD,
            data: data
        })
    },
    chapterEdit(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_CHAPTER_EDIT,
            data: data
        })
    },
    chapterDel(id){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_CHAPTER_DELETE,
            data: {id: id}
        })
    },
    getCommentList(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_COMMENT_LIST,
            data: data
        })
    },
    commentDel(id){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_COMMENT_DELETE,
            data: {id: id}
        })
    },
    commentEdit(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_COMMENT_EDIT,
            data: data
        })
    },
    editComment(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_COMMENT_EDIT,
            data: data
        })
    },
    getPlayList(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_CHAPTER_PALY_LIST,
            data: data
        })
    },
    getResourceList(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_DOC_LIST,
            data: data
        })
    },
    resourceDel(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_DOC_DELETE,
            data: data
        })
    },
    resourceAdd(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_DOC_ADD,
            data: data
        })
    },
    resourceEdit(data){
        return getData({
            method: 'POST',
            url: interfaces.DEMAND_DOC_EDIT,
            data: data
        })
    }


}

export default actionVODManage;