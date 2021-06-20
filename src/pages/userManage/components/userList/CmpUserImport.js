import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLDisplayBoard, RLForm, RLFormItem, RLRadioGroup, RLModal, RLTable
} from '@components/index.js'
import actionUserList from '@actions/userManage/actionUserList.js';
import commonAction from '@actions/commonActions';
import commonImgs from '@/libs/images';
import utils from '@/libs/utils.js'
import interfaces from '@/api/interfaces';
import { Upload } from 'antd'
import './importModal.less';

class CmpUserImport extends BaseCmp {
    constructor(props) {
        super(props)

        this.userId = props.userId;
        this.userPage = props.userPage;

        this.state = {
            showImportResultModal: false,
            showImportingModal: false,

            selected: false,
            uploadFile: null,
            importResult: null
        }

        this.columns = [
            {
                title: 'Excel行号',
                dataIndex: 'line',
                key: 'line',
                width: '20%'
            },
            {
                title: '姓名',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '20%'
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
                width: '20%'
            },
            {
                title: '机构名称',
                dataIndex: 'company_name',
                key: 'company_name',
                width: '20%'
            },
            {
                title: '失败原因',
                dataIndex: 'error_msg',
                key: 'error_msg',
                width: '30%'
            }
        ]

    }
    componentWillMount() {
        // this.getUserInfo()
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>导入用户</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list', {
                            userPage: this.userPage
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
                <div style={{ border: '1px solid #DCDFE6', width: '100%', height: 586, borderRadius: 9 }}>
                    <div style={{ borderBottom: '1px solid #DCDFE6', height: 161, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '84%' }}>
                            <div>1. 下载导入模板</div>
                        </div>
                        <div style={{ width: '80%', marginTop: 20 }}>
                            <div>根据提示信息完善表格内容</div>
                        </div>
                        <div style={{ width: '80%', marginTop: 20 }}>
                            <div onClick={() => {
                                actionUserList.downloadTemplate();
                            }}
                                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', border: '1px solid #DCDFE6', borderRadius: 4, width: 164, height: 36, cursor: 'pointer' }}>
                                <img src={require('../../../../assets/images/download.png').default} style={{ width: 16, height: 16 }} />
                                <span style={{ marginLeft: 5 }}>下载空的模板表格</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '84%', marginTop: 20 }}>
                            <div>2. 上传完善后的表格</div>
                        </div>
                        <div style={{ width: '80%', marginTop: 20, border: '1px solid #DCDFE6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 191 }}>
                            <img src={require('../../../../assets/images/xls.png').default} style={{ width: 40, height: 40 }} />
                            {this.state.selected ? <span style={{ marginTop: 5 }}>{`${this.state.uploadFile.name}(${parseFloat(this.state.uploadFile.size / 1024).toFixed(1)}k)`}</span> : null}
                            <Upload accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                beforeUpload={(file) => {
                                    this.setState({
                                        uploadFile: file,
                                        selected: true
                                    })
                                    return false
                                }}
                                showUploadList={false}
                            >
                                <RLButton type="primay" label={this.state.selected ? '重新选择' : '选择文件'} style={{ marginTop: 10 }} />
                            </Upload>
                            <div style={{ marginTop: 5 }}>下载模板并完善信息后，点击【选择文件】上传，支持格式：xls、xlsx</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <RLButton label="取消"
                            onClick={() => {
                                this.props.changePage('list', {
                                    userPage: this.userPage
                                });
                            }}
                            style={{ marginRight: 40 }}
                        />
                        <RLButton label="导入"
                            type="primary"
                            disabled={!this.state.selected}
                            onClick={() => {
                                if (!this.state.uploadFile) {
                                    this.showToast({ type: 'normal', content: '请先选择上传文件！' });
                                    return;
                                }
                                let formData = new FormData();
                                formData.append('file', this.state.uploadFile);
                                this.setState({
                                    showImportingModal: true,
                                });
                                actionUserList.userImport(formData).then(res => {
                                    if (res.code === 200) {
                                        this.setState({
                                            importResult: res.data,
                                            showImportingModal: false,
                                            showImportResultModal: true
                                        })
                                    } else {
                                        this.showToast({ type: 'error', content: res.msg });
                                        this.setState({
                                            showImportingModal: false
                                        })
                                    }
                                }).catch(err => {
                                    this.setState({
                                        showImportingModal: false
                                    });
                                    this.showToast({ type: 'error', content: err.msg });
                                });
                            }}
                        />
                    </div>
                </div>
                {this.state.showImportingModal && <RLModal
                    visible={this.state.showImportingModal}
                    header={null}
                    footer={null}
                    closable={false}>
                    <div>
                        <div style={{ fontSize: 12, color: '#333333' }}>数据导入中，请勿离开当前页面</div>
                        <div style={{ fontSize: 12, color: '#666666', marginTop: 8 }}>
                            <span>{this.state.uploadFile && this.state.uploadFile.name}</span>
                        </div>
                    </div>
                </RLModal>}
                {this.state.showImportResultModal && <RLModal
                    visible={this.state.showImportResultModal}
                    footer={null}
                    closable={false}
                    className="importModal">
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        {
                            this.state.importResult && this.state.importResult.list.length === 0 ?
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', heught: '100%' }}>
                                    <img src={require('../../../../assets/images/success.png').default} style={{ width: 56, height: 56 }} />
                                    <div style={{ marginTop: 5 }}> 成功导入{this.state.importResult && this.state.importResult.success_count}条 </div>
                                    <RLButton label="完成"
                                        type="primary"
                                        onClick={() => {
                                            this.setState({
                                                showImportResultModal: false
                                            })
                                        }}
                                        style={{ marginTop: 30 }} />
                                </div>
                                :
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', heught: '100%' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #e5e5e5', height: 92, width: '100%' }}>
                                        <div>导入结果</div>
                                        <div>
                                            <img src={require('../../../../assets/images/error.png').default} style={{ width: 16, height: 16 }} />
                                            <span>导入失败{this.state.importResult && this.state.importResult.list.length}条</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '1px solid #e5e5e5', height: 380, width: '100%' }}>
                                        <div style={{ width: '90%', marginLeft: 20, fontSize: 16 }}>失败详情</div>
                                        <div style={{ width: '90%', height: '70%', marginTop: 10, overflowY: 'scroll' }}>
                                            <RLTable
                                                columns={this.columns}
                                                dataSource={(this.state.importResult && this.state.importResult.list) || []}
                                            />
                                        </div>
                                        <RLButton label="完成"
                                            type="primary"
                                            onClick={() => {
                                                this.setState({
                                                    showImportResultModal: false
                                                })
                                            }}
                                            style={{ marginTop: 10 }} />
                                    </div>
                                </div>
                        }
                    </div>
                </RLModal>}
            </WindowContainer>
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
        roleList: store.roleManage.roleList,
        planAvailable: store.userList.planAvailable
    }
})(CmpUserImport)