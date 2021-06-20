import BaseCmp from '@components/BaseCmp.js';
import WindowContainer from '@components/WindowContainer.js';
import { connect } from 'react-redux';
import {
    RLInput, RLButton, RLDisplayBoard, RLForm, RLFormItem, RLRadioGroup, RLKVList
} from '@components/index.js';
import PhoneRegionView from '@/pages/common/PhoneRegionView.js';

import commonAction from '@actions/commonActions';
import actionRoleManage from '@actions/userManage/actionRoleManage.js';
import utils from '@/libs/utils.js';
import interfaces from '@/api/interfaces';
import CmpAuthTree from './CmpAuthTree';



class CmpRoleDetail extends BaseCmp {
    constructor(props) {
        super(props);

        this.roleId = props.roleId;
        this.rolePage = props.rolePage
        this.roleDetail = props.roleDetail;
        this.state = {
            sysAuthData: [],
            roleInfo: this.roleDetail,
        }
        this.getSystemAuth();
    }
    componentWillMount() {
        // this.getUserInfo()
    }

    getSystemAuth = ()=>{
        actionRoleManage.getSystemAuth().then(res =>{
            if(res.code === 200){
                this.setState({
                    sysAuthData: res.data
                });
            }else{
                this.showToast({type:'erroe', content: res.msg});
            }
        }).catch( err => {
            this.showToast({type:'erroe', content: err.msg});
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>{this.state.roleInfo.role_name || '角色详情'}</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list',{
                            rolePage: this.rolePage,
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
                <div className='page-userAdd' >
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <div style={{width:'100%',borderLeft: '4px solid #8F1D22',paddingLeft:5, fontSize:16,fontWeight:500}}>角色信息</div>
                        <div style={{width:'96%'}}>
                            <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                                <div style={{marginRight: 50}}>角色名称</div>
                                <div style={{width:360}}>{this.state.roleInfo.role_name}</div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                                <div style={{marginRight: 50}}>角色描述</div>
                                <div style={{width:360,maxHeight:110,overflowY:'scroll'}}>{this.state.roleInfo.role_desc}</div>
                            </div>
                        </div>  
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center', marginTop: 20}}>
                        <div style={{width:'100%',borderLeft: '4px solid #8F1D22',paddingLeft:5, fontSize:16,fontWeight:500}}>角色权限</div>
                        <div style={{width:'96%',marginTop:0}}>
                            <CmpAuthTree 
                                treeData={this.state.sysAuthData}
                                checkedList={this.state.roleInfo.auth}
                                readOnly={true}/>
                        </div>
                    </div>
                    {/* <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
                        <RLButton label="返回" 
                            onClick={()=> {
                                this.props.changePage('list',{
                                    rolePage: this.rolePage,
                                })
                            }} 
                            style={{marginTop:20}}/>
                    </div> */}
                   
                </div>
            </WindowContainer>
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
    }
})(CmpRoleDetail)