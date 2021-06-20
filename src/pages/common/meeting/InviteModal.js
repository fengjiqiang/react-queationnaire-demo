

import BaseCmp from '@components/BaseCmp.js'
import { RLInput, RLButton, LargeModal, RLTag } from '@components/index.js'

import './inviteModal.less'
import { connect } from 'react-redux';
import eventBus from '@/libs/EventBus.js'
import RLTree from './RLTree.js'

class InviteModal extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            // treeData: null,
            // userCount: 0,
            selectedUsers: props.selected,
            keyword: '', // 获取用户列表的请求参数
        }
        console.log('this.props.allUserInfo:', props.selected)
    }

    rlTreeChecked = (items) => {
        console.log('items:', items)
        this.setState({
            selectedUsers: items
        })
    }
    inviteConfirm = () => {
        this.props.onConfirm(this.state.selectedUsers)
    }
    render() {
        let addBtnLabel = `添加\t${this.state.selectedUsers.length}/${this.props.allUserInfo.list.length}`
        return (
            <LargeModal
                visible={this.props.visible}
                title='邀请用户'
                wrapClassName='inviteModal'
                afterClose={() => {
                    this.props.onCancel()
                    console.log('afterCloseafterClose')
                    this.setState({
                        // treeData: null,
                        selectedUsers: [],
                    })
                }}
                onClose={() => {

                }}
            >
                <div className='inviteChild'>
                    <RLTree
                        onCheck={this.rlTreeChecked}
                        // tree={this.state.treeData}
                        keyword={this.state.keyword}
                        selected={this.state.selectedUsers}
                    />

                    {/* </div>
                    </div> */}
                    <div className='child select-result'>
                        <div className='selected-container'>
                            {
                                this.state.selectedUsers.map(user => {
                                    return <RLTag
                                        label={user.name}
                                        closable
                                        onClose={(e) => {
                                            e.preventDefault()
                                            eventBus.emit('tree_remove_check', user)
                                        }}
                                    />
                                })
                            }
                        </div>
                        <div className='btn-container'>
                            {/* {this.props.allUserInfo} */}
                            <RLButton label='取消' type='default' height={28}
                                style={{ marginRight: 20 }}
                                onClick={() => {
                                    this.props.onCancel()
                                }}
                            />
                            <RLButton
                                label={addBtnLabel}
                                type='primary'
                                height={28}
                                onClick={this.inviteConfirm}
                            />

                        </div>
                    </div>
                </div>
            </LargeModal>
        )
    }
}
// export default InviteModal
export default connect((store, props) => {
    return {
        ...props,
        allUserInfo: store.userList.allUserInfo
    }
})(InviteModal);