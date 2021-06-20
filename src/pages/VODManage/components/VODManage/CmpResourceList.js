import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea, RLSwitch } from '@components/index.js'
import actionVideo from '@actions/VODManage/actionVideoManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import eventBus from '@/libs/EventBus.js'
import actionVODManage from '../../../../store/actions/VODManage/actionVODManage';

import { Upload } from 'antd';
class CmpResourceList extends BaseCmp {
    constructor(props) {
        super(props);
        this.vodId = props.vodId;
        this.vodPage = props.vodPage;
        this.state = {
            resourceListInfo: {
                pageNum: 1,  // 总叶数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            getListLoading: true,       // 获取列表loading

            showResImportModal: false,
            //修改资料
            showResEditModal: false,
            resInfo: {},

            uploadFile: null,

        }

        this.columns = [
            {
                title: '序号',
                width: '10%',
                key: 'title',
                render: (text, record, index) => {
                    return (<div>
                        { (this.state.resourceListInfo.page - 1) * this.pageSize + index + 1}
                    </div>)
                }
            },
            {
                title: '资料名称',
                dataIndex: 'title',
                key: 'title',
                width: '10%',
            },
            {
                title: '是否可下载',
                dataIndex: 'is_down',
                key: 'is_down',
                width: '10%',
                render: (text, record, index) => {
                    return (
                        <div>
                            <RLSwitch defaultChecked={record.is_can_down === 1}
                                onChange={(e) => {
                                    this.updateValue({
                                        course_id: this.vodId,
                                        doc_id: record.id,
                                        id: record.id,
                                        is_down: e ? 1 : 0,
                                    });
                                }}
                            />
                        </div>)
                }
            },
            {
                title: '下载次数',
                dataIndex: 'down_num',
                key: 'down_num',
                width: '12%',
            },
            {
                title: '上传时间',
                dataIndex: 'created_at',
                key: 'created_at',
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
                                    this.delResource(record)
                                }}
                                style={{ color: '#8F1D22' }}
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
                                    this.setState({
                                        resInfo: this.state.resourceListInfo.list.find(item => item.id === record.id),
                                        showResEditModal: true
                                    })
                                }}
                                style={{ color: '#8F1D22' }}
                            />
                        }
                    </div>
                )
            },
        ]
        this.getResourceList();
    }
    componentDidMount() {
        eventBus.addListener('vod_res_update', () => {
            this.getResourceList();
        })
    }
    componentWillUnmount() {
        eventBus.removeListener('vod_res_update');
    }
    // 删除用户
    delResource = (record) => {
        this.showModal({
            content: '确认删除后，该资料将被彻底删除，是否确认删除？',
            title: '是否删除该资料？',
            okText: '删除',
            cancelText: '取消',
            onOk: () => {
                return this.resourceDelConfirm({ course_id: this.vodId, doc_id: record.doc_id })
            },
            onCancel: () => { },
            size: 'big'
        })
    }

    resourceDelConfirm = (data) => {

        return actionVODManage.resourceDel(data).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '删除成功' })
                this.getResourceList();
            } else {
                this.showToast({ type: 'error', content: '删除失败' })
            }
        })
    }

    getResourceList({ page = this.state.resourceListInfo.page } = { page: this.state.resourceListInfo.page }) {
        this.setState({
            getListLoading: true
        })
        actionVODManage.getResourceList({
            course_id: this.vodId,
            page,
            pagesize: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getResourceList({ page: page - 1 })
                } else {
                    let newState = {
                        resourceListInfo: {
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

    updateValue(data) {
        actionVODManage.resourceEdit(data).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '操作成功' });
                this.getResourceList();
            } else {
                this.showToast({ type: 'error', content: '操作失败' });
                this.getResourceList();
            }
        }).catch(err => {
            this.getResourceList();
        })
    }

    getRightItems = () => {
        return (
            [
                interfaces.USER_ADD && <RLButton
                    label='添加资料'
                    type='primary'
                    key='add'
                    onClick={() => {
                        this.setState({
                            showResImportModal: true
                        })
                    }}
                    style={{ marginLeft: 20 }}
                    disabled={this.props.uploading}
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
        this.getResourceList({ page })
    }

    rowClick = (e, user) => {
        this.props.changePage('detail', {
            userId: user.id,
        })
    }
    editConfirm = (values) => {
        console.log(values);
        let data = {
            course_id: this.vodId,
            id: this.state.resInfo.id,
            doc_id: this.state.resInfo.doc_id,
            title: values.title
        };
        actionVODManage.resourceEdit(data).then(res => {
            if (res.code === 200) {
                this.getResourceList();
                this.showToast({ type: 'success', content: '编辑成功' });
                this.setState({
                    showResEditModal: false
                });
            }
        }).catch(err => {
            this.showToast({ type: 'error', content: '编辑失败' });
            this.setState({
                showResEditModal: false
            })
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>点播资料</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('vod_list', {
                            vodPage: this.vodPage,
                        });
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
                    <RLFilterTool leftItems={[]} rightItems={this.getRightItems} />
                    <RLTable
                        loading={this.state.getListLoading}
                        dataSource={this.state.resourceListInfo.list}
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
                            total: this.state.resourceListInfo.count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: this.state.resourceListInfo.page
                        }}
                        rowClassName='rl-table-click-row'
                    />


                    {this.state.showResImportModal && <RLModal
                        title="添加资料"
                        closable={true}
                        onCancel={() => {
                            this.setState({
                                showResImportModal: false
                            })
                        }}
                        footer={null}
                        visible={this.state.showResImportModal}
                    >
                        <div className="videoinput">
                            <RLForm onFinish={this.batchApprove} validateTrigger='onBlur' initialValues={{ status: 1 }}>
                                <RLFormItem label="上传资料" name="file" colon={false}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <RLInput style={{ width: 200 }}
                                            placeholder="请选择上传pdf文件"
                                            value={this.state.uploadFile && this.state.uploadFile.name} disabled={true}
                                        />
                                        <Upload
                                            accept="application/pdf"
                                            multiple={false}
                                            showUploadList={false}
                                            beforeUpload={(file) => {
                                                this.setState({
                                                    uploadFile: file
                                                })
                                                return false;
                                            }}>
                                            <RLButton label="选择资料"
                                                style={{ marginLeft: 20 }} />
                                        </Upload>
                                    </div>
                                </RLFormItem>
                                <RLFormItem>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                        <RLButton label="取消"
                                            onClick={() => {
                                                this.setState({
                                                    showResImportModal: false
                                                })
                                            }}
                                            style={{ marginRight: 40 }} />
                                        <RLButton label="开始上传"
                                            className=""
                                            type="primary"
                                            htmlType="submit"
                                            onClick={e => {
                                                e.stopPropagation()
                                                const file = this.state.uploadFile
                                                if (!file) {
                                                    this.showToast('请先选择资料')
                                                    return
                                                }
                                                if (!file.type.includes('pdf')) {
                                                    this.showToast('请选择pdf文件上传')
                                                    return
                                                }
                                                eventBus.emit('upload-video', this.state.uploadFile, {
                                                    mimetype: 'text/pdf',
                                                    dtype: 3,
                                                    dtranscode: false,
                                                    type: 'vod',
                                                    course_id: this.vodId,
                                                    is_down: 1
                                                });
                                                this.setState({
                                                    showResImportModal: false,
                                                    uploadFile: null
                                                });
                                            }} />
                                    </div>
                                </RLFormItem>
                            </RLForm>
                        </div>
                    </RLModal>}

                    {this.state.showResEditModal && <RLModal
                        title="修改名称"
                        visible={this.state.showResEditModal}
                        onCancel={() => {
                            this.setState({
                                showResEditModal: false
                            })
                        }}
                        footer={null}
                    >
                        <RLForm
                            initialValues={this.state.resInfo}
                            onFinish={this.editConfirm}
                        >
                            <RLFormItem label="资料名称" name="title" colon={false}>
                                <RLInput defaultValue={this.state.resInfo.title} />
                            </RLFormItem>
                            <RLFormItem>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
                                    <RLButton label="取消"
                                        onClick={() => {
                                            this.setState({
                                                showResEditModal: false
                                            })
                                        }}
                                    />
                                    <RLButton label="确定"
                                        type="primary"
                                        htmlType="submit"
                                        style={{ marginLeft: 20 }}
                                    />
                                </div>
                            </RLFormItem>
                        </RLForm>
                    </RLModal>}
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        uploading: store.storeCommon.uploading,
    }
})(CmpResourceList)