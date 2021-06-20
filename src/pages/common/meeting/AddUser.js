
/**
 * visible  控制组件显示隐藏
 * showSelectGroup   控制是否显示群组的筛选条件
 * selectType     勾选框类型   checkbox 多选   /  radio 单选
 * originArr    原数组  
 * originCanCancel  原数据是否可取消
 * returnStyle   点击添加返回的数据类型 'object'返回数据所有属性，'arr'返回id数组
 * onCancel   取消回调函数
 * onAdd     添加回调函数
 * maxNum   最大数量限制
 * mustIdent     是否必须是认证用户
 */

import BaseCmp from '@components/BaseCmp.js'
import { RLFilterTool, LargeModal, RLButton, RLInput, RLSelect, RLTable } from '@components/index.js'
import { connect } from 'react-redux';
import actionMeeting from '@actions/meetingManage/actionMeeting.js';
import actionGroupManage from '@actions/userManage/actionGroupManage.js'
import { Select } from 'antd';

const { Option } = Select;

class AddUser extends BaseCmp {
    constructor(props) {
        super(props)
        console.log('重新渲染');
        console.log(this.props.mustIdent);
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
            group: [],
            searchParam: {
                group_uuid: null,
                keyword: 'nickname',
                value: '',
                approval_type: this.props.mustIdent ? 'approval' : 'register'
            },
            user: {  // 列表信息
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
        if (this.props.showSelectGroup) {
            this.getAllGroup()
        }
        this.getAllUser()
    }
    getLeftItems = () => {
        return [
            this.props.showSelectGroup ? <Select
                className="rl-select"
                showSearch
                style={{ width: 120, marginLeft: 30, marginRight: 10 }}
                placeholder='请选择群组'
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                key={'selectGroup'}
                value={this.state.searchParam.group_uuid}
                onChange={e => {
                    this.setState({
                        searchParam: {
                            ...this.state.searchParam,
                            group_uuid: e
                        }
                    })
                }}
            >
                {this.state.group.map(ele => {
                    return <Option value={ele.uuid} key={ele.uuid} title={ele.title}>{ele.title}</Option>
                })}
            </Select> : null,
            <div className="newSelectArea" key={'input'}>
                <RLSelect
                    options={[{
                        label: '姓名',
                        value: 'nickname'
                    }, {
                        label: '手机号',
                        value: 'mobile'
                    }]}
                    style={{ width: 120, marginLeft: 30, marginRight: 10 }}
                    placeholder='请选择'
                    value={this.state.searchParam.keyword}
                    onChange={(e) => {
                        this.setState({
                            selectOption: e,
                            searchParam: {
                                ...this.state.searchParam,
                                keyword: e
                            }
                        })
                    }}
                />
                <RLInput
                    placeholder='请输入内容'
                    value={this.state.searchParam.value}
                    onChange={(e) => {
                        this.setState({
                            searchParam: {
                                ...this.state.searchParam,
                                value: e.target.value
                            }
                        })
                    }}
                />
            </div>
        ]
    }
    getRightItems = () => {
        return (
            [
                <RLButton
                    label='搜索'
                    type='primary'
                    key={'search'}
                    onClick={() => { this.getAllUser({ page: 1 }) }}
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
                ...this.state.searchParam,
                group_uuid: null,
                value: ''
            }
        })
    }
    getAllUser = ({ page = this.state.user.page } = { page: this.state.user.page }) => {
        this.setState({
            listLoading: true
        })
        actionMeeting.getUserMeeting({
            ...this.state.searchParam, page,
            pagesize: 10,
            group_uuid: this.state.searchParam.group_uuid || ''
        }).then(res => {
            if (res.code == 200) {
                let newState = {
                    user: {
                        list: res.data.list,
                        page,
                        count: res.data.count,
                        pageNum: Math.ceil(res.data.count / 10)
                    }
                }
                this.setState({
                    user: newState.user
                })
            } else {
                this.showToast({ type: 'error', content: '获取成员失败' })
            }
        }).finally(() => {
            this.setState({
                listLoading: false,
            })
        })
    }
    getAllGroup = () => {
        actionGroupManage.getGroupUserList({ type: 'group' }).then(res => {
            this.setState({
                group: res.data
            })
        })
    }
    getColumns = () => {
        let columns = [{
            title: '姓名',
            dataIndex: 'nickname',
            key: 'nickname',
            width: '10%',
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            width: '15%',
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: '15%',
        }, {
            title: '机构名称',
            dataIndex: 'company_name',
            key: 'company_name',
            width: '30%',
        }]
        return columns
    }
    pageChange = (page) => {
        this.getAllUser({ page })
    }
    addAction = () => {
        if (this.props.returnStyle === 'object') {
            this.props.onAdd(this.state.allSelectList)
        } else {
            this.props.onAdd(this.state.allSelect)
        }
        this.props.onCancel()
    }
    selectRow = (record, e) => {
        e.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click()
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
                        dataSource={this.state.user.list}
                        rowKey='id'
                        columns={this.getColumns()}
                        paginationInfo={{
                            total: this.state.user.count,
                            pageSize: 10,
                            onChange: this.pageChange,
                            current: this.state.user.page
                        }}
                        onRow={(record) => ({
                            onClick: (e) => {
                                this.selectRow(record, e);
                            }
                        })}
                        scroll={{ y: 265 }}
                        rowSelection={{
                            type: this.props.selectType,
                            selectedRowKeys: this.props.selectType === 'checkbox' ? this.state.allSelect : undefined,
                            onChange: (selectedRowKeys, selectedRows) => {
                                let i = 0;
                                let currentPage = this.state.user.list;
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
                                            return ele == record.id || (ele && ele.id == record.id)
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
})(AddUser);