import BaseCmp from '@components/BaseCmp.js'
import { RLDatePicker, RLFilterTool, RLButton, RLTable, RLDropdown, RLSelect, RLInput } from '@components/index.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import interfaces from '@/api/interfaces';
import { dealSearchTime, dealTableTime } from '@/libs/utils'
import config from '@/config.js'
import { connect } from 'react-redux';
import locale from 'antd/es/date-picker/locale/zh_CN';

class UpcomingMeeting extends BaseCmp {
    constructor(props) {
        super(props);
        console.log('UpcomingMeeting--props:', props)
        this.state = {
            start_date: '',
            end_date: '',
            selectOption: 'name',
            searchInput: '',
            searchParam: {  // 搜索列表筛选条件
                meeting_status: 0,
                room: '',
                start_time: '',
                end_time: '',
                nickname: '',
                order: 1,        // 按照开始时间倒叙  1正序 0倒序
            },
            upcomingListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            listLoading: true,      // 获取列表中loading
        };
    }
    componentDidMount() {
        this.props.onRef(this)
        this.getMeetingList()
    }
    getColumns = () => {
        let columns = [
            {
                title: '会议ID',
                dataIndex: 'meeting_id',
                key: 'meeting_id',
                width: '10%',
            },
            {
                title: '会议主题',
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
            },
            {
                title: '会议号',
                dataIndex: 'room',
                key: 'room',
                width: '14%',
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
                dataIndex: 'start_time_at',
                key: 'start_time_at',
                width: '18%',
                render: (text, record) => {
                    return <span>
                        {dealTableTime(record.start_time_at)}
                    </span>
                }
            },
            {
                title: '结束时间',
                dataIndex: 'end_time_at',
                key: 'end_time_at',
                width: '18%',
                render: (text, record) => {
                    return <span>
                        {dealTableTime(record.end_time_at)}
                    </span>
                }
            },
        ]
        if (this.props.isMyMeeting) {
            columns.push({
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
            columns.push({
                title: '创建者',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '8%'
            })
        }
        columns.push({
            title: <span style={{ paddingLeft: 6 }}>操作</span>,
            key: 'option',
            width: '20%',
            render: (text, record) => {
                return this.getOptionBtns(record)
            }
        })
        return columns
    }
    getOptionBtns = (record) => {
        return this.getBtnsFromList(this.getBtnList(record), record)
    }
    getBtnList = (record) => {
        let btns = []
        // status 会议状态0未开始1进行中2已开始3已结束
        // is_me  1.我创建的 0不是我创建的
        // time_status  1。预约时间到了 0时间没到
        if (this.props.isMyMeeting) {
            this.isMeRight(btns, record)
        } else {
            this.createAllRight(btns, record)
        }
        return btns
    }

    createAllRight = (btns, record) => {
        let { status, time_status } = record;
        btns.push({
            label: '参会者管理',
            type: 'member'
        })
        if (status == 1) {
            if (interfaces.MEETING_APPROVE) {
                btns.push({
                    label: '邀请',
                    type: 'invite'
                });
                if (this.props.isMyMeeting) {
                    btns.push({
                        label: '进入',
                        type: 'meeting'
                    })
                }
            } else {
                if (this.props.isMyMeeting) {
                    btns.push({
                        label: '进入',
                        type: 'meeting'
                    })
                }
            }
        } else {
            if (time_status == 1) {
                if (interfaces.MEETING_APPROVE) {
                    btns.push({
                        label: '邀请',
                        type: 'invite'
                    })
                }
                if (this.props.isMyMeeting) {
                    btns.push({
                        label: '开始',
                        type: 'start'
                    })
                }
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
                if (this.props.isMyMeeting) {
                    btns.push({
                        label: '开始',
                        type: 'start'
                    })
                }
            }
        }

        return btns
    }
    isMeRight = (btns, record) => {
        let { status, time_status, is_me } = record;
        if (is_me) {
            if (status == 1) {
                if (interfaces.MEETING_APPROVE) {
                    btns.push({
                        label: '邀请',
                        type: 'invite'
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
                            label: '邀请',
                            type: 'invite'
                        })
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
            console.log('邀请')
            this.props.listAddUser(record.meeting_id)
        } else if (type === 'cancel') {
            // 取消会议
            this.showModal({
                content: '是否取消会议',
                title: '取消会议',
                okText: '取消会议',
                cancelText: '我再想想',
                onOk: () => {
                    return actionMeeting.deleteMeeting({ meeting_ids: record.meeting_id }).then(res => {
                        if (res.code === 200) {
                            this.showToast({ type: 'success', content: '取消成功' });
                            this.getMeetingList();
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
        } else if (type === 'member') {
            this.props.changePage(
                'memberManage',
                {
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

        } else if (type === 'meeting') {
            window.open(config.pullUpLink + '?q=' + record.hash_key)
        } else if (type === 'start') {
            window.open(config.pullUpLink + '?q=' + record.hash_key)
        } else if (type === 'ending') {
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
    // 
    pageChange = (page, pageSize) => {
        this.getMeetingList({ page })
    }
    getMeetingList = ({ page = this.state.upcomingListInfo.page } = { page: this.state.upcomingListInfo.page }) => {
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
    getLeftItems = () => {
        if (this.props.isMyMeeting) {
            return [
                <RLInput
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
    getTableTopRight = () => {
        return (
            [this.props.isMyMeeting ? <RLButton
                label='创建会议'
                type='primary'
                key={'create'}
                onClick={() => {
                    this.props.changePage('createMeeting')
                }}
                style={{ marginRight: 20 }}
            /> : null,
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
    rowClick = (record) => {
        this.props.changePage('detail', { meetingId: record.meeting_id })
    }
    render() {
        return (
            <div className=''>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLFilterTool rightItems={this.getTableTopRight} />
                <RLTable
                    loading={this.state.listLoading}
                    dataSource={this.state.upcomingListInfo.list}
                    rowKey='meeting_id'
                    columns={this.getColumns()}
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
})(UpcomingMeeting);