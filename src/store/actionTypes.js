const actionTypes = {
    NAME: 'changeName',
    CHANGE_NAME: 'changeName',
    FROM: "from",
    REQUEST_HOST: 'requestHostChange',
    // 缓存路由列表
    CACHE_ROUTES_CHANGE: 'cacheRoutes',
    // 获取手机号区号列表
    INIT_AREACODE_LIST: 'initAreaCodeList',
    // 获取当前登录账号类型：个人版/企业版
    INIT_ACCOUNT_TYPE: 'initAccountType',
    // 获取菜单列表
    MENU_INIT: 'menuDataInit',
    INVITE_TREE_DATA: 'inviteTreeInit',
    // 获取菜单面包屑地址
    MENU_PATH: 'menuPathChange',
    // 我的会议
    // 我的会议--个人资料
    USERINFO_INIT: 'userInfoInit',   // 初始化个人信息
    MEETING_HASH_CHANGE: 'personalMeetingHash', // 个人会议链接hash段
    // 我的会议--个人会议室
    INIT_PERSONAL_INFO: 'initPersonalInfo',  // 个人会议号信息修改

    // 企业管理
    // 企业管理--用户管理
    INIT_ALL_PLAN: 'initAllPlan',   //   企业计划数目获取
    // 企业管理--用户管理--用户列表
    ACT_USERLIST_CHANGE: 'activeUserListChange', // 已激活用户列表
    UNACT_USERLIST_CHANGE: 'unactiveUserListChange', // 未激活企业管理
    INIT_ALL_USERS: 'getAllUsers',  // 获取所有已激活用户列表
    // 企业管理--用户管理--角色管理
    ALL_ROLES_CHANGE: 'AllRolesChange', // 获取下啦选框角色列表
    ROLELIST_CHANGE: 'roleList_change', // 分页获取角色列表

    // 企业管理--账户管理--账户信息
    INIT_ACCOUNT_INFO: 'initAccountInfo',    // 获取企业账户信息
    INIT_COMPANY_SELECTIONS: 'initCompanySelections',     // 获取企业账户基本信息选项列表：行业类型/企业规模

    UPLOAD_STATE_CHANGE: 'upload_state_change'

}
export default actionTypes