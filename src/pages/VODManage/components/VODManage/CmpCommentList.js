import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea, RLSwitch } from '@components/index.js'
import actionVideo from '@actions/VODManage/actionVideoManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import config from '@/config.js';
import { DatePicker, Input } from 'antd';
import actionVODManage from '../../../../store/actions/VODManage/actionVODManage';

class CmpCommentList extends BaseCmp {
    constructor(props) {
        super(props);
        this.vodId = props.vodId;
        this.vodPage = props.vodPage;
        this.state = {
            commentListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.commentPage || 1,     // 当前第几页
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
                        { (this.state.commentListInfo.page - 1) * this.pageSize + index + 1 }
                    </div>)
                }
            },
            {
                title: '评论内容',
                dataIndex: 'content',
                key: 'content',
                width: '25%',
            },
            {
                title: '隐藏/显示',
                key: 'is_visible',
                width: '10%',
                render: (text, record,index) => {
                    return (
                        <div>
                           <RLSwitch 
                                // checked={record.is_visible === 1}
                                defaultChecked={record.is_visible === 1}
                                onChange={(e)=>{
                                    this.updateValue({
                                        course_id: this.vodId,
                                        comment_id: record.id,
                                        is_visible: e ? 1 : 0,
                                        type: 'visible'
                                    });
                                }}
                                />
                        </div>)
                }
            },
            {
                title: '评论时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '20%',
            },
            {
                title: '评论者',
                dataIndex: 'user_nickname',
                key: 'user_nickname',
                width: '10%',
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '40%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            <RLButton
                                type='link'
                                label='删除'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.delComment(record);
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                        {
                            // interfaces.USER_EDIT &&
                            // record.role_code !== 'admin' && 
                            // record.approval_status !== 3 &&
                            <RLButton
                                type='link'
                                label='查看'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('comment_edit',{
                                        vodId: this.vodId,
                                        vodPage: this.vodPage,
                                        commentId: record.id,
                                        commentPage: this.state.commentListInfo.page,
                                        commentInfo: {
                                            creator: record.user_nickname,
                                            created_at: record.created_at,
                                            content: record.content,
                                            reply_content: record.reply && record.reply[0] && record.reply[0].content
                                        }
                                    });
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                    </div>
                )
            },
        ]
        this.getCommentList(); 
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
       
    }
    updateValue(data){
        actionVODManage.editComment(data).then(res =>{
            if(res.code === 200){
                this.showToast({type:'success',content:'操作成功'});
                this.refreshCommentList();
            }else{
                this.showToast({type:'error',content:'操作失败'});
                this.refreshCommentList();
            }  
        }).catch( err=>{
            this.refreshCommentList();
        })
    }
    // 删除用户
    delComment = (record) => {
        let is_batch = !record ? true: false;
        let ids = is_batch ? this.state.selectedMemberKeys :[record.id];
        this.showModal({
            content: '确认删除后，该评论将被彻底删除，是否确认删除？',
            title: '是否删除该评论？',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                return this.commentDelConfirm(ids)
            },
            onCancel: () => { },
            size: 'big'
        })
    }
    
    commentDelConfirm = (users) => {

        return actionVODManage.commentDel(users).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' })
                this.getCommentList();
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }
    refreshCommentList({ page = this.state.commentListInfo.page } = { page: this.state.commentListInfo.page }){
        actionVODManage.getCommentList({
            course_id: this.vodId,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getCommentList({ page: page - 1 })
                } else {
                    let newState = {
                        commentListInfo: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        }
                    }
                    this.setState(newState)
                }
            }
        })
    }
    getCommentList({ page = this.state.commentListInfo.page } = { page: this.state.commentListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionVODManage.getCommentList({
            course_id: this.vodId,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getCommentList({ page: page - 1 })
                } else {
                    let newState = {
                        commentListInfo: {
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

    getRightItems = () => {
        return (
            [
                // <RLButton 
                //     label="返回"
                //     onClick={()=>{
                //         this.props.changePage('vod_list',{
                //             vodPage: this.vodPage
                //         })
                //     }}
                // />,
                <RLButton
                    label='批量删除'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.delComment();
                    }}
                    style={{ marginLeft: 20 }}
                />
            ]
        )
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedMemberKeys: selectedRowKeys,
        })
    }
    pageChange = (page, pageSize) => {
        this.getCommentList({ page })
    }

    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>点播评论</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('vod_list',{
                            vodPage: this.vodPage
                        })
                    }}
                    label='返回'
                />
            </div>
        )
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='content-user'>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems}/>
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.commentListInfo.list}
                        rowKey='id'
                        columns={this.columns}
                        rowSelection={{
                            type: 'checkbox',
                            onChange: this.onSelectChange,
                        }}
                        paginationInfo={{
                            total: this.state.commentListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.commentListInfo.page
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
})(CmpCommentList)