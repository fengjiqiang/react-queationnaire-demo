import BaseCmp from '@components/BaseCmp.js'
import { RLFilterTool, RLButton, RLTable, RLSwitch, RLDatePicker, RLInput } from '@components/index.js'
import { unLineADList, deleteAD, showOrHide } from '@actions/system/system.js'
import interfaces from '@/api/interfaces';
import { dealSearchTime, dealTableTime } from '@/libs/utils'
import locale from 'antd/es/date-picker/locale/zh_CN';
class ADOfflineList extends BaseCmp {
    constructor(props) {
        super(props);
        this.type = this.props.type;
        this.state = {
            start_date: '',
            end_date: '',
            searchParam: {  // 搜索列表筛选条件
                type: this.props.type === 'offLine' ? 2 : 3
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
    getDataList = ({ page = this.state.currentListInfo.page } = { page: this.state.currentListInfo.page }) => {
        this.setState({
            listLoading: true,
        })
        unLineADList({
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
    getColumns = () => {
        let columns = [
            {
                title: '序号',
                key: 'id',
                width: '9%',
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '时间',
                key: 'start_at',
                render: (record) => {
                    return <div>
                        <div>上线:{record.start_at}</div>
                        <div>下线:{record.end_at}</div>
                    </div>
                }
            },
            {
                title: '图片关联',
                key: 'argue_type',
                render: (record) => {
                    if (record.argue_type == 1) {
                        return '会议'
                    } else if (record.argue_type == 2) {
                        return '直播'
                    } else if (record.argue_type == 3) {
                        return '链接地址'
                    } else if (record.argue_type == 4) {
                        return '点播'
                    }
                }
            },
            // {
            //     title: '点击次数',
            //     dataIndex: 'click_count',
            //     key: 'click_count'
            // },
            {
                title: '更新时间',
                dataIndex: 'created_at',
                key: 'created_at'
            },
            {
                title: '创建者',
                dataIndex: 'creator',
                key: 'creator'
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
                                this.props.showDetail && this.props.showDetail(record.id)
                            }}
                        />
                        {this.type === 'offLine' && interfaces.SYSTEM_AD_EDIT && <RLButton
                            type='link'
                            key={'edit'}
                            label={'编辑'}
                            onClick={(e) => {
                                this.props.editAD && this.props.editAD(record.id)
                            }}
                        />}
                        {interfaces.SYSTEM_AD_DELETE && <RLButton
                            type='link'
                            key={'delete'}
                            label={'删除'}
                            onClick={(e) => {
                                this.showModal({
                                    title: '您是否确定删除此广告？',
                                    okText: '确定',
                                    cancelText: '取消',
                                    onOk: () => {
                                        return deleteAD({ id: record.id }).then(res => {
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
                        />}
                    </div>
                }
            }
        ]
        if (this.type === 'offLine') {
            columns.splice(4, 0, {
                title: '上线/下线',
                key: 'is_show',
                render: (record) => {
                    return <RLSwitch
                        defaultChecked={record.is_show === 1}
                        checked={record.is_show === 1}
                        onClick={e => {
                            if (!interfaces.SYSTEM_AD_UNUP) {
                                this.showToast({ type: 'error', content: '您没有此权限' })
                            } else {
                                showOrHide({
                                    is_show: e ? 1 : 0,
                                    id: record.id
                                }).then(res => {
                                    this.getDataList()
                                })
                            }
                        }}
                    />
                }
            })
        }
        return columns
    }
    pageChange = (page) => {
        this.getDataList({ page })
    }

    reset = () => {
        this.setState({
            start_date: null,
            end_date: null,
            searchInput: '',
            searchParam: {
                ...this.state.searchParam,
                creator: '',
                start_time: '',
                end_time: '',
                title: ''
            }
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
                    placeholder='请输入广告标题'
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
            <div className="newInputArea" key={'creator'} style={{ marginLeft: '20px' }}>
                <RLInput
                    allowClear
                    placeholder='请输入发布人员姓名'
                    value={this.state.searchParam.creator}
                    key={'creator'}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                creator: e.target.value
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
    render() {
        return (
            <div className=''>
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
        )
    }
}
export default ADOfflineList