import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea } from '@components/index.js'
import actionVideo from '@actions/VODManage/actionVideoManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import config from '@/config.js';
import { DatePicker, Input } from 'antd';
import actionVODManage from '../../../../store/actions/VODManage/actionVODManage';
import CmpVideoPlayer from '../videoManage/CmpVideoPlayer.js';

class CmpChapterList extends BaseCmp {
    constructor(props) {
        super(props);
        //对于点播id
        this.vodId = props.vodId;
        this.vodPage = props.vodPage;

        this.state = {
            chapterListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.chapterPage || 1,     // 当前第几页
            },
            getListLoading: true,       // 获取列表loading
            showVideoPlayerModal: false,
            videoLink: ''
        }
        this.columns = [
            {
                title: '序号',
                width: '10%',
                dataIndex: 'title',
                key: 'title',
                render: (text, record, index) => {
                    return (<div>
                        { (this.state.chapterListInfo.page - 1) * this.pageSize + index + 1 }
                    </div>)
                }
            },
            {
                title: '章节标题',
                dataIndex: 'title',
                key: 'title',
                width: '10%',
                render: (text,record)=>{
                    return <div>{record.title || record.en_title}</div>
                }
            },
            {
                title: '播放量',
                dataIndex: 'play_num',
                key: 'play_num',
                width: '10%',
            },
            {
                title: '点赞数',
                dataIndex: 'favour_num',
                key: 'favour_num',
                width: '12%',
            },
            {
                title: '收藏数',
                dataIndex: 'collect_num',
                key: 'collect_num',
                width: '12%',
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                width: '12%',
            },
            {
                title: '创建者',
                dataIndex: 'creator',
                key: 'creator',
                width: '12%',
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '16%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            <RLButton
                                type='link'
                                label='删除'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.delChapter(record);
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
                                label='编辑'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('chapter_edit',{
                                        vodId: this.vodId,
                                        chapterId: record.id,
                                        vodPage: this.vodPage,
                                        chapterPage: this.state.chapterListInfo.page,
                                        chapterInfo: {
                                            title: record.title,
                                            en_title: record.en_title,
                                            chapters_thumb: record.chapters_thumb,
                                            video_id: record.video_id,
                                            video_title: record.video_title,
                                            video_url: record.video_url
                                        }
                                    })
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                        {
                            // interfaces.USER_DELETE &&
                            // record.role_code !== 'admin' &&
                            (
                                <RLButton
                                    type='link' 
                                    label='用户记录'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.props.changePage('user_list',{
                                            vodId: this.vodId,
                                            chapterId: record.id,
                                            vodPage: this.vodPage,
                                            chapterPage: this.state.chapterListInfo.page
                                        })
                                    }}
                                    style={{color:'#8F1D22'}}
                                />
                            )
                        }
                        {
                            // interfaces.USER_DELETE &&
                            // record.role_code !== 'admin' &&
                            (
                                <RLButton
                                    type='link' 
                                    label='预览'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.setState({ 
                                            videoLink: record.video_url,
                                            showVideoPlayerModal: true
                                        })
                                    }}
                                    style={{color:'#8F1D22'}}
                                />
                            )
                        }
                    </div>
                )
            },
        ]
        this.getChapterList(); 
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
       
    }
    // 删除用户
    delChapter = (record) => {
        this.showModal({
            content: '确认删除后，该章节将被彻底删除，是否确认删除？',
            title: '是否删除该章节？',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                return this.chapterDelConfirm(record.id)
            },
            onCancel: () => { },
            size: 'big'
        })
    }
    
    chapterDelConfirm = (users) => {

        return actionVODManage.chapterDel(users).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' })
                this.getChapterList();
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }

    getChapterList({ page = this.state.chapterListInfo.page } = { page: this.state.chapterListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionVODManage.getChapterList({
            course_id: this.vodId,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getChapterList({ page: page - 1 })
                } else {
                    let newState = {
                        chapterListInfo: {
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

    getRightItems = ()=>{
        return [      
            <RLButton 
                label="创建章节"
                type="primary"
                onClick={()=>{
                    this.props.changePage('chapter_edit',{
                        vodId: this.vodId,
                        chapterPage: this.state.chapterListInfo.page,
                        vodPage: this.vodPage,
                    })
                }}
                style={{marginLeft: 20}}
                />
        ]
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedMemberKeys: selectedRowKeys,
        })
    }
    pageChange = (page, pageSize) => {
        this.getChapterList({ page })
    }
    rowClick = (e, user) => {
        this.props.changePage('detail', {
            userId: user.id,
            corp_id: user.corp_id
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>点播章节</span>
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
                        dataSource={this.state.chapterListInfo.list}
                        rowKey='uuid'
                        columns={this.columns}
                        // rowSelection={{
                        //     type: 'checkbox',
                        //     onChange: this.onSelectChange,
                        //     getCheckboxProps: (record) => ({
                        //         disabled: false
                        //     })
                        // }}
                        paginationInfo={{
                            total: this.state.chapterListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.chapterListInfo.page
                        }}
                        rowClassName='rl-table-click-row'
                    />                     
                </div>
               { this.state.showVideoPlayerModal && <CmpVideoPlayer 
                    visible={this.state.showVideoPlayerModal}
                    src={this.state.videoLink} 
                    close={()=>{
                        this.setState({
                            showVideoPlayerModal: false
                        })
                    }} 
                />}
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        // roleList: store.roleManage.roleList,
    }
})(CmpChapterList)