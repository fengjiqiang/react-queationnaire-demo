import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLCheckbox } from '@components/index.js'
import actionUserList from '@actions/userManage/actionUserList.js'
import actionRoleManage from '@actions/userManage/actionRoleManage.js'
// import '../../userList/UserList.less'
import interfaces from '@/api/interfaces'
import utils from '@/libs/utils.js'
import eventBus from '@/libs/EventBus.js'
import { DatePicker, Input } from 'antd';

import './CmpAuthTree.less';

export default class CpmAuthTree extends BaseCmp{
    constructor(props){
        super(props);
        this.state = {
            role_code: ''
        }
    }
    componentWillReceiveProps = (nextProps) => {
        this.setState({
          checkedList: nextProps.checkedList
        });   
    }
    isChecked(id){
        if(!this.props.checkedList) return false;
        let item = this.state.checkedList.find(item => item === id)
        return item ? true : false
    }
    getCheckedList(){
        return this.state.checkedList
    }
    render(){
        return <RLModal
                    title="批量更换"
                    visible={this.props.visible}
                    closable={true}
                
                    >
                    <div>
                        <RLSelect />
                    </div>
                    <div>
                        <RLButton />

                        <RLButton />
                    </div>
                   
                </RLModal>
            
    }
}