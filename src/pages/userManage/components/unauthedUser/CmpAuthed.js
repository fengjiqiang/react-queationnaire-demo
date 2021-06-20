import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { Radio } from 'antd'
import { connect } from 'react-redux'
import { 
    RLButton, RLDisplayBoard, RLTextarea, RLForm, RLFormItem, RLRadioGroup
} from '@components/index.js'

import actionUnauthedUserList from '@actions/userManage/actionUnauthedUserList.js'

import utils from '@/libs/utils.js'
import config from '@/config.js'
import images from '@/libs/images/index.js'
import CmpFile from '@/pages/marketingTool/components/QAManage/CmpFile.js';
const commonImg = images.commonImg

class CmpAuthed extends BaseCmp {
    constructor(props) {
        super(props)
        this.uuid = props.uuid
        this.tabKey = props.tabKey
        this.page = props.page
        this.state = {
            operate_status: null, // 认证操作
            remark: '',  // 认证详情
            addLoading: false,  // 添加按钮loading
            authedUserInfo: {}
        }
    }
    componentWillMount() {
        this.getAuthedUserInfo()
    }
    getAuthedUserInfo = () => {
        const params = {
            uuid: this.uuid,
            approval_id: ''
        }
        actionUnauthedUserList.approvedDetail(params).then(res => {
            if (res.code === 200) {
                this.setState({
                    authedUserInfo: res.data
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }
    baseUserInfo = () => {
        const info = this.state.authedUserInfo
        let inJobIsPDF = info.in_job && info.in_job.endsWith('.pdf')
        let jobCardIsPDF = info.job_card && info.job_card.endsWith('.pdf')
        let otherIsPDF = info.other && info.other.endsWith('.pdf')
        const labelStyle = {
            color: '#999',
            fontSize: 14,
            lineHeight: '20px',
            textAlign: 'right',
            marginRight: 30,
            flex: 'none',
            width: 140
        }
        const valueStyle = {
            color: '#333',
            fontSize: 14,
            lineHeight: '20px'
        }
        let authedUserInfo = [{
            list: [
                {
                    label: '姓名',
                    value: info.nickname,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '手机号',
                    value: info.mobile,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '机构全称',
                    value: info.company_name,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '头像',
                    value: <div>
                        {
                            <img
                                alt=''
                                src={info.avatar || commonImg.logo}
                                style={{ height: 56, width: 56, borderRadius: '50%', cursor: 'pointer' }}
                            />
                        }
                    </div >,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '部门',
                    value: info.department || '未填写',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '职务',
                    value: info.position || '未填写',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '邮箱',
                    value: info.email || '未填写',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '身份证号',
                    value: info.id_number || '未填写',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '身份证正反面照片',
                    value: info.positive_card && info.reverse_card ? <div>
                        <img
                            src={info.positive_card || require('../../../../assets/images/card_positive.png')}
                            alt=''
                            style={{ width: 202, height: 112 }}>
                        </img>
                        <img
                            src={info.reverse_card || require('../../../../assets/images/card_positive.png')}
                            alt=''
                            style={{ width: 202, height: 112, marginLeft: 21 }}>
                        </img>
                    </div> : <span>未上传</span>,
                    labelStyle
                }, {
                    label: '一个月内在职证明',
                    value: info.in_job ? <div style={{marginTop: -12}}>
                                            <CmpFile 
                                                src={info.in_job}
                                                name={info.in_job_desc}
                                                editable={false}
                                                click={()=>{
                                                    window.open(info.in_job);
                                                }}
                                            />
                                        </div>: <span>未上传</span>,
                    labelStyle
                }, {
                    label: '工卡及名片同框照片',
                    value: info.job_card ? <div style={{marginTop: -12}}>
                                                <CmpFile 
                                                    src={info.job_card}
                                                    name={info.job_card_desc}
                                                    editable={false}
                                                    click={()=>{
                                                        window.open(info.job_card);
                                                    }}
                                                />
                                            </div>: <span>未上传</span>,
                    labelStyle
                }, {
                    label: '其他有效证件',
                    value: info.other ? <div style={{marginTop: -12}}>
                                            <CmpFile 
                                                src={info.other}
                                                name={info.other_desc}
                                                editable={false}
                                                click={()=>{
                                                    window.open(info.other);
                                                }}
                                            />
                                        </div>: <span>未上传</span>,
                    labelStyle
                }
            ]
        }]
        return (
            <RLDisplayBoard
                style={{ width: '100%' }}
                valueCol={10}
                spaceWidth={20}
                items={authedUserInfo}>
                {this.renderAuthedOperate()}
            </RLDisplayBoard>
        )
    }
    // 认证保存
    saveConfirm = (values) => {
        console.log('onFinish', values)
        this.setState({
            addLoading: true
        })
        const { operate_status: status, remark } = values
        actionUnauthedUserList.approvedOperate({
            users: [this.uuid],
            status,
            remark
        }).then(res => {
            console.log('认证保存返回--res:', res)
            if (res.code === 200) {
                this.showToast({ content: '认证成功', type: 'success' })
                this.props.changePage('list', { tabKey: this.tabKey })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).finally(() => {
            this.setState({
                addLoading: false
            })
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>用户认证</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list', { tabKey: this.tabKey, page: this.page })
                    }}
                    label='返回'
                />
            </div>
        )
    }

    // 底部-认证操作
    renderAuthedOperate = () => {
        return (
            <RLForm
                labelCol={{ style: { width: 140, textAlign: 'right', marginRight: 20, marginLeft: 60 } }}
                labelAlign='left'
                wrapperCol={
                    { span: 24 }
                }
                onFinish={this.saveConfirm}
                initialValues={{operate_status:1}}
                validateTrigger='onBlur'
            >
                <RLFormItem
                    colon={false}
                    label="用户认证"
                    name='operate_status'
                    rules={[{
                        required: true,
                        message: "请选择是否同意"
                    }]}
                >
                    <RLRadioGroup 
                        items={[
                            { value: 1, label: '同意' },
                            { value: 2, label: '拒绝' },
                        ]}
                    />
                </RLFormItem>
                <RLFormItem
                    colon={false}
                    label="认证详情"
                    name='remark'
                >
                    <RLTextarea rows={4} style={{ width: 360 }} />
                </RLFormItem>

                <RLFormItem>
                    <div style={{ display: 'flex', flexDirection:'row',justifyContent:'center', marginTop: 35,  }}>
                        <RLButton
                            type="default"
                            label='取消'
                            width={80}
                            style={{ display: 'inline-block' }}
                            onClick={() => {
                                this.props.changePage('list')
                            }}
                        />
                        <RLButton
                            type="primary"
                            htmlType="submit"
                            label='确认'
                            style={{ marginLeft: 40, display: 'inline-block' }}
                            loading={this.state.addLoading}
                            width={80}
                        />
                    </div>
                </RLFormItem>
            </RLForm>
        )
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                {this.baseUserInfo()}
            </WindowContainer >
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpAuthed)
