import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLTextarea, RLButton, RLForm, RLFormItem, RLRadioGroup, RLTag, RLCheckboxGroup, RLTable, RLModal, RLSwitch, RLSelect
} from '@components/index.js'
import { Tabs, DatePicker } from 'antd'
import { createRef } from 'react'

import actionQuestionnaire from '@actions/marketingTool/actionQuestionnaire.js'
import CmpUpload from '@/pages/common/CmpUpload.js'
import { dealTime, dealDateTime, uuid } from '@/libs/utils.js'
import moment from 'moment'
import AddUser from '@/pages/common/meeting/AddUser.js'
import QuestionnaireEditor from './components/QuestionnaireEditor.js'


import commonActions from '@actions/commonActions'
import locale from 'antd/es/date-picker/locale/zh_CN'

import './CmpQnaireEdit.less'
import './components/QuestionnaireEditor.less'

const { TabPane } = Tabs


class CmpQnaireEdit extends BaseCmp {
    constructor(props) {
        super(props)
        if (props.qnaireId) {
            this.qnaireId = props.qnaireId
        }
        this.state = {
            addLoading: false,  // 添加按钮loading
            qnaireInfo: {
                title: '',   // 问卷主题
                e_title: '',
                desc: '',   // 问卷简介
                e_desc: '',
                question: [],   // 问题
                image: '',
                end_time_at: '',
                user_list: '',
                q_type: 1   // 默认公开
            },   // 问卷
            userGroup: [],   // 成员列表
            language: 'zh',   // 默认中文

            showAddUserModal: false,   // 添加人员弹框
            addUserConfig: {
                showSelectGroup: true,
                selectType: 'checkbox',
                originCanCancel: true,
                returnStyle: 'object',
                mustIdent: true
            },

            editors: [],
            curMoveItem: null,
            drag: false,
            scrollTo: 0,
            newEditor: true,
        }
        this.form = createRef()
        this.editorsEl = []
    }
    componentDidMount() {
        if (this.qnaireId) {   // 编辑
            this.getQnaireDetail(this.qnaireId)
        } else {
            this.setState({
                qnaireInfo: {
                    ...this.state.qnaireInfo
                }
            })
        }
    }

