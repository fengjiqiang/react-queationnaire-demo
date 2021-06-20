import React from 'react';
import {
    RLButton,
    RLDisplayBoard,
    RLTag
} from '@components/index.js'
import { Tooltip } from 'antd'
import WindowContainer from '@components/WindowContainer.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux';
import utils, { dealTableTime } from '@/libs/utils.js'
import './MeetingDetail.less'
import RLdocument from '@components/document/RLDocument.js'

class MeetingDetail extends BaseCmp {
    constructor(props) {
        super(props)
        this.urlParam = props
        this.meetingId = this.urlParam.meetingId
        this.state = {
            meetingDetail: {
                title: '',
                start_time_at: '',
                end_time_at: '',
                max_user_limit: '',
                meeting_type: '',
                password: '',
                description: '',
                participants_description: '',
                host: '',
                record_users: '',
                popularize: '',
                material: '',
                mustmaster: '',
                status: '',
                auditing: '',
                userList: [],
                fileList: []
            }
        }

    }
    componentDidMount() {
        this.getMeetingDetail(this.meetingId)
    }
    getMeetingDetail = (meetingId) => {
        actionMeeting.getMeetingDetail(meetingId).then(res => {
            if (res.code !== 200) {
                this.showToast({ type: 'error', content: '获取会议详情失败' })
            } else {
                let info = res.data;
                let data = {};
                let status = '';
                let auditing = '';
                if (info.meeting.status == 3) {
                    status = '已结束'
                } else if (info.meeting.status == 2) {
                    status = '已开始'
                } else if (info.meeting.status == 1) {
                    status = '进行中'
                } else {
                    status = '未开始'
                }
                if (info.meeting.auditing == 3) {
                    auditing = '撤销'
                } else if (info.meeting.auditing == 2) {
                    auditing = '审批没通过'
                } else if (info.meeting.auditing == 1) {
                    auditing = '审批通过'
                } else {
                    auditing = '审批中'
                }
                data = {
                    meeting_id: info.meeting.meeting_id,
                    room: info.meeting.room,
                    title: info.meeting.title,
                    start_time_at: dealTableTime(info.meeting.start_time_at),
                    end_time_at: dealTableTime(info.meeting.end_time_at),
                    max_user_limit: info.meeting.max_user_limit + '人',
                    meeting_type: info.meeting.meeting_type == 1 ? '公开' : '非公开',
                    password: info.meeting.password ? info.meeting.password : '无',
                    description: info.meeting.description,
                    participants_description: info.meeting.participants_description,
                    host: info.host.nickname,
                    record_users: '',
                    popularize: info.meeting.popularize == 1 ? '是' : '不是',
                    material: info.meeting.material,
                    mustmaster: info.meeting.mustmaster == 1 ? '允许在主持人之前入会' : '不允许在主持人之前入会',
                    status, auditing,
                    user_list: info.user_list,
                    phone_list: info.phone_list,
                    fileList: info.doc_list.map(i => {
                        return {
                            id: i.id,
                            title: i.title + '.' + i.suffix,
                            doc_url: i.url,
                            lid: i.id,
                            size: '',
                            is_me: i.is_me
                        }
                    })
                }
                this.setState({
                    meetingDetail: {
                        ...data
                    }
                })
            }
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>会议详情</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.closeDetail()
                    }}
                    label='返回'
                />
            </div>
        )
    }
    render() {
        let valueBtnStyle = {
            flex: 10,
            display: 'flex',
            flexDirection: 'row'
        }
        let labelStyle = {
            color: '#999',
            fontSize: 14,
            textAlign: 'left',
            width: 56,
            flex: 'none'
        }
        let valueStyle = {
            color: '#333',
            fontSize: 14
        }
        let basicBoxStyle = {
            width: 500,
            height: 200,
            border: '1px solid rgb(220, 223, 230)',
            borderRadius: 3,
            padding: '10px 10px 10px 10px',
            boxSizing: 'border-box'
        }
        let meetingInfo = [
            {
                list: [
                    {
                        label: '会议主题',
                        value: this.state.meetingDetail.title,
                        labelStyle,
                        valueStyle,
                    },
                    {
                        label: '会议号',
                        labelStyle,
                        valueStyle,
                        value: <div style={valueBtnStyle}>
                            <div style={valueStyle}>{this.state.meetingDetail.room != 0 ? this.state.meetingDetail.room : '——'}</div>
                            {this.state.meetingDetail.room != 0 ? <Tooltip title="点击复制">
                                <img
                                    alt=''
                                    style={{ marginLeft: 10, height: 24, width: 24, cursor: 'pointer' }}
                                    src={require('../../../assets/images/copy.png').default} onClick={() => {
                                        utils.copy(this.state.meetingDetail.room, () => {
                                            alert(this.state.meetingDetail.room);
                                            this.showToast({ type: 'success', content: '复制成功' })
                                        })

                                    }}
                                />
                            </Tooltip> : null}
                        </div>
                    },
                    {
                        label: '开始时间',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.start_time_at
                    },
                    {
                        label: '结束时间',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.end_time_at
                    },
                    {
                        label: '会议人数限制',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.max_user_limit
                    },
                    {
                        label: '会议性质',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.meeting_type
                    },
                    {
                        label: '会议密码',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.password
                    },
                    {
                        label: '主持人',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.host
                    },
                    {
                        label: '参会人员名单',
                        labelStyle,
                        valueStyle,
                        value: ((this.state.meetingDetail.user_list && this.state.meetingDetail.user_list.length) || (this.state.meetingDetail.phone_list && this.state.meetingDetail.phone_list.length)) ? <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: 500,
                            minHeight: 60,
                            maxHeight: 150,
                            padding: '10px 10px 10px 10px',
                            boxSizing: 'border-box',
                            overflowY: 'scroll'
                        }}>
                            {this.state.meetingDetail.user_list ? this.state.meetingDetail.user_list.map(ele => {
                                return <div style={{ height: 19, marginTop: 4 }} key={ele.uid}><RLTag label={ele.nickname} /></div>
                            }) : null}
                            {
                                this.state.meetingDetail.phone_list ? this.state.meetingDetail.phone_list.map(ele => {
                                    return <div style={{ height: 19, marginTop: 4 }} key={ele.uid}><RLTag label={ele.number} /></div>
                                }) : null
                            }
                        </div> : '未添加'
                    },
                    {
                        label: '会议说明',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.description ? <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: 500,
                            minHeight: 60,
                            maxHeight: 150,
                            padding: '10px 10px 10px 10px',
                            boxSizing: 'border-box',
                            overflowY: 'scroll'
                        }}>
                            <p>{this.state.meetingDetail.description}</p>
                        </div> : '未填写'
                    },
                    {
                        label: '参会者说明',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.participants_description ? <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: 500,
                            minHeight: 60,
                            maxHeight: 150,
                            padding: '10px 10px 10px 10px',
                            boxSizing: 'border-box',
                            overflowY: 'scroll'
                        }}>
                            <p>{this.state.meetingDetail.participants_description}</p>
                        </div> : '未填写'
                    },
                    {
                        label: '是否推广',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.popularize
                    },
                    {
                        label: '材料地址',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.material ? this.state.meetingDetail.material : '未上传'
                    },
                    {
                        label: '文档',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.fileList && this.state.meetingDetail.fileList.length ? <RLdocument
                            fileList={this.state.meetingDetail.fileList}
                            isDetail={true} /> : '未上传'
                    },
                    {
                        label: '会议状态',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.status
                    },
                    {
                        label: '会议审核状态',
                        labelStyle,
                        valueStyle,
                        value: this.state.meetingDetail.auditing
                    }
                ]
            }
        ]
        return (
            <div className="floatBox">
                <WindowContainer title={this.pageTitle} className='my-meeting-detail'>
                    <RLDisplayBoard
                        style={{ width: '100%', flex: 1 }}
                        labelCol={2}
                        valueCol={10}
                        spaceWidth={20}
                        className='meeting-info'
                        items={meetingInfo}>
                    </RLDisplayBoard>
                </WindowContainer>
            </div>

        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(MeetingDetail);