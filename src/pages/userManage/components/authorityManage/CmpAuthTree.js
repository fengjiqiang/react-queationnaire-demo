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
            checkedList: this.props.checkedList || []
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
        return (
            <div className="auth-tree">
                {
                    this.props.treeData.map(item => {
                        return <div className="auth-tree-container" >
                                    <div className="auth-tree-title">{item.name}</div>
                                    {
                                        item.children && item.children.map( item => {
                                            return <div className="auth-tree-secend-container">
                                                        <div className="auth-tree-second-level">
                                                            <RLCheckbox 
                                                                label={item.name}
                                                                checked={this.isChecked(item.id)}
                                                                // disabled={this.props.readOnly}
                                                                onChange={(e) => {
                                                                    if(this.props.readOnly) return;
                                                                    if(e.target.checked){
                                                                        if( !this.state.checkedList.includes(item.id)){
                                                                            this.state.checkedList.push(item.id);
                                                                            this.setState({
                                                                                checkedList: this.state.checkedList
                                                                            });
                                                                        }
                                                                    }else{
                                                                        let index = this.state.checkedList.findIndex( i => i === item.id );
                                                                        if(index >= 0){
                                                                            this.state.checkedList.splice(index, 1);
                                                                            this.setState({
                                                                                checkedList: this.state.checkedList
                                                                            });
                                                                        }
                                                                        item.children && item.children.map( item => {
                                                                            let index = this.state.checkedList.findIndex( i => i === item.id );
                                                                            if(index >= 0){
                                                                                this.state.checkedList.splice(index, 1);
                                                                                this.setState({
                                                                                    checkedList: this.state.checkedList
                                                                                });
                                                                            }
                                                                        })
                                                                    }
                                                                }}
                                                                />
                                                        </div>
                                                        <div className="auth-tree-third-level">
                                                            {
                                                                item.children && item.children.map( item => {
                                                                    return <RLCheckbox 
                                                                                label={item.name}
                                                                                checked={this.isChecked(item.id)}
                                                                                // disabled={this.props.readOnly}
                                                                                style={{color:'black'}}
                                                                                onChange={(e)=>{
                                                                                    if(this.props.readOnly) return;
                                                                                    if(e.target.checked){
                                                                                        if( !this.state.checkedList.includes(item.id)){
                                                                                            this.state.checkedList.push(item.id);
                                                                                            if(!this.state.checkedList.includes(item.pid)){
                                                                                                this.state.checkedList.push(item.pid);
                                                                                            }
                                                                                            this.setState({
                                                                                                checkedList: this.state.checkedList
                                                                                            })
                                                                                        }
                                                                                    }else{
                                                                                        let index = this.state.checkedList.findIndex( i => i === item.id );
                                                                                        if(index >= 0){
                                                                                            this.state.checkedList.splice(index, 1);
                                                                                            this.setState({
                                                                                                checkedList: this.state.checkedList
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                />
                                                                })
                                                            }
                                                        </div>
                                            </div>
                                        })
                                    }
                        </div>
                    })
                }
            </div>
        )
    }
}