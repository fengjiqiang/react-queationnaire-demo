import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLForm, RLFormItem, RLRadioGroup, RLTextarea
} from '@components/index.js'

import actionInfoClassify from '@actions/infoManage/actionInfoClassify.js'

import './CmpInfoClassifyEdit.less'


class CmpInfoClassifyEdit extends BaseCmp {
    constructor(props) {
        super(props)
        if (props.record && props.record.id) {
            this.infoClassifyId = props.record.id
            this.record = props.record
        }
        this.state = {
            addLoading: false,  // 添加按钮loading
            infoClassifyInfo: {}   // 资讯分类
        }

    }
    componentWillMount() {
        if (this.infoClassifyId) {
            const { name, e_name, is_show, describe } = this.record
            this.setState({
                infoClassifyInfo: {
                    name,   // 中文分类名称
                    e_name,   // 英文分类名称
                    is_show,   // 是否显示
                    describe   // 分类描述
                }
            })
        } else {
            this.setState({
                infoClassifyInfo: {
                    name: '',
                    e_name: '',
                    is_show: 1,
                    describe: ''
                }
            })
        }
    }

    editConfirm = (values) => {
        console.log('onFinish', values)
        this.setState({
            addLoading: true
        })
        const { name, e_name, is_show, describe } = values
        const params = {
            name,
            e_name,
            is_show,
            describe
        }
        if (this.infoClassifyId) {   // 编辑
            actionInfoClassify.infoClassifyEdit({ ...params, id: this.infoClassifyId }).then(res => {
                if (res.code === 200) {
                    this.showToast({ content: '编辑成功', type: 'success' })
                    this.props.changePage('list')
                } else {
                    this.showToast({ type: 'error', content: res.msg })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        } else {   // 添加
            actionInfoClassify.infoClassifyAdd(params).then(res => {
                if (res && res.code === 200) {
                    this.showToast({ content: '添加成功', type: 'success' })
                    this.props.changePage('list')
                } else {
                    this.showToast({ type: 'error', content: res.msg })
                }
            }).finally(() => {
                this.setState({
                    addLoading: false
                })
            })
        }
    }

    pageTitle = () => {
        let title = '添加分类'
        if (this.infoClassifyId) {
            title = '编辑分类'
        }
        return (
            <div className="custom-page-title">
                <span>{title}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list', { page: this.props.page })
                    }}
                    label='返回'
                />
            </div>
        )
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='page-infoclassify-edit'>
                    {
                        this.state.infoClassifyInfo && <RLForm
                            labelCol={{ style: { width: 150, marginRight: 20, marginLeft: 30, textAlign: 'right' } }}
                            labelAlign='left'
                            wrapperCol={
                                { span: 24 }
                            }
                            onFinish={this.editConfirm}
                            initialValues={this.state.infoClassifyInfo}
                            validateTrigger='onBlur'
                        >
                            <RLFormItem
                                name='name'
                                label='中文分类名称'
                                colon={false}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入分类名称'
                                    }, {
                                        max: 10,
                                        message: '分类名称最多10个汉字'
                                    }
                                ]}
                            >
                                <RLInput placeholder='请输入分类名称' style={{ width: 260 }} />
                            </RLFormItem>
                            <RLFormItem
                                name='e_name'
                                label='英文分类名称'
                                colon={false}
                            >
                                <RLInput placeholder='请输入分类名称' style={{ width: 260 }} />
                            </RLFormItem>
                            <RLFormItem
                                name='is_show'
                                label='是否显示'
                                colon={false}
                                rules={[{
                                    required: true,
                                    message: "请选择是否显示"
                                }]}
                            >
                                <RLRadioGroup
                                    items={[
                                        { value: 1, label: '是' },
                                        { value: 0, label: '否' }
                                    ]}
                                />
                            </RLFormItem>
                            <RLFormItem
                                label='分类描述'
                                name='describe'
                                colon={false}
                                rules={[
                                    {
                                        max: 1000,
                                        message: '分类描述最多1000个汉字'
                                    }
                                ]}
                            >
                                <RLTextarea
                                    style={{
                                        width: 500,
                                        height: 170,
                                        resize: 'none'
                                    }}
                                    maxLength={1000}
                                />
                            </RLFormItem>
                            <RLFormItem>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                                        loading={this.state.addLoading}
                                        type="primary"
                                        htmlType="submit"
                                        label={this.infoClassifyId ? '保存' : '添加'}
                                        style={{ marginLeft: 40, display: 'inline-block' }}
                                        width={80}
                                    />
                                </div>
                            </RLFormItem>
                        </RLForm>
                    }

                </div>
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpInfoClassifyEdit)
