import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLDisplayBoard, RLForm, RLFormItem, RLRadioGroup
} from '@components/index.js'
import PhoneRegionView from '@/pages/common/PhoneRegionView.js'
import actionUserList from '@actions/userManage/actionUserList.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import interfaces from '@/api/interfaces';

import { Upload } from 'antd';
import CmpFile from '@/pages/marketingTool/components/QAManage/CmpFile.js';

class CmpUserDetail extends BaseCmp {
    constructor(props) {
        super(props)
       
        this.userId = props.userId;
        this.userPage = props.userPage;

        this.state = {
            userInfo: {},
        }

    }
    componentWillMount() {
        this.getUserInfo()
    }
    getUserInfo = () => {
        actionUserList.getUserDetail({ uuid: this.userId }).then(res => {
            if (res.code === 200) {
                this.setState({
                    userInfo: res.data
                })
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }
    baseUserInfo = () => {
        let valueBtnStyle = {
            paddingLeft: 20,
            display: 'flex',
            flexDirection: 'row'
        };
        let labelStyle = {
            color: '#999',
            fontSize: 14,
            lineHeight: '20px',
            textAlign: 'right',
            // marginTop: 12,
            marginRight: 30,
            flex: 'none',
            width: 140
        };
        let labelStyle2 = {
            color: '#999',
            fontSize: 14,
            lineHeight: '20px',
            textAlign: 'right',
            // marginTop: 12,
            marginRight: 30,
            flex: 'none',
            width: 140,
            height: 50,
            display:'flex',
            flexDirection:'row',
            justifyContent: 'flex-end',
            alignItems:'center'
        }
        // let labelStyle = { flex: 'none', width: 70, fontSize: 14, lineHeight: '20px', color: '#999', textAlign: 'left' }
        let userInfoBoardItems = [
            {
                // title: '基本信息',
                list: [
                    {
                        label: '姓名',
                        value: <div style={valueBtnStyle}>
                           <div>{this.state.userInfo.nickname }</div>
                        </div>,
                        labelStyle,
                        valueStyle: { flex: 1, fontSize: 14, lineHeight: '20px', color: '#333', paddingLeft: 20 }
                    },
                    {
                        label: '手机号',
                        value: <div style={valueBtnStyle}>
                           <div>{this.state.userInfo.mobile }</div>
                        </div>,
                        labelStyle,
                        valueStyle: { flex: 1, fontSize: 14, lineHeight: '20px', color: '#333', paddingLeft: 20 }
                    }, 
                    {
                        label: '机构全称',
                        value: <div style={valueBtnStyle}>
                            <div>{this.state.userInfo.company_name}</div>
                        </div>,
                        labelStyle,
                        valueStyle: { flex: 1, fontSize: 14, lineHeight: '20px', color: '#333', paddingLeft: 20 },

                    },
                    {
                        label: '头像',
                        value: <div style={valueBtnStyle}>
                            <img src={this.state.userInfo.avatar || require('../../../../assets/images/logo.png').default} style={{width:56, height:56, borderRadius:'50%'}}/>
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '部门',
                        value: <div style={valueBtnStyle}>
                            <div>{this.state.userInfo.department}</div>
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '职务',
                        value: <div style={valueBtnStyle}>
                            <div>{this.state.userInfo.position }</div>
                        </div> ,
                        labelStyle
                    },
                    {
                        label: '邮箱',
                        value: <div style={valueBtnStyle}>
                            <div>{this.state.userInfo.email}</div>
                        </div>,
                        labelStyle
                    },
                    {
                        label: '身份证号',
                        value: <div style={valueBtnStyle}>
                            <div>{this.state.userInfo.id_number}</div>
                        </div>,
                        labelStyle
                    },
                    {
                        label: '身份证正反照片',
                        value: <div style={valueBtnStyle}>
                            {
                               !this.state.userInfo.positive_card && !this.state.userInfo.reverse_card ?
                               <span>未上传</span>:
                               <>
                                    <img src={this.state.userInfo.positive_card || require('../../../../assets/images/card_positive.png')} alt='' style={{width: 202,height:118}}></img>
                                    <img src={this.state.userInfo.reverse_card || require('../../../../assets/images/card_positive.png')} alt='' style={{width: 202,height:118, marginLeft:10}}></img>
                               </>

                            }        
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '公司在职证明',
                        value: <div style={valueBtnStyle}>
                            {
                                this.state.userInfo.in_job ? 
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={this.state.userInfo.in_job}
                                        name={this.state.userInfo.in_job_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(this.state.userInfo.in_job);
                                        }}
                                    />
                                </div>:
                                <span>未上传</span>
                            }
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '工卡及名片同框照片',
                        value: <div style={valueBtnStyle}>
                            {
                                this.state.userInfo.job_card ? 
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={this.state.userInfo.in_job}
                                        name={this.state.userInfo.in_job_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(this.state.userInfo.in_job);
                                        }}
                                    />
                                </div>:
                                <span>未上传</span>
                            }
                        </div>,
                        labelStyle,
                    },
                    {
                        label: '其他有效证件',
                        value: <div style={valueBtnStyle}>
                            {
                                this.state.userInfo.other ? 
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={this.state.userInfo.other}
                                        name={this.state.userInfo.other_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(this.state.userInfo.other);
                                        }}
                                    />
                                </div> : 
                                <span>未上传</span>
                            }
                        </div>,
                        labelStyle: {...labelStyle, textAlign:'center'},
                    }

                ]
            },  
        ]
        return (
            <RLDisplayBoard style={{ width: '100%' }} className='base-info' items={userInfoBoardItems}></RLDisplayBoard>
        )
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>用户详情</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list',{
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
                <div style={{display:'flex', flexDirection:'column',alignItems:'center'}}>
                    {this.baseUserInfo()}
                    {/* <RLButton label="返回" 
                        type="primary"
                        onClick={ ()=> {
                            this.props.changePage('list',{
                                userPage: this.userPage
                            });
                        }}
                        style={{marginTop: 15}}/> */}
                </div>
            </WindowContainer>
        )
    }

}
export default connect((store, props) => {
    return {
        ...props,
        roleList: store.roleManage.roleList,
    }
})(CmpUserDetail)