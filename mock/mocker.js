// import menu from './menu.js'
const menu = [
    {
        name: '个人资料',
        menu_icon: "",
        menu_code: 'personalinfo',
        menu_route: '/personalinfo',
        tag: 'personalinfo',
    },
    {
        name: '用户管理',
        menu_icon: "",
        menu_code: 'userManage',
        tag: 'userManage',
        menu_route: '/userManage',
        children: [
            {
                name: '用户列表',
                menu_icon: '',
                menu_code: 'userManage.userList',
                menu_route: '/userManage/userList',
                tag: 'userList',
            },
            {
                name: '待认证用户',
                menu_icon: '',
                menu_code: 'userManage.unauthedUserList',
                menu_route: '/userManage/unauthedUserList',
                tag: 'unauthedUserList',
            },
            {
                name: '权限管理',
                menu_icon: '',
                menu_code: 'userManage.authorityManage',
                menu_route: '/userManage/authorityManage',
                tag: 'authorityManage',
            },
            // {
            //     name: '群组管理',
            //     menu_icon: '',
            //     menu_code: 'userManage.groupManage',
            //     menu_route: '/userManage/groupManage',
            //     tag: 'grounpManage',
            // },
            // {
            //     name: '用户字段设置',
            //     menu_icon: '',
            //     menu_code: 'userManage.userFieldsSetting',
            //     menu_route: '/userManage/userFieldsSetting',
            //     tag: 'userFieldsSetting',
            // },
            // {
            //     name: '固定电话簿',
            //     menu_icon: '',
            //     menu_code: 'userManage.phoneList',
            //     menu_route: '/userManage/phoneList',
            //     tag: 'phoneList'
            // }
        ]
    },
    // {
    //     name: '视频会议',
    //     menu_icon: "",
    //     menu_code: 'meeting',
    //     tag: 'meeting',
    //     menu_route: '/meeting',
    //     children: [
    //         {
    //             name: '会议管理',
    //             menu_icon: "",
    //             menu_code: 'meeting.meetingManage',
    //             menu_route: '/meeting/meetingManage',
    //             tag: 'meetingManage',
    //         }, {
    //             name: '我的会议',
    //             menu_icon: "",
    //             menu_code: 'meeting.myMeeting',
    //             menu_route: '/meeting/myMeeting',
    //             tag: 'myMeeting',
    //         }, {
    //             name: '会议审核列表',
    //             menu_icon: "",
    //             menu_code: 'meeting.examineMeetingList',
    //             menu_route: '/meeting/examineMeetingList',
    //             tag: 'examineMeetingList',
    //         }, {
    //             name: '会议文档',
    //             menu_icon: "",
    //             menu_code: 'meeting.meetingDocument',
    //             menu_route: '/meeting/meetingDocument',
    //             tag: 'meetingDocument',
    //         },
    //     ]
    // },
    // {
    //     name: '直播',
    //     menu_icon: "",
    //     menu_code: 'seminar',
    //     tag: 'seminar',
    //     menu_route: '/seminar',
    //     children: [
    //         {
    //             name: '直播管理',
    //             menu_icon: "",
    //             menu_code: 'seminar.seminarManage',
    //             menu_route: '/seminar/seminarManage',
    //             tag: 'seminarManage',
    //         }, {
    //             name: '我的直播',
    //             menu_icon: "",
    //             menu_code: 'seminar.mySeminar',
    //             menu_route: '/seminar/mySeminar',
    //             tag: 'mySeminar',
    //         }, {
    //             name: '直播审核列表',
    //             menu_icon: "",
    //             menu_code: 'seminar.examineSeminarList',
    //             menu_route: '/seminar/examineSeminarList',
    //             tag: 'examineSeminarList',
    //         }, {
    //             name: '直播文档',
    //             menu_icon: "",
    //             menu_code: 'seminar.seminarDocument',
    //             menu_route: '/seminar/seminarDocument',
    //             tag: 'seminarDocument',
    //         },
    //     ]
    // },
    // {
    //     name: "点播",
    //     menu_code: "vod",
    //     menu_icon: "",
    //     tag: 'vod',
    //     children: [
    //         {
    //             name: "视频管理",
    //             menu_code: "vod.videoManage",
    //             menu_icon: "",
    //             menu_route: "/vod/videoManage",
    //             tag: 'videoManage',
    //         },
    //         {
    //             name: "点播管理",
    //             menu_code: "vod.vodManage",
    //             menu_icon: "",
    //             menu_route: "/vod/vodManage",
    //             tag: 'vodManage',
    //         },
    //     ]
    // },
    {
        name: "资讯管理",
        menu_code: "info",
        menu_icon: "",
        tag: 'info',
        children: [
            {
                name: "资讯分类",
                menu_code: "info.infoClassify",
                menu_icon: "",
                menu_route: "/info/infoClassify",
                tag: 'infoClassify',
            },
            {
                name: "资讯列表",
                menu_code: "info.infoManage",
                menu_icon: "",
                menu_route: "/info/infoManage",
                tag: 'infoManage',
            },
        ]
    },
    // {
    //     name: "系统",
    //     menu_code: "system",
    //     menu_icon: "",
    //     tag: 'system',
    //     children: [
    //         {
    //             name: "邮箱信息",
    //             menu_code: "system.mail",
    //             menu_icon: "",
    //             menu_route: "/system/messageManagementMail",
    //             tag: 'messageManagementMail'
    //         },
    //         {
    //             name: "站内消息",
    //             menu_code: "system.net",
    //             menu_icon: "",
    //             menu_route: "/system/messageManagementNet",
    //             tag: 'messageManagementNet'
    //         },
    //         {
    //             name: "广告管理",
    //             menu_code: "system.AdManagement",
    //             menu_icon: "",
    //             menu_route: "/system/AdManagement",
    //             tag: 'AdManagement',
    //         },
    //         {
    //             name: "操作日志",
    //             menu_code: "system.handleLog",
    //             menu_icon: "",
    //             menu_route: "/system/handleLog",
    //             tag: 'handleLog',
    //         },
    //         {
    //             name: "登录日志",
    //             menu_code: "system.loginLog",
    //             menu_icon: "",
    //             menu_route: "/system/loginLog",
    //             tag: 'loginLog',
    //         }
    //     ]
    // },
    {
        name: "营销工具集",
        menu_code: "market",
        menu_icon: "",
        tag: 'market',
        children: [
            {
                name: "活动报名",
                menu_code: "market.eventRegistration",
                menu_icon: "",
                menu_route: "/market/eventRegistration",
                tag: 'eventRegistration',
            },
            {
                name: "问答管理",
                menu_code: "market.QAManage",
                menu_icon: "",
                menu_route: "/market/QAManage",
                tag: 'QAManage',
            },
            {
                name: "问卷调查",
                menu_code: "market.questionnaire",
                menu_icon: "",
                menu_route: "/market/questionnaire",
                tag: 'questionnaire',
            }
        ]
    },
]
const basicMeeting = {
    "title": "小行星",
    "meeting_id": 1,
    "room": 123123,
    "status": 0,
    "start_time_at": 1235678912312,
    "end_time_at": 1235678912313,
    "real_start_time": 1312312,
    "nickname": "张三",
    "user_num": 123,
    "is_me": 1,
    "time_status": 0
}
const meetingDetail =
{
    "meeting": {
        "meeting_id": 123,
        "room": 123456,
        "title": "👴😭🌶️难啊",
        "start_time_at": 123123123,
        "end_time_at": 123123123,
        "real_start_time_at": 123123123,
        "real_end_time_at": 123123123,
        "password": "fsd",
        "max_user_limit": 50,
        "meeting_type": 1,
        "status": 0,
        "auditing": 1,
        "mustmaster": 1,
        "material": "url",
        "popularize": 1,
        "description": "sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家",
        "participants_description": "sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家sdfsf我到家",
        "is_me": 1,
        "image": 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2347577630,3215433397&fm=26&gp=0.jpg'
    },
    "host": {
        "uid": 11,
        "nickname": "于贯千",
        "image": "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_40c4f13.svg"
    },
    "guest_list": [
        {
            "uid": 12,
            "nickname": "大蛇1",
            "image": "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_40c4f13.svg"
        },
        {
            "uid": 17,
            "nickname": "大蛇2",
            "image": "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_40c4f13.svg"
        }, {
            "uid": 29,
            "nickname": "大蛇3",
            "image": "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_40c4f13.svg"
        }
    ],
    "user_list": [
        {
            "uid": 11,
            "nickname": "于贯千",
            "image": "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_40c4f13.svg"
        },
        {
            "uid": 18,
            "nickname": "于贯千1",
            "image": "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_40c4f13.svg"
        }, {
            "uid": 20,
            "nickname": "于贯千2",
            "image": "https://fanyi-cdn.cdn.bcebos.com/static/translation/img/header/logo_40c4f13.svg"
        }
    ]
}
const qunzu = [
    {
        "uuid": 18,
        "title": "群组一"
    },
    {
        "uuid": 19,
        "title": "群组er"
    },
    {
        "uuid": 20,
        "title": '辈子'
    }, {
        "uuid": 21,
        "title": '臊子面'
    }
]
const basicUser = {
    "id": 1,
    "uuid": "92d693d4-bf41-4fa1-8fdd-33681c71567f",
    "mobile": "17610891009",
    "email": "1134941009@qq.com",
    "company_name": "甲骨文公司",
    "nickname": "大麦茶"
}
const meetingDocuments = {
    "meeting_id": 1,
    "title": "大猫",
    "room": 12,
    "start_time_at": 21321313232,
    "doc_num": 3
}
const documentList = {
    "doc_id": 1,
    "title": "title",
    "doc_type": 1,
    "update_at": 213213123213278,
    "nickname": '人',
    "start_time_at": 21321312321321
}
const meetingShList = {
    "meeting_id": 1,
    "title": "天变灰了",
    "room": 123123,
    "status": 1,
    "start_time_at": 21321311231,
    "end_time_at": 1231231233213,
    "real_start_time_at": 131231223133,
    "nickname": "无shaun过",
    "user_num": 123,
    "auditing": 2,
    "meeting_type": 1,
    "create_at": 11312123123
}
function dealRes(res, query) {
    let i = 1;
    let returnArr = []
    for (i; i <= 20; i++) {
        let ele = { ...basicMeeting, "meeting_id": i };
        if (res === 'mylist') {
            ele.title = '庐山升龙霸'
        }
        ele.meeting_id = ele.meeting_id + ((Number(query.page) - 1) * 19)
        returnArr.push(ele);
    }
    return returnArr;
}
function dealSHListMeeting(query) {
    let i = 1;
    let returnArr = []
    for (i; i <= 19; i++) {
        let ele = { ...meetingShList, "meeting_id": i };
        ele.meeting_id = ele.meeting_id + ((Number(query.page) - 1) * 19)
        returnArr.push(ele);
    }
    return returnArr;
}
const proxy = {
    'POST /api/v1/admin/system/login-log': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 6,
                        "nickname": "beams11111",
                        "ip": "192.168.10.1",
                        "area": "北京 北京市",
                        "role_name": "系统管理员",
                        "created_at": "2021-03-31 20:42:12",
                        "browser": " - "
                    }
                ],
                "count": 1
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/system/operation-log': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 6,
                        "nickname": "beams11111",
                        "ip": "192.168.10.1",
                        "role_name": "系统管理员",
                        "created_at": "2021-03-31 20:42:12",
                        "content": " 添加用户 "
                    }
                ],
                "count": 1
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/system/email-log': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 1,
                        "nickname": "猩猩",
                        "title": "邮箱主题",
                        "render_desc": "adasfs",
                        "receiver": "10人",
                        "created_at": "2021-04-06 10:48:48"
                    }
                ],
                "count": 1
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/system/notify/list': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 2,
                        "title": "消息标题",
                        "content": "消息内容",
                        "nickname": "多少啊",
                        "creator_id": 35,
                        "created_at": "2021-04-06 16:56:38"
                    },
                ],
                "count": 1
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/system/email-log-del': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/system/notify/del': (req, res) => {
        res.send({
            code: 200
        })
    },
    'GET /api/v1/admin/system/banner/detail': (req, res) => {
        res.send({
            code: 200,
            data: {
                "id": 1,
                "title": "广告排序测试-2",
                "type": "index",
                "start_at": 1617271227,
                "end_at": 1617281327,
                "is_show": 0,
                "website": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/advert_1615794279604f106714e77.jpg",
                "webapp": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/advert_1615794279604f106714e77.jpg",
                "argue_type": '1',
                "argument": "123",
                "click_count": 0,
                "sort": 1,
                "creator_id": 1,
                "deleted_at": 0,
                "created_at": "2021-04-15 17:35:20",
                "updated_at": "2021-04-15 17:35:56"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/system/banner/del': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/meeting/delete': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/user/login': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9jYi11c2VyLmNvbVwvYXBpXC92MVwvYWRtaW5cL3VzZXJcL2xvZ2luIiwiaWF0IjoxNjE0NDk4MTgyLCJuYmYiOjE2MTQ0OTgxODIsImp0aSI6Im1aa01pRlFWQUtSaGNBUFMiLCJzdWIiOjI3LCJwcnYiOiJjNDFhMmU2OTRmZDg2NGI1YWFkNzBiMTlkYmQ0N2FkNGJlMjUzM2E0IiwiYmVsb25nIjoiOTJkNjY1ODQtM2EzMy00NmY3LWJiYWItM2M2NTE4NWU5OGI1In0.i4WZqEPd-X9C0luROE0lyEMRjRlabrbkcVB9m7C_4pc"
            },
            "extra": []
        })
    },
    'POST /api/v1/admin/direct/examine': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/direct/edit': (req, res) => {
        res.send({
            code: 200
        })
    },
    'GET /api/v1/admin/meeting/audi-detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "auditing_uid": 1001,
                "aud_desc": "🥱💩👴🌶️",
                "create_at": 1614256843,
                "nickname": "鱼皮想吹",
                "auditing": 1
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/meeting/end-meeting': (req, res) => {
        res.send({
            code: 200
        })
    },
    'GET /api/v1/admin/doc/list': (req, res) => {
        let i = 1;
        let returnArr = []
        for (i; i <= 20; i++) {
            let ele = { ...meetingDocuments, meeting_id: i };
            ele.meeting_id = ele.meeting_id + ((Number(req.query.page) - 1) * 19)
            ele.title = ele.title + ele.meeting_id
            returnArr.push(ele);
        }
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/admin/meeting/audi-list': (req, res) => {
        let returnArr = dealSHListMeeting(req.query)
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/direct/audi-list': (req, res) => {
        let returnArr = dealSHListMeeting(req.query)
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/direct/my-list': (req, res) => {
        let returnArr = dealRes('mylist', req.query)
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/admin/direct/audi-detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "auditing_uid": 1001,
                "aud_desc": "🥱💩👴🌶️",
                "create_at": 1614256843,
                "nickname": "鱼皮想吹111",
                "auditing": 1
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/doc/doc-list': (req, res) => {
        let i = 1;
        let returnArr = []
        for (i; i <= 5; i++) {
            let ele = { ...documentList, doc_id: i };
            ele.doc_id = ele.doc_id + ((Number(req.query.page) - 1) * 19)
            ele.title = ele.title + ele.doc_id
            returnArr.push(ele);
        }
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ],
                "meeting": {
                    "title": "上述",
                    "room": 1232,
                    "real_start_time_at": 1614654593882
                }
            }
        })
    },
    'GET /api/v1/admin/user/search-list': (req, res) => {
        let i = 1;
        let returnArr = []
        for (i; i <= 10; i++) {
            let ele = { ...basicUser, id: i };
            ele.id = ele.id + ((Number(req.query.page) - 1) * 10)
            ele.nickname = ele.nickname + ele.id
            returnArr.push(ele);
        }
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 10,
                count: 20,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/admin/meeting/lists': (req, res) => {
        let returnArr = dealRes('allList', req.query)
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/direct/list': (req, res) => {
        let returnArr = dealRes('allList', req.query)
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/admin/meeting/my-lists': (req, res) => {
        let returnArr = dealRes('mylist', req.query);
        res.send({
            code: 200,
            data: {
                page: 1,
                page_size: 20,
                count: 40,
                list: [
                    ...returnArr
                ]
            }
        })
    },
    'GET /api/v1/admin/meeting/detail': (req, res) => {
        res.send({
            code: 200,
            data: meetingDetail
        })
    },
    'GET /api/v1/admin/direct/detail': (req, res) => {
        res.send({
            code: 200,
            data: meetingDetail
        })
    },
    'POST /api/v1/admin/direct/create': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/doc/edit': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/meeting/examine': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/meeting/create': (req, res) => {
        res.send({
            code: 200
        })
    },
    'POST /api/v1/admin/user/menu': (req, res) => {
        res.send({
            code: 200,
            data: menu
        })
    },

    'GET /api/v1/admin/info': (req, res) => {
        res.send({
            code: 200,
            data: {
                "nickname": "姓名",
                "avatar": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "uuid": "92d693d4-bf41-4fa1-8fdd-33681c71567f",
                "mobile": "17610891009",
                "email": "1134941009@qq.com",
                "reg_type": 1,
                "company_name": "甲骨文公司",
                "department": "平台技术部",
                "position": "技术员",
                "id_number": "110000199001010003",
                "positive_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "reverse_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "in_job": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "job_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "other": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "status": 1,
                "approval_status": 3,
                "deleted_at": 0,
                "created_at": "2021-02-28 09:03:28",
                "updated_at": "2021-02-28 09:03:28",
                "is_handle": 1,
                "approval_status_desc": "已认证"
            }
        })
    },
    'POST /api/v1/admin/user/basic-edit(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": '1111'
        })
    },
    'POST /api/v1/admin/user/detail(.*)': (req, res) => {
        res.send({
            code: '200',
            data: {
                "nickname": "姓名",
                "avatar": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "uuid": "92d7ff16-f229-4f67-a51e-815910fff517",
                "mobile": "17610891011",
                "email": "1134941011@qq.com",
                "reg_type": 1,
                "company_name": "甲骨文公司",
                "department": "平台技术部",
                "position": "技术员",
                "id_number": "110000199001010003",
                "positive_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "reverse_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "in_job": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "job_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "other": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "status": 1,
                "approval_status": 3,
                "deleted_at": 0,
                "created_at": "2021-03-01 01:59:13",
                "updated_at": "2021-03-01 01:59:13"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/user/add(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/user/edit(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/user/remove(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/resource/upload(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "fileurl": "http:\/\/huatu-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com\/avatar_1567429032_1.PNG"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v2/corp/user/identify/label': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                // "login_type": "personal"
                "login_type": "company"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 用户认证-认证列表
    'GET /api/v1/admin/approval/list': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 25,
                        "uuid": "92d6936a-57bb-4de8-b5ae-b0d216ef2aab",
                        "mobile": "17610891008",
                        "email": "1134941008@qq.com",
                        "company_name": "甲骨文公司",
                        "approval_status": 1,
                        "created_at": "2021-02-28 09:02:18",
                        "operate_status": 1,
                        "approval_time": "2021-02-28 09:02:18",
                        "nickname": "姓名",
                        "apply_time": "2021-02-28 09:02:18",
                        "operate_status_desc": "已同意"
                    },
                    {
                        "id": 26,
                        "uuid": "92d693d4-bf41-4fa1-8fdd-33681c71567f",
                        "mobile": "17610891009",
                        "email": "1134941009@qq.com",
                        "company_name": "甲骨文公司",
                        "approval_status": 3,
                        "created_at": "2021-02-28 09:03:28",
                        "operate_status": 1,
                        "approval_time": "2021-02-28 09:03:28",
                        "nickname": "姓名",
                        "apply_time": "2021-02-28 09:03:28",
                        "operate_status_desc": "已同意"
                    },
                    {
                        "id": 27,
                        "uuid": "92d6df17-e860-4816-9389-cfd0e5daae04",
                        "mobile": "17610891010",
                        "email": "1134941010@qq.com",
                        "company_name": "甲骨文公司",
                        "approval_status": 3,
                        "created_at": "2021-02-28 12:33:55",
                        "operate_status": 1,
                        "approval_time": "2021-02-28 12:33:55",
                        "nickname": "姓名",
                        "apply_time": "2021-02-28 12:33:55",
                        "operate_status_desc": "已同意"
                    }
                ],
                "count": 3
            },
            "extra": []
        })
    },
    // 用户认证-认证详情
    'POST /api/v1/admin/approval/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "uuid": 223,
                "username": "17610893031", // 账号
                "nickname": "lll-t",
                "avatar": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1611201203_223.PNG",
                "approve_desc": "已认证",
                "approval_status": 1,
                "status": 1,
                "is_handle": 1,
                "corp_name": "z止于至善控股",
                "department": "后勤部",
                "position": "产品经理",
                "email": "chinabond@boom.cn",
                "id_number": "110900023312",
                "positive_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "reverse_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "in_job": "",
                "job_card": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "other": "",
                "remark": "认证详情", // 认证备注
                "apply_time": "2021-01-24 18:00:00", // 申请提交时间
                "approval_time": "2021-01-24 18:00:00", // 审批时间
                "operate_status": 1, // 1 已同意 2 已拒绝
                "operate_status_desc": "已同意", // 
                "approval_operator": "张三", // 操作人
            },
            "extra": [],
            "message": "请求成功"
        })
    },
    'POST /api/v1/admin/user/batch-email': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": '1111'
        })
    },
    'POST /api/v1/admin/role/destroy(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": '1111'
        })
    },
    // 用户认证-（批量）认证
    'POST /api/v1/admin/user/approval': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 字段设置-获取
    'POST /api/v1/admin/setting/field-info': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [
                {
                    "uuid": "92d4682f-730d-4eea-9d7a-eb7ed0c63f72",
                    "name": "姓名",
                    "form_title": "nickname",
                    "value": 2,
                    "updated_at": "2021-02-27 07:09:46"
                },
                {
                    "uuid": "92d468bb-8c41-4d1e-a5cd-636745895b87",
                    "name": "手机号",
                    "form_title": "mobile",
                    "value": 2,
                    "updated_at": "2021-02-27 07:11:18"
                },
                {
                    "uuid": "92d468ef-c38c-4729-9c70-7ac305fb1c33",
                    "name": "机构全称",
                    "form_title": "company_name",
                    "value": 2,
                    "updated_at": "2021-02-27 07:11:52"
                },
                {
                    "uuid": "92d468ff-8a7d-48b3-b8a7-de2308889465",
                    "name": "部门",
                    "form_title": "department",
                    "value": 0,
                    "updated_at": "2021-02-27 07:12:03"
                },
                {
                    "uuid": "92d4690c-b4e9-46a9-a915-ba1c8fcc7b14",
                    "name": "职务",
                    "form_title": "position",
                    "value": 0,
                    "updated_at": "2021-02-27 07:12:11"
                },
                {
                    "uuid": "92d4691c-a0b8-464a-ad1a-c9aa00734e63",
                    "name": "邮箱",
                    "form_title": "email",
                    "value": 0,
                    "updated_at": "2021-02-27 07:12:22"
                },
                {
                    "uuid": "92d4692d-a7d9-467c-bb01-d5a54a2fdcdf",
                    "name": "身份证号",
                    "form_title": "id_number",
                    "value": 0,
                    "updated_at": "2021-02-27 07:12:33"
                },
                {
                    "uuid": "92d46944-49a9-4d62-ab22-e52e6e3435a7",
                    "name": "身份证正面",
                    "form_title": "positive_card",
                    "value": 0,
                    "updated_at": "2021-02-27 07:12:48"
                },
                {
                    "uuid": "92d46953-acc6-4425-8613-89a32a80ee82",
                    "name": "身份证反面",
                    "form_title": "reverse_card",
                    "value": 0,
                    "updated_at": "2021-02-27 07:12:58"
                },
                {
                    "uuid": "92d4696e-778a-4ecf-b271-6d0d3b0b5e76",
                    "name": "公司在职证明",
                    "form_title": "in_job",
                    "value": 0,
                    "updated_at": "2021-02-27 07:13:15"
                },
                {
                    "uuid": "92d46996-876a-4700-b4d9-7c2639337de3",
                    "name": "头像",
                    "form_title": "avatar",
                    "value": 0,
                    "updated_at": "2021-02-27 07:13:41"
                }
            ],
            "extra": []
        })
    },

    // 字段设置-更新
    'POST /api/v1/admin/setting/field': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [
                {
                    "id": 1,
                    "uuid": "1235454",
                    "display": "姓名",
                    "field": "nickname",
                    "value": 2,
                    "updated_at": "2020-01-01 18:00:00"
                },
                {
                    "id": 2,
                    "uuid": "12354549",
                    "display": "职位",
                    "field": "position",
                    "value": 0,
                    "updated_at": "2020-01-01 18:00:00"
                },
                {
                    "id": 3,
                    "uuid": "12354546",
                    "display": "邮箱",
                    "field": "email",
                    "value": 1,
                    "updated_at": "2020-01-01 18:00:00"
                }
            ],
            "extra": []
        })
    },
    // 群组管理
    // 群组管理-用户组（成员）列表
    'POST /api/v1/admin/group/list': (req, res) => {
        console.log(req.body);
        if (req.body.type === 'group') {
            res.send({
                "code": 200,
                "message": "请求成功",
                "data": qunzu
            })
            return
        }
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {
                "list": [
                    {
                        "id": 18,
                        "uuid": "asdfafdsf",
                        "group_uuid": "asdfafdsf", // 用户所属组标识
                        "nickname": "浓眉HI",
                        "role_name": "管理员",
                        "role_id": 1,
                        "mobile": "17610895009",
                        "email": "1134947683@qq.com",
                        "corp_name": "z止于至善控股",
                        "approve_desc": "已认证",
                        "approve_status": 1,
                        "status": 1,
                        "created_at": "2021-01-24 18:00:00"
                    },
                    {
                        "id": 1,
                        "uuid": "1",
                        "group_uuid": "asdfafdsf", // 用户所属组标识
                        "nickname": "浓眉HI",
                        "role_name": "管理员",
                        "role_id": 1,
                        "mobile": "17610895009",
                        "email": "1134947683@qq.com",
                        "corp_name": "z止于至善控股",
                        "approve_desc": "已认证",
                        "approve_status": 1,
                        "status": 1,
                        "created_at": "2021-01-24 18:00:00"
                    },
                    {
                        "id": 2,
                        "uuid": "2",
                        "group_uuid": "asdfafdsf", // 用户所属组标识
                        "nickname": "浓眉HI",
                        "role_name": "管理员",
                        "role_id": 1,
                        "mobile": "17610895009",
                        "email": "1134947683@qq.com",
                        "corp_name": "z止于至善控股",
                        "approve_desc": "已认证",
                        "approve_status": 1,
                        "status": 1,
                        "created_at": "2021-01-24 18:00:00"
                    },
                    {
                        "id": 3,
                        "uuid": "3",
                        "group_uuid": "asdfafdsf", // 用户所属组标识
                        "nickname": "浓眉HI",
                        "role_name": "管理员",
                        "role_id": 1,
                        "mobile": "17610895009",
                        "email": "1134947683@qq.com",
                        "corp_name": "z止于至善控股",
                        "approve_desc": "已认证",
                        "approve_status": 1,
                        "status": 1,
                        "created_at": "2021-01-24 18:00:00"
                    },
                    {
                        "id": 4,
                        "uuid": 1928798797,
                        "group_uuid": "asdfafdsf",
                        "nickname": "詹姆斯HI",
                        "role_name": "普通用户",
                        "role_id": 1,
                        "mobile": "17610895009",
                        "email": "1134947683@qq.com",
                        "corp_name": "z止于至善控股",
                        "approve_desc": "已认证",
                        "approve_status": 1,
                        "status": 1,
                        "created_at": "2021-01-24 18:00:00"
                    }
                ],
                "count": 5
            },
            "extra": []
        })
    },
    // 群组管理-用户组创建
    'POST /api/v1/admin/group/add': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [],
            "extra": []
        })
    },
    // 群组管理-用户组编辑
    'POST /api/v1/admin/group/edit': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [],
            "extra": []
        })
    },
    // 群组管理-用户组删除
    'POST /api/v1/admin/group/remove': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [],
            "extra": []
        })
    },
    // 群组管理-用户组成员添加
    'POST /api/v1/admin/group/user-bind': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [],
            "extra": []
        })
    },
    // 群组管理-用户组成员移除
    'POST /api/v1/admin/group/user-unbind': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [],
            "extra": []
        })
    },
    // 群组管理-用户组成员修改群组
    'POST /api/v1/admin/group/user-edit-bind': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [],
            "extra": []
        })
    },
    // 用户列表
    'GET /api/v1/admin/user/list': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {
                "list": [
                    {
                        "id": 26,
                        "uuid": "92d693d4-bf41-4fa1-8fdd-33681c71567f",
                        "mobile": "17610891009",
                        "email": "1134941009@qq.com",
                        "reg_type": 1,
                        "company_name": "甲骨文公司",
                        "department": "平台技术部",
                        "position": "技术员",
                        "approval_status": 3,
                        "created_at": "2021-02-28 09:03:28",
                        "nickname": "姓名",
                        "role_id": "",
                        "role_name": "管理员",
                        "approval_status_desc": "已同意"
                    },
                    {
                        "id": 25,
                        "uuid": "92d6936a-57bb-4de8-b5ae-b0d216ef2aab",
                        "mobile": "17610891008",
                        "email": "1134941008@qq.com",
                        "reg_type": 1,
                        "company_name": "甲骨文公司",
                        "department": "平台技术部",
                        "position": "技术员",
                        "approval_status": 1,
                        "created_at": "2021-02-28 09:02:18",
                        "nickname": "姓名",
                        "role_id": "",
                        "role_name": "普通用户",
                        "approval_status_desc": "未提交"
                    }
                ],
                "count": 2
            },
            "extra": []
        })
    },
    'GET /api/v1/admin/user/import': (req, res) => {
        res.send({
            code: 200,
            data: {
                "list": [
                    {
                        "line": 18,
                        "nickname": "浓眉HI",//姓名
                        "mobile": "17610895009", // 手机号
                        "company_name": "z止于至善控股", // 机构名称
                    },
                    {
                        "line": 18,
                        "nickname": "浓眉HI",//姓名
                        "mobile": "17610895009", // 手机号
                        "company_name": "z止于至善控股", // 机构名称
                    },
                    {
                        "line": 18,
                        "nickname": "浓眉HI",//姓名
                        "mobile": "17610895009", // 手机号
                        "company_name": "z止于至善控股", // 机构名称
                    },
                    {
                        "line": 18,
                        "nickname": "浓眉HI",//姓名
                        "mobile": "17610895009", // 手机号
                        "company_name": "z止于至善控股", // 机构名称
                    },
                    {
                        "line": 18,
                        "nickname": "浓眉HI",//姓名
                        "mobile": "17610895009", // 手机号
                        "company_name": "z止于至善控股", // 机构名称
                    }
                ],
                "count": 1
            },
            extra: [],
            msg: '111'
        })
    },
    // 用户详情
    'POST /api/v2/corp/user/information(.*)': (req, res) => {
        res.send({
            code: 200,
            data: {
                "id": 1,
                "nickname": "超级管理员",
                "uuid": "admin",
                "corp_id": 1,
                "role_id": "1",
                "account_type": 1,
                "mobile": "17610893039",
                "role_name": "超级管理员",
                "email": "yuguanqian@boom.cn",
                "position": "php",
                "plan_title": "企业版",
                "status_desc": "已激活"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/role/auth': (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": [
                {
                    "id": 1,
                    "name": "用户管理",
                    "pid": 0,
                    "children": [
                        {
                            "id": 1,
                            "pid": 0,
                            "name": "用户列表",
                            "children": [
                                {
                                    "id": 2,
                                    "pid": 1,
                                    "name": "新增用户"
                                },
                                {
                                    "id": 3,
                                    "pid": 1,
                                    "name": "编辑用户"
                                },
                                {
                                    "id": 4,
                                    "pid": 1,
                                    "name": "删除用户"
                                },
                                {
                                    "id": 5,
                                    "pid": 1,
                                    "name": "批量导入"
                                },
                                {
                                    "id": 6,
                                    "pid": 1,
                                    "name": "批量导出"
                                },
                                {
                                    "id": 7,
                                    "pid": 1,
                                    "name": "群发邮件"
                                }
                            ]
                        },
                        {
                            "id": 8,
                            "pid": 0,
                            "name": "用户认证",
                            "children": [
                                {
                                    "id": 9,
                                    "pid": 8,
                                    "name": "认证"
                                }
                            ]
                        },
                        {
                            "id": 10,
                            "pid": 0,
                            "name": "权限管理",
                            "children": [
                                {
                                    "id": 11,
                                    "pid": 10,
                                    "name": "创建角色"
                                },
                                {
                                    "id": 12,
                                    "pid": 10,
                                    "name": "编辑角色"
                                },
                                {
                                    "id": 13,
                                    "pid": 10,
                                    "name": "删除角色"
                                },
                                {
                                    "id": 14,
                                    "pid": 10,
                                    "name": "查看角色成员"
                                }
                            ]
                        },
                        {
                            "id": 15,
                            "pid": 0,
                            "name": "群组管理",
                            "children": [
                                {
                                    "id": 16,
                                    "pid": 15,
                                    "name": "创建群组"
                                },
                                {
                                    "id": 17,
                                    "pid": 15,
                                    "name": "编辑群组"
                                },
                                {
                                    "id": 18,
                                    "pid": 15,
                                    "name": "删除群组"
                                },
                                {
                                    "id": 19,
                                    "pid": 15,
                                    "name": "添加群组成员"
                                }
                            ]
                        },
                        {
                            "id": 20,
                            "pid": 0,
                            "name": "用户字段管理",
                            "children": [
                                {
                                    "id": 21,
                                    "pid": 20,
                                    "name": "设置字段"
                                }
                            ]
                        }
                    ]
                }
            ],
            "extra": []
        })
    },
    'POST /api/v1/admin/role/detail(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "role_name": "产品",
                "role_desc": "列表读取角色描述",
                "auth": [1, 2, 3]
            },
            "extra": [],
            "msg": ''
        })
    },
    'GET /api/v1/admin/role/index': (req, res) => {
        res.send({
            "code": 200,
            "data": [
                {
                    "role_code": "product",
                    "role_name": "产品",
                    "role_desc": "列表读取角色描述",
                    "user_count": 2,
                    "updated_at": "2020-01-01 18:00:00"
                },
                {
                    "role_code": "C90606E3-F7F1-74D5-11B9-4D07C84A56CF",
                    "role_name": "角色5528",
                    "role_desc": "当前角色描述",
                    "user_count": 0,
                    "updated_at": "2020-01-01 18:00:00"
                },
                {
                    "role_code": "C90606E3-F7F1-74D5-11B9-4D07C84A56CF",
                    "role_name": "超级管理员",
                    "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                    "user_count": 1,
                    "updated_at": "2020-01-01 18:00:00"
                }
            ]
        })
    },
    'POST /api/v1/admin/user/reset-password(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": '11111'
        })
    },
    'POST //api/v1/admin/role/add(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": '11111'
        })
    },
    'POST /api/v1/admin/role/add(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": '11111'
        })
    },
    'POST /api/v1/admin/role/edit(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": '11111'
        })
    },
    // 获取分页角色列表
    'GET /api/v1/admin/role/list': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "role_code": "product",
                        "role_name": "产品",
                        "role_desc": "列表读取角色描述",
                        "user_count": 2,
                        "auth": [2, 3],
                        "updated_at": "2020-01-01 18:00:00"
                    },
                    {
                        "role_code": "C90606E3-F7F1-74D5-11B9-4D07C84A56CF",
                        "role_name": "角色5528",
                        "role_desc": "当前角色描述",
                        "user_count": 0,
                        "auth": [],
                        "updated_at": "2020-01-01 18:00:00"
                    },
                    {
                        "role_code": "admin",
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1,
                        "auth": [],
                        "updated_at": "2020-01-01 18:00:00"
                    }
                ],
                "count": 5
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 分页获取角色列表详细信息
    'GET /api/v2/corp/role/page/list(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 4,
                        "role_name": "产品",
                        "role_desc": "列表读取角色描述",
                        "user_count": 2
                    },
                    {
                        "id": 3,
                        "role_name": "角色5528",
                        "role_desc": "当前角色描述",
                        "user_count": 0
                    },
                    {
                        "id": 1,
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1
                    },
                    {
                        "id": 2,
                        "role_name": "角色5528",
                        "role_desc": "当前角色描述",
                        "user_count": 0
                    },
                    {
                        "id": 5,
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1
                    },
                    {
                        "id": 6,
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1
                    },
                    {
                        "id": 7,
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1
                    },
                    {
                        "id": 8,
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1
                    },
                    {
                        "id": 9,
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1
                    },
                    {
                        "id": 10,
                        "role_name": "超级管理员",
                        "role_desc": "超级管理员拥有访问和管理企业账户的全部权限",
                        "user_count": 1
                    }
                ],
                "count": 11
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取权限列表
    'POST /api/v1/admin/user/permission': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                ROLE_LIST: '/api/v2/corp/role/page/list',  // 分页获取角色列表

                ROLE_USER_LIST: '/api/v2/corp/user/list',                // 用户管理--获取某一角色下用户列表
                USER_ADD: '/api/v2/corp/user/add',               // 企业管理-用户管理-用户列表：添加用户
                USER_DEL: '/api/v2/corp/user/del',     // 用户管理-删除用户
                USER_UPDATE: '/api/v2/corp/user/update',     // 用户管理-编辑用户
                USER_BATCH_DELETE: '11111',
                USER_BATCH_IMPORT: '1111',
                USER_BATCH_EXPORT: '1111',
                USER_BATCH_EMAIL: '1111',

                AUTH_EDIT: '11111',
                ROLE_CREATE: '1111',
                ROLE_DELETE: '1111',
                ROLE_SEARCH: '11111',

                GROUNP_CREATE: '11111',
                GROUNP_EDIT: '11111',
                GROUP_DELETE: '11111',
                GROUNP_PARTICIPANT_ADD: '11111',

                FIELD_SET: '11111',

                PLAN_DIST: '/api/v2/corp/plan/distribute',     // 分配计划
                PLAN_REMOVE: '/api/v2/corp/plan/remove',     // 撤销计划
                ACCOUNT_UPDATE: '/api/v2/corp/account/update',    // 编辑账户信息
                ROLE_CHANGE: '/api/v2/corp/role/user/link',  // 修改角色
                ROLE_MEMBER_ADD: '/api/v2/corp/role/user/link',  // 添加角色成员
                INVITE_RESEND: '/api/v2/corp/user/activateInvitation', // 未激活用户重新发送

                MEETING_LIST: '/api/v1/meeting/lists',    // 获取会议列表
                MEETING_APPOINT: '/api/v1/meeting/create',   // 预约会议
                MEETING_DETAIL: '/api/v1/meeting/detail',   // 获取会议详情
                MEETING_UPDATE: '/api/v1/seminar/edit',     // 编辑会议

            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v2/corp/user/person/info': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "id": 322,
                "nickname": "mac",
                "avatar": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/2019/10/17466000157086657727.png",
                "is_handle": 1,
                "type": "user",
                "meeting": {
                    "meeting_number": "85885283525",
                    "is_join": 0,
                    "meeting_pwd": "",
                    "join_url": ""
                },
                "info": {
                    "mobile": "18666748230",
                    "email": null,
                    "is_default_pwd": 0
                },
                "target_type": [
                    {
                        "target_type": "basicset",
                        "type_name": "基础套餐",
                        "num": 20,
                        "duration": "1440分钟",
                        "days": "",
                        "finished_at": "",
                        "screen_num": 2
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/share/hash': (req, res) => { // 获取hash
        res.send({
            "code": 200,
            "data": "7WLn04",
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v2/corp/user/add': (req, res) => {   // 添加用户
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/front/user/text/check': (req, res) => {   // 合法性校验
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/front/user/nickname/update': (req, res) => {  // 修改昵称
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/user/sms/send': (req, res) => {   // 发送短信验证码
        res.send({
            code: 451,
            data: [],
            extra: [],
            msg: '发送成功'
        })
    },
    'POST /api/v1/auth/mobileverify': (req, res) => { // 短信验证码验证
        res.send({
            "code": 200,
            "data": {
                "mobile": "17610893031",
                "msg_code": "9781"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取图片验证码
    'GET /api/v1/front/verify/setimage': (req, res) => {
        res.send({
            code: 200,
            data: {
                img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAAyCAMAAAC53sMJAAABPlBMVEX///8AAADd7PHt1vbz5/bP9Ofe2ebazvXf3/Tr7szx2/jb/tH+8NDtzefm48jny9X25c7O9O/+4Obu+/js993Wz+np1/P68eDMyu3s3tX70czg5u3/3M396/Di7f3r1tDUz/HQ+/vL5e759/bL0ujt1/bLz8nU4NX+8N7t2ezq7vju5fnay/7e3t7Y7enIyOPw0/Ts99zp4N/I1/fs2v/z79z/ysnO8tzu9vL/39j03+HW9d3Y7svV0eXn6t3O1PPnyOPP6PX27OPozPXP39rm1/zs1tfl8OXK+P3//OXb1fzyz8j08tL54NH899r9/93W/fXK9sz85ezb6+zt69Tk49bv4/ze1efi6dvv3dbJ89Xe1ejw9M/d38jh7M3RzeD++dLO/NzM9eLv6tfS+djt9N9dFYQuAwgJW0NTiAxi2s6LAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGWUlEQVRYhd3TaVNTWRAG4C5AggQpRaFYQ0pCUEAoljAoYTFgIstAQSCQwLCD+v//wPRy1nvPjZOp+TTdXZrca6Ue39MH4H9enz79Zz/15o33dXy8ZQtPuLq7W7PwWAtPq5YkTDdPSxYHM956NJ+4Ey3d7e3+w74+/elzHPMGPMx468k0wVCDp+njcS0dHUmYfP7fHJP7/dUr+Xtzkyjt3eBF02eiMRYehfFWJs+DNTTUDLC87Gt09fcDUlizicMr0w4+pg805rO2ONF4FoqGLDyJFh6r0Zx+Ho5mU0XT7mHW1wOYDpOMv795yI/nlSUZsxyJRle/ikYw1Hy1HQsPWQ4P9TH5GLcQUyxCoTAEQ02SWeYOYag9DHz5Yt+vSzRkofmsMAkWxBTzuSJAwcdsbTXFzM25GLsyZMExyaxz4/4ecjRWk1DFHHA03sps8XA9PEBsZeZ+YgmGg5EiCltsNIIBSoVaV0cSp5gvFooFKLhntGWjeeDxzwgtc3NG411txFBbjFg05k/7I+/fhzAgGHd/t7i1hTDe/qIF5oAxtL9e+RhFUSvjWXi86uxETA5PquA9djEPnAzV3Z2HCdcXcC20v0bjYt7Ho+nEwe3N+RR3ZRzMHY9gQO1MWBOsw0Mf8/zsYzo5mpza34hGY1yLwfxkUbAuLjzO7KzzxWK+P1vM7a1gqCGXi/+kudr6jBBzZ5Ohqx3WXPBYC09MQ5ZnbWlru7WY5vVgknEw9k+/DsjiYGYj0VjLd8EsLt62STSd8HuLKbsy4gha4AI5HmYWAhi0AGMWMRiMhjAtUEjz8qX5/DO4wAfwzzDoEAxaFm+Jw487W+C8vLtjzclJ0r84wGM6CKzMwkIUI4WYRYS04Uk1qR8/zMdMRltwCHNCs7GRgPEoooEFHq++w6gks0jR/MZiMBkewVCz5QQpIc0Bb43PmZ1dUNE0Gq5mVx9TrSZXW9XERMyiMRk4O4tiqBOjCdQCNzR4VI3u6gWuAdScZCZ4XIs9pgxSzjQG+JSOCLMRTAY1wvmlCmBvT2EaXjS7yNmlDzXk1ORZpSIWF0MQgzlDjsKA3CU6po1EjFeI2UOOrEyD22KoCcPNlixUEDPhJsMOB3OWUZibG9rfI4zmKLgyV1dxzJ6KBjTmD4sZdTH39xWKplyOYqQUBimCueFBzNHJSSiWK55YMNS8v7IyBjMqwfDKoAWy9xgNJlOGyAKrZC4vEVPNWIvCYMf39yoSTSrFGyMYrsbTk8WgZhS0Bi0YTbZSrgBGEyvCIOWyihpQmBuVDE0omCs3mRTlAo+PYCzw1Gg8acy7dyD7S5oaYu6z97QyZShHrzZjLjmadPVMJyOYMCWKqdd//UoBUh7NI4yFohELj66lJcZUsmXCBH/9kjpdBZOMWFCTkIxroTNKkeVxTyfzxG0sFrMkx5Tlqx22CAYMRlMSyzmjOp5RnTCPXjIO5p1NZkmiAchmkyiESePKpKvmwU2cMzjoagyHMSmIYHp67Cl5GOr7e/4S2N/TU9akAaqxd56FJ151PKc6+CsDSOkB+Esw4J4SdWKd8sjVrsY55+eOJQED9d6US7m+7pH9ZYy7vXxMzS2n8jGdjr8+5xHMYDgZpAD0Qqn0qDjXND0mGXd/u7qaUAhzCqeJb8lyvrLytimmt17vHSsBlAYGtMXHmOrCWWqajMJMTwcx2G+BNEkrQ6mQZayEngHGUJMlWmTpCv/G1JRglAXg2zf1Znvbwaycg0Szs5Pw/+mFMSiNlQZKMGAwAQphqKM1P48WnpEROSOyTINokLI9PKwwGMzKW8LswGCCBjG9JTyk0oBKhoMxnJmZphikzE9xNCPI4f0lyLREsy3RaM2KYHaaRYPJ4DEBYfb3ieLUDI/ChC2IwSbLiErmGzdjtoe3QUWD+ysrs8OdUGN4mSgVtADOtcOZ8aOJ1Ty1wlArzLSLGVbJYPHCTEYxa2ueBu8SnhJb9iPBzJhk/P09PnYwMAUWg2cEzsqAg6H9nYSdSd/Cs7pqNMjB/d0H6jjmxYtYJMc8fEy8vbwy+uW0vktMcSyUC0cTsawBUlbBqxCGLABRzbGNhoqu9oj73rnaTHn9+utX+vvDh0nkTLr7u0a96kajMRELa8gSxxxzMnK1pUZGIFi4v6/hKw5aaIjjlMKsmmQ+fjQat/4GisVbNAtTJKQAAAAASUVORK5CYII="
            },
            extra: [],
            msg: ''
        })
    },
    // 获取企业信息
    'GET /api/v2/corp/account/info': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "corp_name": "旧金山发展有限公司",
                "corp_avatar": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/2019/10/17466000157086657727.png",
                "corp_domain": "http://baidu.cn",
                "corp_sn": "B100666",
                "industry_type": 1,
                "firm_size": 1,
                "principal_name": "刘松明",
                "principal_phone": "17610893031",
                "princlpal_email": "yimingrensc@163.com",
                "address": "旧金山",
                "master_id": 223,
                "firm_size_desc": "20人以下",
                "industry_type_desc": "政务",
                "superinfo": {
                    "mobile": "17610893031",
                    "email": ""
                }
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 企业信息编辑
    'GET /api/v2/corp/account/update': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/auth/avatar/update': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "url": "http://huatu-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1567429032_1.PNG"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v2/corp/user/del': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 企业计划数目获取
    'POST /api/v2/corp/plan/info': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "available": 2
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v2/corp/plan/distribute': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v2/corp/plan/remove': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 个人会议号信息获取
    'POST /api/v2/corp/user/conference/number': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "meeting_number": "85885283525",
                "is_join": 1,
                "meeting_pwd": "1234",
                "join_url": ""
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 图片验证码验证
    'GET /api/v1/front/verify/checkimage': (req, res) => {
        res.send({
            code: 201,
            data: '',
            msg: ''
        })
    },
    'POST /api/v1/auth/setpassword': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v2/corp/user/conference/editInfo': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v2/corp/role/user/link': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 未激活用户从新发送邀请
    'POST /api/v2/corp/user/activateInvitation': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 个人版会议列表
    'GET /api/v1/meeting/personMeetingList': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 11,
                "page_num": 1,
                "list": [
                    {
                        "id": 40,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 41,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 42,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 43,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 44,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "0"        //是否主持人
                    }, {
                        "id": 45,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "0"        //是否主持人
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 会议列表
    'GET /api/v1/meeting/lists': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 11,
                "page_num": 1,
                "list": [
                    {
                        "id": 40,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 41,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 42,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 43,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 44,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "0"        //是否主持人
                    }, {
                        "id": 45,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "0"        //是否主持人
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/meeting/businessMeetingList': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 11,
                "page_num": 1,
                "list": [
                    {
                        "id": 40,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 41,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 42,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 43,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 1,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "1"        //是否主持人
                    }, {
                        "id": 44,
                        "title": "邵博渊预约的会议0",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": [],             //横幅属性
                        "is_anchor": "0"        //是否主持人
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 预约会议
    'POST /api/v1/meeting/create': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "meeting_id": "1233"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/meeting/businessMeetingCreate': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "meeting_id": "1233"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 会议详情
    'GET /api/v1/meeting/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "room_id": "128496",
                "title": "1234",
                "start_date": "2021-02-01",
                "start_time": "18:30",
                "end_date": "2021-02-01",
                "end_time": "19:30",
                "duration": 60,
                "is_earily": 0,
                "mustmaster": 0,
                "is_password": 0,
                "password": "",
                "userlist": [],
                "nickname": "Boom\u89c6\u9891\u4f1a\u8bae\u4f01\u4e1a\u6bcd\u8d26\u53f72222",
                "close_time": "0000-00-00 00:00:00",
                "virtual_end_time": "2021-02-01 19:30:00",
                "status": 0, "is_seminars": 0,
                "is_appointment": 1,
                "is_anchor": 1,
                "banner_info": {
                    "banner_id": 10,
                    "name": "横幅1",
                    "content": "横幅内容1",
                    "color": "#333333"
                }
            },
            "extra": [],
            "msg": "\u8bf7\u6c42\u6210\u529f"
        })
    },
    // 会议列表
    'GET /api/v1/meeting/participants': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "info": {
                    "uid": 342,
                    "title": "邵博渊预约的会议",
                    "room": "439010",
                    "start_time": "2020-12-25 15:45:00",
                    "lock": "0"
                },
                "list": [
                    {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }, {
                        "uid": "342",
                        "add_time": "2020-12-25 15:33:29",
                        "device": "pc",
                        "nickname": "邵博渊",
                        "is_you": "1",
                        "share_screen": "1",
                        "camera": "0",
                        "microphone": "0",
                        "is_device": "0",
                        "sn": "",
                        "permission": 'MFDFAG',
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取企业基本信息选框列表（企业规模/行业类型）
    'GET /api/v2/corp/account/basic': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "enterprise_size": {
                    "1": "20人以下",
                    "2": "20-99人",
                    "3": "100-199人",
                    "4": "200-499人",
                    "5": "500-999人",
                    "6": "1000-2999人",
                    "7": "3000-4999人",
                    "8": "5000-9999人",
                    "9": "10000人以上"
                },
                "industry": {
                    "1": "政务",
                    "2": "金融",
                    "3": "教育",
                    "4": "医疗",
                    "5": "泛互",
                    "6": "游戏",
                    "7": "传媒",
                    "8": "地产",
                    "9": "文旅",
                    "10": "运营商",
                    "11": "交通",
                    "12": "能源",
                    "13": "工业",
                    "14": "智能终端",
                    "15": "其他"
                }
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 手机区号列表
    'GET /api/v1/user/sms/areacode2': (req, res) => {
        res.send({ "code": 200, "data": { "public": { "\u4e2d\u56fd": "+86", "\u4e2d\u56fd\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a": "+852", "\u4e2d\u56fd\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a": "+853", "\u4e2d\u56fd\u53f0\u6e7e": "+886" }, "A": { "\u963f\u5c14\u5df4\u5c3c\u4e9a": "+355", "\u963f\u5c14\u53ca\u5229\u4e9a": "+213", "\u963f\u5bcc\u6c57": "+93", "\u963f\u6839\u5ef7": "+54", "\u963f\u62c9\u4f2f\u8054\u5408\u914b\u957f\u56fd": "+971", "\u963f\u9c81\u5df4": "+297", "\u963f\u66fc": "+968", "\u963f\u585e\u62dc\u7586": "+994", "\u963f\u68ee\u677e\u5c9b": "+247", "\u57c3\u53ca": "+20", "\u57c3\u585e\u4fc4\u6bd4\u4e9a": "+251", "\u7231\u5c14\u5170": "+353", "\u7231\u6c99\u5c3c\u4e9a": "+372", "\u5b89\u9053\u5c14": "+376", "\u5b89\u54e5\u62c9": "+244", "\u5b89\u572d\u62c9": "+1", "\u5b89\u63d0\u74dc\u548c\u5df4\u5e03\u8fbe": "+1", "\u5965\u5730\u5229": "+43", "\u5965\u5170\u7fa4\u5c9b": "+358", "\u6fb3\u5927\u5229\u4e9a": "+61" }, "B": { "\u5df4\u5df4\u591a\u65af": "+1", "\u5df4\u5e03\u4e9a\u65b0\u51e0\u5185\u4e9a": "+675", "\u5df4\u54c8\u9a6c": "+1", "\u5df4\u57fa\u65af\u5766": "+92", "\u5df4\u62c9\u572d": "+595", "\u5df4\u52d2\u65af\u5766\u9886\u571f": "+970", "\u5df4\u6797": "+973", "\u5df4\u62ff\u9a6c": "+507", "\u5df4\u897f": "+55", "\u767d\u4fc4\u7f57\u65af": "+375", "\u767e\u6155\u5927": "+1", "\u4fdd\u52a0\u5229\u4e9a": "+359", "\u5317\u9a6c\u91cc\u4e9a\u7eb3\u7fa4\u5c9b": "+1", "\u8d1d\u5b81": "+229", "\u6bd4\u5229\u65f6": "+32", "\u51b0\u5c9b": "+354", "\u6ce2\u591a\u9ece\u5404": "+1", "\u6ce2\u5170": "+48", "\u6ce2\u65af\u5c3c\u4e9a\u548c\u9ed1\u585e\u54e5\u7ef4\u90a3": "+387", "\u73bb\u5229\u7ef4\u4e9a": "+591", "\u4f2f\u5229\u5179": "+501", "\u535a\u8328\u74e6\u7eb3": "+267", "\u4e0d\u4e39": "+975", "\u5e03\u57fa\u7eb3\u6cd5\u7d22": "+226", "\u5e03\u9686\u8fea": "+257", "\u79d8\u9c81": "+51" }, "C": { "\u8d64\u9053\u51e0\u5185\u4e9a": "+240" }, "D": { "\u4e39\u9ea6": "+45", "\u5fb7\u56fd": "+49", "\u4e1c\u5e1d\u6c76": "+670", "\u591a\u54e5": "+228", "\u591a\u7c73\u5c3c\u52a0\u5171\u548c\u56fd": "+1", "\u591a\u7c73\u5c3c\u514b": "+1" }, "E": { "\u4fc4\u7f57\u65af": "+7", "\u5384\u74dc\u591a\u5c14": "+593", "\u5384\u7acb\u7279\u91cc\u4e9a": "+291" }, "F": { "\u6cd5\u56fd": "+33", "\u6cd5\u7f57\u7fa4\u5c9b": "+298", "\u6cd5\u5c5e\u6ce2\u5229\u5c3c\u897f\u4e9a": "+689", "\u6cd5\u5c5e\u572d\u4e9a\u90a3": "+594", "\u68b5\u8482\u5188": "+39", "\u83f2\u5f8b\u5bbe": "+63", "\u6590\u6d4e": "+679", "\u82ac\u5170": "+358", "\u4f5b\u5f97\u89d2": "+238", "\u798f\u514b\u5170\u7fa4\u5c9b": "+500" }, "G": { "\u5188\u6bd4\u4e9a": "+220", "\u521a\u679c(\u5e03)": "+242", "\u521a\u679c(\u91d1)": "+243", "\u54e5\u4f26\u6bd4\u4e9a": "+57", "\u54e5\u65af\u8fbe\u9ece\u52a0": "+506", "\u683c\u6069\u897f\u5c9b": "+44", "\u683c\u6797\u7eb3\u8fbe": "+1", "\u683c\u9675\u5170": "+299", "\u683c\u9c81\u5409\u4e9a": "+995", "\u74dc\u5fb7\u7f57\u666e": "+590", "\u5173\u5c9b": "+1", "\u572d\u4e9a\u90a3": "+592" }, "H": { "\u54c8\u8428\u514b\u65af\u5766": "+7", "\u6d77\u5730": "+509", "\u97e9\u56fd": "+82", "\u8377\u5170": "+31", "\u8377\u5c5e\u52a0\u52d2\u6bd4\u533a": "+599", "\u8377\u5c5e\u5723\u9a6c\u4e01": "+1", "\u9ed1\u5c71": "+382", "\u6d2a\u90fd\u62c9\u65af": "+504" }, "J": { "\u57fa\u91cc\u5df4\u65af": "+686", "\u5409\u5e03\u63d0": "+253", "\u5409\u5c14\u5409\u65af\u65af\u5766": "+996", "\u51e0\u5185\u4e9a": "+224", "\u51e0\u5185\u4e9a\u6bd4\u7ecd": "+245", "\u52a0\u62ff\u5927": "+1", "\u52a0\u7eb3": "+233", "\u52a0\u84ec": "+241", "\u67ec\u57d4\u5be8": "+855", "\u6377\u514b": "+420", "\u6d25\u5df4\u5e03\u97e6": "+263" }, "K": { "\u5580\u9ea6\u9686": "+237", "\u5361\u5854\u5c14": "+974", "\u5f00\u66fc\u7fa4\u5c9b": "+1", "\u79d1\u79d1\u65af(\u57fa\u6797)\u7fa4\u5c9b": "+61", "\u79d1\u6469\u7f57": "+269", "\u79d1\u7d22\u6c83": "+383", "\u79d1\u7279\u8fea\u74e6": "+225", "\u79d1\u5a01\u7279": "+965", "\u514b\u7f57\u5730\u4e9a": "+385", "\u80af\u5c3c\u4e9a": "+254", "\u5e93\u514b\u7fa4\u5c9b": "+682", "\u5e93\u62c9\u7d22": "+599" }, "L": { "\u62c9\u8131\u7ef4\u4e9a": "+371", "\u83b1\u7d22\u6258": "+266", "\u8001\u631d": "+856", "\u9ece\u5df4\u5ae9": "+961", "\u7acb\u9676\u5b9b": "+370", "\u5229\u6bd4\u91cc\u4e9a": "+231", "\u5229\u6bd4\u4e9a": "+218", "\u5217\u652f\u6566\u58eb\u767b": "+423", "\u7559\u5c3c\u6c6a": "+262", "\u5362\u68ee\u5821": "+352", "\u5362\u65fa\u8fbe": "+250", "\u7f57\u9a6c\u5c3c\u4e9a": "+40" }, "M": { "\u9a6c\u8fbe\u52a0\u65af\u52a0": "+261", "\u9a6c\u6069\u5c9b": "+44", "\u9a6c\u5c14\u4ee3\u592b": "+960", "\u9a6c\u8033\u4ed6": "+356", "\u9a6c\u62c9\u7ef4": "+265", "\u9a6c\u6765\u897f\u4e9a": "+60", "\u9a6c\u91cc": "+223", "\u9a6c\u5176\u987f": "+389", "\u9a6c\u7ecd\u5c14\u7fa4\u5c9b": "+692", "\u9a6c\u63d0\u5c3c\u514b": "+596", "\u9a6c\u7ea6\u7279": "+262", "\u6bdb\u91cc\u6c42\u65af": "+230", "\u6bdb\u91cc\u5854\u5c3c\u4e9a": "+222", "\u7f8e\u5c5e\u8428\u6469\u4e9a": "+1", "\u7f8e\u5c5e\u7ef4\u5c14\u4eac\u7fa4\u5c9b": "+1", "\u8499\u53e4": "+976", "\u8499\u7279\u585e\u62c9\u7279": "+1", "\u7f8e\u56fd": "+1", "\u5b5f\u52a0\u62c9\u56fd": "+880", "\u5bc6\u514b\u7f57\u5c3c\u897f\u4e9a": "+691", "\u7f05\u7538": "+95", "\u6469\u5c14\u591a\u74e6": "+373", "\u6469\u6d1b\u54e5": "+212", "\u6469\u7eb3\u54e5": "+377", "\u83ab\u6851\u6bd4\u514b": "+258", "\u58a8\u897f\u54e5": "+52" }, "N": { "\u7eb3\u7c73\u6bd4\u4e9a": "+264", "\u5357\u975e": "+27", "\u5357\u82cf\u4e39": "+211", "\u7459\u9c81": "+674", "\u5c3c\u52a0\u62c9\u74dc": "+505", "\u5c3c\u6cca\u5c14": "+977", "\u5c3c\u65e5\u5c14": "+227", "\u5c3c\u65e5\u5229\u4e9a": "+234", "\u7ebd\u57c3": "+683", "\u632a\u5a01": "+47", "\u8bfa\u798f\u514b\u5c9b": "+672" }, "P": { "\u5e15\u52b3": "+680", "\u8461\u8404\u7259": "+351" }, "R": { "\u65e5\u672c": "+81", "\u745e\u5178": "+46", "\u745e\u58eb": "+41" }, "S": { "\u8428\u5c14\u74e6\u591a": "+503", "\u8428\u6469\u4e9a": "+685", "\u585e\u5c14\u7ef4\u4e9a": "+381", "\u585e\u62c9\u5229\u6602": "+232", "\u585e\u5185\u52a0\u5c14": "+221", "\u585e\u6d66\u8def\u65af": "+357", "\u585e\u820c\u5c14": "+248", "\u6c99\u7279\u963f\u62c9\u4f2f": "+966", "\u5723\u5df4\u6cf0\u52d2\u7c73": "+590", "\u5723\u8bde\u5c9b": "+61", "\u5723\u591a\u7f8e\u548c\u666e\u6797\u897f\u6bd4": "+239", "\u5723\u8d6b\u52d2\u62ff": "+290", "\u5723\u57fa\u8328\u548c\u5c3c\u7ef4\u65af": "+1", "\u5723\u5362\u897f\u4e9a": "+1", "\u5723\u9a6c\u4e01\u5c9b": "+590", "\u5723\u9a6c\u529b\u8bfa": "+378", "\u5723\u76ae\u57c3\u5c14\u548c\u5bc6\u514b\u9686\u7fa4\u5c9b": "+508", "\u5723\u6587\u68ee\u7279\u548c\u683c\u6797\u7eb3\u4e01\u65af": "+1", "\u65af\u91cc\u5170\u5361": "+94", "\u65af\u6d1b\u4f10\u514b": "+421", "\u65af\u6d1b\u6587\u5c3c\u4e9a": "+386", "\u65af\u74e6\u5c14\u5df4\u548c\u626c\u9a6c\u5ef6": "+47", "\u65af\u5a01\u58eb\u5170": "+268", "\u82cf\u4e39": "+249", "\u82cf\u91cc\u5357": "+597", "\u6240\u7f57\u95e8\u7fa4\u5c9b": "+677", "\u7d22\u9a6c\u91cc": "+252" }, "T": { "\u5854\u5409\u514b\u65af\u5766": "+992", "\u6cf0\u56fd": "+66", "\u5766\u6851\u5c3c\u4e9a": "+255", "\u6c64\u52a0": "+676", "\u7279\u514b\u65af\u548c\u51ef\u79d1\u65af\u7fa4\u5c9b": "+1", "\u7279\u91cc\u65af\u5766-\u8fbe\u5e93\u5c3c\u4e9a\u7fa4\u5c9b": "+290", "\u7279\u7acb\u5c3c\u8fbe\u548c\u591a\u5df4\u54e5": "+1", "\u7a81\u5c3c\u65af": "+216", "\u56fe\u74e6\u5362": "+688", "\u571f\u8033\u5176": "+90", "\u571f\u5e93\u66fc\u65af\u5766": "+993", "\u6258\u514b\u52b3": "+690" }, "W": { "\u74e6\u5229\u65af\u548c\u5bcc\u56fe\u7eb3": "+681", "\u74e6\u52aa\u963f\u56fe": "+678", "\u5371\u5730\u9a6c\u62c9": "+502", "\u59d4\u5185\u745e\u62c9": "+58", "\u6587\u83b1": "+673", "\u4e4c\u5e72\u8fbe": "+256", "\u4e4c\u514b\u5170": "+380", "\u4e4c\u62c9\u572d": "+598", "\u4e4c\u5179\u522b\u514b\u65af\u5766": "+998" }, "X": { "\u5e0c\u814a": "+30", "\u897f\u73ed\u7259": "+34", "\u897f\u6492\u54c8\u62c9": "+212", "\u65b0\u52a0\u5761": "+65", "\u65b0\u5580\u91cc\u591a\u5c3c\u4e9a": "+687", "\u65b0\u897f\u5170": "+64", "\u5308\u7259\u5229": "+36" }, "Y": { "\u7259\u4e70\u52a0": "+1", "\u4e9a\u7f8e\u5c3c\u4e9a": "+374", "\u4e5f\u95e8": "+967", "\u4f0a\u62c9\u514b": "+964", "\u4ee5\u8272\u5217": "+972", "\u610f\u5927\u5229": "+39", "\u5370\u5ea6": "+91", "\u5370\u5ea6\u5c3c\u897f\u4e9a": "+62", "\u82f1\u56fd": "+44", "\u82f1\u5c5e\u7ef4\u5c14\u4eac\u7fa4\u5c9b": "+1", "\u82f1\u5c5e\u5370\u5ea6\u6d0b\u9886\u5730": "+246", "\u7ea6\u65e6": "+962", "\u8d8a\u5357": "+84" }, "Z": { "\u8d5e\u6bd4\u4e9a": "+260", "\u6cfd\u897f\u5c9b": "+44", "\u4e4d\u5f97": "+235", "\u76f4\u5e03\u7f57\u9640": "+350", "\u667a\u5229": "+56", "\u4e2d\u975e\u5171\u548c\u56fd": "+236", "\u4e2d\u56fd": "+86", "\u4e2d\u56fd\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a": "+853", "\u4e2d\u56fd\u53f0\u6e7e": "+886", "\u4e2d\u56fd\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a": "+852" } }, "extra": [], "msg": "\u8bf7\u6c42\u6210\u529f" })
    },
    // 获取设备列表
    'GET /api/v1/admin/device/lists(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 21,
                "page_num": 1,
                "list": [
                    {
                        "id": 1,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ1",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 2,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ2",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 0,
                        'type': 2,
                    }, {
                        "id": 3,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ3",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 3,
                    }, {
                        "id": 4,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ4",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 4,
                    }, {
                        "id": 5,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ5",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 6,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ6",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 7,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ7",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 8,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ8",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 9,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ9",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 10,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ10",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 11,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ11",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 12,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ12",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 13,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ13",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 14,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ14",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 15,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ15",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 16,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ16",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 17,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ17",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 18,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ18",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 19,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ19",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 20,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ20",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }, {
                        "id": 21,
                        "uid": 342,
                        "sn": "BM20195SKQAEAEQDJ21",
                        "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                        "device_model": "BM201",
                        "province": "",
                        "city": "",
                        "county": "",
                        "building_name": "BOOM大厦",
                        "floor_name": "88层",
                        "meeting_name": "BOOM会议室",
                        "is_timing": 0,
                        "power_time": "00:00",
                        "shutdown_time": "00:00",
                        "cycle": 1,
                        "tag": "",
                        "address": "",
                        "status": 1,
                        "created_at": "2020-12-25 19:32:20",
                        "updated_at": "2020-12-25 19:32:20",
                        "activated_at": "2020-11-09 11:37:58",
                        "expired_at": "2022-11-09 23:59:59",
                        "has_ad": 1,
                        'type': 1,
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取设备详情
    'GET /api/v1/admin/device/detail(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "id": 2,
                "uid": 342,
                "sn": "BM20195SKQAEAEQDJ",
                "secret": "IRQC6LC8AT772FNVC6JFLUYP169XYNBA",
                "device_model": "BM201",
                "province": "河北省",
                "city": "唐山市",
                "county": "",
                "building_name": "BOOM大厦",
                "floor_name": "88层",
                "meeting_name": "BOOM会议室",
                "is_timing": 1,
                "power_time": "00:00",
                "shutdown_time": "00:00",
                "cycle": 1,
                "tag": "",
                "address": "唐山的某个地方",
                "status": 1,
                "created_at": "2020-12-25 19:32:20",
                "updated_at": "2020-12-25 19:32:20"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 添加设备
    'POST /api/v1/admin/device/create(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 删除设备
    'GET /api/v1/admin/device/delete(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 重启设备
    'GET /api/v1/admin/device/restart(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 编辑设备
    'POST /api/v1/admin/device/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取设备下会议列表
    'GET /api/v1/device/meetingList': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 20,
                "page_num": 1,
                "list": [
                    {
                        "id": 44,
                        "title": "邵博渊预约的会议",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": 0,             //横幅属性
                        "is_anchor": "1",        //是否主持人

                    }, {
                        "id": 45,
                        "title": "邵博渊预约的会议",
                        "room": "967759",
                        "start_time": "2020-12-15 13:45:00",
                        "user_num": 0,                        //会议内的实时人数
                        "user_num2": 2,                        //会议内的最大并发数
                        "nickname": "邵博渊",
                        "close_time": "2020-12-15 14:12:26",
                        "end_time": "0000-00-00 00:00:00",
                        "status": 0,                //0:未开始;1:进行中;2:已结束
                        "is_seminars": 0,         //是否研讨会
                        "is_appointment": "1",  //是否为预约会议
                        "banner": 2,             //横幅属性
                        "is_anchor": "1",        //是否主持人
                        "banner_time": "2020.05.01 12:15",   // 添加横幅的时间
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取网络诊断
    'GET /api/v1/admin/device/diagnosis(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "network_type": 1,
                "ip_address": "192.168.1.1",
                "delay": "30ms",
                "packet_loss_rate": "30%"
            },
            "msg": "success"
        })
    },
    // 分页获取横幅列表
    'GET /api/v1/banner/lists': (req, res) => {
        console.log(12345, req)
        res.send({
            "code": 200,
            "data": {
                "count": 9,
                "page_num": 1,
                "list": [
                    {
                        "id": 10,
                        "name": "横幅1",
                        "content": "横幅内容1",
                        "color": "#333333",
                        "status": 0,
                        "created_at": "2020-12-31 15:10:03"
                    },
                    {
                        "id": 9,
                        "name": "横幅1",
                        "content": "横幅内容1",
                        "color": "#333333",
                        "status": 1,
                        "created_at": "2020-12-31 15:09:59"
                    },
                    {
                        "id": 8,
                        "name": "横幅7",
                        "content": "横幅内容7",
                        "color": "#333333",
                        "status": 1,
                        "created_at": "2020-12-31 14:57:51"
                    },
                    {
                        "id": 7,
                        "name": "横幅6",
                        "content": "横幅内容6",
                        "color": "#333333",
                        "status": 1,
                        "created_at": "2020-12-31 14:56:48"
                    },
                    {
                        "id": 6,
                        "name": "横幅5",
                        "content": "横幅内容5",
                        "color": "#333333",
                        "status": 1,
                        "created_at": "2020-12-31 14:56:47"
                    },
                    {
                        "id": 5,
                        "name": "横幅4",
                        "content": "横幅内容4",
                        "color": "#333333",
                        "status": 1,
                        "created_at": "2020-12-31 14:56:17"
                    },
                    {
                        "id": 4,
                        "name": "横幅3",
                        "content": "横幅内容3",
                        "color": "#333333",
                        "status": 1,
                        "created_at": "2020-12-31 14:56:15"
                    },
                    {
                        "id": 3,
                        "name": "啦啦啦",
                        "content": "横幅内容123123",
                        "color": "#4D88FE",
                        "status": 1,
                        "created_at": "2020-12-31 14:56:14"
                    },
                    {
                        "id": 2,
                        "name": "横幅1",
                        "content": "横幅内容1",
                        "color": "#333333",
                        "status": 1,
                        "created_at": "2020-12-31 14:56:10"
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 添加横幅
    'POST /api/v1/banner/create': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "banner_id": 1921,
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 编辑横幅
    'POST /api/v1/banner/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取横幅详情
    'GET /api/v1/banner/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "id": 3,
                "uid": 342,
                "name": "啦啦啦",
                "content": "横幅内容123123",
                "color": "#216BFF",
                "status": 1,
                "created_at": "2020-12-31 14:56:14",
                "updated_at": "2020-12-31 15:27:10"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 设置横幅上限状态
    'POST /api/v1/banner/status': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 删除横幅
    'POST /api/v1/banner/delete': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 横幅列表关键字
    'POST /api/v1/banner/titles': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 9,
                        "name": "横幅1",
                        "content": "横幅内容1"
                    },
                    {
                        "id": 8,
                        "name": "横幅7",
                        "content": "横幅内容7"
                    },
                    {
                        "id": 7,
                        "name": "横幅6",
                        "content": "横幅内容6"
                    },
                    {
                        "id": 6,
                        "name": "横幅5",
                        "content": "横幅内容5"
                    },
                    {
                        "id": 5,
                        "name": "横幅4",
                        "content": "横幅内容4"
                    },
                    {
                        "id": 4,
                        "name": "横幅3",
                        "content": "横幅内容3"
                    },
                    {
                        "id": 3,
                        "name": "啦啦啦",
                        "content": "横幅内容123123"
                    },
                    {
                        "id": 2,
                        "name": "横幅1",
                        "content": "横幅内容1"
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 会议关联横幅
    'POST /api/v1/banner/related': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取日志列表
    'GET /api/v1/admin/deviceLog/list(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 4,
                "list": [
                    {
                        "id": 3,
                        "sn": "BM20195SKQAEAEQDJ",
                        "sn_title": "测试添加",
                        "log_url": "http://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/log_1612340010.txt",
                        "soft_ver": "1.01",
                        "add_time": "2021.02.03 16:02"
                    },
                    {
                        "id": 4,
                        "sn": "BM20195SKQAEAEQDJ",
                        "sn_title": "测试添加",
                        "log_url": "http://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/log_1612340089.txt",
                        "soft_ver": "1.01",
                        "add_time": "2021.02.03 16:02"
                    },
                    {
                        "id": 2,
                        "sn": "2",
                        "sn_title": "2",
                        "log_url": "2",
                        "soft_ver": "2",
                        "add_time": "2021.02.03 16:02"
                    },
                    {
                        "id": 1,
                        "sn": "1",
                        "sn_title": "1",
                        "log_url": "1",
                        "soft_ver": "1",
                        "add_time": "2021.02.03 16:02"
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 上传日志
    'GET /api/v1/admin/deviceLog/send(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 获取广告列表
    'GET /api/v1/admin/advert/lists(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 21,
                "page_num": 1,
                "list": [
                    {
                        'id': 1,
                        'title': '广告1',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 2,
                        'title': '广告2',
                        'image': [],
                        'interval': 3,
                        'status': 0
                    }, {
                        'id': 3,
                        'title': '广告3',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 4,
                        'title': '广告4',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 5,
                        'title': '广告5',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 6,
                        'title': '广告6',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 7,
                        'title': '广告7',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 8,
                        'title': '广告8',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 9,
                        'title': '广告9',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 10,
                        'title': '广告10',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 11,
                        'title': '广告11',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 12,
                        'title': '广告12',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 13,
                        'title': '广告13',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 14,
                        'title': '广告14',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 15,
                        'title': '广告15',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 16,
                        'title': '广告16',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 17,
                        'title': '广告17',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 18,
                        'title': '广告18',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 19,
                        'title': '广告19',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 20,
                        'title': '广告20',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }, {
                        'id': 21,
                        'title': '广告21',
                        'image': [],
                        'interval': 3,
                        'status': 1
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/advert/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "id": 1,
                "uid": 342,
                "title": "测试的广告123",
                "image": "[\"http:\\/\\/huatu-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com\\/advert_1597230063_237.png\",\"http:\\/\\/huatu-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com\\/advert_1596535437_246.png\"\]",
                "interval": "86400",
                "status": 1,
                "created_at": "2021-01-01 14:46:04",
                "updated_at": "2021-01-01 14:46:04"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 添加广告
    'POST /api/v1/admin/advert/create': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "advert_id": "33"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 编辑广告
    'POST /api/v1/admin/advert/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 设置广告上下线
    'POST /api/v1/admin/advert/status': (req, res) => {
        res.send({
            "code": 200,
            "data": {
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 删除广告
    'POST /api/v1/admin/advert/delete': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "advert_id": "33"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 广告图片上传
    'POST /api/v1/admin/advert/upload': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "url": "http://huatu-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com//advert_1597230063_237.png"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 设备绑定广告
    'GET /api/v1/admin/advert/bind': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "\u8bf7\u6c42\u6210\u529f"
        })
    },
    // 
    'GET /api/v1/admin/advert/unbind': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },


    // 获取研讨会列表
    /**
     * type
     * page
     * pagesize
    */
    'GET /api/v1/seminar/lists': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 1,
                "page_num": 1,
                "list": [
                    {
                        "id": 305,
                        "title": "测试的研讨会",
                        "room": "237019",
                        "start_time": "2020-12-19 14:00:00",
                        "user_num": 0,
                        "nickname": "邵博渊",
                        "close_time": "2020-12-19 13:50:18",//会议结束时间
                        "end_time": "2020-12-19 14:45:00",//会议预约结束时间
                        "status": 0,             //会议状态,0:未开始;1:进行中;2:已结束
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 删除/取消研讨会
    /**
     * meeting_id
    */
    'POST /api/v1/seminar/delete': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 结束研讨会
    /**
     * meeting_id
    */
    'POST /api/v1/seminar/end': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 研讨会详情
    /**
     * meeting_id
    */
    'GET /api/v1/seminar/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "info": {
                    "room_id": "252551",
                    "title": "测试的研讨会",
                    "start_date": "2021-02-21",
                    "start_time": "19:50",
                    "end_date": "2021-02-21",
                    "end_time": "20:45",
                    "is_password": 0,
                    "password": ""
                },
                "list": [
                    {
                        "username": "邵博渊",
                        "value": "18601228491"
                    },
                    {
                        "username": "杨军帅",
                        "value": "1430879826@qq.com"
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        }
        )
    },
    // 创建研讨会
    /**
     * title,start_date,start_time,end_date,
     * end_time,is_password,password,
     * video_master,video_honour
    */
    'POST /api/v1/seminar/create': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "meeting_id": "294"
            },
            "extra": [],
            "msg": "发送成功"
        })
    },
    // 研讨会编辑
    /**
     * meeting_id,title,start_date,start_time,end_date,
     * end_time,is_password,password
    */
    'POST /api/v1/seminar/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "title": "改过名字了",
                "start_date": "2020-12-19",
                "start_time": "15:00",
                "end_date": "2020-12-19",
                "end_time": "15:45",
                "is_password": "1",
                "password": "1234",
                "hour": 0,
                "minute": 45,
                "user_id": 342,
                "start_at": "2020-12-19 15:00:00",
                "end_at": "2020-12-19 15:45:00",
                "duration": 45
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 研讨会发送邀请
    /**
     * meeting_id,username,vakue
     * 
    */
    'POST /api/v1/seminar/sendMessage': (req, res) => {
        res.send({
            "code": 200,
            "data": {},
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 保存研讨会邀请嘉宾列表
    /**
     * meeting_id
     * list
    */
    'POST /api/v1/seminar/preserve': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },
    // // 
    // '': (req, res) => {
    //     res.send()
    // },


    "GET /api/playback/list": (req, res) => {
        res.send({
            "code": 200,
            "data": {
                list: [
                    {

                    }],
                count: 0
            },
            "extra": [],
            "msg": '1111'
        })
    },

    "POST /api/v1/admin/demand/list": (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {
                "list": [
                    {
                        "id": 29,
                        "title": "点播标题",
                        "video_num": 0,// 音视频数目
                        "created_at": "2021-03-01 01:59:13", //创建时间
                        "creator": "哈哈", //创建者
                        "is_show": 0, //是否上家 1 = 是 0 = 否
                        "is_comment    ": 1, // 是否可评论 1=是 0=否
                    },
                    {
                        "id": 30,
                        "title": "点播标题",
                        "video_num": "10",// 音视频数目
                        "created_at": "2021-03-01 01:59:13", //创建时间
                        "creator": "哈哈", //创建者
                        "is_show": 1, //是否上家 1 = 是 0 = 否
                        "is_comment    ": 1, // 是否可评论 1=是 0=否
                    },
                    {
                        "id": 31,
                        "title": "点播标题",
                        "video_num": "10",// 音视频数目
                        "created_at": "2021-03-01 01:59:13", //创建时间
                        "creator": "哈哈", //创建者
                        "is_show": 1, //是否上家 1 = 是 0 = 否
                        "is_comment    ": 1, // 是否可评论 1=是 0=否
                    },
                    {
                        "id": 32,
                        "title": "点播标题",
                        "video_num": "10",// 音视频数目
                        "created_at": "2021-03-01 01:59:13", //创建时间
                        "creator": "哈哈", //创建者
                        "is_show": 1, //是否上家 1 = 是 0 = 否
                        "is_comment    ": 1, // 是否可评论 1=是 0=否
                    }

                ],
                "count": 4
            }
        })
    },
    "POST /api/v1/admin/demand/remove": (req, res) => {
        res.send({
            "code": 200,
            "data": [],
        })
    },
    "POST /api/v1/admin/demand/create": (req, res) => {
        res.send({
            "code": 200,
            "data": [],
        })
    },
    "POST /api/v1/admin/demand/detail": (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "id": 122, //主键ID
                "title": "hhhh", //点播主题
                "en_title": "http", //英文点播主题
                "render_desc": "jianke", // 点播简介
                "en_render_desc": "safsdf", // 英文点播简介
                "thumb": "http", //点播封面
                "users": [{ id: 1, nickname: '234' }], //可见人名单
                "is_public": 1, //是否公开 1 是
                "is_comment": 1, //是否允许评论  1可以 
                "is_show": 1, //是否上架  1可以 
                "speaker": "技术员", //主讲人
                "created_at": "2021-03-01 01:59:13",
                "updated_at": "2021-03-01 01:59:13"
            }
        })
    },
    "POST /api/v1/admin/demand/update": (req, res) => {
        res.send({
            "code": 200,
            "data": [],
        })
    },
    "POST /api/v1/admin/demand/chapter-list": (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 29,
                        "course_id": 20,// 点播主键ID
                        "video_id": 20,// 视频ID
                        "video_title": "ccccc",// 视频名称
                        "title": "章节标题", // 章节标题
                        "chapters_thumb": "http://",
                        "play_num": 10,// 播放量
                        "favour_num": 10,// 点赞量
                        "collect_num": 10,// 收藏数
                        "created_at": "2021-03-01 01:59:13", //创建时间
                        "creator": "哈哈", //创建者
                    },
                    {
                        "id": 20,
                        "course_id": 21,// 点播主键ID
                        "video_id": 20,// 视频ID
                        "video_title": "ccccc",// 视频名称
                        "title": "章节标题", // 章节标题
                        "chapters_thumb": "http://",
                        "play_num": 10,// 播放量
                        "favour_num": 10,// 点赞量
                        "collect_num": 10,// 收藏数
                        "created_at": "2021-03-01 01:59:13", //创建时间
                        "creator": "哈哈", //创建者
                    },

                ],
                "count": 1
            }
        })
    },
    "POST /api/v1/admin/demand/chapter-remove": (req, res) => {
        res.send({
            "code": 200,
            "data": {}
        })
    },
    "POST /api/v1/admin/demand/chapter-record": (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "viewer": "三三",// 观看者
                        "mobile": "176000000",// 手机号
                        "email": "11@163.com",
                        "company_name": "机构名称ccccc"// 机构名称
                    }
                ],
                "count": 4
            }
        })
    },
    "POST /api/v1/admin/demand/comment-list": (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {
                "list": [
                    {
                        "id": 29,
                        "created_at": "2021-03-01 01:59:13", //评论时间
                        "creator": "哈哈", //评论者
                        "is_visible": 1, //是否可见 1 = 是 0 = 否
                        "content": "jsfjaskfa", // 评论内容
                    }
                ],
                "count": 4
            },
            "extra": []
        })
    },
    "POST /api/v1/admin/demand/comment-remove": (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {},
            "extra": []
        })
    },
    "POST /api/v1/admin/demand/comment-update": (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {},
            "extra": []
        })
    },

    "POST /api/v1/admin/demand/doc-list": (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {
                "list": [
                    {
                        "id": 29,
                        "course_id": 20,// 点播主键ID
                        "title": "资料名称", // 资料名称
                        "is_down": 1, // 是否可下载 1 是
                        "down_num": 10,// 下载次数            
                        "created_at": "2021-03-01 01:59:13", //创建时间
                    }
                ]
            },
            "extra": []
        })
    },
    "POST /api/v1/admin/demand/doc-remove": (req, res) => {
        res.send({
            "code": 200,
            "message": "请求成功",
            "data": {},
            "extra": []
        })
    },
    // 资讯
    // 列表（不分页）
    'GET /api/v1/admin/information-class/list-all': (req, res) => {
        res.send({
            "code": 200,
            "data": [
                {
                    "id": 1,
                    "name": "qqqq",
                    "e_name": "zzz"
                },
                {
                    "id": 2,
                    "name": "zzzz",
                    "e_name": ""
                },
                {
                    "id": 3,
                    "name": "qqqqq",
                    "e_name": ""
                }
            ],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯分类-列表
    'GET /api/v1/admin/information-class/list': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 29,
                        "name": "分类名分类名分类名分类名",
                        "is_show": 1,        //1 显示  0不显示
                        "info_count": 12,
                        "create_at": 1616486954, //创建时间
                        "creator": "哈哈", //创建者
                        "describe": "分类描述"
                    },
                    {
                        "id": 2,
                        "name": "分类名1",
                        "is_show": 0,        //1 显示  0不显示
                        "info_count": 6,
                        "create_at": 1616986954, //创建时间
                        "creator": "哈哈1", //创建者
                        "describe": "分类描述122"
                    }
                ],
                "count": 2
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯分类-增加
    'POST /api/v1/admin/information-class/add': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯分类-编辑
    'POST /api/v1/admin/information-class/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯分类-删除
    'POST /api/v1/admin/information-class/delete': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯分类-显示/隐藏
    'POST /api/v1/admin/information-class/hide': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/information-class/list-all': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 29,
                        "name": "分类名分类名分类名分类名",
                        "e_name": ''
                    },
                    {
                        "id": 2,
                        "name": "分类名1",
                        "e_name": "zzz"
                    }
                ],
                "count": 2
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯管理-列表
    'GET /api/v1/admin/information/list': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 2,
                "list": [
                    {
                        "title": "关于十万个为什么关于十万个为什么关于十万个为什么",
                        "type": 1,
                        "user_num": 20,
                        "status": 1,
                        "class": "马老师的黑历史",
                        "create_time": 1616486954,
                        "nickname": "马老师",
                        "id": 1
                    },
                    {
                        "title": "关于十万个为什么111",
                        "type": 2,
                        "user_num": 10,
                        "status": 0,
                        "class": "马老师的黑历史222",
                        "create_time": 1616442212,
                        "nickname": "马老师往往马老师往往马老师往往",
                        "id": 2
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯管理-添加
    'POST /api/v1/admin/information/add': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 资讯管理-编辑
    'POST /api/v1/admin/information/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 资讯管理-详情
    'GET /api/v1/admin/information/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "title": "马老师的隐私合集",
                "e_title": "aaa",
                "language": 1,
                "start_time": 1616486058,
                "content": '<p><div class="media-wrap audio-wrap"><audio controls="" src="//img.tukuppt.com/newpreview_music/09/00/31/5c89176e550ed57855.mp3"></audio></div><p></p>3月11日，中央结算公司支持中国国家铁路集团成功发行2021年第一期中国铁路建设债券。本期债券期限10年，发行规模150亿元，发行利率3.65%，认购倍数近2倍。国铁集团财务部副主任厉民一行莅临现场指导债券发行工作。公司总经理陈刚明会见，公司总监敖一帆，客服中心、运营中心、z止于至善企业债券服务中心、z止于至善估值公司等相关部门负责人陪同参会。</p><p></p><div class="media-wrap image-wrap align-center" style="text-align: center"><img id="123" title="截屏2021-02-24 下午2.26.05.png" alt="" src="https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/161725621760655f19e225d.jpeg" style="width:523px;height:392px"/></div><p></p><p>陈刚明总经理向厉民副主任一行介绍了公司全面深入参与中国市场培育和建设，积极打造债券市场运行、宏观政策实施、金融市场定价基准和债券市场对外开放主门户等四大平台的重要成果，并回顾了公司立足金融市场基础设施职责，长期服务企业债券市场发展，支持铁路建设债券发行等有关情况。厉民副主任一行参观了公司陈列室、估值中心及ECC指挥中心，充分肯定了公司的专业实力与服务水平，对公司长期提供债券发行、登记托管、交易结算、付息兑付、估值、担保品管理、信息披露等全生命周期服务，为铁路建设债券筹融资保驾护航表示感谢。厉民副主任表示，中央结算公司以支持国家重大战略为导向，坚守服务实体经济理念，不断加强服务能力，提升服务水平，切实保障铁路建设债券发行工作高效完成。</p><p></p><div class="media-wrap video-wrap"><video controls="" id="60629a3f76408b09a3fb86ea" title="1616988786758437.mp4" alt="" loop="" poster="https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/161725621760655f19e225d.jpeg" src="https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/16170843556062bfc3b8bf3.mp4"></video></div><p>陈刚明总经理向厉民副主任一行介绍了公司全面深入参与中国市场培育和建设，积极打造债券市场运行、宏观政策实施、金融市场定价基准和债券市场对外开放主门户等四大平台的重要成果，并回顾了公司立足金融市场基础设施职责，长期服务企业债券市场发展，支持铁路建设债券发行等有关情况。厉民副主任一行参观了公司陈列室、估值中心及ECC指挥中心，充分肯定了公司的专业实力</p>',
                "e_content": "<p></p>",
                "class_id": 2,
                "source": "",
                "e_source": "sss",
                "type": 1,
                "status": 1,
                "invite_uids": [
                    {
                        "uid": 1,
                        "nickname": "马老师"
                    },
                    {
                        "uid": 2,
                        "nickname": "马老师2"
                    }
                ],
                "home_image": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG",
                "wx_image": "https://boom-beiyan-sitemgt.oss-cn-beijing.aliyuncs.com/avatar_1610508085_97602.JPG"
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯管理-删除
    'GET /api/v1/admin/information/delete': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 资讯管理-上/下架
    'GET /api/v1/admin/information/update-status': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 资讯管理-文档列表
    'GET /api/v1/admin/information-doc/list': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "title": "zxcvbnm.pdf",
                        "uid": 1,
                        "update_at": 1616997044,
                        "doc_type": 1,
                        "id": 1,
                        "create_at": 1616996665,
                        "doc_url": "111",
                        "down_num": 0
                    },
                    {
                        "title": "zxcvbnm111",
                        "uid": 2,
                        "update_at": 1616197044,
                        "doc_type": 2,
                        "id": 2,
                        "create_at": 1616196665,
                        "doc_url": "",
                        "down_num": 1
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 资讯管理-文档修改名称
    'POST /api/v1/admin/information-doc/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 资讯管理-文档删除
    'GET /api/v1/admin/information-doc/delete': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 资讯管理-文档是否可下载
    'GET /api/v1/admin/information-doc/update-status': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 资讯管理-添加资料
    'POST /api/v1/admin/information-doc/create': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "msg": "OK"
        })
    },
    // 营销工具集
    // 根据链接获取二维码
    'GET /api/v1/tools/auth/get-qrcode': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "share": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHLUlEQVR4nO3dQY7cNhRAQdvI/Y9sZJcEUGJwGJKPLVetpyV5PA8NfJDi958/f34DOj/qB4DfnQghJkKIiRBiIoSYCCEmQoiJEGIihJgIISZCiIkQYiKEmAghJkKIiRBiIoSYCCEmQoiJEGIihJgIISZCiIkQYiKEmAgh9sfyK/74UYa9763+z3/X814jP9Pefd8Tzhn5axn5V5y0/DfmmxBiIoSYCCEmQoiJEGLrp6NPJyeWIz+zb9q2aho596mTdz/57xrR/o3931vsvgHwayKEmAghJkKIiRBiJ6ajT3MTp7kJ2G0rPEesWhc6YtWVV/3b911nRLKS1jchxEQIMRFCTIQQEyHEmunoSftmhk/3rx3dt0P/qd3//kH8miAmQoiJEGIihJgIIfb+6ejJHd+r1ljOPfPT3Lx05F63rbb9aL4JISZCiIkQYiKEmAgh1kxHT07A5qaRc7PHfXvJT+7ZHzH3+5l7nlX/0mv5JoSYCCEmQoiJEGIihNiJ6ej9O6xPvnvztp95OrnXft8a1A/ywY8O7yBCiIkQYiKEmAghtn46etuavX0n1O/Tzmb3uf+E+sTtf47weiKEmAghJkKIiRBi35cPmvbNHu+fc57cWb/q7queZ98z37/a9n+6648YfkMihJgIISZCiIkQYp89Hd1n3/Rv1e+nvfK+eelJJ0/s+tUt1l4O+CoRQkyEEBMhxEQIsRPT0VUr9OZma584x2vnwKvsW0k78qlVz3OAb0KIiRBiIoSYCCEmQoitn44+tbuw564zYtWqwpM70Oc+tWou3brtDQZ/33Tt5YCvEiHERAgxEUJMhBC7ZWf9W9/YOaJdY3nb2tp9M9VVb0IwHYW3ESHERAgxEUJMhBA7sXb06f7d9yNXvv9Tc/b9X7RvMDg5hf7aLdZeDvgqEUJMhBATIcRECLE/6gf4T7e9ifTk+tL758CrZoa3Pc+TM+vh/UQIMRFCTIQQEyHE1k9H953kPjexPPlWz5P3WrUO8+Rccd++/vunrL/gmxBiIoSYCCEmQoiJEGLNmfWrrjzn5NlJt+12H9GeEnXSJU/omxBiIoSYCCEmQoiJEGK3vHf0qT2d56mdB972JtJ99xq5+8n/wbnrfIlvQoiJEGIihJgIISZCiJ147+iqmWG7DnPVbvfbdvHP2Xf++753yc6xsx7eT4QQEyHERAgxEULslrWjJ8+sv+3U+E9888DJ2ezJN9mO3N3aUXgbEUJMhBATIcRECLHmvaP71hA+3ba3/eRErl25OqL9bcw9z3K+CSEmQoiJEGIihJgIIWbt6N57jbjtlKj7T4Bq33Fq7Si8jQghJkKIiRBiIoTYLe8dbddYjlz5qd0Rv2/yOWLfm1Gfn7ptlr6cb0KIiRBiIoSYCCEmQoidmI7Ozc32nYLUTmtXzRX3rZ+cs29S3U50TUfh/UQIMRFCTIQQEyHETuys/8S1kXNXPrn3f+RTc9oJ877nGbnyCDvr4W1ECDERQkyEEBMhxJpTmeY+dduUbMTJGV07B953ltO+64zw3lF4PxFCTIQQEyHERAixEzvrn9od6CPTrZO7uUfuPqI9Tald7zpy5UtWij75JoSYCCEmQoiJEGIihNgtO+tvW196/zrV2062auelyftCV/FNCDERQkyEEBMhxEQIsRM765/2vVP0tjdkjjg5x7tt/3s7vx1h7Si8nwghJkKIiRBiIoRYc2b9qk/te/fm07757ci99q1KPTl7/MSTtrx3FN5PhBATIcRECDERQuyWU5nmrnPtasC/nNxLPuK2Nxjsc//fxl98E0JMhBATIcRECDERQqw5lWnEbWcnnXyv5si92id82rfetb2OnfXwfiKEmAghJkKIiRBit6wd3TfZa+dv+3b6z9193w79206tWsV0FN5PhBATIcRECDERQuzEmfWt9s2fq369t61ufbptP/5tz/MLvgkhJkKIiRBiIoSYCCHWnFm/z8l54Ih9ZzmdnJeusm898G2z4i/xTQgxEUJMhBATIcRECLF7z6wfsWq21p7bPvIz988DT76xc9WV21nx3zc9f0vgn0QIMRFCTIQQEyHEmlOZTp4nvmreteqkpFX32vczc3POubvPPc8qyRlM//IY528J/JMIISZCiIkQYiKE2L1n1t9m1YlCJ8+j33dS0twceNU08uSc3HtH4f1ECDERQkyEEBMhxExHv31btwP9E/fjz1n1zCfX1s7x3lF4PxFCTIQQEyHERAixZjqa7F/+hX2zvpNnsj+dfO/oqk/ddk6T6Si8nwghJkKIiRBiIoTYieloe4r9Kifffvk0t0511XtH56x6u+zJJ/TeUfgdiRBiIoSYCCEmQoh9v20ZJ/xufBNCTIQQEyHERAgxEUJMhBATIcRECDERQkyEEBMhxEQIMRFCTIQQEyHERAgxEUJMhBATIcRECDERQkyEEBMhxEQIMRFCTIQQ+xNkuzX7glftlgAAAABJRU5ErkJggg=="
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 活动报名
    'GET /api/v1/admin/action/lists': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 4,
                "list": [
                    {
                        "title": "马老师和燕主任的激情劲爆合集",
                        "current_num": 0,
                        "start_time_at": 1618396539,
                        "end_time_at": 1618396539,
                        "status": 1,
                        "user_limit": 100,
                        "tag": 1,
                        "create_at": 1618298552,
                        "nickname": "马兆权",
                        "id": 1
                    },
                    {
                        "title": "马老师和燕主任的激情劲爆合集22",
                        "current_num": 100,
                        "start_time_at": 1618396539,
                        "end_time_at": 1618396539,
                        "status": 2,
                        "user_limit": 100,
                        "tag": 1,
                        "create_at": 1618298552,
                        "nickname": "马兆权",
                        "id": 2
                    },
                    {
                        "title": "马老师和燕主任的激情劲爆合集",
                        "current_num": 2,
                        "start_time_at": 1618396539,
                        "end_time_at": 1618396539,
                        "status": 2,
                        "user_limit": 200,
                        "tag": 1,
                        "create_at": 1618298552,
                        "nickname": "马兆权",
                        "id": 3
                    },
                    {
                        "title": "马老师和燕主任的激情劲爆合集",
                        "current_num": 0,
                        "start_time_at": 1618396539,
                        "end_time_at": 1618396539,
                        "status": 1,
                        "user_limit": -1,
                        "tag": 1,
                        "create_at": 1618298552,
                        "nickname": "马兆权",
                        "id": 4
                    },
                    {
                        "title": "马老师和燕主任的激情劲爆合集",
                        "current_num": 300,
                        "start_time_at": 1618396539,
                        "end_time_at": 1618396539,
                        "status": 3,
                        "user_limit": -1,
                        "tag": 1,
                        "create_at": 1618298552,
                        "nickname": "马兆权",
                        "id": 5
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/action/show-field': (req, res) => {
        res.send({
            "code": 200,
            "data": [
                {
                    "id": 1,
                    "key": "nickname",
                    "name": "姓名"
                },
                {
                    "id": 2,
                    "key": "ages",
                    "name": "年龄"
                },
                {
                    "id": 3,
                    "key": "email",
                    "name": "邮箱"
                },
                {
                    "id": 4,
                    "key": "phone",
                    "name": "手机号"
                },
                {
                    "id": 5,
                    "key": "certificates",
                    "name": "证件号"
                },
                {
                    "id": 6,
                    "key": "company",
                    "name": "机构全称"
                }
            ],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/action/create': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'POST /api/v1/admin/action/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/action/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "langeage": 1,
                "title": "马老师的燕老师",
                "e_title": "mis.ma and mis.yan",
                "desc": "马老师和哈哈哈",
                "e_desc": "",
                "image": "https://pics5.baidu.com/feed/2e2eb9389b504fc21027f2d31643b11991ef6d17.png?token=2fede05927add873784f3c0167b9f6d9",
                "action_type": 1,
                "content": "马老师拉萨的立方空间的水立方",
                "e_content": "",
                "start_time_at": 1618306000,
                "end_time_at": 1618306612,
                "user_limit": 11,
                "show_field": [
                    1,
                    2,
                    3,
                    4
                ],
                "default_field": [
                    2,
                    3
                ],
                // "default_field": [
                //     {
                //         "id": 2,
                //         "key": "ages",
                //         "name": "年龄"
                //     },
                //     {
                //         "id": 3,
                //         "key": "email",
                //         "name": "邮箱"
                //     }
                // ],
                "current_num": 0,
                "status": 0,
                "uid": 1,
                "user_list": [
                    {
                        "nickname": "lebronbeams111112",
                        "id": 1,
                        "uid": 1
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/action/delete': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/action/update-tag': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },
    'GET /api/v1/admin/action/user-list': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "count": 3,
                "list": [
                    {
                        "nickname": "马兆权",
                        "sex": 0,
                        "email": "21312312@qq.com",
                        "phone": "13311232213",
                        "certificates": 12312312,
                        "id": 1,
                        "company": "哈哈学院",
                        "create_at": 1618303738,
                        "user_type": 1
                    },
                    {
                        "nickname": "马兆权",
                        "sex": 1,
                        "email": "21312312@qq.com",
                        "phone": "13311232213",
                        "certificates": 12312312,
                        "id": 2,
                        "company": "哈哈学院",
                        "create_at": 1618303738,
                        "user_type": 2
                    },
                    {
                        "nickname": "马兆权",
                        "sex": 2,
                        "email": "21312312@qq.com",
                        "phone": "13311232213",
                        "certificates": 12312312,
                        "id": 3,
                        "company": "哈哈学院",
                        "create_at": 1618303738,
                        "user_type": 1
                    }
                ]
            },
            "extra": [],
            "msg": "请求成功"
        })
    },
    // 问答管理
    'GET /api/v1/admin/question/list(.*)': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "list": [
                    {
                        "id": 1,
                        "class_name": "业务咨询",
                        "describe": "1",
                        "create_at": 1,
                        "uid": 1,
                        "is_hide": 1,
                        "is_reply": 1,
                        "creator": "lebronbeams111112"
                    },
                    {
                        "id": 2,
                        "class_name": "使用咨询",
                        "describe": "2",
                        "create_at": 0,
                        "uid": 0,
                        "is_hide": 1,
                        "is_reply": 0,
                        "creator": ""
                    }
                ],
                "count": 2
            },
            "extra": [],
            "msg": "请求成功"
        })
    },

    'GET /api/v1/admin/question/detail': (req, res) => {
        res.send({
            "code": 200,
            "data": {
                "question": {
                    "id": 1,
                    "describe": "1",
                    "detail": "1",
                    "class_name": "其他",
                    "is_hide": 1,
                    "is_reply": 1,
                    "delete_at": 1,
                    "create_at": 1,
                    "update_at": 1,
                    "accessory": {
                        "urls": [],
                        "url_count": 0
                    },
                    "creator": "lebronbeams111112"
                },
                "reply": [
                    {
                        "id": 1,
                        "content": "1",
                        "uid": 1,
                        "is_hide": 1,
                        "create_at": 1,
                        "update_at": 1,
                        "accessory": {
                            "urls": [],
                            "url_count": 0
                        }
                    },
                    {
                        "id": 2,
                        "content": "",
                        "uid": 0,
                        "is_hide": 1,
                        "create_at": 0,
                        "update_at": 0,
                        "accessory": {
                            "urls": [],
                            "url_count": 0
                        }
                    }
                ],
                "reply_count": 2
            },
            "extra": [],
            "msg": "请求成功"
        })
    },

    'GET /api/v1/admin/question/reply': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },

    'POST /api/v1/admin/question/edit': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    },

    'GET /api/v1/admin/question/hide': (req, res) => {
        res.send({
            "code": 200,
            "data": [],
            "extra": [],
            "msg": "请求成功"
        })
    }

}
module.exports = proxy