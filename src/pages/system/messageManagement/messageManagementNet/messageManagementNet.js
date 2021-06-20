import BaseCmp from '@components/BaseCmp.js'
import { getMessageNet, deleteMessageNet, publishMessageNet } from '@actions/system/system.js'
import {
    RLInput,
    RLFilterTool,
    RLButton,
    RLTable,
    RLDatePicker,
    RLModal,
    RLForm,
    RLFormItem,
    RLTextarea
} from '@components/index.js'
import WindowContainer from '@components/WindowContainer.js'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { dealSearchTime, strTrim, dealTableTime, getStrLength } from '@/libs/utils'
import interfaces from '@/api/interfaces';

import './messageManagementNet.less'
class MessageManagementNet extends BaseCmp {
    constructor(props) {
        super(props);
        this.state = {
            start_date: '',
            end_date: '',
            showCheck: false,
            publish: false,
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
            formInput: {
                title: '',
                content: ''
            },
            click: false,
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
                dataIndex: 'id',
                key: 'id',
                width: '8%',
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '消息标题',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '发布时间',
                key: 'created_at',
                render: (record) => {
                    return <p>
                        {record.created_at}
                    </p>
                }
            },
            {
                title: '发布人员',
                dataIndex: 'nickname',
                key: 'nickname'
            },
            {
                title: '操作',
                key: 'selfDoIt',
                width: '20%',
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
                        {interfaces.SYSTEM_MESSAGENET_DELETE && <RLButton
                            type='link'
                            key={'delete'}
                            label={'删除'}
                            onClick={(e) => {
                                this.showModal({
                                    title: '您是否确定删除此记录？',
                                    okText: '确定',
                                    cancelText: '取消',
                                    onOk: () => {
                                        return deleteMessageNet({ id: record.id }).then(res => {
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
        return columns
    }
    pageChange = (page) => {
        this.getDataList({ page })
    }
    getDataList = ({ page = this.state.currentListInfo.page } = { page: this.state.currentListInfo.page }) => {
        this.setState({
            listLoading: true,
        })
        getMessageNet({
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
                    placeholder='请输入消息标题'
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
    getTableTopRight = () => {
        if (interfaces.SYSTEM_MESSAGENET_PUBLISH) {
            return <RLButton
                label='发布消息'
                type='primary'
                key='create'
                style={{ marginRight: 20 }}
                onClick={() => {
                    this.setState({
                        publish: true
                    })
                }}
            />
        } else {
            return undefined
        }
    }
    createLabel = (labelName, need, style = {}) => {
        return <div>
            {need ? <span style={{ color: '#ff4d4f' }}>*</span> : null}
            <span style={{ ...style }}>{labelName}</span>
        </div>
    }
    appointConfirm = (value) => {
        this.setState({
            click: true
        })
        publishMessageNet({
            ...value
        }).then(res => {
            console.log(res);
            if (res.code != 200) {
                this.showToast({ type: 'error', content: res.msg })
            } else {
                this.showToast({ type: 'success', content: '发布成功' })
                this.setState({
                    publish: false
                })
            }
        }).finally(() => {
            this.setState({
                click: false
            })
        })
    }
    render() {
        return <WindowContainer>
            <div>
                <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                <RLFilterTool rightItems={this.getTableTopRight} />
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
                title="查看消息"
                visible={this.state.showCheck}
                onCancel={() => {
                    this.setState({
                        showCheck: false
                    })
                }}
                footer={null}
            >
                <div className="checkNetBox">
                    <div>
                        <p className="item">消息标题:</p>
                        <p className="mailCon">{this.state.record.title}</p>
                    </div>
                    <div>
                        <p className="item">消息内容:</p>
                        <p className="mailCon">{this.state.record.content}</p>
                    </div>
                </div>
            </RLModal>}
            {this.state.publish && <RLModal
                title="发布消息"
                visible={this.state.publish}
                onCancel={() => {
                    this.setState({
                        publish: false
                    })
                }}
                footer={null}
            >
                <div className="publishBox">
                    <RLForm
                        labelCol={{ style: { width: 100 } }}
                        labelAlign='left'
                        wrapperCol={
                            { span: 20 }
                        }
                        onFinish={this.appointConfirm}
                        className='appointment-form'
                        ref={this.appointForm}
                        validateTrigger='onBlur'
                    >
                        <RLFormItem label={this.createLabel('消息标题', true)} colon={true}
                            name='title'
                            rules={[{
                                validator: (rule, val) => {
                                    if (!strTrim(val)) {
                                        return Promise.reject('消息标题不可为空')
                                    } else {
                                        if (getStrLength(strTrim(val)) > 100) {
                                            return Promise.reject('消息标题最多50个字')
                                        }
                                    }
                                    return Promise.resolve()
                                }
                            }]}
                        >
                            <RLInput
                                placeholder='请输入内容，不超过50个汉字'
                                style={{ width: 300 }}
                                value={this.state.formInput.title}
                                onInput={(e) => {
                                    let text = strTrim(e.target.value)
                                    e.target.value = text
                                    this.setState({
                                        formInput: {
                                            ...this.state.formInput,
                                            title: text
                                        }
                                    })
                                }}
                            />
                        </RLFormItem>
                        <RLFormItem label={this.createLabel('消息内容', true)} colon={true} style={{
                            border: 'none'
                        }}
                            name='content'
                            rules={[{
                                validator: (rule, val) => {
                                    if (!strTrim(val)) {
                                        return Promise.reject('消息内容不可为空')
                                    } else {
                                        if (strTrim(val).length > 2000) {
                                            return Promise.reject('消息内容最多1000')
                                        }
                                    }
                                    return Promise.resolve()
                                }
                            }]}
                        >
                            <RLTextarea
                                placeholder='请输入消息内容,不超过1000个汉字'
                                showCount
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                maxLength={2000}
                                bordered={false}
                                style={{ width: 300, height: '100%' }}
                                value={this.state.formInput.content}
                                onInput={(e) => {
                                    let text = strTrim(e.target.value);
                                    e.target.value = text
                                    this.setState({
                                        formInput: {
                                            ...this.state.formInput,
                                            content: text
                                        }
                                    })
                                }}
                            />
                        </RLFormItem>
                        <div style={{ width: '100%', display: 'flex', flex: 1, justifyContent: 'center' }}>
                            <RLButton
                                type="default"
                                label='取消'
                                width={80}
                                onClick={() => {
                                    this.setState({
                                        publish: false
                                    })
                                }}
                            />
                            <RLButton type="primary"
                                htmlType="submit"
                                label={'发布'}
                                style={{ marginLeft: 40 }}
                                width={80}
                                loading={this.state.submitLoading}
                                disabled={this.state.click}
                            />
                        </div>
                    </RLForm>
                </div>
            </RLModal>}
        </WindowContainer>
    }
}
export default MessageManagementNet