


import { LargeModal, RLButton } from '@components/index.js'
import BaseCmp from '@components/BaseCmp.js'
import './CopyInviteModal.less'
import actionMeetingList from '@actions/myMeeting/actionMeetingList.js'
import config from '@/config.js'
import utils from '@/libs/utils.js'
import moment from 'moment'
class CopyInviteModal extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            nickname: '',
            title: '',
            meetingTime: '',

            link: '',

            roomNum: '',
            password: '',
            is_appointment: ''
        }
    }
    componentWillMount() {
        this.getMeetingInfo(this.props.meetingId)
    }
    // 获取链接
    getMeetingLink({ nickname, roomNum, start_date, start_time, startTime, end_date, end_time, endTime, title, password, is_appointment }) {
        return actionMeetingList.getMeetingHash({ roomId: roomNum, startTime, endTime, title, password, nickname, is_appointment }).then(res => {
            if (res.code === 200) {
                let startTime = start_date + ' ' + start_time
                startTime = moment(startTime)
                startTime = startTime.format('YYYY.MM.DD ddd HH:mm')
                let meetingTime = startTime + '-' + end_time
                return {
                    nickname,
                    title,
                    meetingTime,
                    link: config.pullUpLink + '?q=' + res.data,
                    roomNum,
                    password,
                    is_appointment
                }
            } else {
                this.showToast({ type: 'error', content: '获取会议链接错误' })
            }
        })
    }
    // 获取会议详情
    getMeetingDetail = (id) => {
        return actionMeetingList.getMeetingDetail(id).then(res => {
            if (res.code === 200) {
                console.log('会议详情：', res)
                var { start_date, start_time, end_date, end_time, title, password, room_id, nickname, is_appointment } = res.data
                if (is_appointment === 0) {
                    let endMoment = moment(start_time)
                    console.log(endMoment.hour())
                    endMoment = endMoment.set('hour', (endMoment.hour() + 1))
                    end_date = endMoment.format('YYYY-MM-DD')
                    console.log('endMoment:', endMoment)
                    end_time = endMoment.format('HH:mm')

                    // let eMoment = moment(sMoment)
                    // let minute = eMoment.minute() + 60
                    // eMoment.set('minute', minute)
                    let startArr = start_time.split(' ')
                    start_date = startArr[0]
                    start_time = startArr[1]

                }
                end_time = end_time.substring(0, 5)
                start_time = start_time.substring(0, 5)
                return {
                    title,
                    nickname,
                    start_date,
                    start_time,
                    startTime: start_date + ' ' + start_time,
                    end_date,
                    end_time,
                    endTime: end_date + ' ' + end_time,
                    roomNum: room_id,
                    password,
                    is_appointment
                }
            } else {
                this.showToast({ type: 'error', content: '获取会议详情失败' })
            }
        })
    }
    // 获取会议信息
    getMeetingInfo = (id) => {
        this.getMeetingDetail(id)
            .then(this.getMeetingLink)
            .then(res => {
                let {
                    nickname,
                    title,
                    meetingTime,
                    link,
                    roomNum,
                    password,
                    is_appointment
                } = res

                this.setState({
                    nickname,
                    title,
                    meetingTime,
                    link,
                    roomNum,
                    password,
                    is_appointment
                })
            })
    }

    copyMeetingInfo = () => {
        console.log('copyMeetingInfo')
        let str = this.state.nickname + '  邀请您参加Boom视频会议\n会议主题：' + this.state.title +
            '\n会议时间：' + this.state.meetingTime +
            '\n\n点击链接，加入Boom会议\n' + this.state.link +
            '\n\n会议号：' + this.state.roomNum
        if (this.state.is_appointment === 1) {
            str += '\n密码：' + (this.state.password || '无')
        }
        //
        utils.copy(str, () => {
            this.showToast({ type: 'success', content: '复制成功' })
        })
    }


    render() {
        return (
            <LargeModal
                visible={this.props.visible}
                title='邀请参会者入会'
                wrapClassName='copyInviteModal'
                afterClose={(...rest) => {
                    this.props.afterClose && this.props.afterClose(...rest)
                }}
                onClose={(...rest) => {
                    this.props.onClose && this.props.onClose(...rest)
                }}
            >
                <div className='inviteChild'>
                    <div className='invite-body'>
                        <div className='display-block'>
                            <div className='invite-item'>
                                <span className='active-text'>{this.state.nickname}</span>
                                <span className='invite-text'>邀请您参加Boom视频会议</span>
                            </div>
                            <div className='invite-item kvs'>
                                <span>会议主题：</span>
                                <span>{this.state.title}</span>
                            </div>
                            <div className='invite-item kvs'>
                                <span>会议时间：</span>
                                <span>{this.state.meetingTime}</span>
                            </div>
                        </div>
                        <div className='display-block'>
                            <span className='invite-item invite-text'>点击链接，加入Boom会议</span>
                            <span className='invite-item active-text link-word'
                                onClick={() => {
                                    window.open(this.state.link)
                                }}
                            >
                                {this.state.link}
                            </span>
                        </div>
                        <div className='display-block'>
                            <div className='invite-item kvs'>
                                <span className='invite-text'>会议号：</span>
                                <span className='invite-text'>{this.state.roomNum}</span>
                            </div>
                            {
                                this.state.is_appointment === 1 && <div className='invite-item kvs'>
                                    <span className='invite-text'>密&nbsp;&nbsp;&nbsp;&nbsp;码：</span>
                                    <span className='invite-text'>{this.state.password || '无'}</span>
                                </div>
                            }

                        </div>
                    </div>
                    <div className='invite-footer'>
                        <RLButton
                            label='复制邀请信息'
                            type='primary'
                            onClick={this.copyMeetingInfo}
                        />
                    </div>
                </div>
            </LargeModal>
        )
    }
}

export default CopyInviteModal