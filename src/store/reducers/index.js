import memberManage from './common/memberManage.js' // 会议管理
import storeCommon from './storeCommon.js'
import personalInfo from './personalInfo/personalInfo.js'    // 个人信息
import personalMeeting from './myMeeting/personalMeeting.js'    // 个人会议室

import userList from './userManage/userList.js'    // 企业管理--用户管理--用户列表
import roleManage from './userManage/roleManage.js'    // 企业管理--用户管理--角色管理



import { combinReducers, combineReducers } from 'redux'

let arr = combineReducers({
    memberManage, 
    storeCommon,
    personalInfo,
    personalMeeting,
    userList,
    roleManage,
})

export default arr;