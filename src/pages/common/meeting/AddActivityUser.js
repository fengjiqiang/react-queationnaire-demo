import BaseCmp from '@components/BaseCmp.js'
import { RLFilterTool, LargeModal, RLButton, RLInput, RLSelect, RLTable, RLCheckbox } from '@components/index.js'
import { connect } from 'react-redux';
import actionMeeting from '@actions/meetingManage/actionMeeting.js';
import actionEvent from '@actions/marketingTool/actionEventRegistration.js';
import moment from 'moment';
import { Select } from 'antd';

const { Option } = Select;

class AddActivityUser extends BaseCmp {
    constructor(props) {
        super(props);

        this.state = {
            listLoading: false,
            title: '',
            activity: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 1,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },                                       //所有选择ID集合
            selectKeys: [],                          //所有选择列表集合
            originalUser: true,
            authUser: true,
        }
    }
    componentDidMount() {
        this.getActivityList()
    }

    getLeftItems = () => {
        return [
            <RLCheckbox 
                label='认证用户'
                checked={this.state.authUser}
                onChange={(e)=>{
                    this.setState({
                        authUser: e.target.checked
                    })
                }}
            />,
            <RLCheckbox 
                label='普通用户'
                checked={this.state.originalUser}
                onChange={(e)=>{
                    this.setState({
                        originalUser: e.target.checked
                    })
                }}
            />
        ]
    }
    getRightItems = () => {
        return (
            [
                <RLInput 
                    placeholder='请输入活动名称'
                    value={this.state.title}
                    onChange={(e)=>{
                        this.setState({
                            title: e.target.value
                        })
                    }}
                    style={{ marginRight: 20 }}
                />,
                <RLButton
                    label='搜索'
                    type='primary'
                    key={'search'}
                    onClick={this.getActivityList}
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
            title: ''
        }, ()=> {
            this.getActivityList();
        })
    }
    getActivityList = ({ page = this.state.activity.page } = { page: this.state.activity.page }) => {
        this.setState({
            listLoading: true
        })
        actionEvent.getEventList({
            title: this.state.title,
            page,
            page_size: 10
        }).then(res => {
            if (res.code === 200) {
                let newState = {
                    activity: {
                        list: res.data.list,
                        page,
                        count: res.data.count,
                        pageNum: Math.ceil(res.data.count / 10)
                    }
                }
                this.setState({
                    activity: newState.activity
                })
            }
        }).finally(() => {
            this.setState({
                listLoading: false,
            })
        })
    }

    getColumns = () => {
        let columns = [{
            title: '活动主题',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
        }, {
            title: '报名人数',
            dataIndex: 'current_num',
            key: 'current_num',
            width: '20%',
            render: (text,record)=>{
                return (
                    record.user_limit === -1 ? <div>{record.current_num}</div> :
                    <div>
                        {record.current_num}/{record.user_limit}
                    </div>
                )
            }
        }, {
            title: '活动状态',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            render: (text, record) => {
                return (
                    <div>
                        <div style={{ width: 70 }}>{record.status === 1 ? '未开始' : (record.status === 2 ? '进行中' : (record.status === 3 ? '已结束' : '-'))}</div>
                        {
                            record.status === 2 && record.user_limit === record.current_num &&
                            <div style={{ color: '#FF8921', fontSize: 14 }}>已报满</div>
                        }
                    </div>
                )
            }

        },{
            title: '创建时间',
            dataIndex: 'create_at',
            key: 'create_at',
            width: '20%',
            render: (text, record)=>{
                return <div>{moment(record.create_at * 1000).format('YYYY-MM-DD HH:mm')}</div>
            }
        },
         {
            title: '创建者',
            dataIndex: 'nickname',
            key: 'nickname',
            width: '30%',
        }]
        return columns
    }

    pageChange = (page) => {
        this.getActivityList({ page })
    }

    addAction = () => {
        let identity = 0;
        if(this.state.authUser && !this.state.originalUser){
            identity = 2;
        }else if(!this.state.authUser && this.state.originalUser){
            identity = 1;
        }
        actionEvent.getActionUser({
            aid: this.state.selectKeys[0],
            identity: identity
        }).then(res => {
            if (res.code === 200){
                this.props.onAdd(res.data);
            }else{
                this.showToast({type:'error', content: res.msg});
            }
        })
        this.props.onCancel();
    }

    render() {
        return (
            <LargeModal
                visible={this.props.visible}
                title='添加成员'
                width={1000}
                style={{ height: 580 }}
                wrapClassName='newAddUser'
                onCancel={() => {
                    this.props.onCancel()
                }}
            >
                <div>
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.listLoading}
                        dataSource={this.state.activity.list}
                        rowKey='id'
                        columns={this.getColumns()}
                        paginationInfo={{
                            total: this.state.activity.count,
                            pageSize: 10,
                            onChange: this.pageChange,
                            current: this.state.activity.page
                        }}
                        scroll={{ y: 265 }}
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: this.state.selectKeys,
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log(`selectedRowKeys`, selectedRowKeys)
                                this.setState({
                                    selectKeys: selectedRowKeys
                                })
                            }
                        }}
                        rowClassName='rl-table-click-row'
                    />
                    <div className='btn-container' style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <RLButton label='取消' type='default' height={28}
                            style={{ marginRight: 20 }}
                            onClick={() => {
                                this.props.onCancel()
                            }}
                        />
                        <RLButton
                            label='添加'
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
export default connect((store, props) => {
    return {
        ...props
    }
})(AddActivityUser);