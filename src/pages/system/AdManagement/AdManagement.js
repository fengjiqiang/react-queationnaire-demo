import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { RLTabs, RLButton } from '@components/index.js'
import ADOfflineList from '@/pages/system/AdManagement/components/ADOfflineList.js'
import ADOnlineLists from '@/pages/system/AdManagement/components/ADOnlineLists.js'
import AddAD from '@/pages/system/AdManagement/components/AddAD.js'
import AddRoom from '@/pages/system/AdManagement/components/addRoom.js'
import ADDetail from '@/pages/system/AdManagement/components/ADDetail.js'
import interfaces from '../../../api/interfaces.js'

class AdManagement extends BaseCmp {
    constructor(props) {
        super(props);
        this.tabPanes = [
            {
                tab: '已上线',
                id: 'onLine',
            },
            {
                tab: '未上线',
                id: 'offLine',
            },
            {
                tab: '已结束',
                id: 'end',
            }
        ]
        this.state = {
            defaultTabKey: 'onLine',
            isShowAdd: false,
            isShowDetail: false,
            tempId: '',
            showRoomList: false,
            roomInfo: {}
        };
    }
    showEditAD = (id) => {
        this.setState({
            isShowAdd: true,
            tempId: id
        })
    }
    showDetail = (id) => {
        this.setState({
            isShowDetail: true,
            tempId: id
        })
    }
    addAD = () => {
        this.setState({
            isShowAdd: true,
            tempId: ''
        })
    }
    displayRoomList = (res) => {
        this.setState({
            showRoomList: true,
            roomInfo: { ...res }
        })
    }
    refresh = () => {
        if (this.state.defaultTabKey === 'onLine') {
            this.ADOnlineLists.getDataList()
        } else if (this.state.defaultTabKey === 'offLine') {
            this.ADOfflineList.getDataList()
        } else if (this.state.defaultTabKey === 'end') {
            this.ADEndlineList.getDataList()
        }
    }
    render() {
        let showList = undefined;
        let showAddAD = undefined;
        let showAddRoom = undefined;
        let showdetail = undefined;

        if (this.state.defaultTabKey === 'offLine') {
            showList = <ADOfflineList
                key='offLine'
                editAD={this.showEditAD}
                showDetail={this.showDetail}
                type='offLine'
                ref={(e) => {
                    this.ADOfflineList = e
                }}
            />
        } else if (this.state.defaultTabKey === 'onLine') {
            showList = <ADOnlineLists
                showDetail={this.showDetail}
                ref={(e) => {
                    this.ADOnlineLists = e
                }}
            />
        } else if (this.state.defaultTabKey === 'end') {
            showList = <ADOfflineList
                key='end'
                showDetail={this.showDetail}
                type='end'
                ref={(e) => {
                    this.ADEndlineList = e
                }}
            />
        }
        if (this.state.isShowAdd) {
            showAddAD = <AddAD
                id={this.state.tempId}
                displayRoomList={this.displayRoomList}
                return={(refresh) => {
                    this.setState({
                        isShowAdd: false
                    })
                    if (refresh) {
                        this.refresh();
                    }
                }}
                ref={e => {
                    this.addADs = e
                }}
            />
        }
        if (this.state.showRoomList) {
            showAddRoom = <AddRoom
                visible={this.state.showRoomList}
                type={this.state.roomInfo.type}
                onCancel={() => {
                    this.setState({
                        showRoomList: false,
                        roomInfo: {}
                    })
                }}
                onAdd={(res) => {
                    this.addADs.addRoomNum && this.addADs.addRoomNum(res.id)
                }}
            />
        }
        if (this.state.isShowDetail) {
            showdetail = <ADDetail
                id={this.state.tempId}
                return={(refresh) => {
                    this.setState({
                        isShowDetail: false
                    })
                    if (refresh) {
                        this.refresh();
                    }
                }}
            />
        }
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <WindowContainer>
                    <div className="page-meetinglist" style={{ position: 'relative' }}>
                        <RLTabs
                            onChange={(key) => {
                                this.setState({
                                    defaultTabKey: key
                                })
                            }}
                            tabPanes={this.tabPanes}
                            defaultActiveKey={this.state.defaultTabKey}
                        />
                        {interfaces.SYSTEM_AD_ADD && <RLButton
                            label='添加广告'
                            type='primary'
                            key={'addAD'}
                            onClick={this.addAD}
                            style={{ position: 'absolute', top: 13, right: 0 }}
                        />}
                        {showList}
                    </div>
                </WindowContainer>
                {showAddAD}
                {showAddRoom}
                {showdetail}
            </div >
        )
    }

}
export default AdManagement