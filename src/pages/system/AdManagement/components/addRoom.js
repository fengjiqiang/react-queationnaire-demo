import BaseCmp from '@components/BaseCmp.js'
import { LargeModal, RLButton, RLTable } from '@components/index.js'
import { getRoomList } from '@actions/system/system.js'
import { dealTableTime } from '../../../../libs/utils'

class AddRoom extends BaseCmp {
    constructor(props) {
        super(props)
        this.typeName = this.props.type == 1 ? '直播' : '会议'
        this.state = {
            listLoading: false,
            searchParam: {
                type: this.props.type
            },
            user: {  // 列表信息
                pageNum: 1,  // 总页数
                count: 1,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            selectData: null
        }
    }
    componentDidMount() {
        this.getAllUser()
    }
    getAllUser = ({ page = this.state.user.page } = { page: this.state.user.page }) => {
        this.setState({
            listLoading: true
        })
        getRoomList({
            ...this.state.searchParam,
            page,
            pagesize: 10
        }).then(res => {
            if (res.code == 200) {
                let newState = {
                    user: {
                        list: res.data.list,
                        page,
                        count: res.data.count,
                        pageNum: Math.ceil(res.data.count / 10)
                    }
                }
                this.setState({
                    user: newState.user
                })
            } else {
                this.showToast({ type: 'error', content: `获取${this.typeName}列表失败` })
            }
        }).finally(() => {
            this.setState({
                listLoading: false,
            })
        })
    }
    getColumns = () => {
        let columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
        }, {
            title: `${this.typeName}主题`,
            dataIndex: 'title',
            key: 'title',
            width: '15%',
        }, {
            title: `${this.typeName}直播号`,
            dataIndex: 'room',
            key: 'room',
            width: '15%',
        }, {
            title: '开始时间',
            key: 'start_time_at',
            width: '30%',
            render: (record) => {
                return <p>
                    {dealTableTime(record.start_time_at)}
                </p>
            }
        }, {
            title: '结束时间',
            key: 'end_time_at',
            width: '30%',
            render: (record) => {
                return <p>
                    {dealTableTime(record.end_time_at)}
                </p>
            }
        }]
        return columns
    }
    pageChange = (page) => {
        this.getAllUser({ page })
    }
    addAction = () => {
        if (!this.state.selectData) {
            this.showToast(`请选择${this.typeName}`)
        } else {
            this.props.onAdd(this.state.selectData)
            this.props.onCancel()
        }

    }
    render() {
        return (
            <LargeModal
                visible={this.props.visible}
                title={`选择可推广的${this.typeName}`}
                width={1000}
                style={{ height: 540 }}
                wrapClassName='newAddUser'
                onCancel={() => {
                    this.props.onCancel()
                }}
            >
                <div>
                    <RLTable
                        loading={this.state.listLoading}
                        dataSource={this.state.user.list}
                        rowKey='id'
                        columns={this.getColumns()}
                        paginationInfo={{
                            total: this.state.user.count,
                            pageSize: 10,
                            onChange: this.pageChange,
                            current: this.state.user.page
                        }}
                        scroll={{ y: 265 }}
                        rowSelection={{
                            type: 'radio',
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({
                                    selectData: selectedRows[0]
                                })
                            }
                        }}
                        rowClassName='rl-table-click-row'
                    />
                    <div className='btn-container' style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        position: 'absolute',
                        bottom: 30
                    }}>
                        <RLButton label='取消' type='default' height={28}
                            style={{ marginRight: 20 }}
                            onClick={() => {
                                this.props.onCancel()
                            }}
                        />
                        <RLButton
                            label='确定'
                            type='primary'
                            height={28}
                            onClick={this.addAction}
                        />
                    </div>
                </div>
            </LargeModal>
        )
    }
}
export default AddRoom