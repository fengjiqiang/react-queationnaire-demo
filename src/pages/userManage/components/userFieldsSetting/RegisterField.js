import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import { RLSwitch, RLTable } from '@components/index.js'
import actionUserFieldsSetting from '@actions/userManage/actionUserFieldsSetting.js'
import interfaces from '@/api/interfaces'


class RegisterField extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            type: 'register',   // 注册字段
            data: [],   // 列表数据
            getListLoading: true   // 获取列表loading
        }

        // table 字段
        this.columns = [
            {
                title: '序号',
                dataIndex: 'uuid',
                key: 'uuid',
                width: '10%',
                render: (text, record, index) => {
                    return <div>{index + 1}</div>
                }
            },
            {
                title: '字段',
                dataIndex: 'name',
                key: 'name',
                width: '33%'
            },
            {
                title: '最近更新时间',
                dataIndex: 'updated_at',
                key: 'updated_at',
                width: '30%'
            },
            {
                title: '必填/非必填',
                dataIndex: 'value',
                key: 'value',
                // width: '14%',
                render: (text, record) => {
                    switch (record.value) {
                        case 0 : case 1:
                            return <RLSwitch
                                defaultChecked={record.value === 1}
                                disabled={!interfaces.FIELD_SET}
                                onChange={(e) => {
                                    // 调用更新接口
                                    this.updateValue({ uuid: record.uuid, value: e ? 1 : 0, type: this.state.type })
                                }}
                            />
                        default:
                            return <div>-</div>
                    }
                }
            }
        ]
    }
    componentDidMount() {
        this.getRegisterFieldList()
    }
    // 注册字段列表
    getRegisterFieldList() {
        this.setState({
            getListLoading: true
        })
        actionUserFieldsSetting.getUserFieldsSetting({
            type: this.state.type
        }).then(res => {
            if (res.code === 200) {
                let newState = {
                    data: res.data
                }
                this.setState(newState)
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }
    // reload
    reloadList() {
        actionUserFieldsSetting.getUserFieldsSetting({
            type: this.state.type
        }).then(res => {
            if (res.code === 200) {
                let newState = {
                    data: res.data
                }
                this.setState(newState)
            }
        })
    }
    // 更新字段设置value
    updateValue({ uuid, value, type }) {
        actionUserFieldsSetting.updateUserFieldsSetting({ uuid, value, type }).then(res => {
            if (res && res.code === 200) {
                this.reloadList()
            } else {
                this.showToast(res.msg)
            }
        })
    }

    render() {
        return (
            <div className='unauthed-user-content'>
                <RLTable
                    loading={this.state.getListLoading}
                    dataSource={this.state.data}
                    rowKey='uuid'
                    columns={this.columns}
                />
            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(RegisterField)
