import { Component, forwardRef } from 'react';
import { connect } from 'react-redux';
import UpcomingMeeting from '@/pages/common/meeting/UpcomingMeeting.js';
import CurrentMeeting from '@/pages/common/meeting/CurrentMeeting.js';
import HistoryMeeting from '@/pages/common/meeting/HistoryMeeting.js'
import WindowContainer from '@components/WindowContainer.js'
import { RLTabs } from '@components/index.js'

// import utils from '@/libs/utils.js'
import BaseCmp from '@components/BaseCmp.js'

class CmpMeeingList extends BaseCmp {
    constructor(props) {
        super(props);
        this.state = {
            defaultTabKey: props.tabKey ? props.tabKey : 'upcoming'
        };

    }
    render() {
        let tabPanes = [
            {
                tab: '即将举行的会议',
                id: 'upcoming',
            },
            {
                tab: '实时会议',
                id: 'current',
            },
            {
                tab: '已结束的会议',
                id: 'history',
            }
        ]
        if (this.props.accountType === 'personal') {
            if (this.props.userInfo.target_type && this.props.userInfo.target_type[0]) {
                let targetType = this.props.userInfo.target_type[0].target_type
                if (targetType === 'basicset') {
                    tabPanes.splice(1, 1)
                }
            }
        }
        return (
            <WindowContainer title='会议列表'>
                <div className="page-meetinglist">
                    <RLTabs
                        onChange={(key) => {
                            console.log('tab:', key);
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
                                    pageType={'mine'}
                                />
                            } else if (this.state.defaultTabKey === 'current') {
                                return <CurrentMeeting
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    pageType={'mine'}
                                />
                            } else if (this.state.defaultTabKey === 'history') {
                                return <HistoryMeeting
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    pageType={'mine'}
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
        ...props,
        accountType: store.storeCommon.accountType,
        userInfo: store.personalInfo.userInfo,
    }
})(CmpMeeingList);