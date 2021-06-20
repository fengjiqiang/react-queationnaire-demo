import BaseCmp from '@components/BaseCmp.js'
import { RLFilterTool, RLButton, RLTable, RLDisplayBoard, RLSelect } from '@components/index.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import { dealTableTime } from '@/libs/utils'
import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'
import Config from '@/config.js'
import './DocumentsList.less'

class DocumentsList extends BaseCmp {
    constructor(props) {
        super(props);
        this.isLive = this.props.isLive;
        this.isMeeting = this.props.isMeeting;
        this.state = {
            searchParam: {  // 搜索列表筛选条件
                meeting_id: this.props.meeting_Id
            },
            meetingInfo: {

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
        this.getDocumentsList()
    }
    getColumns = () => {
        let columns = [
            {
                title: '文档名称',
                key: 'title',
                width: '20%',
                dataIndex: 'title'
            },
            {
                title: '创建者',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '14%'
            },
            {
                title: '修改时间',
                dataIndex: 'update_at',
                key: 'update_at',
                width: '18%',
                render: (text, record) => {
                    return <span>
                        {dealTableTime(record.start_time_at)}
                    </span>
                }
            },
            {
                title: '文档权限',
                key: 'doc_type',
                width: '20%',
                render: (text, record) => {
                    return <div>
                        <RLSelect
                            options={Config.listRight}
                            value={record.doc_type}
                            style={{
                                width: 180
                            }}
                            onChange={(e) => {
                                this.changeDocRight(record, e)
                            }}
                        />
                    </div>
                }
            }
        ]
        return columns
    }
    // 
    pageChange = (page, pageSize) => {
        this.getDocumentsList({ page })
    }
    changeDocRight = (record, type) => {
        actionMeeting.changeDocRight({
            id: record.doc_id,
            doc_type: type
        }).then(res => {
            if (res.code == 200) {
                this.getDocumentsList();
            }
        })
    }
    getDocumentsList = ({ page = this.state.pageInfo.page } = { page: this.state.pageInfo.page }) => {
        this.setState({
            listLoading: true,
        })
        actionMeeting.getDocumentsList({
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
                    },
                    meetingInfo: {
                        ...res.data.meeting
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
    getRightItems = () => {
        return (
            [
                <RLButton
                    label='导入文档'
                    type='primary'
                    key={'import_Doc'}
                    onClick={() => { console.log('正在开发😊') }}
                />
            ]
        )
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>文档列表</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.closeDocumentsList()
                    }}
                    label='返回'
                />
            </div>
        )
    }
    getTxt = () => {
        if (this.isLive) {
            return '直播'
        } else if (this.isMeeting) {
            return '会议'
        }
    }
    render() {
        return (
            <div className="floatBox documentsList">
                <WindowContainer title={this.pageTitle}>
                    <RLDisplayBoard className='meeting-info-board'>
                        <div className='meeting-title'>
                            <span>{this.state.meetingInfo.title}</span>
                        </div>
                        <div className='meeting-info'>
                            <div className='meeting-info-item'>
                                <span className='item-label'>{this.getTxt()}号：</span>
                                <span className='item-value'>{this.state.meetingInfo.room}</span>
                                <span className='meetingTime'>{this.state.meetingInfo.real_start_time_at ? dealTableTime(this.state.meetingInfo.real_start_time_at) : null}</span>
                            </div>
                        </div>
                    </RLDisplayBoard>
                    <RLFilterTool rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.listLoading}
                        dataSource={this.state.pageInfo.list}
                        rowKey='doc_id'
                        columns={this.getColumns()}
                        paginationInfo={{
                            total: this.state.pageInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.pageInfo.page
                        }}
                        rowClassName='rl-table-click-row'
                    />
                </WindowContainer>
            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(DocumentsList);