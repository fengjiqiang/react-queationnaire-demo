import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea, RLCheckbox } from '@components/index.js'
import actionPhoneList from '@actions/userManage/actionPhoneList.js'
import actionRoleManage from '@actions/userManage/actionRoleManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils, { downloadFile } from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import config from '@/config.js';
import { DatePicker, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';

class CmpPhoneList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            phoneListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: props.phonePage || 1,     // 当前第几页
            },
        }

        this.columns = [
            {
                title: '固话号码',
                dataIndex: 'number',
                key: 'number',
                width: '25%',
            },
          
            {
                title: '机构名称',
                dataIndex: 'company',
                key: 'company',
                width: '25%'
            },
            {
                title: '上传时间',
                dataIndex: 'create_at',
                key: 'create_at',
                width: '25%',
                render: (text,record)=>{
                    return <div>{moment(Number.parseInt(record.create_at)*1000).format('YYYY-MM-DD')}</div>
                }
            },
            {
                title: <span style={{ paddingLeft: 6 }}>操作</span>,
                key: 'option',
                width: '25%',
                render: (text, record) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            interfaces.PHONE_DELETE &&
                            (
                                <RLButton
                                    type='link' label='删除'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.delPhone(record)
                                    }}
                                    style={{color:'#8F1D22'}}
                                />
                            )
                        }
                    </div>
                )
            },
        ];

        this.getPhoneList();
    }
    componentWillMount() {

    }
    componentWillUnmount() {
        
    }
   
    // 删除固话
    delPhone = (record) => {
        this.showModal({
            content: '删除后信息不可恢复。',
            title: '是否删除该固话号码',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                return this.phoneDelConfirm(record);
            },
            onCancel: () => { },
            size: 'big'
        })
    }
    
    phoneDelConfirm = (record) => {

        return actionPhoneList.phoneDel({id: record.id}).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' });
                this.getPhoneList();
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }

    getPhoneList({ page } = { page: this.state.phoneListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionPhoneList.getPhoneList({
            page,
            page_size: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getPhoneList({ page: page - 1 })
                } else {
                    let newState = {
                        phoneListInfo: {
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
                label="批量导入"
                type="primary"
                onClick={()=>{
                    this.props.changePage('import',{
                        phonePage: this.state.phoneListInfo.page
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
        this.getPhoneList({ page })
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='content-user'>
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.phoneListInfo.list}
                        rowKey='uuid'
                        columns={this.columns}
                        paginationInfo={{
                            selectedRowKeys: this.state.selectedMemberKeys,
                            total: this.state.phoneListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.phoneListInfo.page
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
})(CmpPhoneList)