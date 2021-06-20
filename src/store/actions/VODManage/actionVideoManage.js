import { getData, getResponse } from '@/libs/utils.js'
import store from '@/store/index.js'
import actionTypes from '@/store/actionTypes.js'
import interfaces from '@/api/interfaces'
import config from '@/config.js'

const actionVideoManage = {

    createRecord(data){
        return getData({
            method: 'POST',
            url: interfaces.VIDEO_ADD,
            data: data
        });
    },

    getVideoList(data){
       return getData({
           method: 'get', 
           url: interfaces.VIDEO_LIST, 
           data: data
       })
    },

    videoEdit(data){
        return getData({
            method: 'post',
            url: interfaces.VIDEO_EDIT,
            data: data
        })
    },

    videoDel(data){
        return getData({
            method: 'post',
            url: interfaces.VIDEO_DELETE,
            data: data
        })
    },

    uploadWatermark(data){
        return getResponse({
            method: 'post',
            url: interfaces.VIDEO_UPLOAD_WATERMARK,
            data: data
        })
    },

    getVideoUrl(id){
        return getResponse({
            method: 'get',
            url: '/api/playback/list',
            data: {ids: id}
        })
    }

    // getAllVideo(data){
    //     return getData({
    //         method: 'POST', url: interfaces.VIDEO_LIST, data: {}
    //     })
    // }
}

export default actionVideoManage;