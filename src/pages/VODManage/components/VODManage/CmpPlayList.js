import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea } from '@components/index.js'
import actionVideo from '@actions/VODManage/actionVideoManage.js'
import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import config from '@/config.js';
import { DatePicker, Input } from 'antd';
import actionVODManage from '../../../../store/actions/VODManage/actionVODManage';

class CmpPlayList extends BaseCmp {
    constructor(props) {
        super(props)
        this.chapterId = props.chapterId;
        this.chapterPage = props.chapterPage;
        this.vodId = props.vodId;
        this.vodPage = props.vodPage;
        
        this.state = {
            playListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            getListLoading: true,       // 获取列表loading
        }
        this.columns = [
            {
                title: '序号',
                width: '10%',
                key: 'id',
                render: (text, record, index) => {
                   return <div>{ (this.state.playListInfo.page - 1) * 20 + index + 1 }</div>
                }
            },
            {
                title: '用户姓名',
                dataIndex: 'viewer',
                key: 'viewer',
                width: '10%',
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
                width: '10%',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: '10%',
            },
            {
                title: '机构名称',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '12%',
            },
        ]
        this.getPlayList(); 
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
       
    }
    
    getPlayList({ page = this.state.playListInfo.page } = { page: this.state.playListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionVODManage.getPlayList({
            chapter_id: this.chapterId,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getPlayList({ page: page - 1 })
                } else {
                    let newState = {
                        playListInfo: {
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
        return [
            <RLButton 
                label="返回"
                onClick={()=>{
                    this.props.changePage('chapter_list',{
                        vodId: this.vodId,
                        vodPage: this.vodPage,
                        chapterPage: this.chapterPage,
                    })
                }}
                />
        ]
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedMemberKeys: selectedRowKeys,
        })
    }

    pageChange = (page, pageSize) => {
        this.getPlayList({ page })
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='content-user'>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems}/>
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.playListInfo.list}
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
                            total: this.state.playListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.playListInfo.page
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
    }
})(CmpPlayList)