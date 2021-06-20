import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import AllLiveList from '@/pages/common/liveCom/AllLiveList.js'
import ComExamineMeetingList from '@/pages/common/meeting/ComExamineMeetingList.js'
import ExamineList from '@/pages/common/liveCom/ExamineList.js'
import { RLTabs } from '@components/index.js'
import './LiveCmpMeetingList.less';

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
        if (this.props.listName === 'allLive') {
            this.allLiveList && this.allLiveList.getMeetingList()
        } else if (this.props.listName === 'myLive') {
            this.myLiveList && this.myLiveList.getMeetingList()
        } else if (this.props.listName === 'examineLive') {
            this.comExamineMeetingList && this.comExamineMeetingList.getMeetingList()
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
                            if (this.props.listName === 'allLive') {
                                return <AllLiveList
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    isMyLive={this.props.isMyLive}
                                    onRef={e => this.allLiveList = e}
                                    listAddUser={this.props.listAddUser}
                                    listAddNewUser={this.props.listAddNewUser}
                                    type={this.state.defaultTabKey}
                                    key={this.state.defaultTabKey}
                                    modelName={this.props.listName}
                                    showDoc={this.props.showDoc}
                                />
                            } else if (this.props.listName === 'myLive') {
                                return <AllLiveList
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    isMyLive={this.props.isMyLive}
                                    onRef={e => this.myLiveList = e}
                                    listAddUser={this.props.listAddUser}
                                    listAddNewUser={this.props.listAddNewUser}
                                    type={this.state.defaultTabKey}
                                    key={this.state.defaultTabKey}
                                    modelName={this.props.listName}
                                    showDoc={this.props.showDoc}
                                />
                            } else if (this.props.listName === 'examineLive') {
                                return <ExamineList
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    onRef={e => this.comExamineMeetingList = e}
                                    listAddUser={this.props.listAddUser}
                                    type={this.state.defaultTabKey}
                                    key={this.state.defaultTabKey}
                                    modelName={this.props.listName}
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