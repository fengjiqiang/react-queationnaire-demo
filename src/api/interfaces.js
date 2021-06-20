

const interfaces = {
    mixin(obj) {
        this.__proto__ = obj
    },
    //登录/登出
    LOG_IN: '/api/v1/admin/user/login',
    LOG_OUT: '/api/v1/admin/user/logout',

    //个人信息
    PERSON_INFO: '/api/v1/admin/info',    // 获取个人信息
    NICKNAME_UPDATE: 'api/v1/front/user/nickname/update',    // 修改昵称
    CORPNAME_UPDATE: '',
    SMS_SEND: '/api/v1/user/sms/send',   // 获取短信验证码
    MOBILE_VERIFY: '/api/v1/auth/mobileverify',      // 短信验证码验证
    SET_PASSWORD: '/api/v1/admin/user/reset-password',  // 设置密码
    INFO_UPDATE: '/api/v1/admin/user/basic-edit',      // 更新信息

    //用户管理
    ALLROLES: '/api/v1/admin/role/index',                 // 所有角色列表，用户下拉选框
    USER_LIST: '/api/v1/admin/user/list',                // 用户管理--获取用户列
    GET_USER_DETAIL: '/api/v1/admin/user/detail',        // 获取用户详情
    FilE_UPLOAD: '/api/v1/admin/resource/upload',
    USER_DELETE: '/api/v1/admin/user/remove',     // 用户管理-删除用户
    USER_ADD: '/api/v1/admin/user/add',   // 用户管理-添加用户
    USER_EDIT: '/api/v1/admin/user/edit',   // 用户管理-编辑用户
    USER_IMPORT: '/api/v1/admin/user/import',
    USER_APPROVE: '/api/v1/admin/user/approval',    // 用户认证-（批量）认证
    USER_EXPORT: '/api/v1/admin/user/batch-export',
    USER_SEND_EMAIL: '/api/v1/admin/user/batch-email',

    //固话簿
    PHONE_LIST: '/api/v1/admin/system/list',
    PHONE_DELETE: '/api/v1/admin/system/delete',
    PHONE_IMPORT: '/api/v1/admin/system/phone-book/import',

    //角色权限管理
    ROLE_LIST: '/api/v1/admin/role/list', //分页获取权限
    GET_SYSTEM_AUTH: '/api/v1/admin/role/auth',
    ROLE_CHANGE: '/api/v1/admin/role/user-link',
    ROLE_EDIT: '/api/v1/admin/role/edit',
    ROLE_ADD: '/api/v1/admin/role/add',
    ROLE_DELETE: '/api/v1/admin/role/destroy', 
    ROLE_SEARCH: true, //查看角色成员

    //广告管理
    ADVER_LIST: '/api/v1/admin/device-banner/lists',
    // ADVER_ADD: '/api/v1/admin/advert/create',
    // ADVER_EDIT: '/api/v1/admin/advert/edit',
    // ADVER_DELETE: '/api/v1/admin/advert/delete',
    ADVER_DETAIL: '/api/v1/admin/advert/detail',
    ADVER_IMG_UPLOAD: '/api/v1/admin/advert/upload',
    // ADVER_STATUS: '/api/v1/admin/advert/status',


    //设备管理
    DEVICE_LIST: '/api/v1/admin/device/lists',
    // DEVICE_ADD: '/api/v1/admin/device/create',
    // DEVICE_EDIT: '/api/v1/admin/device/edit',
    // DEVICE_DELETE: '/api/v1/admin/device/delete',
    DEVICE_DETAIL: '/api/v1/admin/device/detail',
    DEVICE_RESTART: '/api/v1/admin/device/restart',
    DEVICE_LOG_LIST: '/api/v1/admin/deviceLog/list',
    DEVICE_LOG_SUBMIT: '/api/v1/admin/deviceLog/send',
    // DEVICE_BIND_ADVER: '/api/v1/admin/advert/bind',
    // DEVICE_UNBIND_ADVER: '/api/v1/admin/advert/unbind',
    // DEVICE_NET_CHECK: 'api/v1/admin/device/diagnosis',
    // DEVICE_LOG: true,

    //视频
    VIDEO_LIST: '/api/v1/admin/vod/list',
    // VIDEO_DELETE: '/api/v1/admin/vod/remove',
    // VIDEO_EDIT: '/api/v1/admin/vod/update',
    VIDEO_UPLOAD_WATERMARK: '/api/playback/upwm',

    // VIDEO_ADD: '/api/v1/admin/vod/create',
    // VIDEO_GET_URL: true,
    // VIDEO_PREVIEW: true,

    //点播视频
    DEMAND_LIST: '/api/v1/admin/demand/list',
    // DEMAND_ADD: '/api/v1/admin/demand/create',
    // DEMAND_DELETE: '/api/v1/admin/demand/remove',
    DEMAND_DETAIL: '/api/v1/admin/demand/detail',
    // DEMAND_EDIT: '/api/v1/admin/demand/update',
    DEMAND_ATTR_EDIT: '/api/v1/admin/demand/update-attr',

    //点播章节
    // DEMAND_CHAPTER_LIST: '/api/v1/admin/demand/chapter-list',
    DEMAND_CHAPTER_DELETE: '/api/v1/admin/demand/chapter-remove',
    DEMAND_CHAPTER_ADD: '/api/v1/admin/demand/chapter-create',
    DEMAND_CHAPTER_EDIT: '/api/v1/admin/demand/chapter-update',
    DEMAND_CHAPTER_PALY_LIST: '/api/v1/admin/demand/chapter-record',

    // DEMAND_COMMENT_LIST: '/api/v1/admin/demand/comment-list',
    DEMAND_COMMENT_DELETE: '/api/v1/admin/demand/comment-remove',
    DEMAND_COMMENT_EDIT: '/api/v1/admin/demand/comment-update',

    //资料
    // DEMAND_DOC_LIST: '/api/v1/admin/demand/doc-list',
    DEMAND_DOC_ADD: '/api/v1/admin/demand/doc-create',
    DEMAND_DOC_EDIT: '/api/v1/admin/demand/doc-update',
    DEMAND_DOC_DELETE: '/api/v1/admin/demand/doc-remove',

    ACCOUNT_TYPE: '/api/v2/corp/user/identify/label', // 获取登录账号类型

    MENU: '/api/v1/admin/user/menu',           // 菜单
    IMAGE_UPLOAD: '/api/v1/auth/avatar/update',   // 上传图片

    MEMBER_LIST: '/api/v1/meeting/participants',     // 获取会议中成员列表，包含会议信息
    GET_AREA_CODE: '/api/v1/user/sms/areacode2',   // 获取区号列表

    // 用户管理
    // 用户管理-待认证用户
    APPROVE_LIST: '/api/v1/admin/approval/list',   // 用户认证-认证列表
    APPROVE_DETAIL: '/api/v1/admin/approval/detail',     // 用户认证-认证详情

    // 用户管理-字段设置
    FIELD_SETTING_LIST: '/api/v1/admin/setting/field-info',   // 字段设置-获取
    FIELD_SET: '/api/v1/admin/setting/field',   // 字段设置-更新

    // 群组管理
    // 群组管理-用户组列表
    GROUP_USER_LIST: '/api/v1/admin/group/list',   // 群组管理-用户组（成员）列表
    GROUNP_ADD: '/api/v1/admin/group/add',   // 群组管理-用户组创建
    GROUNP_EDIT: '/api/v1/admin/group/edit',   // 群组管理-用户组编辑
    GROUP_DELETE: '/api/v1/admin/group/remove',   // 群组管理-用户组删除
    GROUNP_PARTICIPANT_ADD: '/api/v1/admin/group/user-bind',   // 群组管理-用户组成员添加
    LWM_REMOVE_GROUNP_PARTICIPANT_ADD: '/api/v1/admin/group/user-unbind',   // 群组管理-用户组成员移除
    LWM_EDIT_GROUNP_PARTICIPANT_ADD: '/api/v1/admin/group/user-edit-bind',   // 群组管理-用户组成员修改群组

    // 资讯
    // 资讯-资讯分类
    INFO_CLASSIFY_LIST: '/api/v1/admin/information-class/list',   // 资讯分类-列表
    INFO_CLASSIFY_ADD: '/api/v1/admin/information-class/add',   // 资讯分类-添加
    INFO_CLASSIFY_EDIT: '/api/v1/admin/information-class/edit',   // 资讯分类-编辑
    INFO_CLASSIFY_DELETE: '/api/v1/admin/information-class/delete',   // 资讯分类-删除
    INFO_CLASSIFY_HIDE: '/api/v1/admin/information-class/hide',   // 资讯分类-显示/隐藏
    INFO_CLASSIFY_ALL: '/api/v1/admin/information-class/list-all',   // 资讯分类-列表（不分页）
    // 资讯-资讯管理
    INFO_LIST: '/api/v1/admin/information/list',   // 资讯管理-列表
    INFO_ADD: '/api/v1/admin/information/add',   // 资讯管理-添加
    INFO_EDIT: '/api/v1/admin/information/edit',   // 资讯管理-编辑
    INFO_DETAIL: '/api/v1/admin/information/detail',   // 资讯管理-详情
    INFO_DELETE: '/api/v1/admin/information/delete',   // 资讯管理-删除
    INFO_UPDATE_STATUS: '/api/v1/admin/information/update-status',   // 资讯管理-上/下架
    INFO_DOC_LIST: '/api/v1/admin/information-doc/list',   // 资讯管理-文档列表
    INFO_DOC_EDIT: '/api/v1/admin/information-doc/edit',   // 资讯管理-文档修改名称
    INFO_DOC_DELETE: '/api/v1/admin/information-doc/delete',   // 资讯管理-文档删除
    INFO_DOC_UPDATE_STATUS: '/api/v1/admin/information-doc/update-status',   // 资讯管理-文档是否可下载
    INFO_DOC_ADD: '/api/v1/admin/information-doc/create',   // 资讯管理-添加资料

    // 营销工具集
    GET_QRCODE: '/api/v1/tools/auth/get-qrcode',   // 根据链接获取二维码
    // 营销工具集-活动报名
    EVENT_LIST: '/api/v1/admin/action/lists',   // 获取活动列表
    EVENT_SHOW_FIELD: '/api/v1/admin/action/show-field',   // 获取显示字段
    EVENT_CREATE: '/api/v1/admin/action/create',   // 活动创建
    EVENT_EDIT: 'api/v1/admin/action/edit',   // 活动编辑
    EVENT_DETAIL: '/api/v1/admin/action/detail',   // 活动详情
    EVENT_DELETE: '/api/v1/admin/action/delete',   // 活动删除
    EVENT_UPDATE_TAG: '/api/v1/admin/action/update-tag',   // 活动上下架
    REGISTRATION_INFO: '/api/v1/admin/action/user-list',   // 报名信息
    REGISTRATION_INFO_EXPORT: '/api/v1/admin/action/export-user',   // 导出报名信息
    REGISTRATION_USER_GET: '/api/v1/admin/action/get-action-user',
    // 营销工具集-问答管理
    QUESTION_LIST: '/api/v1/admin/question/list',
    QUESTION_DETAIL: '/api/v1/admin/question/detail',
    QUESTION_REPLY: '/api/v1/admin/question/reply',
    QUESTION_REPLY_EDIT: '/api/v1/admin/question/edit',
    QUESTION_SHOW_TOGGLE: '/api/v1/admin/question/hide',
    // 营销工具集-问卷调查
    QNAIRE_LIST: '/api/v1/admin/questionnaire/list',
    QNAIRE_CREATE: '/api/v1/admin/questionnaire/create',
    QNAIRE_EDIT: '/api/v1/admin/questionnaire/edit',
    QNAIRE_DETAIL: '/api/v1/admin/questionnaire/detail',
    QNAIRE_DELETE: '/api/v1/admin/questionnaire/delete',
    QNAIRE_UPDATE_STATUS: '/api/v1/admin/questionnaire/update-status',
    QNAIRE_EXPORT: '/api/v1/admin/questionnaire/export',
    QNAIRE_RESULT: '/api/v1/admin/questionnaire/answer-list',

    // 我的会议
    // 我的会议-个人资料
    // PERSON_INFO: '/api/v1/admin/info',    // 获取个人信息
    TEXT_CHECK: '/api/v1/front/user/text/check',     // 昵称合法校验
    // NICKNAME_UPDATE: 'api/v1/front/user/nickname/update',    // 修改昵称
    MEETING_HASH: '/api/share/hash',    // 获取会议邀请的hash
    // SMS_SEND: '/api/v1/user/sms/send',   // 获取短信验证码
    GET_IMAGE_CODE: '/api/v1/front/verify/setimage', // 获取图片验证码
    IMAGE_CODE_CHECK: '/api/v1/front/verify/checkimage', // 图形验证码验证
    // MOBILE_VERIFY: '/api/v1/auth/mobileverify',      // 短信验证码验证
    // SET_PASSWORD: '/api/v1/auth/setpassword',  // 设置密码
    // PERSON_AVATAR_UPDATE: '/api/v2/corp/user/person/avatar',      // 头像上传并更新

    // 我的会议-个人会议室
    PERSONAL_MEETING_INFO: '/api/v2/corp/user/conference/number',  // 个人会议号信息获取
    PERSONAL_MEETING_UPDATE: '/api/v2/corp/user/conference/editInfo', // 个人会议号信息编辑


    // 我的会议-会议列表
    // MEETING_LIST: '/api/v1/meeting/lists',    // 获取会议列表
    //MEETING_APPOINT: '/api/v1/meeting/create',   // 预约会议
    //MEETING_APPOINT_COMPANY: '/api/v1/meeting/businessMeetingCreate',    // 预约会议---企业
    // MEETING_DETAIL: '/api/v1/meeting/detail',   // 获取会议详情
    // MEETING_UPDATE: '/api/v1/meeting/edit',      // 编辑会议/研讨会  (只能修改普通会议，不能修改研讨会)
    // MEETING_LIST_PERSONAL: '/api/v1/meeting/personMeetingList',   // 个人版会议列表获取   ------------------
    // MEETING_LIST_CMP_MINE: '/api/v1/meeting/lists',   // 企业版个人的会议列表---------------
    // MEETING_LIST_CMP: '/api/v1/meeting/businessMeetingList',   // 企业版所有的会议列表-----------------
    // MEETING_CANCEL: '/api/v1/meeting/personMeetingCancel', // 取消会议     ------------------
    //MEETING_DELETE: '/api/v1/meeting/personMeetingDelete', // 删除会议 ----------------
    // MEMBER_EXPORT: '/api/v1/meeting/control/export',    // 导出参会成员   -------------
    //  MEMBER_EXPORT_PERSONAL: '/api/v1/meeting/control/export',    // 导出参会成员   -------------
    // MEETING_EXPORT: '/api/v1/meeting/control/exportMeetingList', // 导出会议列表 ----------------
    // MEETING_EXPORT_PERSONAL: '/api/v1/meeting/control/exportMeetingList', // 导出会议列表 ----------------

    // 企业管理
    // 企业管理-用户管理
    // ALLROLES: '/api/v2/corp/role/list',                 // 所有角色列表，用户下拉选框
    // USER_LIST: '/api/v1/admin/user/list',                // 用户管理--获取用户列表
    // // PAGE_ROLE_LIST: '/api/v2/corp/role/page/list',  // 分页获取角色列表
    // // USER_LIST: '/api/v2/corp/user/list',                // 用户管理--获取用户列表
    // USER_DEL: '/api/v1/admin/user/del',     // 用户管理-删除用户
    // USER_ADD: '/api/v1/admin/user/add',   // 用户管理-添加用户
    // USER_APPROVAL: '/api/v1/admin/approval',

    // GET_USER_DETAIL: '/api/v2/corp/user/information',        // 获取用户详情 -------------------
    // USER_UPDATE: '/api/v2/corp/user/update',   // 用户管理-编辑用户

    // PLAN_DIST: '/api/v2/corp/plan/distribute',     // 分配计划
    // PLAN_REMOVE: '/api/v2/corp/plan/remove',     // 撤销计划
    // 企业管理-用户管理-角色管理
    // ROLE_CHANGE: '/api/v2/corp/role/user/link',  // 修改角色
    // INVITE_RESEND: '/api/v2/corp/user/activateInvitation', // 未激活用户重新发送
    PERMISSION_LIST: '/api/v1/admin/user/permission', // 获取权限列表

    SEMINAR_LIST: '/api/v1/seminar/lists',              // 研讨会列表---------------------
    SEMINAR_DELETE: '/api/v1/seminar/delete',           // 删除/取消研讨会---------------------
    SEMINAR_END: '/api/v1/seminar/end',                 // 结束研讨会  ---------------------
    SEMINAR_DETAIL: '/api/v1/seminar/detail',           // 研讨会详情---------------------
    SEMINAR_CREATE: '/api/v1/seminar/create',           // 创建研讨会---------------------
    SEMINAR_EDIT: '/api/v1/seminar/edit',               // 研讨会编辑---------------------
    SEMINAR_SEND: '/api/v1/seminar/sendMessage',        // 研讨会发送邀请---------------------
    SEMINAR_INVITE: '/api/v1/seminar/preserve',         // 保存研讨会邀请嘉宾列表---------------------

    //new-视频会议
    //PARTICIPANT_MANAGE: true,                                       //会控管理
    //MEETING_PARTICIPANT_EXPORT: true,                                   //会议导出
    MEETING_EXPORTMEETINGLIST: '/api/v1/admin/meeting/export-meeting-list',  //会议列表导出
    MEETING_EXPORTMEETINGUSER: '/api/v1/admin/meeting/export-meeting-user',   //会议成员导出
    //MEETING_ALLMEETINGLIST: '/api/v1/admin/meeting/lists',              //会议管理列表
    MEETING_MYMEETINGLIST: '/api/v1/admin/meeting/my-lists',           //我的会议列表
    //MEETING_EXAMINEMEETINGLIST: '/api/v1/admin/meeting/audi-list',    //审核列表
    MEETING_DETAIL: '/api/v1/admin/meeting/detail',            //会议详情
    MEETING_EDIT: '/api/v1/admin/meeting/edit',               //会议编辑
    //MEETING_APPROVE: '/api/v1/admin/meeting/examine',        //会议审核权限
    MEETING_EXMINE_DETAIL: '/api/v1/admin/meeting/audi-detail',  //会议审核详情
    MEETING_CREATE: '/api/v1/admin/meeting/create',             //会议创建
    MEETING_MEMBERLIST: '/api/v1/meeting/participants',          //获取会议成员的列表
    MEETING_GETUSER: '/api/v1/admin/user/search-list',             //会议内用户列表信息获取接口
    MEETING_LISTINVITE: '/api/v1/admin/meeting/invite',            //列表处邀请用户
    //MEETING_ENDMEETING: '/api/v1/admin/meeting/end-meeting',        //结束直播

    // new-会控操作
    MEETING_CTRL_MIC: '/api/v1/admin/meeting/control-microphone',    // 会控--麦克风操作  ------------
    MEETING_CTRL_REMOVE: '/api/v1/admin/meeting/control-evict',    // 会控--移出会议室    ------------
    MEETING_CTRL_RELATIONMASTER: '/api/v1/admin/meeting/control-setAnchor',    // 会控--设置联席主持人    --------------
    MEETING_CTRL_RENAME: '/api/v1/admin/meeting/control-updateNickname', // 改名-----------------
    MEETING_CTRL_MASTER: '', // 设为主持人-----------------
    MEETING_CTRL_CAMERA: '', // 申请打开摄像头-----------------

    MEETING_ALL_MUTE: '/api/v1/admin/meeting/control-audio', // 全员静音-----------------
    MEETING_LOCK: '/api/v1/meeting/control/setLock',  // 锁定会议-----------------  

    //new-文档管理
    DOCUMENTS_MEETING: '/api/v1/admin/doc/list',
    DOCUMENTS_MEETING_LIST: 'api/v1/admin/doc/doc-list',
    DOCUMENTS_CHANGE_RIGHTS: '/api/v1/admin/doc/edit',
    //new-直播管理
    //LIVEBROADCAST_PARTICIPANT_EXPORT: true,
    //LIVE_ALLLIVELIST: '/api/v1/admin/direct/list',      //所有直播管理列表
    LIVE_MYLIVELIST: '/api/v1/admin/direct/my-list',    //我的直播列表
    //LIVE_EXAMINELIVELIST: '/api/v1/admin/direct/audi-list', //审核的直播列表
    LIVE_DETAIL: '/api/v1/admin/direct/detail', //直播详情
    //LIVE_EXAMINE: '/api/v1/admin/direct/examine', //直播审核
    LIVE_CREATE: '/api/v1/admin/direct/create',  //直播创建
    LIVE_EDIT: '/api/v1/admin/direct/edit',     //直播编辑
    LIVE_EXAMINE_DETAIL: '/api/v1/admin/direct/audi-detail',   //审核结果详情
    MEETING_CANCEL: '/api/v1/admin/meeting/delete',    //直播会议取消删除接口

    //系统管理
    SYSTEM_LOGINLOG: '/api/v1/admin/system/login-log',   //登录日志
    SYSTEM_HANDLELOG: '/api/v1/admin/system/operation-log',//操作日志
    SYSTEM_MESSAGEMAIL: '/api/v1/admin/system/email-log',   //邮件信息
    SYSTEM_MESSAGEMAIL_DELETE: '/api/v1/admin/system/email-log-del', //删除邮件信息
    SYSTEM_MESSAGENET: '/api/v1/admin/system/notify/list',          //站内消息
    SYSTEM_MESSAGENET_DELETE: '/api/v1/admin/system/notify/del',     //删除站内消息
    SYSTEM_MESSAGENET_PUBLISH: '/api/v1/admin/system/notify/publish', //站内消息发布
    SYSTEM_AD_UNLINELIST: '/api/v1/admin/system/banner/list',  //广告列表
    SYSTEM_AD_ADD: '/api/v1/admin/system/banner/create', //添加广告
    SYSTEM_AD_DELETE: '/api/v1/admin/system/banner/del',   //删除广告
    SYSTEM_AD_EDIT: '/api/v1/admin/system/banner/update',    //编辑广告
    SYSTEM_AD_SORT: '/api/v1/admin/system/banner/sort-update',     //广告排序
    //SYSTEM_AD_UNUP: '/api/v1/admin/system/banner/update-show',    //广告上下线
    SYSTEM_AD_ROOM: '/api/v1/admin/meeting/select-list',       //待推广的直播or会议
    SYSTEM_AD_DETAIL: '/api/v1/admin/system/banner/detail',     //广告详情

    // MEETING_CANCEL: '/api/v1/admin/meeting/delete',  //直播会议取消删除接口


    //文档管理
    DOCUMENT_DELETE: '/api/v1/admin/room/delete-doc',   //删除文档
    DOCUMENT_GET_LIST: '/api/v1/admin/room/doc-list', //获取文档列表
    DOCUMENT_UP_LOAD: '/api/v1/admin/room/insert-meeting-doc',//上传文档后将文档地址存在业务后端
}
export default interfaces