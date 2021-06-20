
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import actionMemberManage from '@actions/common/actionMemberManage.js'

import {
    RLTooltip,
    RLButton,
    RLTable,
    RLDisplayBoard,
    RLDropdown,
    RLRenameModal,
    RLCheckbox
} from '@components/index.js'
import './MemberManage.less'


class MemberManage extends BaseCmp {
    constructor(props) {
        super(props)
        this.urlParam = props
        this.meetingId = this.urlParam.meetingId
        this.pageType = this.urlParam.pageType
        this.state = {
            meetingInfo: {
                room: '',
                title: '',
                nickname: ''
            },
            memberList: [],
            duration: '',   // 已进行时间
            showRenameModal: false,  // 改名模态框
            renameUser: {},      // 要修改的用户对象：uid,meeting_id,nickname
            listLoading: true,
            openSelf: false,    // 全员静音是否允许自行开启

        }
        this.cameraOnImg = require('../../../assets/images/common/camera_on.png').default
        this.cameraOffImg = require('../../../assets/images/common/camera_off.png').default
        this.micOnImg = require('../../../assets/images/common/mic_on.png').default
        this.micOffImg = require('../../../assets/images/common/mic_off.png').default
        this.speakerOnImg = require('../../../assets/images/common/speaker_on.png').default
        this.speakerOffImg = require('../../../assets/images/common/speaker_off.png').default
        this.shareScreenImg = require('../../../assets/images/common/screen_share_on.png').default
        this.getMemberList()
    }
    componentWillMount() {
        // this.listTimer = setInterval(() => {
        //     this.getMemberList()
        // }, 30 * 1000)
    }
    componentWillUnmount() {
        // clearInterval(this.listTimer)
        // this.listTimer = null
    }
    getMemberList = () => {
        let meeting_id = this.meetingId
        this.setState({
            listLoading: true
        })
        actionMemberManage.getMemberList(meeting_id).then(res => {
            if (res.code === 200) {
                let meetingInfo = res.data.info
                let memberList = res.data.list
                let duration = this.getDuration(meetingInfo.start_time)
                this.setState({
                    meetingInfo,
                    memberList,
                    duration
                })
            } else if (res.code === 451) {
                this.showToast({ type: 'info', content: '会议已结束' })
                this.props.closeMember('list', {
                    tabKey: this.urlParam.tabKey
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).finally(() => {
            this.setState({
                listLoading: false,
            })
        })
    }
    getDuration = (startTime) => {
        let start = new Date(startTime).getTime()
        let end = new Date().getTime()
        let allMinutes = parseInt((end - start) / 1000 / 60)
        let minutes = allMinutes % 60
        let hours = parseInt(allMinutes / 60)
        return `${hours}小时${minutes}分钟`
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>参会者管理</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.closeMember('list', {
                            tabKey: this.urlParam.tabKey
                        })
                    }}
                    label='返回'
                />
            </div>
        )
    }
    getIdentify = (record) => {
        let idArr = []
        if (record.is_you === '1') {
            idArr.push('我')
        }
        if (record.is_anchor === '1') {
            idArr.push('主持人')
        } else if (record.permission.includes('M')) {
            idArr.push('联席主持人')
        }
        if (idArr.length) {
            return <span style={{ color: '#999' }}>({idArr.join(',')})</span>
        } else {
            return null
        }

    }
    getColumns = () => {
        return [
            {
                title: '序号',
                key: 'index',
                width: '6%',
                render: (text, record, index) => `${index + 1}`
            }, {
                title: '参会者昵称',
                width: '10%',
                key: 'nickname',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <RLTooltip title={record.nickname}>
                            <span className='line-clamp-2'>{record.nickname}</span>
                        </RLTooltip>

                        {this.getIdentify(record)}

                    </div>
                )
            }, {
                title: '设备/用户账号',
                key: 'account',
                width: '10%',
                dataIndex: 'account',
                render: (text, record) => {
                    return <RLTooltip title={record.account}>
                        <span className='line-clamp-2'>{record.account}</span>
                    </RLTooltip>

                }
            },
            {
                title: '终端类型',
                width: '9%',
                dataIndex: 'device',
                key: 'device'
            }, {
                title: '摄像头状态',
                width: '10%',
                key: 'camera',
                render: (text, record) => (
                    <div>
                        <img
                            alt=''
                            src={Number(record.camera) === 1 ? this.cameraOnImg : this.cameraOffImg}
                            style={{ width: 40, height: 40 }}
                        />
                    </div>
                )
            }, {
                title: '麦克风状态',
                width: '10%',
                key: 'microphone',
                render: (rext, record) => (
                    <div>
                        <img
                            alt=''
                            src={Number(record.microphone) === 1 ? this.micOnImg : this.micOffImg}
                            style={{ width: 40, height: 40, cursor: 'pointer' }}
                            onClick={() => {
                                this.userOption({ type: 'mic', record })

                            }}
                        />
                    </div>
                )
            },
            {
                title: '共享屏幕',
                width: '10%',
                key: 'share_screen',
                render: (text, record) => (
                    <div>
                        {
                            Number(record.share_screen) === 1 && (
                                <img alt=''
                                    src={this.shareScreenImg}
                                    style={{ width: 40, height: 40 }}
                                />
                            )
                        }

                    </div>
                )
            }, {
                title: '入会时间',
                width: '10%',
                dataIndex: 'add_time',
                key: 'add_time',
                render: (text, record) => {
                    return <RLTooltip title={record.add_time}>
                        <span className='line-clamp-2'>{record.add_time}</span>
                    </RLTooltip>

                }
            }, {
                title: '创建者',
                width: '10%',
                key: 'creator',
                render: (text, record) => {
                    return <RLTooltip title={this.state.meetingInfo.nickname}>
                        <span className='line-clamp-2'>{this.state.meetingInfo.nickname}</span>
                    </RLTooltip>

                }
            }, {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                width: 216,
                key: 'opt',
                render: (text, record) => {
                    return this.getOptionBtns(record)
                }
            }
        ]
    }
    roomOption = ({ type, action }) => {
        return this.roomOptionAction({ type, action, option: { openSelf: this.state.openSelf ? 1 : 0 } }).then(res => {
            console.log('roomOption--res:', res)
            if (res.code === 200) {
                this.getMemberList()
                if (type === 'lock') {
                    if (action) {
                        this.showToast('锁定后，新成员将无法加入')
                    } else {
                        this.showToast('锁定后，新成员将可以加入')
                    }
                }
            } else {
                this.showToast(res.msg)
            }
        })
    }
    /**
     * @param {*} { type:操作类型, action:操作 }
     */
    roomOptionAction = ({ type, action, option = {} }) => {
        return actionMemberManage.roomOption({ type, action, meeting_id: this.meetingId, option }).then(res => {
            console.log('房间操作返回--res：', res)
            return res
        })
    }
    userOption = ({ type, record }) => {
        this.userOptionAction({ type, record }).then(res => {
            if (res.code === 200) {
                if (type === 'relationmaster') {
                    if (record.permission.includes('M')) {
                        this.showToast(record.nickname + '已被取消联席主持人')
                    } else {
                        this.showToast(record.nickname + '已被设为联席主持人')
                    }
                }
                this.getMemberList()
            }
        })
    }
    userOptionAction = ({ type, record }) => {
        if (type === 'rename') {
            console.log('userOption--改名操作')
            this.toggleRenameModal(true, record)
            return Promise.reject({})
        } else if (type === 'mic') {
            console.log('userOption--麦克风操作')
            return actionMemberManage.userOption({
                //'1'开启  '0'关闭
                type, action: record.microphone === '0' ? '1' : '0',
                meeting_id: this.meetingId, uid: record.uid
            })
        } else if (type === 'relationmaster') {
            console.log('userOption--联席主持人操作')
            return actionMemberManage.userOption({
                //'0'联席主持人  '1'撤销
                type, action: record.permission.includes('M') ? '0' : '1',
                meeting_id: this.meetingId, uid: record.uid
            })
        } else if (type === 'master') {
            console.log('userOption--主持人操作')
            return Promise.reject({})
        } else if (type === 'remove') {
            console.log('userOption--移除会议室')
            this.showModal({
                title: <div>
                    确定将
                    <span style={{ color: this.themeColor }}>{record.nickname}</span>
                    移出会议室吗?
                </div>,
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    return actionMemberManage.userOption({
                        type,
                        meeting_id: this.meetingId, uid: record.uid
                    }).then(res => {
                        if (res.code === 200) {
                            this.getMemberList()
                        }
                    })
                },
                onCancel: () => { console.log('cancel in call') },
                size: 'small'
            })
            return Promise.reject({})
        } else if (type === 'camera') {
            console.log('userOption--摄像头操作')
            return Promise.reject({})
        } else {
            return Promise.reject({})
        }
    }
    getOptionBtns = (record) => {
        return this.getBtnsFromList(this.getBtnList(record), record)
    }
    getBtnList = (record) => {
        let btns = [
            {
                label: '改名',
                type: 'rename'
            }, {
                label: record.microphone == 1 ? '静音' : '解除静音',
                type: 'mic'
            }
        ]
        if (record.is_anchor != 1) {
            btns.push({
                label: record.permission.includes('M') ? '撤销联席主持人' : '设为联席主持人',
                type: 'relationmaster'
            }, {
                label: '移出会议室',
                type: 'remove'
            })
        }
        return btns
    }
    // 获取列表右侧按钮组件
    getBtnsFromList = (btns, record) => {
        if (btns.length <= 3) {
            return <div style={{ display: 'flex', flexDirection: 'row', minWidth: 216 }}>
                {
                    btns.map(({ label, type }) => {
                        return <RLButton
                            type='link'
                            label={label}
                            key={label}
                            onClick={(e) => {
                                this.userOption({ type, record })
                                e.stopPropagation()
                            }}
                        />
                    })
                }
            </div>
        } else {
            let btnList = []
            let subList = []
            for (let i = 0; i < btns.length; i++) {
                if (i < 2) {
                    btnList.push(
                        (<RLButton
                            type='link'
                            label={btns[i].label}
                            onClick={(e) => {
                                this.userOption({ type: btns[i].type, record })
                                e.stopPropagation()
                            }}
                        />)
                    )
                } else {
                    subList.push(
                        { label: btns[i].label, key: btns[i].type }
                    )
                }
            }
            btnList.push(
                (<RLDropdown
                    subBtns={subList}
                    label='更多'
                    key={new Date().getTime()}
                    onClick={(e, key) => {
                        console.log(e, key);
                        if (!key) {
                            return
                        }
                        this.userOption({ type: key, record })
                        e.stopPropagation()
                    }}
                />)
            )


            return <div style={{ display: 'flex', flexDirection: 'row', minWidth: 216 }}>
                {btnList}
            </div>
        }
    }
    // 全员静音
    roomMute = () => {
        this.setState({
            openSelf: false
        })
        this.showModal({
            title: '所有参会者都将被静音',
            content: <div>
                <RLCheckbox
                    label='允许参会者自行解除静音'
                    // checked={this.state.openSelf}
                    onChange={(e) => {
                        console.log(1234, e.target.checked)
                        this.setState({
                            openSelf: e.target.checked
                        })
                    }}
                />
            </div>,
            okText: '全员静音',
            cancelText: '取消',

            onOk: () => {
                // console.log('openSelfCheckbox', this.openSelfCheckbox)
                return this.roomOption({ type: 'mute', action: true })
            },
            onCancel: () => { console.log('cancel in call') },
            size: 'big'
        })
    }
    toggleRenameModal = (show, record) => {
        let _show, renameUser = {}
        if (show !== undefined) {
            _show = show

        } else {
            _show = !this.state.showRenameModal
        }
        if (show && record) {
            renameUser = {
                meeting_id: this.meetingId,
                nickname: record.nickname,
                uid: record.uid
            }
        }
        this.setState({
            showRenameModal: _show,
            renameUser

        })
    }
    render() {
        return (
            <div className="floatBox">
                <WindowContainer title={this.pageTitle} className='member-mamage-page'
                >
                    <RLDisplayBoard className='meeting-info-board'>
                        <div className='meeting-title'>
                            <span>{this.state.meetingInfo.title}</span>
                        </div>
                        <div className='meeting-info'>
                            <div className='meeting-info-item'>
                                <span className='item-label'>会议号：</span>
                                <span className='item-value'>{this.state.meetingInfo.room}</span>
                            </div>
                        </div>
                    </RLDisplayBoard>
                    <div className='btn-container'>
                        <RLButton label='刷新' type='default'
                            onClick={() => {
                                this.getMemberList()
                            }}
                        />
                        <RLButton label='全员静音' type={this.state.meetingInfo.audiooff === '1' ? 'primary' : 'default'}
                            onClick={() => {
                                this.roomMute()
                            }}
                        />
                        <RLButton label='取消静音' type='default'
                            onClick={() => {
                                this.roomOption({ type: 'mute', action: false })
                            }}
                        />
                        <RLButton
                            type={this.state.meetingInfo.lock === '1' ? 'primary' : 'default'}
                            label={this.state.meetingInfo.lock === '1' ? '取消锁定' : '锁定会议'}
                            onClick={() => {
                                this.roomOption({ type: 'lock', action: this.state.meetingInfo.lock === '0' })
                            }}
                        />
                    </div>
                    <RLTable
                        style={{ overflow: 'auto' }}
                        dataSource={this.state.memberList}
                        columns={this.getColumns()}
                        loading={this.state.listLoading}
                    />
                    {
                        this.state.showRenameModal && <RLRenameModal
                            visible={this.state.showRenameModal}
                            toggleRenameModal={this.toggleRenameModal}
                            onRenameSuccess={() => {
                                this.toggleRenameModal(false)
                                this.getMemberList()
                            }}
                            onRenameError={() => { }}
                            user={this.state.renameUser}
                        />
                    }

                </WindowContainer>
            </div>

        )
    }
}
export default MemberManage