import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea, RLSwitch } from '@components/index.js'
import interfaces from '@/api/interfaces'
import actionQAManage from '@actions/marketingTool/actionQAManage.js';
import moment from 'moment';
class CmpQuestionList extends BaseCmp {
    constructor(props) {
        super(props);
        this.vodId = props.vodId;
        this.vodPage = props.vodPage;
        this.state = {
            type: 0,
            questionListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.questionPage || 1,     // 当前第几页
            },
            getListLoading: true,       // 获取列表loading
        }
        this.columns = [
            {
                title: '序号',
                width: '10%',
                key: 'title',
                render: (text, record, index)=>{
                    return (<div>
                        { (this.state.questionListInfo.page - 1) * this.pageSize + index + 1 }
                    </div>)
                }
            },
            {
                title: '问题类型',
                dataIndex: 'class_name',
                key: 'class_name',
                width: '15%',
            },
            {
                title: '问题描述',
                dataIndex: 'describe',
                key: 'describe',
                width: '25%',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.describe}>
                    <div className='line-clamp-noColor'>
                        {record.describe}
                    </div>
                </RLTooltip>
            },
            {
                title: '提问时间',
                dataIndex: 'create_at',
                key: 'create_at',
                width: '15%',
                render: (text, record) => {
                    return <div>{moment((record.create_at)*1000).format('YYYY-MM-DD HH:mm')}</div>
                }
            },
            {
                title: '提问者',
                dataIndex: 'creator',
                key: 'creator',
                width: '10%',
                render: (text, record) => {
                    return <div>
                        {record.creator && record.creator.nickname}
                        {record.is_hide !== 0 && record.creator.approval_status === 3 && <span>(认证用户)</span>}
                    </div>
                }
            },
            {
                title: '显示/隐藏',
                dataIndex: 'is_hide',
                key: 'is_hide',
                width: '10%',
                render: (text, record, index) => {
                    return <div>
                        <RLSwitch 
                            checked = {record.is_show === 1}
                            defaultChecked = {record.is_show === 1}
                            onChange = {(e) => {
                                actionQAManage.toggleShow({
                                    id: record.id,
                                    is_show: e ? 1 : 0
                                }).then(res =>{
                                    if(res.code === 200){
                                        this.getQuestionList();
                                    }
                                })
                            }}
                        />
                    </div>
                }
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '40%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            record.is_reply === 1 &&
                            <RLButton
                                type='link'
                                label='查看'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.props.changePage('edit',{
                                        questionId: record.id,
                                        questionPage: this.questionPage,
                                        is_reply: false
                                    });
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                        {
                            record.is_reply === 0 &&
                            <RLButton
                                type='link'
                                label='回复'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('edit',{
                                        questionId: record.id,
                                        questionPage: this.vodPage,
                                        is_reply: true
                                    });
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                    </div>
                )
            },
        ]
        this.getQuestionList(); 
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
       
    }

    updateValue(data){
        actionQAManage.editComment(data).then(res =>{
            if(res.code === 200){
                this.showToast({type:'success',content:'操作成功'});
                // this.refreshCommentList();
            }else{
                this.showToast({type:'error',content:'操作失败'});
                // this.refreshCommentList();
            }  
        }).catch( err=>{
            // this.refreshCommentList();
        })
    }
    
    getQuestionList({ page } = { page: this.state.questionListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionQAManage.getQuestionList({
            type: this.state.type,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getQuestionList({ page: page - 1 })
                } else {
                    let newState = {
                        questionListInfo: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        }
                    }
                    this.setState(newState)
                }
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }
    getLeftItems = () => {
        return ([
            <RLSelect 
                value={this.state.type}
                defaultValue={this.state.value}
                options={[
                    {label:'全部问题类型', value: 0},
                    {label:'业务咨询', value: 1},
                    {label:'使用咨询', value: 2},
                    {label:'其他', value: 3}
                ]}
                style={{ width: 150 }}
                onChange={(e)=>{
                    this.setState({
                        type: e
                    })
                }}
            />,
            <RLButton 
                label="搜索"
                type="primary"
                onClick={()=>{
                    this.getQuestionList();
                }}
                style={{marginLeft:20}}
            />
        ])
    }
    getRightItems = () => {
        return (
            [       
                <RLButton
                    label='刷新'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.getQuestionList();
                    }}
                    style={{ marginLeft: 20 }}
                />
            ]
        )
    }

    pageChange = (page, pageSize) => {
        this.getQuestionList({ page })
    }

    render() {
        return (
            <WindowContainer title= ''>
                <div className='content-user'>
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems}/>
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.questionListInfo.list}
                        rowKey='id'
                        columns={this.columns}
                        paginationInfo={{
                            total: this.state.questionListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.questionListInfo.page
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
        ...props,
        // roleList: store.roleManage.roleList,
    }
})(CmpQuestionList)