import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import DocumentsMeetingList from '@/pages/common/meeting/DocumentsMeetingList.js'
import DocumentsList from '@/pages/common/meeting/DocumentsList.js'

class MeetingDocument extends BaseCmp {
    constructor(props) {
        super(props);
        if (props.pathname.indexOf('seminarDocument') !== -1) {
            this.isLive = true
        } else if (props.pathname.indexOf('meetingDocument') !== -1) {
            this.isMeeting = true
        }
        this.state = {
            isShowList: false
        };
    }
    showDetail = (isShow, props = {}) => {
        this.setState({
            isShowList: isShow,
            props
        })
    }
    closeDocumentsList = () => {
        this.setState({
            isShowList: false,
        })
    }
    render() {
        let meetingList = undefined;
        meetingList = <DocumentsMeetingList
            onRef={e => this.documentsMeetingList = e}
            showDetail={this.showDetail}
            isLive={this.isLive}
            isMeeting={this.isMeeting}
        />
        return <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {meetingList}
            {this.state.isShowList ? <DocumentsList onRef={e => this.documentsList = e}
                closeDocumentsList={this.closeDocumentsList}
                {...this.state.props}
                isLive={this.isLive}
                isMeeting={this.isMeeting}
            /> : null}
        </div>
    }
}

export default connect((store, props) => {
    return {
        ...props,
    }
})(MeetingDocument);