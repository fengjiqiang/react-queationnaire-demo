import BaseCmp from '@components/BaseCmp.js'
import { RLDatePicker, RLFilterTool, RLButton, RLTable, RLDropdown, RLSelect, RLInput } from '@components/index.js'
import actionSeminar from '@actions/seminar/actionSeminar.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import interfaces from '@/api/interfaces';
import { dealSearchTime, dealTableTime } from '@/libs/utils'
import config from '@/config.js'
import { connect } from 'react-redux';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { downloadFile } from '@/libs/utils.js';
class AllliveList extends BaseCmp {
    constructor(props) {
        super(props);
        let meeting_status = 3;
        if (this.props.type === 'upcomingLive') {
            meeting_status = 0
        } else if (this.props.type === 'endLive') {
            meeting_status = 2
        }
        if (this.props.isMyLive) {
            this.tableOption = {
                upcomingLive: ['meeting_id', 'title', 'room', 'start_time_at', 'end_time_at', 'nickname', 'doc_num', 'selfDoIt'],
                endLive: ['meeting_id', 'titleNoColor', 'room', 'real_start_time_at', 'nickname', 'doc_num', 'selfDoIt']
            }
        } else {
            this.tableOption = {
                upcomingLive: ['meeting_id', 'title', 'room', 'start_time_at', 'end_time_at', 'nickname', 'selfDoIt'],
                endLive: ['meeting_id', 'titleNoColor', 'room', 'real_start_time_at', 'nickname', 'selfDoIt']
            }
        }

        let select = [];
        let selectList = [];

        this.state = {
            meetingSelected: [],
            start_date: '',
            end_date: '',
            searchInput: '',
            selectOption: 'name',
            searchParam: {  // 搜索列表筛选条件
                meeting_status: meeting_status,
                nickname: '',
                room: '',
                start_time: '',
                end_time: '',
                order: this.props.type === 'upcomingLive' ? 1 : 0,//1 正序    0 倒序
            },
            upcomingListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            listLoading: true,      // 获取列表中loading
            listInfo: {
                type: this.props.type   //upcomingLive / endLive
            },
            allSelect: [...select],    //所有选择meeting_id集合
            allSelectList: [...selectList],   //所有选择列表集合
        };
    }
    componentDidMount() {
        this.props.onRef(this)
        this.getMeetingList();
    }
    createRow = (rowType) => {
        switch (rowType) {
            case 'meeting_id':
                return {
                    title: 'ID',
                    dataIndex: 'meeting_id',
                    key: 'meeting_id',
                    width: '10%'
                }
            case 'title':
                return {
                    title: '直播主题',
                    dataIndex: 'title',
                    key: 'title',
                    width: '20%',
                    render: (text, record) => {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {Number(record.status) === 1 && (
                                    <div style={{
                                        borderRadius: 3,
                                        background: '#8F1D22',
                                        width: 46, height: 20,
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        color: '#fff', fontSize: 12, lineHeight: '17px',
                                        marginRight: 3
                                    }}>
                                        <span>进行中</span>
                                    </div>
                                )}
                                <span className='line-clamp-2' onClick={() => {
                                    this.rowClick(record)
                                }}>
                                    {record.title}
                                </span>
                            </div>
                        )
                    }
                }
            case 'titleNoColor':
                return {
                    title: '直播主题',
                    dataIndex: 'title',
                    key: 'title',
                    width: '20%',
                    render: (text, record) => {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {Number(record.status) === 1 && (
                                    <div style={{
                                        borderRadius: 3,
                                        background: '#8F1D22',
                                        width: 46, height: 20,
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        color: '#fff', fontSize: 12, lineHeight: '17px',
                                        marginRight: 3
                                    }}>
                                        <span>进行中</span>
                                    </div>
                                )}
                                <span className='line-clamp-noColor'>
                                    {record.title}
                                </span>
                            </div>
                        )
                    }
                }
            case 'room':
                return {
                    title: '直播号',
                    dataIndex: 'room',
                    key: 'room',
                    width: '10%'
                }
            case 'nickname':
                return {
                    title: '创建者',
                    dataIndex: 'nickname',
                    key: 'nickname',
                    width: '10%'
                }
            case 'real_start_time_at':
                return {
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
                        return <div>
                            {dealTableTime(record.real_start_time_at)}
                        </div>
                    }
                }
            case 'start_time_at':
                return {
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
                    key: 'start_time_at',
                    width: '15%',
                    render: (record) => {
                        return <div>
                            {dealTableTime(record.start_time_at)}
                        </div>
                    }
                }
            case 'end_time_at':
                return {
                    title: '结束时间',
                    key: 'end_time_at',
                    width: '15%',
                    render: (record) => {
                        return <div>
                            {dealTableTime(record.end_time_at)}
                        </div>
                    }
                }
            case 'doc_num':
                return {
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
                }
            case 'selfDoIt':
                return {
                    title: '操作',
                    key: 'selfDoIt',
                    width: '18%',
                    render: (record) => {
                        return this.getOptionBtns(record)
                    }
                }
            default:
                return undefined
        }
    }
    getColumns = () => {
        let rowArr = [];
        this.tableOption[this.state.listInfo.type].forEach(ele => {
            rowArr.push(this.createRow(ele));
        })
        return rowArr
    }
    getOptionBtns = (record) => {
        return this.getBtnsFromList(this.getBtnList(record), record)
    }
    getBtnList = (record) => {
        let btns = []
        // status 会议状态0未开始1进行中2已开始3已结束
        // is_me  1.我创建的 0不是我创建的
        // time_status  1。预约时间到了 0时间没到
        if (this.props.modelName === 'allLive') {
            if (this.state.listInfo.type === 'upcomingLive') {
                btns = this.createAllRight(btns, record)
            } else if (this.state.listInfo.type === 'endLive') {
                btns = this.creatEndRight(btns, record)
            }
        } else if (this.props.modelName === 'myLive') {
            if (this.state.listInfo.type === 'upcomingLive') {
                btns = this.createMyAllRight(btns, record)
            } else if (this.state.listInfo.type === 'endLive') {
                btns = this.creatEndRight(btns, record)
            }
        }
        return btns
    }
    creatEndRight = (btns, record) => {
        if (Number(record.user_num) <= 0) {
            return btns
        }
        if (interfaces.LIVEBROADCAST_PARTICIPANT_EXPORT) {
            btns.push({
                label: '导出参会成员',
                type: 'exportMembers'
            })
        }
        return btns
    }
    createAllRight = (btns, record) => {
        let { status, time_status } = record;
        if (status == 1) {
            if (interfaces.MEETING_ENDMEETING) {
                btns.push({
                    label: '结束',
                    type: 'ending'
                })
            }
            if (interfaces.MEETING_APPROVE) {
                btns.push({
                    label: '邀请成员',
                    type: 'invite'
                });
                btns.push({
                    label: '设置嘉宾',
                    type: 'inviteUser'
                });
                // btns.push({
                //     label: '进入',
                //     type: 'meeting'
                // })
            } else {
                // btns.push({
                //     label: '进入',
                //     type: 'meeting'
                // })
            }
        } else {
            if (time_status == 1) {
                if (interfaces.MEETING_APPROVE) {
                    btns.push({
                        label: '邀请成员',
                        type: 'invite'
                    })
                    btns.push({
                        label: '设置嘉宾',
                        type: 'inviteUser'
                    });
                }
                // btns.push({
                //     label: '开始',
                //     type: 'start'
                // })
            } else {
                if (interfaces.MEETING_APPROVE) {
                    btns.push({
                        label: '编辑',
                        type: 'edit'
                    });
                    btns.push({
                        label: '取消',
                        type: 'delete'
                    })
                }
                // btns.push({
                //     label: '开始',
                //     type: 'start'
                // })
            }
        }

        return btns
    }
    createMyAllRight = (btns, record) => {
        let { status, time_status, is_me } = record;
        if (is_me) {
            if (status == 1) {
                if (interfaces.MEETING_ENDMEETING) {
                    btns.push({
                        label: '结束',
                        type: 'ending'
                    })
                }
                if (interfaces.MEETING_APPROVE) {
                    btns.push({
                        label: '邀请成员',
                        type: 'invite'
                    });
                    btns.push({
                        label: '设置嘉宾',
                        type: 'inviteUser'
                    });
                    btns.push({
                        label: '进入',
                        type: 'meeting'
                    })
                } else {
                    btns.push({
                        label: '进入',
                        type: 'meeting'
                    })
                }
            } else {
                if (time_status == 1) {
                    if (interfaces.MEETING_APPROVE) {
                        btns.push({
                            label: '邀请成员',
                            type: 'invite'
                        })
                        btns.push({
                            label: '设置嘉宾',
                            type: 'inviteUser'
                        });
                    }
                    btns.push({
                        label: '开始',
                        type: 'start'
                    })
                } else {
                    if (interfaces.MEETING_APPROVE) {
                        btns.push({
                            label: '编辑',
                            type: 'edit'
                        });
                        btns.push({
                            label: '取消',
                            type: 'delete'
                        })
                    }
                    btns.push({
                        label: '开始',
                        type: 'start'
                    })
                }
            }
        } else {
            btns.push({
                label: '进入',
                type: 'meeting'
            })
        }

        return btns
    }
    // 获取列表右侧按钮组件
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

    /**
     * 权限操作
     */
    optionAction = (type, record) => {
        if (type === 'invite') {
            console.log('邀请成员')
            this.props.listAddUser(record.meeting_id)
        } else if (type === 'inviteUser') {
            console.log('邀请嘉宾');
            this.props.listAddNewUser && this.props.listAddNewUser(record.meeting_id)
        }
        else if (type === 'check') {
            console.log('查看')
            this.rowClick(record);
        } else if (type === 'cancel') {
            // 取消会议
            this.showModal({
                content: '是否取消直播',
                title: '取消会议',
                okText: '取消会议',
                cancelText: '我再想想',
                onOk: () => {
                    return actionMeeting.deleteMeeting({ meeting_ids: record.meeting_id }).then(res => {
                        if (res.code === 200) {
                            this.showToast({ type: 'success', content: '取消成功' })
                        } else {
                            this.showToast({ type: 'error', content: res.msg })
                        }
                    })
                },
                onCancel: () => {
                },
                size: 'big'
            })

        } else if (type === 'edit') {
            console.log('编辑会议')
            this.props.changePage('edit', {
                meetingId: record.meeting_id
            })
        } else if (type === 'delete') {
            // 删除会议
            this.showModal({
                title: '您是否确定删除此会议？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    return actionMeeting.deleteMeeting({ meeting_ids: record.meeting_id }).then(res => {
                        if (res.code === 200) {
                            this.showToast({ type: 'success', content: '删除成功' });
                            this.getMeetingList();
                        } else {
                            this.showToast({ type: 'error', content: res.msg })
                        }
                    })
                },
                onCancel: () => {

                },
                size: 'small'
            })

        } else if (type === 'start') {
            console.log('开始会议');
            window.open(config.pullUpLink + '?q=' + record.hash_key)
        } else if (type === 'meeting') {
            console.log('进入会议');
            window.open(config.pullUpLink + '?q=' + record.hash_key)
        } else if (type === 'examine') {
            console.log('审核会议')
            this.props.changePage('examine', {
                meetingId: record.meeting_id,
                isExamine: true
            })
        } else if (type === 'ending') {
            console.log('结束会议')
            this.showModal({
                title: '您是否确定结束此会议？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    return actionMeeting.endMeeting({ meeting_id: record.meeting_id }).then(res => {
                        if (res.code === 200) {
                            this.showToast({ type: 'success', content: '结束成功' })
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
        } else if (type === 'exportMembers') {
            console.log('导出参会者列表');
            // actionMeeting.exportMemberList(record.meeting_id)
            actionMeeting.exportMemberList(record.meeting_id).then(res => {
                if (res.code === 200) {
                    downloadFile(res.data, '参会者列表.xlsx')
                } else {
                    this.showToast({ type: 'error', content: '导出文件出错' })
                }
            }).catch(err => {
                this.showToast({ type: 'error', content: err.msg })
            })
        }
    }
    //
    pageChange = (page, pageSize) => {
        this.getMeetingList({ page })
    }
    getMeetingList = ({ page = this.state.upcomingListInfo.page } = { page: this.state.upcomingListInfo.page }) => {
        this.setState({
            listLoading: true,
            // meetingSelected: []
        })
        if (this.props.isMyLive) {
            actionSeminar.myLiveList({
                ...this.state.searchParam,
                page,
                pagesize: this.pageSize,
            }).then(res => {
                if (res.code === 200) {
                    let newState = {
                        upcomingListInfo: {
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
        } else {
            actionSeminar.getAllLiveList({
                ...this.state.searchParam,
                page,
                pagesize: this.pageSize,
            }).then(res => {
                if (res.code === 200) {
                    let newState = {
                        upcomingListInfo: {
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
    }
    getLeftItems = () => {
        if (this.props.modelName === 'myLive') {
            if (this.state.listInfo.type === 'endLive') {
                return [
                    <RLInput
                        allowClear
                        placeholder='请输入直播号'
                        value={this.state.searchInput}
                        key={'meeting_Id'}
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
        }
        return [
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
                    options={config.liveSearch}
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
    getTableTopRight = () => {
        return (
            [
                (this.props.modelName === 'myLive' && this.state.listInfo.type === 'upcomingLive' ? <RLButton
                    label='创建直播'
                    type='primary'
                    key='create'
                    style={{ marginRight: 20 }}
                    onClick={() => {
                        this.props.changePage('createMeeting')
                    }}
                /> : null),
                (this.props.type === 'endLive' && interfaces.LIVEBROADCAST_PARTICIPANT_EXPORT ? <RLButton
                    label='批量导出'
                    type='primary'
                    key="exportList"
                    disabled={this.state.allSelect.length ? false : true}
                    onClick={() => {
                        actionMeeting.exportMeetingList(this.state.allSelect.join(',')).then(res => {
                            if (res.code === 200) {
                                downloadFile(res.data, '直播列表.xlsx')
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
                nickname: '',
                start_time: '',
                end_time: '',
                room: ''
            }
        })
    }
    rowClick = (record) => {
        this.props.changePage('detail', { meetingId: record.meeting_id })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let i = 0;
        let currentPage = this.state.upcomingListInfo.list;
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
        let rowSelection = undefined
        if (this.state.listInfo.type === 'endLive') {
            rowSelection = {
                type: "checkbox",
                selectedRowKeys: this.state.allSelect,
                onChange: this.onSelectChange
                // onChange: (selectedRowKeys, selectedRows) => {
                //     this.setState({
                //         meetingSelected: selectedRowKeys
                //     })
                // }
            }
        }
        return (
            <div className=''>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLFilterTool rightItems={this.getTableTopRight} />
                <RLTable
                    loading={this.state.listLoading}
                    dataSource={this.state.upcomingListInfo.list}
                    rowKey='meeting_id'
                    columns={this.getColumns()}
                    rowSelection={rowSelection}
                    paginationInfo={{
                        total: this.state.upcomingListInfo.count,
                        pageSize: this.pageSize,
                        onChange: this.pageChange,
                        current: this.state.upcomingListInfo.page
                    }}
                    rowClassName='rl-table-click-row'
                />
            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(AllliveList);