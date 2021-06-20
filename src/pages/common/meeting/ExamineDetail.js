import BaseCmp from '@components/BaseCmp.js'
import { RLModal, RLTable } from '@components/index.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js';
import actionSeminar from '@actions/seminar/actionSeminar.js';
import { dealTableTime } from '@/libs/utils'
class ExamineDetail extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                pageNum: 1,  // 总叶数
                count: 1,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            }
        }
    }
    componentDidMount() {
        this.getDetail()
    }
    getRowColumns() {
        let columns = [{
            title: '审核员',
            dataIndex: 'nickname',
            key: 'nickname',
            width: '20%',
        },
        {
            title: '审核时间',
            key: 'create_at',
            width: '30%',
            render: (record) => {
                return <div>
                    {dealTableTime(record.create_at)}
                </div>
            },
        },
        {
            title: '审核结果',
            key: 'auditing',
            width: '20%',
            render(record) {
                if (record.auditing == 1) {
                    return <div>
                        已通过
                    </div>
                } else if (record.auditing == 2) {
                    return <div>
                        已拒绝
                    </div>
                } else if (record.auditing == 3) {
                    return <div>
                        撤销
                    </div>
                } else {
                    return <div>
                        审批中
                    </div>
                }
            },
        },
        {
            title: '审核详情',
            dataIndex: 'aud_desc',
            key: 'aud_desc',
            width: '30%',
        }]
        return columns
    }
    getDetail() {
        if (this.props.isLive) {
            actionSeminar.getExamineResult({ meeting_id: this.props.meetingId }).then(res => {
                if (res.code == 200) {
                    let newState = {
                        user: {
                            list: [{ ...res.data }],
                            page: 1,
                            count: 1,
                            pageNum: Math.ceil(1 / 10)
                        }
                    }
                    this.setState({
                        user: newState.user
                    })
                } else {
                    this.showToast({ type: 'error', content: '获取会议详情失败' })
                }
            })
        } else {
            actionMeeting.getExmineDetail({ meeting_id: this.props.meetingId }).then(res => {
                if (res.code == 200) {
                    let newState = {
                        user: {
                            list: [{ ...res.data }],
                            page: 1,
                            count: 1,
                            pageNum: Math.ceil(1 / 10)
                        }
                    }
                    this.setState({
                        user: newState.user
                    })
                } else {
                    this.showToast({ type: 'error', content: '获取会议详情失败' })
                }
            })
        }

    }
    render() {
        return <RLModal
            visible={true}
            title='审核详情'
            footer={null}
            onCancel={() => {
                this.props.closeExamineDetail && this.props.closeExamineDetail()
            }}
        >
            <RLTable
                columns={this.getRowColumns()}
                dataSource={this.state.user.list}
                rowKey='auditing_uid'
            />
        </RLModal>
    }
}
export default ExamineDetail