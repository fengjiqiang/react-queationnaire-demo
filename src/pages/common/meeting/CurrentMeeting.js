
import BaseCmp from '@components/BaseCmp.js'
import { RLInput, RLFilterTool, RLButton, RLTable, RLSelect, RLDropdown } from '@components/index.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import { connect } from 'react-redux'
import interfaces from '../../../api/interfaces';
import config from '@/config.js';
import { dealTableTime } from '@/libs/utils'

class CurrentMeeting extends BaseCmp {
    constructor(props) {
        super(props);
        this.state = {
            selectOption: 'name',
            searchInput: '',
            searchParam: {  // 搜索列表筛选条件
                meeting_status: 1,
                room: '',
                nickname: '',
                start_time: '',
                end_time: '',
                order: 1,        // 按照开始时间倒叙  1正序 0倒序
            },
            currentListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            listLoading: true,      // 获取列表中loading
        };

    }
    componentDidMount() {
        this.props.onRef(this);
        this.getMeetingList()
    }
    getColumns = () => {
        let columns = [
            {
                title: '会议ID',
                dataIndex: 'meeting_id',
                key: 'meeting_id',
                width: '9%'
            },
            {
                title: '会议主题',
                dataIndex: 'title',
                key: 'title',
                width: '18%',
                render: (text, record) => {
                    return <span className='line-clamp-2' onClick={() => {
                        this.rowClick(record)
                    }}>
                        {record.title}
                    </span>
                }
            },
            {
                title: '会议号',
                dataIndex: 'room',
                key: 'room',
                width: '12%',
                render: (text, record) => {
                    return <span>
                        {
                            this.showRoomNumber(record.room)
                        }
                    </span>
                }
            },
            {
                title: <div onClick={() => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            order: this.state.searchParam.order == 1 ? 0 : 1
                        }
                    }, () => {
                        this.getMeetingList()
                    })
                }}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                >
                    <span style={{ marginRight: 4 }}>开始时间</span>
                    {
                        this.state.searchParam.order == 1 ? (
                            <img
                                alt=''
                                src={require('../../../assets/images/common/sort_up.png').default}
                                style={{ width: 16, height: 16 }}
                            />
                        ) : (
                                <img
                                    alt=''
                                    src={require('../../../assets/images/common/sort_down.png').default}
                                    style={{ width: 16, height: 16 }}
                                />
                            )
                    }
                </div>,
                key: 'real_start_time_at',
                width: '16%',
                render: (record) => {
                    return <div>{dealTableTime(record.real_start_time_at)}</div>
                }
            },
            {
                title: '参会人数',
                dataIndex: 'user_num',
                key: 'user_num',
                width: '7%',
            },
            {
                title: '创建者',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '6%',
                render: (text, record) => {
                    return <div style={{
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {record.nickname}
                    </div>
                }
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'opt',
                width: '15%',
                render: (text, record) => {
                    return this.getOptionBtns(record)
                }
            }
        ]

        if (this.props.isMyMeeting) {
            columns.splice(5, 0, {
                title: '文档数量',
                key: 'doc_num',
                width: '9%',
                render: (record) => {
                    return <div>
                        <span className='line-clamp-2' onClick={() => {
                            this.props.showDoc && this.props.showDoc(record.room)
                        }}>
                            {record.doc_num}
                        </span>
                    </div>
                }
            })
        }
        if (!this.props.isMyMeeting) {
            columns.splice(5, 0, {
                title: '创建者',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '9%',
            })
        }

        return columns
    }
    getOptionBtns = (record) => {
        return this.getBtnsFromList(this.getBtnList(record), record)
    }
    getBtnList = (record) => {
        let btns = [];
        if (interfaces.MEETING_APPROVE) {
            btns.push({
                label: '邀请',
                type: 'invite'
            })
        }
        if (this.props.isMyMeeting) {
            btns.push({
                label: '进入',
                type: 'meeting'
            })
        }
        // if (interfaces.PARTICIPANT_MANAGE) {
        //     btns.push({
        //         label: '参会者管理',
        //         type: 'member'
        //     })
        // }
        btns.push({
            label: '参会者管理',
            type: 'member'
        })
        if (interfaces.MEETING_ENDMEETING) {
            btns.push({
                label: '结束',
                type: 'ending'
            })
        }
        return btns
    }
    getBtnsFromList = (btns, record) => {
        if (btns.length <= 3) {
            return <div style={{ display: 'flex', flexDirection: 'row' }}>
                {
                    btns.map(({ label, type }) => {
                        return <RLButton
                            type='link'
                            key={type}
                            label={label}
                            onClick={(e) => {
                                this.optionAction(type, record)
                                e.stopPropagation()
                            }}
                        />
                    })
                }
            </div>
        } else {
            let btnList = []
            let subList = []
            for (let i = 0; i < btns.length; i++) {
                if (i < 2) {
                    btnList.push(
                        (<RLButton
                            type='link'
                            key={btns[i].type}
                            label={btns[i].label}
                            onClick={(e) => {
                                this.optionAction(btns[i].type, record)
                                e.stopPropagation()
                            }}
                        />)
                    )
                } else {
                    subList.push(
                        { label: btns[i].label, key: btns[i].type }
                    )
                }
            }
            btnList.push(
                (<RLDropdown
                    subBtns={subList}
                    label='更多'
                    onClick={(e, key) => {
                        this.optionAction(key, record)
                        e.stopPropagation()
                    }}
                />)
            )


            return <div style={{ display: 'flex', flexDirection: 'row' }}>
                {btnList}
            </div>
        }
    }
    optionAction = (key, record) => {
        if (key === 'invite') {
            this.props.listAddUser(record.meeting_id)
        } else if (key == 'meeting') {
            window.open(config.pullUpLink + '?q=' + record.hash_key)
        } else if (key === 'member') {
            this.props.changePage(
                'memberManage',
                {
                    meetingId: record.meeting_id
                })
        } else if (key === 'ending') {
            console.log('结束会议')
            this.showModal({
                title: '您是否确定结束此会议？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    return actionMeeting.endMeeting({ meeting_id: record.meeting_id }).then(res => {
                        if (res.code === 200) {
                            this.showToast({ type: 'success', content: '结束成功' });
                            this.getMeetingList()
                        } else {
                            this.showToast({ type: 'error', content: res.msg })
                        }
                    })
                },
                onCancel: () => {

                },
                size: 'small'
            })
        }
    }
    pageChange = (page, pageSize) => {
        this.getMeetingList({ page })
    }
    getMeetingList = ({ page = this.state.currentListInfo.page } = { page: this.state.currentListInfo.page }) => {
        this.setState({
            listLoading: true,
        })
        actionMeeting.getMeetingList({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize,
            isMyMeeting: this.props.isMyMeeting
        }).then(res => {
            if (res.code === 200) {
                let newState = {
                    currentListInfo: {
                        list: res.data.list,
                        page,
                        count: res.data.count,
                        pageNum: Math.ceil(res.data.count / this.pageSize)
                    }
                }
                this.setState(newState)
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).finally(() => {
            this.setState({
                listLoading: false,
            })
        })
    }
    getLeftItems = () => {
        if (this.props.isMyMeeting) {
            return [
                <RLInput
                    allowClear
                    placeholder='请输入会议号'
                    value={this.state.searchInput}
                    key={'input_meetingCode'}
                    onChange={(e) => {
                        this.setState({
                            searchInput: e.target.value,
                            searchParam: {
                                ...this.state.searchParam,
                                room: e.target.value
                            }
                        })
                    }}
                />
            ]
        }
        return [
            <div className="newSelectArea" key="date">
                <RLSelect
                    options={config.meetingSearch}
                    style={{ width: 120, marginRight: 10 }}
                    placeholder='请选择'
                    value={this.state.selectOption}
                    onChange={(e) => {
                        this.setState({
                            selectOption: e,
                            searchParam: {
                                ...this.state.searchParam,
                                room: e === 'roomID' ? this.state.searchInput : '',
                                nickname: e === 'name' ? this.state.searchInput : ''
                            }
                        })
                    }}
                />
                <RLInput
                    allowClear
                    placeholder='请输入内容'
                    value={this.state.searchInput}
                    onChange={(e) => {
                        this.setState({
                            searchInput: e.target.value,
                            searchParam: {
                                ...this.state.searchParam,
                                room: this.state.selectOption === 'roomID' ? e.target.value : '',
                                nickname: this.state.selectOption === 'name' ? e.target.value : '',
                            }
                        })
                    }}
                />
            </div>
        ]
    }
    getRightItems = () => {
        return (
            [
                <RLButton
                    label='搜索'
                    type='primary'
                    key={'search'}
                    onClick={() => { this.getMeetingList({ page: 1 }) }}
                    style={{ marginRight: 20 }}
                />,
                <RLButton
                    label='重置'
                    type='default'
                    key={'reset'}
                    onClick={this.reset}
                    style={{ marginRight: 20 }}
                />
            ]
        )
    }
    rowClick = (record) => {
        this.props.changePage('detail', { meetingId: record.meeting_id })
    }
    getTableTopRight = () => {
        return (
            [
                <RLButton
                    label='刷新'
                    type='default'
                    key={'refresh'}
                    onClick={this.getMeetingList}
                    style={{ marginRight: 20 }}
                />
            ]
        )
    }
    render() {
        return (
            <div>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLFilterTool rightItems={this.getTableTopRight} />
                <RLTable
                    loading={this.state.listLoading}
                    dataSource={this.state.currentListInfo.list}
                    rowKey='meeting_id'
                    columns={this.getColumns()}
                    paginationInfo={{
                        total: this.state.currentListInfo.count,
                        pageSize: this.pageSize,
                        onChange: this.pageChange,
                        current: this.state.currentListInfo.page
                    }}
                    rowClassName='rl-table-click-row'
                />
            </div>
        )
    }
}

export default connect((store, props) => {
    return {
        ...props,
        accountType: store.storeCommon.accountType
    }
})(CurrentMeeting)