
let env
let hostname = window.location.hostname
if (hostname === 'localhost') {
    env = 'test'
} else if (hostname === '') {
    env = 'beta'
} else if (hostname === '' && window.location.host === '') {
    env = 'mcu'
} else if (hostname === '') {
    env = 'prod'
} else {
    env = 'test'
}

let client_env
if (hostname === 'localhost') {
    client_env = 'test'
} else if (hostname === '') {
    client_env = 'beta'
} else if (hostname === '') {
    client_env = 'prod'
} else {
    client_env = 'test'
}


const releaseHost = '';
const betaHost = '';
const developHost = '';
const hostDict = {
    test: developHost,
    beta: betaHost,
    prod: releaseHost,
}


const config = {
    host: hostDict[client_env],
    get requestHosts() {
        if (env === 'test') {
            return ''
        } else if (env === 'beta') {
            return '';
        } else if (env === 'mcu') {
            return '';
        } else if(env === 'prod'){
            return '';
        }else {
            return ''
        }
    },
    get uploadBaseUrl() {
        if (env === 'test') {
            return '';
        } else if (env === 'beta') {
            return '';
        } else if (env === 'prod') {
            return '';
        } else {
            return ''
        }
    },
    get officialWebHost() {
        if (env === 'test' || env === 'dev') {
            return ''
        } else {
            return ''
        }
    },
    get personalPullUpLink() {
        if (env === 'dev' || env === 'test') {
            return ''
        } else {
            return ''
        }
    },
    get pullUpLink() {
        if (env === 'dev' || env === 'test') {
            return ''
        } else if(env === 'beta') {
            // if (env === 'prod')
            return ''
        }else if(env === 'prod'){
            return '';
        }else{
            return '';
        }
    },
    initToken(token) {
        this.token = token
    },
    themeColor: '#8F1D22', // 主题色
    layoutBgColor: '#F6F6F6',  // 边框色
    pageSize: 20,   // 默认分页条数
    maxPersonNum: 20,
    requestHeaders: {
        ch: 'web',
        p: '2',
        ver: '2.0.0',
        os: 'web',
    },
    // 密码格式
    pwdReg: {
        reg: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]/,
        minLength: 6
    },
    // 中国手机号正则
    CNMobileReg: /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/,
    emailReg: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    cacheRoute: true,
    meetingSearch: [{
        label: '创建人姓名',
        value: 'name'
    }, {
        label: '会议号',
        value: 'roomID'
    }],
    liveSearch: [{
        label: '创建人姓名',
        value: 'name'
    }, {
        label: '直播号',
        value: 'roomID'
    }],
    meetingMaxNum: [
        {
            label: '20人',
            value: 20
        },
        {
            label: '50人',
            value: 50
        }, {
            label: '100人',
            value: 100
        }
    ],
    liveMaxNum: [
        {
            label: '50人',
            value: 50
        },
        {
            label: '100人',
            value: 100
        }, {
            label: '1000人',
            value: 1000
        }, {
            label: '3000人',
            value: 3000
        }, {
            label: '5000人',
            value: 5000
        }, {
            label: '10000人',
            value: 10000
        }
    ],
    meetingExamine: [
        {
            label: '通过',
            value: 1
        },
        {
            label: '拒绝',
            value: 2
        }
    ],
    meetingNature: [
        {
            label: '公开',
            value: 1
        },
        {
            label: '非公开',
            value: 0
        }
    ],
    meetingExtend: [
        {
            label: '是',
            value: 1
        },
        {
            label: '否',
            value: 0
        }
    ],
    keywordType: [
        {
            label: 'ID',
            value: 'id'
        },
        {
            label: '手机号',
            value: 'mobile'
        },
        {
            label: '姓名',
            value: 'nickname'
        },

    ],
    approvalStatus: [
        {
            label: '未提交',
            value: 1
        },
        {
            label: '待认证',
            value: 2
        },
        {
            label: '已认证',
            value: 3
        },
        {
            label: '已拒绝',
            value: 4
        },
    ],
    listRight: [
        {
            label: '成员仅查看',
            value: 1
        },
        {
            label: '成员可编辑',
            value: 2
        }
    ]
}
export default config