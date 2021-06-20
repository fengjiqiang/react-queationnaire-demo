import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import MemberManage from '@/pages/common/meeting/MemberManage.js'
import LiveDetail from '@/pages/common/liveCom/LiveDetail.js'
import LiveCmpMeetingList from '@/pages/common/liveCom/LiveCmpMeetingList.js'
import CreateLive from '@/pages/common/liveCom/CreateLive.js'
import AddUser from '@/pages/common/meeting/AddUser.js'
import DocumentDetail from '@/components/document/DocumentDetail.js'
import actionSeminar from '@actions/seminar/actionSeminar.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import interfaces from '../../../api/interfaces.js'
import AddPhone from '@/pages/common/meeting/AddPhone.js'
import AddActivityUser from '@/pages/common/meeting/AddActivityUser.js'
import config from '@/config.js';

class MySeminar extends BaseCmp {
    constructor(props) {
        super(props);
        this.tabPanes = [
            {
                tab: '即将开始的直播',
                id: 'upcomingLive',
            },
            {
                tab: '已结束的直播',
                id: 'endLive',
            }
        ]
        this.state = {
            showPage: 'list',     // 要现实的页面appoint：预约会议/detail：会议详情/list：会议列表
            props,
            isShowMemberManage: false,
            isShowCreateMeeting: false,
            isShowMeetingDetail: false,
            isShowDocumentsDetail: false,
            addUser: false,
            tempRoom: undefined,
            addUserConfig: {
                showSelectGroup: true,
                selectType: 'checkbox',
                originArr: [],
                originCanCancel: true,
                returnStyle: 'object',
                successFunName: ''
            },
            // 添加固话
            addPhone: false,
            addPhoneConfig: {
                showSelectGroup: true,
                selectType: 'checkbox',
                originArr: [],
                originCanCancel: true,
                returnStyle: 'object',
                successFunName: ''
            },
            // 导入报名用户
            addActivityUser: false
        };
    }
    closeMember = () => {
        this.setState({
            isShowMemberManage: false
        })
    }
    closeCreat = () => {
        this.setState({
            isShowCreateMeeting: false
        })
    }
    closeDetail = () => {
        this.setState({
            isShowMeetingDetail: false
        })
    }
    changeMeetingMaster = (data) => {
        this.CreateLive && this.CreateLive.setHost(data)
    }
    changePage = (page, props = {}) => {
        if (page === 'memberManage') {
            this.setState({
                isShowMemberManage: true,
                props
            })
            return
        } else if (page === 'createMeeting') {
            this.setState({
                isShowCreateMeeting: true,
                props
            })
            return
        } else if (page === 'detail') {
            this.setState({
                isShowMeetingDetail: true,
                props
            })
            return
        } else if (page === 'edit') {
            this.setState({
                isShowCreateMeeting: true,
                props
            })
            return
        }
        this.setState({
            showPage: page,
            props
        })
    }
    addSuccess = (data) => {
        if (this.state.addUserConfig.successFunName === 'changeMeetingMaster') {
            this.changeMeetingMaster(data)
        } else if (this.state.addUserConfig.successFunName === 'changeVisit') {
            this.CreateLive && this.CreateLive.setVisitor(data)
        } else if (this.state.addUserConfig.successFunName === 'listAddUser') {
            let arr = [];
            data.forEach(ele => {
                arr.push(ele.id)
            })
            arr = arr.join(',')
            actionMeeting.listInviteUser({
                meeting_id: this.state.meetingId,
                uids: arr,
                type: 3
            }).then(res => {
                if (res.code == 200) {
                    this.showToast({ type: 'success', content: '邀请成功' })
                }
            })
        } else if (this.state.addUserConfig.successFunName === 'listAddNewUser') {
            let arr = [];
            data.forEach(ele => {
                arr.push(ele.id)
            })
            arr = arr.join(',')
            actionMeeting.listInviteUser({
                meeting_id: this.state.meetingId,
                uids: arr,
                type: 2
            }).then(res => {
                if (res.code == 200) {
                    this.showToast({ type: 'success', content: '邀请成功' })
                } else {
                    this.showToast({ type: 'error', content: res.msg });
                }
            })
        } else if (this.state.addUserConfig.successFunName === 'changeGuest') {
            this.CreateLive && this.CreateLive.setGuest(data)
        }
        this.setState({
            addUserConfig: {}
        })
    }
    addPhoneSuccess = (data) => {
        if (this.state.addPhoneConfig.successFunName === 'changeVisit') {
            this.CreateLive && this.CreateLive.setPhone(data)
        }
    }
    addActUserSuccess = (data) => {
        this.CreateLive && this.CreateLive.setActUser(data)
    }
    refeshAndhttp = () => {
        this.cmpMeetingList.refesh()
    }
    listAddUser = (meetingId) => {
        if (!interfaces.USER_LIST) {
            this.showToast({ type: 'error', content: '您当前没有此权限' });
            return
        }
        this.setState({
            meetingId
        })
        actionSeminar.getLiveDetail({ meeting_id: meetingId }).then(res => {
            if (res.code !== 200) {
                this.showToast({ type: 'error', content: '获取会议详情失败' });
                return
            }
            const data = res.data;
            let userList = data.user_list.map(ele => {
                return { ...ele }
            })
            this.setState({
                addUser: true,
                addUserConfig: {
                    ...this.state.addUserConfig,
                    showSelectGroup: true,
                    selectType: 'checkbox',
                    originArr: userList,
                    originCanCancel: false,
                    returnStyle: 'object',
                    successFunName: 'listAddUser'
                }
            })
        })
    }
    listAddNewUser = (meetingId) => {
        if (!interfaces.USER_LIST) {
            this.showToast({ type: 'error', content: '您当前没有此权限' });
            return
        }
        this.setState({
            meetingId
        })
        actionSeminar.getLiveDetail({ meeting_id: meetingId }).then(res => {
            if (res.code !== 200) {
                this.showToast({ type: 'error', content: '获取会议详情失败' });
                return
            }
            const data = res.data;
            let guestList = data.guest_list.map(ele => {
                return { ...ele }
            })
            this.setState({
                addUser: true,
                addUserConfig: {
                    ...this.state.addUserConfig,
                    showSelectGroup: true,
                    selectType: 'checkbox',
                    originArr: guestList,
                    originCanCancel: false,
                    returnStyle: 'object',
                    successFunName: 'listAddNewUser',
                    mustIdent: true,
                    maxNum: config.maxPersonNum,
                }
            })
        })
    }
    showDoc = (res) => {
        this.setState({
            isShowDocumentsDetail: true,
            tempRoom: res
        })
    }
    render() {
        let showCmp;
        let isDetail = undefined    //展示用户详情
        let isMemberManage = undefined  //展示会控管理 
        let isCreateMeeting = undefined   //展示创建会议
        if (this.state.showPage === 'list') {
            showCmp = <LiveCmpMeetingList
                changePage={this.changePage}
                {...this.state.props}
                tabPanes={this.tabPanes}
                tabKey={'upcomingLive'}
                isMyLive={true}
                onRef={e => this.cmpMeetingList = e}
                listAddUser={(res) => {
                    this.listAddUser(res);
                }}
                listAddNewUser={(res) => {
                    this.listAddNewUser(res);
                }}
                showDoc={this.showDoc}
                listName={'myLive'}
            />
        }
        isMemberManage = <MemberManage closeMember={this.closeMember} {...this.state.props} />
        isCreateMeeting = <CreateLive
            closeCreat={this.closeCreat}
            onRef={e => this.CreateLive = e}
            {...this.state.props}
            addMaster={(res) => {
                if (!interfaces.USER_LIST) {
                    this.showToast({ type: 'error', content: '您当前没有此权限' });
                    return
                }
                this.setState({
                    addUser: true,
                    addUserConfig: {
                        ...this.state.addUserConfig,
                        ...res
                    }
                })
            }}
            addPhone={(res) => {
                if (!interfaces.PHONE_LIST) {
                    this.showToast({ type: 'error', content: '您当前没有此权限' });
                    return
                }
                this.setState({
                    addPhone: true,
                    addPhoneConfig: {
                        ...this.state.addPhoneConfig,
                        ...res
                    }
                })
            }}
            addActivityUser={(res) => {
                if (!interfaces.EVENT_LIST) {
                    this.showToast({ type: 'error', content: '您当前没有此权限' });
                    return
                }
                this.setState({
                    addActivityUser: true
                })
            }}
            refeshAndhttp={this.refeshAndhttp}
        />
        isDetail = <LiveDetail closeDetail={this.closeDetail} {...this.state.props} />
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {this.state.isShowMemberManage ? isMemberManage : null}
                {this.state.isShowCreateMeeting ? isCreateMeeting : null}
                {this.state.isShowMeetingDetail ? isDetail : null}
                {this.state.isShowDocumentsDetail ?
                    <DocumentDetail
                        room={this.state.tempRoom}
                        closeDoc={() => {
                            this.setState({
                                isShowDocumentsDetail: false,
                                tempRoom: undefined
                            })
                        }}
                    /> : null}
                {showCmp}
                {this.state.addUser ? <AddUser
                    visible={true}
                    showSelectGroup={this.state.addUserConfig.showSelectGroup}
                    selectType={this.state.addUserConfig.selectType}
                    originArr={this.state.addUserConfig.originArr}
                    originCanCancel={this.state.addUserConfig.originCanCancel}
                    returnStyle={this.state.addUserConfig.returnStyle}
                    maxNum={this.state.addUserConfig.maxNum}
                    mustIdent={this.state.addUserConfig.mustIdent}
                    onCancel={() => {
                        this.setState({
                            addUser: false,
                            addUserConfig: {}
                        })
                    }}
                    onAdd={(data) => {
                        console.log(data);
                        console.log('直播回传数据')
                        this.addSuccess(data)
                    }}
                /> : null}
                {this.state.addPhone ? <AddPhone
                    visible={true}
                    showSelectGroup={this.state.addPhoneConfig.showSelectGroup}
                    selectType={this.state.addPhoneConfig.selectType}
                    originArr={this.state.addPhoneConfig.originArr}
                    originCanCancel={this.state.addPhoneConfig.originCanCancel}
                    returnStyle={this.state.addPhoneConfig.returnStyle}
                    onCancel={() => {
                        this.setState({
                            addPhone: false
                        })
                    }}
                    onAdd={(data) => {
                        console.log(data);
                        console.log('回传数据')
                        this.addPhoneSuccess(data)
                    }}
                /> : null}
                {this.state.addActivityUser ? <AddActivityUser
                    visible={true}
                    onCancel={() => {
                        this.setState({
                            addActivityUser: false
                        })
                    }}
                    onAdd={(data) => {
                        console.log(data);
                        console.log('回传数据')
                        this.addActUserSuccess(data)
                    }}
                /> : null}
            </div>
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
    }
})(MySeminar)