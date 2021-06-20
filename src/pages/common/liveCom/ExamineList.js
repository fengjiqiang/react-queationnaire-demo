import BaseCmp from '@components/BaseCmp.js'
import { RLDatePicker, RLFilterTool, RLButton, RLTable, RLDropdown, RLSelect, RLInput } from '@components/index.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import actionSeminar from '@actions/seminar/actionSeminar.js'
import interfaces from '@/api/interfaces';
import { dealSearchTime, dealTableTime } from '@/libs/utils'
import config from '@/config.js'
import { connect } from 'react-redux';
import locale from 'antd/es/date-picker/locale/zh_CN';
import ImagesList from '@/libs/images/index.js'
class ExamineList extends BaseCmp {
    constructor(props) {
        super(props);
        let auditing = undefined;
        if (this.props.type === 'haveExamineAll') {
            auditing = 1;
        } else if (this.props.type === 'waitExamine') {
            auditing = 2;
        } else if (this.props.type === 'haveExmineMe') {
            auditing = 3;
        } else if (this.props.type === 'launchMe') {
            auditing = 4;
        }
        this.tableOption = {
            haveExamineAll: ['meeting_id', 'room', 'meeting_type', 'user_num', 'nickname', 'create_at', 'auditing', 'selfDoIt'],
            waitExamine: ['meeting_id', 'meeting_type', 'user_num', 'nickname', 'create_at', 'selfDoIt'],
            haveExmineMe: ['meeting_id', 'room', 'meeting_type', 'user_num', 'nickname', 'create_at', 'auditing', 'selfDoIt'],
            launchMe: ['meeting_id', 'room', 'meeting_type', 'user_num', 'create_at', 'auditing']
        }
        this.state = {
            start_date: '',
            end_date: '',
            searchParam: {  // 搜索列表筛选条件
                auditing: auditing,
                aud_status: '',
                nickname: '',
                start_time_c: '',
                end_time_c: ''
            },
            upcomingListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            listLoading: true,      // 获取列表中loading
            listInfo: {
                type: this.props.type   //haveExamineAll / waitExamine / haveExmineMe / launchMe
            }
        };
    }
    componentDidMount() {
        this.props.onRef(this)
        this.getMeetingList()
    }
    createRow = (rowType) => {
        switch (rowType) {
            case 'meeting_id':
                return {
                    title: '直播',
                    key: 'meeting_id',
                    width: '35%',
                    render: (record) => {
                        return <div>
                            <p className='addItemColor' onClick={() => {
                                this.rowClick(record);
                            }}>主题:<span className='addTextDecoration'>{record.title}</span></p>
                            <p><span className='addItemColor'>ID</span>:{record.meeting_id}</p>
                            <p><img src={ImagesList.menuIcon.newClock} alt='' width='20' height='20' />:{dealTableTime(record.start_time_at)}~{dealTableTime(record.end_time_at)}</p>
                        </div>
                    },
                }
            case 'room':
                return {
                    title: '直播号',
                    key: 'room',
                    width: '10%',
                    render: (record) => {
                        return <span>{record.room != 0 ? record.room : '——'}</span>
                    }
                }
            case 'meeting_type':
                return {
                    title: '直播性质',
                    key: 'meeting_type',
                    width: '10%',
                    render: (record) => {
                        return <div>
                            {record.meeting_type == 1 ? '公开' : '非公开'}
                        </div>
                    }
                }
            case 'user_num':
                return {
                    title: '直播人数',
                    dataIndex: 'user_num',
                    key: 'user_num',
                    width: '10%'
                }
            case 'nickname':
                return {
                    title: '申请人',
                    dataIndex: 'nickname',
                    key: 'nickname',
                    width: '10%'
                }
            case 'create_at':
                return {
                    title: this.props.type === 'launchMe' ? '提交时间' : '申请时间',
                    key: 'create_at',
                    width: '15%',
                    render: (record) => {
                        return <div>
                            {dealTableTime(record.create_at)}
                        </div>
                    }
                }
            case 'auditing':
                return {
                    title: '审核状态',
                    key: 'auditing',
                    width: '10%',
                    render: (record) => {
                        return <div>
                            <p>{record.auditing == 1 ? '已通过' : null}</p>
                            <p>{record.auditing == 2 ? '已拒绝' : null}</p>
                            <p>{record.auditing == 0 ? '待审核' : null}</p>
                            <p className='addItemColor' style={{ fontSize: 12 }} onClick={() => {
                                this.props.changePage('examineDetail', {
                                    meetingId: record.meeting_id
                                })
                            }}>{record.auditing == 1 || record.auditing == 2 ? '审核详情' : null}</p>
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
        // status 直播状态0未开始1进行中2已开始3已结束
        // is_me  1.我创建的 0不是我创建的
        // time_status  1。预约时间到了 0时间没到
        if (this.state.searchParam.auditing == 1) {
            btns = this.createAllRight(btns, record)
        } else if (this.state.searchParam.auditing == 2) {
            btns = this.createWaitRight(btns, record)
        } else if (this.state.searchParam.auditing == 3) {
            btns = this.createAllRight(btns, record)
        }
        return btns
    }
    createAllRight = (btns, record) => {
        let { status, time_status } = record;
        if (record.auditing == 1) {
            if (status == 1) {
                if (interfaces.MEETING_APPROVE) {
                    // btns.push({
                    //     label: '邀请',
                    //     type: 'invite'
                    // });
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
            } else if (status == 3) {
                btns.push({
                    label: '查看',
                    type: 'check'
                })
                btns.push({
                    label: '删除',
                    type: 'delete'
                })
            } else {
                if (time_status == 1) {
                    if (interfaces.MEETING_APPROVE) {
                        // btns.push({
                        //     label: '邀请',
                        //     type: 'invite'
                        // })
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
                        // btns.push({
                        //     label: '取消',
                        //     type: 'delete'
                        // })
                    }
                    // btns.push({
                    //     label: '开始',
                    //     type: 'start'
                    // })
                }
            }
        } else {
            btns.push({
                label: '查看',
                type: 'check'
            })
            btns.push({
                label: '删除',
                type: 'delete'
            })
        }

        return btns
    }
    createWaitRight = (btns, record) => {
        btns.push({
            label: '查看',
            type: 'check'
        })
        if (interfaces.MEETING_APPROVE) {
            btns.push({
                label: '审核',
                type: 'examine'
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
        if (type === 'joinmeeting') {
            actionMeeting.getMeetingHash({
                master: record.master,
                roomId: record.room,
                startTime: record.start_time,
                endTime: record.end_time,
                title: record.title,
                password: record.password.password
            }).then(res => {
                if (res.code === 200) {
                    window.open(config.pullUpLink + '?q=' + res.data)
                } else {
                    this.showToast({ type: 'error', content: '获取直播链接错误' })
                }
            })
        } else if (type === 'invite') {
            console.log('邀请')
            this.props.listAddUser(record.meeting_id)
        } else if (type === 'check') {
            console.log('查看')
            this.rowClick(record);
        } else if (type === 'cancel') {
            // 取消直播
            this.showModal({
                content: '是否取消直播',
                title: '取消直播',
                okText: '取消直播',
                cancelText: '我再想想',
                onOk: () => {
                    return actionMeeting.deleteMeeting({ meeting_ids: record.meeting_id }).then(res => {
                        if (res.code === 200) {
                            this.showToast({ type: 'success', content: '取消成功' })
                            this.getMeetingList()
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
            console.log('编辑直播')
            this.props.changePage('edit', {
                meetingId: record.meeting_id
            })
        } else if (type === 'delete') {
            // 删除会议
            this.showModal({
                title: '您是否确定删除此直播？',
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

        } else if (type === 'start') {
            console.log('开始直播');
            window.open(config.pullUpLink + '?q=' + record.hash_key)
        } else if (type === 'meeting') {
            console.log('进入直播');
            window.open(config.pullUpLink + '?q=' + record.hash_key)
        } else if (type === 'examine') {
            console.log('审核直播')
            this.props.changePage('examine', {
                meetingId: record.meeting_id,
                isExamine: true
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
        actionSeminar.examineLiveList({
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
    getLeftItems = () => {
        let status = [];
        let status_value0 = {
            label: '未审核',
            value: 0
        }
        let status_value1 = {
            label: '已通过',
            value: 1
        }
        let status_value2 = {
            label: '已拒绝',
            value: 2
        }
        if (this.state.searchParam.auditing == 1) {
            status = [status_value1, status_value2]
        } else if (this.state.searchParam.auditing == 3) {
            status = [status_value1, status_value2]
        } else if (this.state.searchParam.auditing == 4) {
            status = [status_value0, status_value1, status_value2]
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
                {status.length ? <RLSelect
                    options={status}
                    allowClear
                    style={{ width: 120, marginLeft: 30, marginRight: 10 }}
                    placeholder='请选择审核状态'
                    value={this.state.searchParam.aud_status ? this.state.searchParam.aud_status : undefined}
                    onChange={(e) => {
                        if (e === undefined) {
                            e = ''
                        }
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                aud_status: e
                            }
                        })
                    }}
                /> : null}
                {this.state.searchParam.auditing != 4 ? <RLInput
                    placeholder='请输入创建者姓名'
                    allowClear
                    value={this.state.searchParam.nickname}
                    style={{ width: 150, marginLeft: 20, marginRight: 10 }}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                nickname: e.target.value
                            }
                        })
                    }}
                /> : null}
            </div>
        ]
    }
    startDateChange = (val, dateString) => {
        let numTime = dealSearchTime(dateString, true);
        this.setState({
            start_date: val,
            searchParam: {
                ...this.state.searchParam,
                start_time_c: numTime
            }
        })
    }
    endDateChange = (val, dateString) => {
        let numTime = dealSearchTime(dateString, false);
        this.setState({
            end_date: val,
            searchParam: {
                ...this.state.searchParam,
                end_time_c: numTime
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
            searchParam: {
                ...this.state.searchParam,
                aud_status: '',
                nickname: '',
                start_time_c: '',
                end_time_c: ''
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
})(ExamineList);