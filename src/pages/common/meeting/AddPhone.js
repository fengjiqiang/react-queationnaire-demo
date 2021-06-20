
/**
 * visible  控制组件显示隐藏
 * selectType     勾选框类型   checkbox 多选   /  radio 单选
 * originArr    原数组  
 * originCanCancel  原数据是否可取消
 * returnStyle   点击添加返回的数据类型 'object'返回数据所有属性，'arr'返回id数组
 * onCancel   取消回调函数
 * onAdd     添加回调函数
 * maxNum   最大数量限制
 */

import BaseCmp from '@components/BaseCmp.js'
import { RLFilterTool, LargeModal, RLButton, RLInput, RLSelect, RLTable } from '@components/index.js'
import { connect } from 'react-redux';
import actionPhoneList from '@actions/userManage/actionPhoneList.js'
import { Select } from 'antd';
import { dealTableTime } from '@/libs/utils.js'

const { Option } = Select;

class AddPhone extends BaseCmp {
    constructor(props) {
        super(props)
        let select = [];
        let selectList = [];
        let origin = props.originArr;
        if (origin && origin.length > 0) {
            if (typeof origin[0] === 'object') {
                origin.forEach(ele => {
                    select.push(ele.id)
                    selectList.push(ele);
                })
            } else {
                origin.forEach(ele => {
                    select.push(ele.id);
                })
            }
        }

        this.state = {
            listLoading: false,
            searchParam: {
                value: ''
            },
            phoneListInfo: {  // 列表信息
                pageNum: 1,  // 总叶数
                count: 1,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            origin: this.props.originArr ? this.props.originArr : [],    //原数组
            allSelect: [...select],                                              //所有选择ID集合
            allSelectList: [...selectList],                                           //所有选择列表集合
        }
    }
    componentDidMount() {
        this.getPhoneList()
    }
    getPhoneList = ({ page } = { page: this.state.phoneListInfo.page }) => {
        this.setState({
            listLoading: true
        })
        actionPhoneList.getPhoneList({
            ...this.state.searchParam,
            page,
            page_size: 10
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
                listLoading: false
            })
        })
    }
    getLeftItems = () => {
        return [
            <RLInput
                placeholder='请输入固话'
                value={this.state.searchParam.value}
                onChange={e => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            value: e.target.value
                        }
                    })
                }}
            />
        ]
    }
    getRightItems = () => {
        return (
            [
                <RLButton
                    label='搜索'
                    type='primary'
                    key={'search'}
                    onClick={() => {
                        this.getPhoneList()
                    }}
                    style={{ marginRight: 20 }}
                />,
                <RLButton
                    label='重置'
                    type='default'
                    key={'reset'}
                    onClick={() => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                value: ''
                            }
                        })
                    }}
                    style={{ marginRight: 20 }}
                />
            ]
        )
    }
    getColumns = () => {
        let columns = [{
            title: '固话号码',
            dataIndex: 'number',
            key: 'number',
            width: '30%',
        }, {
            title: '机构名称',
            dataIndex: 'company',
            key: 'company',
            width: '40%',
        }, {
            title: '上传时间',
            dataIndex: 'create_at',
            key: 'create_at',
            width: '30%',
            render: (text, record) => {
                return <div>
                    {dealTableTime(record.create_at)}
                </div>
            }
        }]
        return columns
    }
    pageChange = (page) => {
        this.getPhoneList({ page })
    }
    addAction = () => {
        if (this.props.returnStyle === 'object') {
            this.props.onAdd(this.state.allSelectList)
        } else {
            this.props.onAdd(this.state.allSelect)
        }
        this.props.onCancel()
    }
    render() {
        const { list, count, page } = this.state.phoneListInfo
        return (
            <LargeModal
                visible={this.props.visible}
                title='添加固话'
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
                        dataSource={list}
                        rowKey='id'
                        columns={this.getColumns()}
                        paginationInfo={{
                            total: count,
                            pageSize: 10,
                            onChange: this.pageChange,
                            current: page
                        }}
                        scroll={{ y: 265 }}
                        rowSelection={{
                            type: this.props.selectType,
                            selectedRowKeys: this.props.selectType === 'checkbox' ? this.state.allSelect : undefined,
                            onChange: (selectedRowKeys, selectedRows) => {
                                let i = 0;
                                let currentPage = this.state.phoneListInfo.list;
                                let allSelect = [...this.state.allSelect];
                                let allSelectList = [...this.state.allSelectList];
                                for (i; i < currentPage.length; i++) {
                                    let isInSelect = selectedRowKeys.findIndex(ele => { return ele == currentPage[i].id })
                                    let isInOrigin = allSelect.findIndex(ele => { return ele == currentPage[i].id })
                                    let isInList = allSelectList.findIndex(ele => { return ele.id == currentPage[i].id })
                                    if (isInSelect == -1 && isInOrigin !== -1) {
                                        allSelect.splice(isInOrigin, 1);
                                        if (this.props.returnStyle === 'object' && isInList !== -1) {
                                            allSelectList.splice(isInList, 1);
                                        }
                                    } else if (isInSelect !== -1 && isInOrigin == -1) {
                                        allSelect.push(selectedRowKeys[isInSelect]);
                                        if (this.props.returnStyle === 'object' && isInList == -1) {
                                            allSelectList.push(currentPage[i]);
                                        }
                                    }
                                    if (this.props.maxNum) {
                                        let num = Number(this.props.maxNum);
                                        if (selectedRowKeys.length > num) {
                                            this.showToast({ type: 'error', content: '已达最大人数限制' })
                                            return
                                        }
                                        if (allSelect.length > num) {
                                            this.showToast({ type: 'error', content: '已达最大人数限制' })
                                            return
                                        }
                                    }
                                    this.setState({
                                        allSelect: [...allSelect],
                                        allSelectList: [...allSelectList]
                                    })
                                }
                            },
                            getCheckboxProps: (record) => {
                                if (!this.props.originCanCancel) {
                                    if (this.state.origin.length > 0) {
                                        let index = this.state.origin.findIndex(ele => {
                                            return ele === record.id || (ele && ele.id === record.id)
                                        })
                                        if (index !== -1) {
                                            return {
                                                disabled: true
                                            }
                                        }
                                    }
                                }
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
})(AddPhone)
