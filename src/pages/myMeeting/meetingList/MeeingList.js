import { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import MeetingDetail from '@/pages/common/meeting/MeetingDetail.js'
import Appointment from '@/pages/common/meeting/Appointment.js'
import CmpMeetingList from './component/CmpMeetingList.js'
import MemberManage from '@/pages/common/meeting/MemberManage.js'



class MeetingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPage: 'list',     // 要现实的页面appoint：预约会议/detail：会议详情/list：会议列表
            props
        };

    }
    changePage = (page, props = {}) => {
        this.setState({
            showPage: page,
            props
        })
    }
    render() {
        let showCmp
        if (this.state.showPage === 'list') {
            showCmp = <CmpMeetingList
                changePage={this.changePage}
                {...this.state.props}
            />
        } else if (this.state.showPage === 'detail') {
            showCmp = <MeetingDetail changePage={this.changePage} {...this.state.props} />
        } else if (this.state.showPage === 'appoint') {
            showCmp = <Appointment changePage={this.changePage} {...this.state.props} />
        } else if (this.state.showPage === 'manage') {
            showCmp = <MemberManage changePage={this.changePage} {...this.state.props} />
        }
        return (

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {showCmp}
                {/* <Route exact
                    key='/myMeeting/meetinglist/list'
                    path="/myMeeting/meetinglist/list"
                    component={CmpMeetingList}
                />
                <Route exact
                    key='/myMeeting/meetinglist/detail'
                    path="/myMeeting/meetinglist/detail"
                    component={MeetingDetail}
                />
                <Route exact
                    key='/myMeeting/meetinglist/appoint'
                    path="/myMeeting/meetinglist/appoint"
                    component={Appointment}
                />
                <Route exact
                    key='/myMeeting/meetinglist/manage'
                    path="/myMeeting/meetinglist/manage"
                    component={MemberManage}
                /> */}
            </div>

        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
        accountType: store.storeCommon.accountType
    }
})(MeetingList);