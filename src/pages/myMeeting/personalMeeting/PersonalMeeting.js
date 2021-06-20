import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux';


import WindowContainer from '@components/WindowContainer.js'

import './PersonalMeeting.less'
import utils from '@/libs/utils.js'
import config from '@/config.js'
import { RLDisplayBoard, RLInput, RLButton, RLCheckbox } from '@components/index.js'
import actionPersonalMeeting from '../../../store/actions/myMeeting/actionPersonalMeeting.js';

class PersonalMeeting extends BaseCmp {
    constructor(props) {
        super(props);
        this.state = {
            personalMeeting: {
                hasPwd: !!this.props.personalMeetingInfo.meeting_pwd,
                ...this.props.personalMeetingInfo
            },
            saveLoading: false, // 保存loading
            editStatus: false,   // 当前是否是编辑状态
            reqParam: {
                is_join: this.props.personalMeetingInfo.is_join,
                meeting_number: this.props.personalMeetingInfo.meeting_number,
                meeting_pwd: this.props.personalMeetingInfo.meeting_pwd,
                hasPwd: !!this.props.personalMeetingInfo.meeting_pwd,
            }
        };
        this.pwdInput = createRef();
        this.getPersonalMeetingInfo()
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            personalMeeting: {
                hasPwd: !!nextProps.personalMeetingInfo.meeting_pwd,
                ...nextProps.personalMeetingInfo
            },
        })
    }
    onEnterMeeting = () => {
        window.open(config.personalPullUpLink + '?q=' + this.props.personalHash)
    }
    getPersonalMeetingInfo = () => {
        actionPersonalMeeting.getPersonalMeetingInfo()
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>{this.props.userInfo.nickname}的个人会议室</span>
                {
                    !this.state.editStatus && <RLButton
                        className="custom-page-title-btn"
                        type="primary"
                        onClick={this.onEnterMeeting}
                        label='进入会议'
                    />
                }

            </div>
        )
    }
    saveFn = () => {
        let { is_join, meeting_pwd, meeting_number, hasPwd } = this.state.reqParam
        if (hasPwd && (!meeting_pwd || meeting_pwd.length < 4)) {
            this.showToast({ type: 'warning', content: '请输入4位密码' })
            return
        }
        this.setState({
            saveLoading: true
        })
        actionPersonalMeeting.personalMeetingUpdate({ is_join, meeting_pwd, meeting_number }).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '保存成功' })
                this.getPersonalMeetingInfo()
                this.setState({
                    editStatus: false
                })
            } else {
                this.showToast({ type: 'error', content: '保存失败' })
            }
        }).finally(() => {
            this.setState({
                saveLoading: false
            })
        })
    }
    toggleEditStatus = () => {
        this.setState({
            editStatus: !this.state.editStatus
        })
    }
    render() {
        let valueStyle = {
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'row'
        }
        let labelStyle = { flex: 'none', width: 70, fontSize: 14, lineHeight: '20px', color: '#999', textAlign: 'left' }
        let boardItems = [
            {
                list: [
                    {
                        label: '个人会议号',
                        value: <div style={valueStyle}>
                            <div>{this.showRoomNumber(this.state.personalMeeting.meeting_number)}</div>
                            <img alt='' style={{ marginLeft: 10, height: 24, width: 24, cursor: 'pointer' }}
                                src={require('../../../assets/images/copy.png').default} onClick={() => {
                                    console.log(2345)
                                    utils.copy(this.state.personalMeeting.meeting_number, () => {
                                        this.showToast({ type: 'success', content: '会议号已复制到剪贴板' })
                                    })

                                }}
                            ></img>
                        </div>,
                        labelStyle,
                    }, {
                        label: '会议链接',
                        value: <div style={valueStyle}>
                            <div className='link-word'
                                onClick={() => {
                                    window.open(config.personalPullUpLink + '?q=' + this.props.personalHash)
                                }}
                            >{config.personalPullUpLink + '?q=' + this.props.personalHash}</div>
                            <img alt=''
                                style={{ marginLeft: 10, height: 24, width: 24, cursor: 'pointer' }}
                                src={require('../../../assets/images/copy.png').default}
                                onClick={() => {
                                    utils.copy(config.personalPullUpLink + '?q=' + this.props.personalHash, () => {
                                        this.showToast({ type: 'success', content: '会议链接已复制到剪贴板' })
                                    })
                                }}
                            />
                        </div>,
                        labelStyle,
                    }, {
                        label: '入会密码',
                        value: this.state.editStatus ? <div style={{ ...valueStyle, alignItems: 'center', height: 30 }}>
                            <RLCheckbox label='开启入会密码'
                                defaultChecked={!!this.state.personalMeeting.meeting_pwd}
                                onChange={(e) => {
                                    // console.log(e.target.checked)
                                    this.setState({
                                        reqParam: {
                                            ...this.state.reqParam,
                                            hasPwd: !this.state.reqParam.hasPwd,
                                            meeting_pwd: ''
                                        }
                                    }, () => {
                                        if (this.state.reqParam.hasPwd) {
                                            this.passwordInput.focus()
                                        }
                                    })
                                }}
                            />
                            {
                                this.state.reqParam.hasPwd && (<RLInput
                                    ref={ref => this.passwordInput = ref}
                                    placeholder='请输入4位密码'
                                    maxLength={4}
                                    value={this.state.reqParam.meeting_pwd}
                                    onChange={(e) => {
                                        let text = e.target.value
                                        text = text.replace(/[^\d]/g, '')
                                        console.log(text)
                                        if (text.length > 4) {
                                            return
                                        }
                                        this.setState({
                                            reqParam: {
                                                ...this.state.reqParam,
                                                meeting_pwd: text
                                            }
                                        })
                                    }}
                                />)
                            }

                        </div> : <div style={{ ...valueStyle, alignItems: 'center', height: 30 }}>
                                <span>{this.state.personalMeeting.hasPwd ? this.state.personalMeeting.meeting_pwd : '无'}</span>
                            </div>,
                        labelStyle,
                    }
                ]
            }, {
                list: [
                    {
                        label: '会议设置',
                        value: this.state.editStatus ? <div style={{ ...valueStyle, flexDirection: 'column', position: 'relative', flex: 1 }}>
                            <RLCheckbox label='允许成员在主持人进会前加入会议'
                                disabled={!this.state.editStatus}
                                defaultChecked={!!this.state.reqParam.is_join}
                                onChange={(e) => {
                                    console.log(e.target.checked)
                                    this.setState({
                                        reqParam: {
                                            ...this.state.reqParam,
                                            is_join: e.target.checked ? 1 : 0,
                                        }
                                    })
                                }}
                            />
                            <span style={{ lineHeight: '17px', fontSize: 12, color: this.themeColor, position: 'absolute', top: 30 }}>
                                修改设置后，所有使用您个人会议号发起的会议都将同步修改</span>
                        </div> : <div style={{ ...valueStyle, flexDirection: 'column', position: 'relative', flex: 1 }}>
                                <span>{this.state.personalMeeting.is_join == 1 ? '允许成员在主持人进会前加入会议' : '不允许成员在主持人进会前加入会议'}</span>
                            </div>,
                        labelStyle,
                    }
                ]
            }
        ]
        return (
            <WindowContainer title={this.pageTitle} className='page-personalMeeting'
                style={{ flex: 1 }}
            >
                <RLDisplayBoard style={{ width: '100%' }} items={boardItems} >
                    {
                        this.state.editStatus ? (
                            <div className='btn-container'>
                                <RLButton
                                    label='取消'
                                    type='default'
                                    onClick={this.toggleEditStatus}
                                    key='cancel'
                                />
                                <RLButton
                                    label='保存'
                                    type='primary'
                                    style={{ marginLeft: 40 }}
                                    loading={this.state.saveLoading}
                                    onClick={this.saveFn}
                                    key='save'
                                />

                            </div>
                        ) : (
                                <div className='btn-container'>
                                    <RLButton label='编辑会议' type='default'
                                        key='edit'
                                        onClick={() => {
                                            this.toggleEditStatus()
                                            this.setState({
                                                reqParam: {
                                                    ...this.state.personalMeeting
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            )
                    }

                </RLDisplayBoard>
            </WindowContainer >

        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
        userInfo: store.personalInfo.userInfo,
        personalHash: store.personalInfo.personalHash,
        personalMeetingInfo: store.personalMeeting.personalMeetingInfo
        // nickname: store.storeUser.nickname,
        // meetingNum: store.storeUser.meetingNum,
        // meetingLink: store.storeUser.meetingLink
    }
})(PersonalMeeting)