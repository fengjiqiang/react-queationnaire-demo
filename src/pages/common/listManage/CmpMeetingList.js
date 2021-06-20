import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import UpcomingMeeting from '@/pages/common/meeting/UpcomingMeeting.js';
import CurrentMeeting from '@/pages/common/meeting/CurrentMeeting.js';
import HistoryMeeting from '@/pages/common/meeting/HistoryMeeting.js'
import ComExamineMeetingList from '@/pages/common/meeting/ComExamineMeetingList.js'
import { RLTabs } from '@components/index.js'
import './CmpMeetingList.less';

class MeetingManage extends BaseCmp {
    constructor(props) {
        super(props)
        let urlParam = props
        this.state = {
            defaultTabKey: urlParam.tabKey ? urlParam.tabKey : 'upcoming'
        };
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    refesh = () => {
        if (this.state.defaultTabKey === 'upcoming') {
            this.upcomingMeeting.getMeetingList()
        } else if (this.state.defaultTabKey === 'current') {
            this.currentMeeting.getMeetingList()
        } else if (this.state.defaultTabKey === 'history') {
            this.currentMeeting.getMeetingList()
        } else if (this.state.defaultTabKey === 'haveExamineAll' ||
            this.state.defaultTabKey === 'waitExamine' ||
            this.state.defaultTabKey === 'haveExmineMe' ||
            this.state.defaultTabKey === 'launchMe') {
            this.comExamineMeetingList.getMeetingList()
        }
    }
    render() {
        let tabPanes = this.props.tabPanes
        return (
            <WindowContainer>
                <div className="page-meetinglist">
                    <RLTabs
                        onChange={(key) => {
                            this.setState({
                                defaultTabKey: key
                            })
                        }}
                        tabPanes={tabPanes}
                        defaultActiveKey={this.state.defaultTabKey}
                    />
                    {
                        (() => {
                            if (this.state.defaultTabKey === 'upcoming') {
                                return <UpcomingMeeting
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    isMyMeeting={this.props.isMyMeeting}
                                    onRef={e => this.upcomingMeeting = e}
                                    listAddUser={this.props.listAddUser}
                                    showDoc={this.props.showDoc}
                                />
                            } else if (this.state.defaultTabKey === 'current') {
                                return <CurrentMeeting
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    isMyMeeting={this.props.isMyMeeting}
                                    onRef={e => this.currentMeeting = e}
                                    listAddUser={this.props.listAddUser}
                                    showDoc={this.props.showDoc}
                                />
                            } else if (this.state.defaultTabKey === 'history') {
                                return <HistoryMeeting
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    isMyMeeting={this.props.isMyMeeting}
                                    onRef={e => this.historyMeeting = e}
                                    listAddUser={this.props.listAddUser}
                                    showDoc={this.props.showDoc}
                                />
                            } else if (this.state.defaultTabKey === 'haveExamineAll' ||
                                this.state.defaultTabKey === 'waitExamine' ||
                                this.state.defaultTabKey === 'haveExmineMe' ||
                                this.state.defaultTabKey === 'launchMe') {
                                return <ComExamineMeetingList
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    onRef={e => this.comExamineMeetingList = e}
                                    listAddUser={this.props.listAddUser}
                                    type={this.state.defaultTabKey}
                                    key={this.state.defaultTabKey}
                                />
                            }
                        })()
                    }
                </div>
            </WindowContainer>

        )
    }

}

export default connect((store, props) => {
    return {
        ...props
    }
})(MeetingManage)