import BaseCmp from '@components/BaseCmp.js'
import { getLoginLog } from '@actions/system/system.js'
import { RLInput, RLFilterTool, RLButton, RLTable } from '@components/index.js'
import WindowContainer from '@components/WindowContainer.js'
class LoginLog extends BaseCmp {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {  // 搜索列表筛选条件
                title: '',
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
                title: '姓名',
                dataIndex: 'nickname',
                key: 'nickname'
            },
            {
                title: '角色',
                dataIndex: 'role_name',
                key: 'role_name'
            },
            {
                title: '登录时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '24%'
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip'
            },
            {
                title: '地区',
                dataIndex: 'area',
                key: 'area',
                width: '24%'
            },
            {
                title: '浏览器',
                dataIndex: 'browser',
                key: 'browser',
                width: '10%'
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
        getLoginLog({
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
        return <RLInput
            allowClear
            placeholder='请输入姓名'
            value={this.state.searchParam.title}
            key={'input_nickname'}
            onChange={(e) => {
                this.setState({
                    searchParam: {
                        title: e.target.value
                    }
                })
            }}
        />
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
            searchParam: {
                title: ''
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
        </WindowContainer>
    }
}
export default LoginLog