import BaseCmp from '@components/BaseCmp.js'
import { RLFilterTool, RLButton, RLTable, RLInput } from '@components/index.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import { dealTableTime } from '@/libs/utils'
import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'

class DocumentsMeetingList extends BaseCmp {
    constructor(props) {
        super(props);
        this.isLive = this.props.isLive;
        this.isMeeting = this.props.isMeeting;
        this.state = {
            searchParam: {  // 搜索列表筛选条件
                room: ''
            },
            pageInfo: {  // 列表信息
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
        this.getMeetingDocuments()
    }
    getColumns = () => {
        let columns = [
            {
                title: `${this.getTxt()}主题`,
                key: 'title',
                width: '20%',
                render: (text, record) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
                title: `${this.getTxt()}号`,
                dataIndex: 'room',
                key: 'room',
                width: '14%'
            },
            {
                title: '开始时间',
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
                title: '文档数量',
                key: 'doc_num',
                width: '14%',
                render: (text, record) => {
                    return <span className='addItemColor' onClick={() => {
                        this.rowClick(record)
                    }}>
                        {record.doc_num}
                    </span>
                }
            }
        ]
        return columns
    }
    // 
    pageChange = (page, pageSize) => {
        this.getMeetingDocuments({ page })
    }
    getMeetingDocuments = ({ page = this.state.pageInfo.page } = { page: this.state.pageInfo.page }) => {
        this.setState({
            listLoading: true,
        })
        actionMeeting.getDocumentsMeeting({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                let newState = {
                    pageInfo: {
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
        return [
            <RLInput
                placeholder={`请输入${this.getTxt()}号`}
                value={this.state.searchParam.room}
                key={'input_meetingCode'}
                onChange={(e) => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            room: e.target.value
                        }
                    })
                }}
            />
        ]
    }
    getTxt = () => {
        if (this.isLive) {
            return '直播'
        } else if (this.isMeeting) {
            return '会议'
        }
    }
    getRightItems = () => {
        return (
            [
                <RLButton
                    label='搜索'
                    type='primary'
                    key={'search'}
                    onClick={this.getMeetingDocuments}
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
        this.props.showDetail && this.props.showDetail(true, { meeting_Id: record.meeting_id })
    }
    render() {
        return (
            <WindowContainer>
                <div className=''>
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.listLoading}
                        dataSource={this.state.pageInfo.list}
                        rowKey='meeting_id'
                        columns={this.getColumns()}
                        paginationInfo={{
                            total: this.state.pageInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.pageInfo.page
                        }}
                        rowClassName='rl-table-click-row'
                    />
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(DocumentsMeetingList);