    // 问卷详情
    getQnaireDetail = (id) => {
        actionQuestionnaire.getQnaireDetail({ id }).then(res => {
            if (res.code === 200) {
                const data = res.data
                this.setState({
                    userGroup: data.user_list,   // 成员名单
                    qnaireInfo: {
                        ...data,
                        end_time_at: moment(dealTime(data.end_time_at, 'YYYY-MM-DD HH:mm')),
                    },
                    editors: JSON.parse(data.question)
                }, () => {
                    // 给表单重置值
                    this.form && this.form.setFieldsValue(this.state.qnaireInfo)
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }

    editConfirm = (values) => {
        console.log('onFinish', values)
        this.setState({
            addLoading: true
        })
        let { end_time_at, q_type } = values
        const { title, e_title, desc, e_desc, image, user_list } = this.state.qnaireInfo
        if (this.state.editors.length < 1) {
            this.showToast('请添加问题')
            this.setState({
                addLoading: false
            })
            return
        }
        if (this.state.language === 'zh') {
            if ((!e_title && !e_desc) || (e_title && e_desc)) {

            } else {
                this.showToast('英文必填项请填写完整')
                this.setState({
                    addLoading: false
                })
                return
            }
        } else if (this.state.language === 'en') {
            if ((!title && !desc) || (title && desc)) {

            } else {
                this.showToast('中文必填项请填写完整')
                this.setState({
                    addLoading: false
                })
                return
            }
        }

        for(let i=0; i< this.state.editors.length; i++){
            if(!this.state.editors[i].title.trim()){
                this.showToast({type:'error',content:`请填写问题${i+1}标题`});
                this.setState({
                    addLoading: false
                })
                return;
            }
            if(['radio','dropdown','checkbox'].includes(this.state.editors[i].type)){
                for(let option of this.state.editors[i].options){
                    if(!option.trim()){
                      this.showToast({type:'error',content:`请将问题${i+1}选项填写完整`});
                      this.setState({
                        addLoading: false
                      });
                      return;
                    }
                }
            }
            if(this.state.editors[i].type === 'rate'){
                for(let option of this.state.editors[i].options){
                    if(!option.title.trim() || !option.score.trim()){
                      this.showToast({type:'error',content:`请将问题${i+1}选项及对应分数填写完整`});
                      this.setState({
                        addLoading: false
                    })
                      return;
                    }
                }
            }
            if(this.state.editors[i].type === 'matrixrate'){
                for(let row of this.state.editors[i].rows){
                    if(!row.trim()){
                        this.showToast({type:'error',content:`请将问题${i+1}行标题填写完整`});
                        this.setState({
                            addLoading: false
                        })
                        return;
                    }
                }
                for(let option of this.state.editors[i].options){
                    if(!option.title.trim() || !option.score.trim()){
                      this.showToast({type:'error',content:`请将问题${i+1}选项及对应分数填写完整`});
                      this.setState({
                        addLoading: false
                    })
                      return;
                    }
                }
            }
        }

        const params = {
            title,
            e_title,
            desc,
            e_desc,
            question: JSON.stringify(this.state.editors),
            end_time_at: end_time_at && dealDateTime(end_time_at.format('YYYY-MM-DD HH:mm')),
            q_type,
            image,
            user_list,
            information: 2
        }
        let userStr = []
        this.state.userGroup.forEach(ele => {
            userStr.push(ele.id)
        })
        params.user_list = userStr.join(',')
        params.language = this.state.language === 'en' ? 2 : 1

        console.log('添加编辑问卷参数--params:', params)
        if (this.qnaireId) {   // 编辑
            actionQuestionnaire.qnaireEdit({ ...params, id: this.qnaireId }).then(res => {
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
        } else {   // 创建
            actionQuestionnaire.qnaireCreate(params).then(res => {
                if (res.code === 200) {
                    this.showToast({ type: 'success', content: '创建成功' })
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
        let title = '创建问卷'
        if (this.qnaireId) {
            title = '编辑问卷'
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

    /**
     * 创建表单的label
     */
    createLabel = (labelName, need, style = {}) => {
        return <div>
            {need ? <span style={{ color: '#ff4d4f' }}>*</span> : null}
            <span style={{ ...style }}>{labelName}</span>
        </div>
    }

    range = (start, end) => {
        const result = []
        for (let i = start; i < end; i++) {
            result.push(i)
        }
        return result
    }

    disabledDate = (current) => {
        return current && current < moment().startOf('day')
    }

    // 成员添加
    addSuccess = (data) => {
        let originUsers = this.state.userGroup
        let returnUsers = data.map(item => {
            return {
                'id': item.id,
                'nickname': item.nickname
            }
        })
        let newUsers = []
        for (let user of returnUsers) {
            let index = originUsers.findIndex(item => item.id === user.id)
            if (index < 0) {
                newUsers.push(user)
            }
        }
        let finalUsers = originUsers.concat(newUsers)
        this.setState({
            userGroup: finalUsers
        }, () => {
            this.form.validateFields(['user_list'])
        })
    }

    updateEditors = (callback) => {
        this.state.editors.some((data, index) => {
            if (data.isFirst && data.isEditor) {
                this.state.editors.splice(index, 1)
                return true;
            } else if (!data.isFirst && data.isEditor) {
                data.isEditor = false;
                return true;
            };
        });
        callback(this.state.editors);
    }

    createEditor = (type) => {
        const editor = {
            questionId: uuid(), // id
            type: type || 'radio', // 类型
            title: '', // 标题
            required: false, // 是否必填
            rows: ['', ''],   // matrixrate 行标题
            options: ['', ''], // 选项(radio,checkbox,dropdown,rate,matrixrate)
        };
        // this.setState(prevState => ({
        //     editors: [...prevState.editors, editor],
        // }))
        this.state.editors.push(editor);
        this.forceUpdate();
    }

    confirmEdit = (index, newEditor) => {
        const { onConfirm } = this.props;
        let editors = JSON.parse(JSON.stringify(this.state.editors));
        editors.splice(index, 1, newEditor);
        this.setState({
            editors,
            qnaireInfo: {
                ...this.state.qnaireInfo,
                question: JSON.stringify(editors)
            }
        }, () => {
            if (onConfirm) {
                this.updateEditors(onConfirm);
            };
        })
    }

    cancelEdit = (index) => {
        // let editors = JSON.parse(JSON.stringify(this.state.editors));
        // editors[index].isFirst ? editors.splice(index, 1) : editors[index].isEditor = false;
        // this.setState({
        //     editors,
        // });
        this.state.editors.splice(index,1);
        this.forceUpdate();
    }

    handleEdit = (data, index) => {
        this.state.editors[index] = data;
        this.forceUpdate();
    }
    render() {
        const { showSelectGroup, selectType, originCanCancel, returnStyle, mustIdent } = this.state.addUserConfig
        const { editors } = this.state
        const editorsEl = editors.map((editor, index) => {
            return (
                <div
                    className="drag-wrapper"
                    ref={el => {
                        console.log('question index---'+ index);
                        this.editorsEl[index] = el
                    }}
                    key={editor.questionId}
                >
                    <QuestionnaireEditor
                        index={index}
                        editor={editor}
                        isStatusEdit={this.state.qnaireInfo.edit_status}
                        handleEdit={this.handleEdit}
                        handleConfirm={this.confirmEdit}
                        handleCancel={this.cancelEdit}
                        // handleEdit={this.againEdit}
                        // handleRemove={this.removeEdit}
                        // handleCopy={this.copyEdit}
                    />
                </div>
            );
        });
        return (
            <WindowContainer title={this.pageTitle}>
                <div className='page-info-edit'>
                    <Tabs defaultActiveKey="zh"
                        style={{ flex: 1 }}
                        onChange={key => {
                            this.setState({
                                language: key
                            })
                        }}
                    >
                        <TabPane tab="中文" key="zh">
                        </TabPane>
                        <TabPane tab="英文" key="en">
                        </TabPane>
                    </Tabs>
                    <RLForm
                        ref={form => this.form = form}
                        className="form-questionnair"
                        labelCol={{ style: { width: 150, marginRight: 20, textAlign: 'right' } }}
                        labelAlign='left'
                        wrapperCol={{ style: { span: 24, marginRight: 30 } }}
                        onFinish={this.editConfirm}
                        initialValues={this.state.qnaireInfo}
                        validateTrigger='onBlur'
                    >
                        {
                            this.state.language === 'zh' ?
                                <RLFormItem
                                    name='title'
                                    label='问卷主题'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入问卷主题'
                                        }, {
                                            max: 50,
                                            message: '问卷主题最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLInput
                                        placeholder='请输入问卷主题'
                                        style={{ width: 400 }}
                                        value={this.state.qnaireInfo.title}
                                        onChange={e => {
                                            this.setState({
                                                qnaireInfo: {
                                                    ...this.state.qnaireInfo,
                                                    title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem> :
                                <RLFormItem
                                    name='e_title'
                                    label='问卷主题'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入问卷主题'
                                        }, {
                                            max: 50,
                                            message: '问卷主题最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLInput
                                        placeholder='请输入问卷主题'
                                        style={{ width: 400 }}
                                        value={this.state.qnaireInfo.e_title}
                                        onChange={e => {
                                            this.setState({
                                                qnaireInfo: {
                                                    ...this.state.qnaireInfo,
                                                    e_title: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>
                        }
                        {
                            this.state.language === 'zh' ?
                                <RLFormItem
                                    name='desc'
                                    label='问卷简介'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入问卷简介'
                                        }, {
                                            max: 200,
                                            message: '问卷简介最多200个字符'
                                        }
                                    ]}
                                >
                                    <RLTextarea
                                        placeholder='请输入问卷简介'
                                        rows={2}
                                        style={{ width: 520 }}
                                        value={this.state.qnaireInfo.desc}
                                        onChange={e => {
                                            this.setState({
                                                qnaireInfo: {
                                                    ...this.state.qnaireInfo,
                                                    desc: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem> :
                                <RLFormItem
                                    name='e_desc'
                                    label='问卷简介'
                                    colon={false}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入问卷简介'
                                        }, {
                                            max: 200,
                                            message: '问卷简介最多50个字符'
                                        }
                                    ]}
                                >
                                    <RLTextarea
                                        placeholder='请输入问卷简介'
                                        rows={2}
                                        style={{ width: 520 }}
                                        value={this.state.qnaireInfo.e_desc}
                                        onChange={e => {
                                            this.setState({
                                                qnaireInfo: {
                                                    ...this.state.qnaireInfo,
                                                    e_desc: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </RLFormItem>
                        }
                        <RLFormItem
                            name='image'
                            label='问卷封面'
                            colon={false}
                        >
                            <CmpUpload
                                aspect={4 / 3}
                                saveUrl={fileurl => {
                                    this.form.setFieldsValue({
                                        image: fileurl
                                    })
                                    this.setState({
                                        qnaireInfo: {
                                            ...this.state.qnaireInfo,
                                            image: fileurl
                                        }
                                    })
                                }}
                                src={this.state.qnaireInfo.image}
                                imgStyle={{ width: 120, height: 90, borderRadius: 4, cursor: 'pointer' }}
                                default={require('../../../../assets/images/upload.png').default}
                            />
                            <div style={{ marginTop: 10 }}>只能上传jpg/png，大小不超过2M，图片比例4：3</div>
                        </RLFormItem>

                        <RLFormItem
                            name='question'
                            label='问题设置'
                            colon={false}
                        >
                            <div className="questionnair">
                                {editorsEl.length > 0 && editorsEl}
                            </div>
                            <div className="questionnair-add"
                                onClick={() => {
                                    this.createEditor()
                                }}
                            >
                                <img
                                    alt=''
                                    src={require('../../../../assets/images/questionnaire/add_question.png').default}
                                    style={{ width: 24, height: 24, marginRight: 8 }}
                                />
                                <span style={{ fontSize: 14, color: '#333333' }}>添加问题</span>
                            </div>
                        </RLFormItem>
                        <RLFormItem
                            name='end_time_at'
                            label='截止时间'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择截止时间'
                                }
                            ]}
                        >
                            <DatePicker
                                allowClear
                                locale={locale}
                                showTime
                                disabledDate={this.disabledDate}
                                format={'YYYY-MM-DD HH:mm'}
                                placeholder='请选择日期时间'
                            />
                        </RLFormItem>
                        <RLFormItem
                            name='q_type'
                            label='发布范围'
                            colon={false}
                        >
                            <RLRadioGroup
                                items={[
                                    { value: 1, label: '公开' },
                                    { value: 2, label: '非公开' }
                                ]}
                                value={this.state.qnaireInfo.q_type}
                                onChange={e => {
                                    this.setState({
                                        qnaireInfo: {
                                            ...this.state.qnaireInfo,
                                            q_type: e.target.value
                                        }
                                    }, () => {
                                        this.form.validateFields(['user_list'])
                                    })
                                }}
                            />
                        </RLFormItem>
                        <RLFormItem
                            label={this.createLabel('可见名单', this.state.qnaireInfo.q_type === 1 ? false : true)}
                            colon={false}
                            name='user_list'
                            rules={[
                                {
                                    validator: () => {
                                        if (this.state.qnaireInfo.q_type === 2) {
                                            if (this.state.userGroup.length === 0) {
                                                return Promise.reject('如果发布范围选择的是非公开，可见名单是必填项')
                                            } else {
                                                return Promise.resolve()
                                            }
                                        } else {
                                            return Promise.resolve()
                                        }
                                    }
                                }
                            ]}
                        >
                            <div className='form-item-gropu'>
                                <div style={{
                                    width: 520,
                                    minHeight: 60,
                                    border: '1px solid rgb(220, 223, 230)',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    padding: '10px 10px 10px 10px',
                                    boxSizing: 'border-box'
                                }}>
                                    {this.state.userGroup.map(ele => {
                                        return <div style={{ height: 19, marginTop: 4 }} key={ele.id}>
                                            <RLTag
                                                label={ele.nickname}
                                                closable
                                                onClose={() => {
                                                    let all = [...this.state.userGroup]
                                                    let index = all.findIndex(clc => { return clc.id === ele.id })
                                                    all.splice(index, 1)
                                                    this.setState({
                                                        userGroup: all
                                                    })
                                                }}
                                            />
                                        </div>
                                    })}
                                </div>
                                <RLButton
                                    label='添加用户'
                                    type='primary'
                                    disabled={this.state.qnaireInfo.q_type === 1}
                                    onClick={() => {
                                        this.setState({
                                            showAddUserModal: true
                                        })
                                    }}
                                    style={{ marginLeft: 20 }}
                                />
                            </div>
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
                                    type="primary"
                                    htmlType="submit"
                                    label={this.qnaireId ? '保存' : '创建'}
                                    style={{ marginLeft: 40, display: 'inline-block' }}
                                    loading={this.state.addLoading}
                                    width={80}
                                />

                            </div>

                        </RLFormItem>
                    </RLForm>
                </div>
                {
                    this.state.showAddUserModal && <AddUser
                        visible={this.state.showAddUserModal}
                        showSelectGroup={showSelectGroup}
                        selectType={selectType}
                        originArr={this.state.userGroup}
                        originCanCancel={originCanCancel}
                        returnStyle={returnStyle}
                        mustIdent={mustIdent}
                        onCancel={() => {
                            this.setState({
                                showAddUserModal: false
                            })
                        }}
                        onAdd={data => {
                            this.addSuccess(data)
                        }}
                    />
                }
            </WindowContainer >
        )
    }

}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpQnaireEdit)
