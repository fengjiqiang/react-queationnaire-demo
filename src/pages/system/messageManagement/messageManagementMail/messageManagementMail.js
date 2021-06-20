import BaseCmp from '@components/BaseCmp.js'
import { getMessageMail, deleteMessageMail } from '@actions/system/system.js'
import { RLInput, RLFilterTool, RLButton, RLTable, RLDatePicker, RLModal } from '@components/index.js'
import WindowContainer from '@components/WindowContainer.js'
import locale from 'antd/es/date-picker/locale/zh_CN';
import { dealSearchTime } from '@/libs/utils'

import './messageManagementMail.less'
class MessageManagementMail extends BaseCmp {
    constructor(props) {
        super(props);
        this.state = {
            start_date: '',
            end_date: '',
            showCheck: false,
            record: {},
            searchParam: {  // 搜索列表筛选条件
                title: '',
                nickname: '',
                start_time: '',
                end_time: ''
            },
            currentListInfo: {  // 列表信息
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            listLoading: true,      // 获取列表中loading
        };
    }
    componentDidMount() {
        this.getDataList()
    }
    getColumns = () => {
        let columns = [
            {
                title: '序号',
                key: 'id',
                width: '9%',
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '邮箱主题',
                dataIndex: 'title',
                key: 'title',
                width: '30%',
            },
            {
                title: '发布时间',
                dataIndex: 'created_at',
                key: 'created_at'
            },
            {
                title: '发布人员',
                dataIndex: 'nickname',
                key: 'nickname'
            },
            {
                title: '接收人员',
                dataIndex: 'receiver',
                key: 'receiver'
            },
            {
                title: '操作',
                key: 'selfDoIt',
                width: '18%',
                render: (record) => {
                    return <div style={{
                        display: 'flex'
                    }}>
                        <RLButton
                            type='link'
                            key={'check'}
                            label={'查看'}
                            onClick={(e) => {
                                this.setState({
                                    showCheck: true,
                                    record: record
                                })
                            }}
                        />
                        <RLButton
                            type='link'
                            key={'delete'}
                            label={'删除'}
                            onClick={(e) => {
                                this.showModal({
                                    title: '您是否确定删除此记录？',
                                    okText: '确定',
                                    cancelText: '取消',
                                    onOk: () => {
                                        return deleteMessageMail({ id: record.id }).then(res => {
                                            if (res.code === 200) {
                                                this.showToast({ type: 'success', content: '删除成功' });
                                                this.getDataList()
                                            } else {
                                                this.showToast({ type: 'error', content: res.msg })
                                            }
                                        })
                                    },
                                    onCancel: () => {

                                    },
                                    size: 'small'
                                })
                            }}
                        />
                    </div>
                }
            }
        ]
        return columns
    }
    pageChange = (page) => {
        this.getDataList({ page })
    }
    getDataList = ({ page = this.state.currentListInfo.page } = { page: this.state.currentListInfo.page }) => {
        this.setState({
            listLoading: true,
        })
        getMessageMail({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize
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
            <div className="newInputArea" key={'title'} style={{ marginLeft: '20px' }}>
                <RLInput
                    allowClear
                    placeholder='请输入邮箱主题'
                    value={this.state.searchParam.title}
                    key={'input_title'}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                title: e.target.value
                            }
                        })
                    }}
                />
            </div>,
            <div className="newInputArea" key={'nickname'} style={{ marginLeft: '20px' }}>
                <RLInput
                    allowClear
                    placeholder='请输入发布人员姓名'
                    value={this.state.searchParam.nickname}
                    key={'input_nickname'}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                nickname: e.target.value
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
                    onClick={() => { this.getDataList({ page: 1 }) }}
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
            searchParam: {
                title: '',
                start_time: '',
                end_time: '',
                nickname: ''
            }
        })
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
    render() {
        return <WindowContainer>
            <div>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLTable
                    loading={this.state.listLoading}
                    dataSource={this.state.currentListInfo.list}
                    rowKey='id'
                    columns={this.getColumns()}
                    paginationInfo={{
                        total: this.state.currentListInfo.count,
                        pageSize: this.pageSize,
                        onChange: this.pageChange,
                        current: this.state.currentListInfo.page
                    }}
                />
            </div>
            {this.state.showCheck && <RLModal
                title="查看邮件"
                visible={this.state.showCheck}
                onCancel={() => {
                    this.setState({
                        showCheck: false
                    })
                }}
                footer={null}
            >
                <div className="checkMailBox">
                    <div>
                        <p className="item">邮件主题:</p>
                        <p className="mailCon">{this.state.record.title}</p>
                    </div>
                    <div>
                        <p className="item">邮件内容:</p>
                        <p className="mailCon">{this.state.record.render_desc}</p>
                    </div>
                </div>
            </RLModal>}
        </WindowContainer>
    }
}
export default MessageManagementMail