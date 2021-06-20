import BaseCmp from '@components/BaseCmp.js'
import { RLInput, RLFilterTool, RLButton, RLTable, RLDatePicker, RLSelect } from '@components/index.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import locale from 'antd/es/date-picker/locale/zh_CN';
import { connect } from 'react-redux'
import config from '@/config.js'
import interfaces from '@/api/interfaces.js'
import { dealSearchTime, dealTableTime } from '@/libs/utils'
import { downloadFile } from '@/libs/utils.js';
class HistoryMeeting extends BaseCmp {
    constructor(props) {
        super(props);
        let select = [];
        let selectList = [];
        this.state = {
            start_date: '',
            end_date: '',
            selectOption: 'name',
            searchInput: '',
            searchParam: {
                meeting_status: 2,
                room: '',
                start_time: '',
                end_time: '',
                nickname: '',
                order: 0,        // 按照开始时间倒叙  1正序 0倒序
            },
            historyListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            meetingSelected: [],
            listLoading: true,      // 获取列表中loading
            allSelect: [...select],    //所有选择meeting_id集合
            allSelectList: [...selectList],   //所有选择列表集合
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
                dataIndex: 'id',
                key: 'id',
                width: '10%',
                render: (text, record) => {
                    return <span>{record.meeting_id}</span>
                }
            },
            {
                title: '会议主题',
                dataIndex: 'title',
                key: 'title',
                width: '19%',
                render: (text, record) => {
                    return <span className='line-clamp-noColor' onClick={() => {
                        this.rowClick(record)
                    }}>
                        {record.title}
                    </span>

                }
            },
            {
                title: '会议号',
                key: 'room',
                width: '11%',
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
                width: '15%',
                render: (record) => {
                    return <div>{dealTableTime(record.real_start_time_at)}</div>
                }
            },
            {
                title: '创建者',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '15%'
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: '',
                width: '20%',
                render: (text, record) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {(() => {
                                if (Number(record.user_num) <= 0) {
                                    return
                                }
                                if (!interfaces.MEETING_PARTICIPANT_EXPORT) {
                                    return
                                }
                                return (<RLButton
                                    type='link'
                                    label='导出参会成员'
                                    onClick={() => {
                                        this.fileExport(record.meeting_id)
                                    }}
                                />)
                            })()}
                        </div>
                    )
                }
            }
        ]

        if (this.props.isMyMeeting) {
            columns.splice(4, 0, {
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
        return columns
    }
    meetingListExport = (ids) => {
        actionMeeting.exportMeetingList(ids).then(res => {
            if (res.code === 200) {
                downloadFile(res.data, '会议列表.xlsx')
            } else {
                this.showToast({ type: 'error', content: '导出文件出错' })
            }
        }).catch(err => {
            this.showToast({ type: 'error', content: err.msg })
        })
    }
    fileExport = (meetingId) => {
        actionMeeting.exportMemberList(meetingId).then(res => {
            if (res.code === 200) {
                downloadFile(res.data, '参会人员列表.xlsx')
            } else {
                this.showToast({ type: 'error', content: '导出文件出错' })
            }
        }).catch(err => {
            this.showToast({ type: 'error', content: err.msg })
        })
    }
    pageChange = (page, pageSize) => {
        this.getMeetingList({ page })
    }
    getMeetingList = ({ page = this.state.historyListInfo.page } = { page: this.state.historyListInfo.page }) => {
        this.setState({
            listLoading: true,
            // meetingSelected: []
        })
        actionMeeting.getMeetingList({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize,
            isMyMeeting: this.props.isMyMeeting
        }).then(res => {
            if (res.code === 200) {
                let newState = {
                    historyListInfo: {
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
        return (
            [
                <div className="newTimeArea" key={'date'}>
                    <p>从</p>
                    <RLDatePicker
                        allowClear
                        onChange={this.startDateChange}
                        disabledDate={this.startDisabledDate}
                        locale={locale}
                        inputReadOnly={true}
                        format="YYYY-MM-DD"
                        placeholder='请选择日期'
                        value={this.state.start_date}
                    />
                    <p>至</p>
                    <RLDatePicker
                        allowClear
                        onChange={this.endDateChange}
                        disabledDate={this.startDisabledDate}
                        locale={locale}
                        inputReadOnly={true}
                        format="YYYY-MM-DD"
                        placeholder='请选择日期'
                        value={this.state.end_date}
                    />
                </div>,
                <div className="newSelectArea" key={'input'}>
                    <RLSelect
                        options={config.meetingSearch}
                        style={{ width: 120, marginLeft: 30, marginRight: 10 }}
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
        )
    }
    startDateChange = (val, dateString) => {
        let numTime = dealSearchTime(dateString, true);
        this.setState({
            start_date: val,
            searchParam: {
                ...this.state.searchParam,
                start_time: numTime
            }
        })
    }
    endDateChange = (val, dateString) => {
        let numTime = dealSearchTime(dateString, false);
        this.setState({
            end_date: val,
            searchParam: {
                ...this.state.searchParam,
                end_time: numTime
            }
        })
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
        if (this.props.pageType === 'mine') {
            this.props.changePage('detail', { meetingId: record.id, pageType: this.props.pageType, tabKey: 'upcoming' })
        } else if (this.props.pageType === 'company') {
            this.props.changePage('detail', { meetingId: record.id, pageType: this.props.pageType, tabKey: 'upcoming' })
        }
    }
    getTableTopRight = () => {
        return (
            [
                (interfaces.MEETING_PARTICIPANT_EXPORT ? <RLButton
                    label='批量导出'
                    type='primary'
                    key={'export'}
                    disabled={this.state.allSelect.length === 0 ? true : false}
                    onClick={() => {
                        actionMeeting.exportMeetingList(this.state.allSelect.join(',')).then(res => {
                            if (res.code === 200) {
                                downloadFile(res.data, '会议列表.xlsx')
                                this.setState({
                                    allSelect: [],
                                    allSelectList: []
                                })
                            } else {
                                this.showToast({ type: 'error', content: '导出文件出错' })
                            }
                        }).catch(err => {
                            this.showToast({ type: 'error', content: err.msg })
                        })
                    }}
                    style={{ marginRight: 20 }}
                /> : null),
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
    reset = () => {
        this.setState({
            start_date: null,
            end_date: null,
            searchInput: '',
            searchParam: {
                ...this.state.searchParam,
                start_time: '',
                end_time: '',
                room: '',
                nickName: ''
            }
        })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let i = 0;
        let currentPage = this.state.historyListInfo.list;
        let allSelect = [...this.state.allSelect];
        let allSelectList = [...this.state.allSelectList];
        for (i; i < currentPage.length; i++) {
            let isInSelect = selectedRowKeys.findIndex(ele => { return ele == currentPage[i].meeting_id })
            let isInOrigin = allSelect.findIndex(ele => { return ele == currentPage[i].meeting_id })
            let isInList = allSelectList.findIndex(ele => { return ele.meeting_id == currentPage[i].meeting_id })
            if (isInSelect === -1 && isInOrigin !== -1) {
                allSelect.splice(isInOrigin, 1);
                if (isInList !== -1) {
                    allSelectList.splice(isInList, 1);
                }
            } else if (isInSelect !== -1 && isInOrigin === -1) {
                allSelect.push(selectedRowKeys[isInSelect]);
                if (isInList === -1) {
                    allSelectList.push(currentPage[i]);
                }
            }
            this.setState({
                allSelect: [...allSelect],
                allSelectList: [...allSelectList]
            })
        }
    }
    render() {
        return (
            <div>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLFilterTool rightItems={this.getTableTopRight} />
                <RLTable
                    loading={this.state.listLoading}
                    dataSource={this.state.historyListInfo.list}
                    rowKey='meeting_id'
                    columns={this.getColumns()}
                    rowSelection={{
                        type: "checkbox",
                        selectedRowKeys: this.state.allSelect,
                        onChange: this.onSelectChange
                        // onChange: (selectedRowKeys, selectedRows) => {
                        //     this.setState({
                        //         meetingSelected: selectedRowKeys
                        //     })
                        // }
                    }}
                    paginationInfo={{
                        total: this.state.historyListInfo.count,
                        pageSize: this.pageSize,
                        onChange: this.pageChange,
                        current: this.state.historyListInfo.page
                    }}
                    rowClassName='rl-table-click-row'
                />
            </div>
        )
    }
}

// export default HistoryMeeting;
export default connect((store, props) => {
    return {
        ...props
    }
})(HistoryMeeting)