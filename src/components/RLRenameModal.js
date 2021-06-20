

import React from 'react';
import BaseCmp from '@components/BaseCmp.js'
import RLInput from './RLInput.js'
import RLForm from './RLForm.js'
import RLFormItem from './RLFormItem.js'
import RLModal from './RLModal.js'
import RLButton from './RLButton.js'
import actionMemberManage from '@actions/common/actionMemberManage.js'

class RLRenameModal extends BaseCmp {
    constructor(props) {
        super(props)
        // meeting_id
        // uid
        console.log('props.user:', props.user)
        this.meeting_id = props.user.meeting_id
        this.uid = props.user.uid
        this.state = {
            nickname: props.user.nickname
        }
        this.renameForm = React.createRef();
    }
    renameConfirm = (values) => {
        actionMemberManage.userOption({
            type: 'rename',
            meeting_id: this.meeting_id,
            uid: this.uid,
            nickname: values.nickname
        }).then(res => {
            if (res.code === 200) {
                this.showToast({ type: 'success', content: '修改成功' })
                this.props.onRenameSuccess && this.props.onRenameSuccess()
            } else {
                this.showToast({ type: 'error', content: res.msg })
                this.props.onRenameError && this.props.onRenameError()
            }
        })
    }
    render() {
        return (
            <RLModal visible={this.props.visible}
                title='修改昵称'
                footer={null}
                onCancel={() => {
                    this.props.toggleRenameModal && this.props.toggleRenameModal(false)
                }}
            >
                <div className='modal-content' style={{ padding: 20 }}>
                    <RLForm
                        initialValues={{ nickname: this.props.user.nickname }}
                        style={{ width: 360, margin: 'auto' }}
                        onFinish={this.renameConfirm}
                        ref={this.renameForm}
                    >
                        <RLFormItem

                            name='nickname'
                            rules={[
                                {
                                    required: true,
                                    message: '请输入昵称'
                                }, {
                                    pattern: /\S+/,
                                    message: '请输入昵称'
                                }, {
                                    max: 36,
                                    message: '昵称最多36个字符'
                                }
                            ]}
                        >
                            <RLInput
                                placeholder='请输入昵称'
                            />
                        </RLFormItem>

                    </RLForm>


                </div>
                <div className='modal-btnContainer'>
                    <RLButton label='取消'
                        onClick={() => {
                            this.props.toggleRenameModal && this.props.toggleRenameModal(false)
                        }}
                    />
                    <RLButton label='确定'
                        type='primary'
                        style={{ marginLeft: 30 }}
                        onClick={() => {
                            console.log(this.renameForm)
                            this.renameForm.current.submit()
                            // this.renameConfirm(this.state.nickname)
                        }}
                    />
                </div>
            </RLModal>
        )

    }
}
export default RLRenameModal