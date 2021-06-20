//个人信息
import PersonalInfo from '@/pages/personalInfo/PersonalInfo.js';

//用户管理
import UserList from '@/pages/userManage/UserList.js';    // 用户管理-用户列表
import AuthorityManage from '@/pages/userManage/AuthorityManage.js'; // 用户管理-权限管理
import UnauthedUserList from '@/pages/userManage/UnauthedUserList.js'     // 用户管理-用户认证
import UserFieldsSetting from '@/pages/userManage/UserFieldsSetting.js'    // 用户管理-用户字段设置
import GroupManage from '@/pages/userManage/GroupManage.js'    // 用户管理-群组管理
import PhoneList from '@/pages/userManage/PhoneList.js'

import VideoManage from './VODManage/VideoManage.js';
import VODManage from './VODManage/VODManage.js';

// 资讯
import InfoClassify from '@/pages/infoManage/InfoClassify.js';   // 资讯分类
import InfoManage from '@/pages/infoManage/InfoManage.js';   // 资讯管理

//视频会议
import MyMeeting from '@/pages/meetingManage/myMeeting/MyMeeting.js';
import MeetingManage from '@/pages/meetingManage/meetingManage/MeetingManage.js';
import ExamineMeetingList from '@/pages/meetingManage/examineMeetingList/ExamineMeetingList.js';
import MeetingDocument from '@/pages/meetingManage/meetingDocument/MeetingDocument.js';

// 营销工具集
import EventRegistration from '@/pages/marketingTool/EventRegistration.js';   // 活动报名
import QAManage from '@/pages/marketingTool/QAManage.js';   // 问答管理
import Questionnaire from '@/pages/marketingTool/Questionnaire.js';   // 问卷调查


// import UserList from '@/pages/userManage/UserList.js'     // 用户管理-用户列表


// 我的会议

// import PersonalInfo from '@/pages/personalInfo/PersonalInfo.js';
import PersonalMeeting from '@/pages/myMeeting/personalMeeting/PersonalMeeting.js';
import MeetingList from '@/pages/myMeeting/meetingList/MeeingList.js';
import Seminar from '@/pages/myMeeting/seminar/Seminar.js';


// 直播
import ExamineSeminarList from '@/pages/seminarManage/examineSeminarList/ExamineSeminarList.js'
import MySeminar from '@/pages/seminarManage/mySeminar/MySeminar.js'
import SeminarManage from '@/pages/seminarManage/seminarManage/SeminarManage.js'

// new 会议模块


//系统管理
import LoginLog from '@/pages/system/loginLog/LoginLog.js'
import HandleLog from '@/pages/system/handleLog/HandleLog.js'
import AdManagement from '@/pages/system/AdManagement/AdManagement.js'
import MessageManagementMail from '@/pages/system/messageManagement/messageManagementMail/messageManagementMail.js'
import MessageManagementNet from '@/pages/system/messageManagement/messageManagementNet/messageManagementNet.js'


const obj = {
    //new-个人资料
    'personalinfo': PersonalInfo,
    //
    // 我的会议
    // 我的会议--个人资料
    // 'userManage.userList': UserList,
    'userManage.userList': UserList,
    // 用户管理--用户认证
    'userManage.unauthedUserList': UnauthedUserList,
    // 用户管理--用户字段设置
    'userManage.userFieldsSetting': UserFieldsSetting,
    // 用户管理--群组管理
    'userManage.groupManage': GroupManage,
    //用户管理--固定电话簿
    'userManage.phoneList': PhoneList,
    // 我的会议--会议列表
    'userManage.authorityManage': AuthorityManage,

    'vod.videoManage': VideoManage,
    'vod.vodManage': VODManage,

    // 资讯
    'info.infoClassify': InfoClassify,   // 资讯分类
    'info.infoManage': InfoManage,   // 资讯管理

    // 营销工具集
    'market.eventRegistration': EventRegistration,   // 活动报名
    'market.QAManage': QAManage,   // 问答管理
    'market.questionnaire': Questionnaire,   // 问卷调查

    // 我的会议--网络研讨会
    'myMeeting.seminar': Seminar,

    // 直播
    // 直播-直播管理
    'seminar.seminarManage': SeminarManage,
    // 直播-我的直播
    'seminar.mySeminar': MySeminar,
    // 直播-直播审核列表
    'seminar.examineSeminarList': ExamineSeminarList,
    // 直播-直播文档
    'seminar.seminarDocument': MeetingDocument,

    //new-会议管理
    //视频会议-会议管理
    'meeting.meetingManage': MeetingManage,
    //视频会议-我的会议
    'meeting.myMeeting': MyMeeting,
    //视频会议-会议审核列表
    'meeting.examineMeetingList': ExamineMeetingList,
    //视频会议-会议文档
    'meeting.meetingDocument': MeetingDocument,
    //

    //系统管理
    //邮箱信息
    'system.messageManagement.mail': MessageManagementMail,
    //站内信息
    'system.messageManagement.net': MessageManagementNet,
    //广告管理
    'system.AdManagement': AdManagement,
    //操作日志
    'system.handleLog': HandleLog,
    //登录日志
    'system.loginLog': LoginLog,

}


export default obj