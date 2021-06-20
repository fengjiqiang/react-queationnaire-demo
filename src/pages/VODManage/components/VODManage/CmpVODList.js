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

class CmpVODList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            searchParam : {  // 筛选用户列表项
                title: '',
                creator: '',
                start_time: '',
                end_time: ''
            },
            vodListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.vodPage || 1,     // 当前第几页
            },
            getListLoading: true,       // 获取列表loading

            start_date: null,
            end_date: null
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'title',
                key: 'title',
                width: '5%',
                render: (text, record, index) => {
                    return (<div>
                        { (this.state.vodListInfo.page - 1) * this.pageSize + index + 1 }
                    </div>)
                }
            },
            {
                title: '点播标题',
                dataIndex: 'title',
                key: 'title',
                width: '10%',
                render: (text, record )=>{
                    return <div>{record.title || record.en_title}</div>
                }
            },
            {
                title: '点播ID',
                dataIndex: 'id',
                key: 'id',
                width: '10%'
            },
            {
                title: '音/视频数量',
                dataIndex: 'video_num',
                key: 'video_num',
                width: '10%',
            },
            {
                title: '标签',
                dataIndex: 'role_name',
                key: 'role_name',
                width: '20%',
                render: (text, record,index) => {
                    return (
                        <div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{width:120, textAlign:'right',marginRight:5}}>上架/下架</div>
                                <RLSwitch 
                                    checked={record.is_show === 1}
                                    defaultChecked={record.is_show === 1}
                                    onChange={(e)=>{
                                        //如果没有关联章节，不准上架
                                        if(e && record.video_num <= 0){
                                            this.showToast({type:'error',content:'检测到该点播下无章节，请先上传章节！'});
                                            return;
                                        } 

                                        actionVODManage.editVODAttr({
                                            course_id: record.id,
                                            is_show: e ? 1 : 0
                                        }).then(res =>{
                                            if(res.code === 200){
                                                record.is_show = e ? 1 : 0;
                                                this.forceUpdate();
                                            }else{
                                                this.showToast({type: 'error', content:'操作失败'});
                                            }
                                        }).catch(e =>{
                                            this.showToast({type: 'error', content:'操作失败'});
                                        })
                                    }}/>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:5}}>
                                <div style={{width:120, textAlign:'right',marginRight:5}}>评论区开启/关闭</div>
                                <RLSwitch 
                                    checked={record.is_comment === 1}
                                    defaultChecked={record.is_comment === 1}
                                    onChange={(e)=>{

                                        actionVODManage.editVODAttr({
                                            course_id: record.id,
                                            is_comment: e ? 1 : 0
                                        }).then(res =>{
                                            if(res.code === 200){
                                                record.is_comment = e ? 1: 0;
                                                this.forceUpdate();
                                            }else{
                                                this.showToast({type: 'error', content:'操作失败'});
                                            }
                                        }).catch(e =>{
                                            this.showToast({type: 'error', content:'操作失败'});
                                        });
                                    }}/>
                            </div>
                        </div>)
                }
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
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap:'wrap' }}>
                        {
                            interfaces.DEMAND_DELETE &&
                            <RLButton
                                type='link'
                                label='删除'
                                onClick={(e) => {
                                    this.delVOD(record);
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                        {
                            interfaces.DEMAND_EDIT &&
                            <RLButton
                                type='link'
                                label='编辑'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    this.props.changePage('vod_edit',{
                                        vodId: record.id,
                                        vodPage: this.state.vodListInfo.page
                                    })
                                }}
                                style={{color:'#8F1D22'}}
                            />
                        }
                        {
                            interfaces.DEMAND_CHAPTER_LIST &&
                            (
                                <RLButton
                                    type='link' 
                                    label='章节管理'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.props.changePage('chapter_list', {
                                            vodId: record.id,
                                            vodPage: this.state.vodListInfo.page
                                        })
                                    }}
                                    style={{color:'#8F1D22'}}
                                />
                            )
                        }
                        {
                            interfaces.DEMAND_COMMENT_LIST &&
                            (
                                <RLButton
                                    type='link' 
                                    label='评论管理'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.props.changePage('comment_list', {
                                            vodId: record.id,
                                            vodPage: this.state.vodListInfo.page
                                        })
                                    }}
                                    style={{color:'#8F1D22'}}
                                />
                            )
                        }
                        {
                            interfaces.DEMAND_DOC_LIST &&
                            (
                                <RLButton
                                    type='link' 
                                    label='资料管理'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.props.changePage('res_list', {
                                            vodId: record.id,
                                            vodPage: this.state.vodListInfo.page
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
        this.getVODList(); 
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
       
    }
    // 删除用户
    delVOD = (record) => {
        this.showModal({
            content: '确认删除后，该点播将被彻底删除，是否确认删除？',
            title: '是否删除该点播？',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                return this.VODDelConfirm(record.id)
            },
            onCancel: () => { },
            size: 'big'
        })
    }
    
    VODDelConfirm = (id) => {

        return actionVODManage.VODDel(id).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' })
                this.getVODList();
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }

    getVODList({ page = this.state.vodListInfo.page } = { page: this.state.vodListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionVODManage.getVODList({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getVODList({ page: page - 1 })
                } else {
                    let newState = {
                        vodListInfo: {
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

    refreshVODList({ page = this.state.vodListInfo.page } = { page: this.state.vodListInfo.page }){
        actionVODManage.getVODList({
            ...this.state.searchParam,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.refreshVODList({ page: page - 1 })
                } else {
                    let newState = {
                        vodListInfo: {
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

    getLeftItems = () => {
        return (
            [
                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <span style={{marginRight:5}}>从</span>
                    <RLDatePicker placeholder="请选择日期" 
                        allowClear 
                        ref = {c => this.startDateInput = c}
                        picker="date" 
                        style={{width:130, marginRight:5}}
                        format = "YYYY-MM-DD"
                        value={this.state.start_time}
                        onChange={ (val, dateString)=> {
                            this.setState({
                                start_date: val,
                                searchParam: {
                                    ...this.state.searchParam,
                                    start_time: dateString
                                }
                            })
                        }}/>
                    <span style={{marginRight:5}}>至</span>
                    <RLDatePicker placeholder="请选择日期" 
                        allowClear 
                        ref = {c => this.endDateInput = c}
                        picker="date" 
                        style={{width:130, marginRight:20}}
                        format = "YYYY-MM-DD"
                        value={this.state.end_time}
                        onChange={(val, dateString)=>{
                            this.setState({
                                end_date: val,
                                searchParam: {
                                    ...this.state.searchParam,
                                    end_time: dateString
                                }
                            })
                        }}/>
                </div>,
                <RLInput
                    ref={ c => this.valueInput = c }
                    placeholder='请输入创建者名称'
                    allowClear 
                    key='keyword'
                    style={{ width: 180, marginRight: 20 }}
                    value={this.state.searchParam.creator}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                creator: e.target.value
                            }
                        })
                    }}
                />,
                <RLInput
                    ref={ c => this.valueInput = c }
                    placeholder='请输入点播标题'
                    allowClear 
                    key='keyword'
                    style={{ width: 150, marginRight: 20 }}
                    value={this.state.searchParam.title}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                title: e.target.value
                            }
                        })
                    }}
                />
            ]
        )
    }
    getRightItems = ()=>{
        return [
            <RLButton label='搜索'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.getVODList();
                    }}
                />,

                <RLButton label='重置'
                    key='add'
                    onClick={() => {
                        this.setState({
                            start_time: null,
                            end_time: null,
                            searchParam : {
                                title: '',
                                creator: '',
                                start_time: '',
                                end_time: ''
                            }
                        }, () => {
                            this.getVODList();
                        });
                    }}
                    style={{ marginLeft: 20}}/>,
        ]
    }

    getRightSecondItems = () => {
        return (
            [
                interfaces.DEMAND_ADD && <RLButton
                    label='创建点播'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.props.changePage('vod_edit',{
                            vodPage: this.state.vodListInfo.page
                        })
                    }}
                    style={{ marginLeft: 20 }}
                />
            ]
        )
    }
    updateValue(data){
        actionVODManage.editVODAttr(data).then(res =>{
            if(res.code === 200){
                this.refreshVODList();
            }else{
                this.refreshVODList();
                this.showToast({type: 'error', content:'操作失败'});
            }
        }).catch(e =>{
            this.refreshVODList();
            this.showToast({type: 'error', content:'操作失败'});
        })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedMemberKeys: selectedRowKeys,
        })
    }

    pageChange = (page, pageSize) => {
        this.getVODList({ page })
    }

    rowClick = (e, user) => {
        this.props.changePage('detail', {
            userId: user.id,
            corp_id: user.corp_id
        })
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='content-user'>
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems}/>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightSecondItems}/>
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.vodListInfo.list}
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
                            total: this.state.vodListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.vodListInfo.page
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
        roleList: store.roleManage.roleList,
    }
})(CmpVODList)