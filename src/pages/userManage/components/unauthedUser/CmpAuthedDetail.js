import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLDisplayBoard
} from '@components/index.js'

import actionUnauthedUserList from '@actions/userManage/actionUnauthedUserList.js'
import commonAction from '@actions/commonActions'
import utils from '@/libs/utils.js'
import interfaces from '@/api/interfaces'
import images from '@/libs/images/index.js'
import CmpFile from '@/pages/marketingTool/components/QAManage/CmpFile.js';
const commonImg = images.commonImg

class CmpAuthedDetail extends BaseCmp {
    constructor(props) {
        super(props)
        this.uuid = props.uuid
        this.approvalId = props.approvalId
        this.tabKey = props.tabKey
        this.page = props.page
        this.state = {
            authedUserInfo: {}
        }

    }
    componentWillMount() {
        this.getAuthedUserInfo()
    }
    getAuthedUserInfo = () => {
        const params = {
            uuid: this.uuid,
            approval_id: this.approvalId
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
                    label: '??????',
                    value: info.nickname,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '?????????',
                    value: info.mobile,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '????????????',
                    value: info.company_name,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '??????',
                    value: <div>
                        {
                            <img
                                alt=''
                                src={info.avatar || commonImg.logo}
                                style={{ height: 56, width: 56, borderRadius: '50%', cursor: 'pointer' }}
                            />
                        }
                    </div>,
                    labelStyle,
                    valueStyle,
                }, {
                    label: '??????',
                    value: info.department || '?????????',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '??????',
                    value: info.position || '?????????',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '??????',
                    value: info.email || '?????????',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '????????????',
                    value: info.id_number || '?????????',
                    labelStyle,
                    valueStyle,
                }, {
                    label: '????????????????????????',
                    value: info.positive_card && info.reverse_card ? <div>
                        <img
                            src={info.positive_card || require('../../../../assets/images/card_positive.png')}
                            alt=''
                            style={{ width: 202, height: 112 }}>
                        </img>
                        <img
                            src={info.reverse_card || require('../../../../assets/images/card_reverse.png')}
                            alt=''
                            style={{ width: 202, height: 112, marginLeft: 21 }}>
                        </img>
                    </div> : <span>?????????</span>,
                    labelStyle
                }, {
                    label: '????????????????????????',
                    value: info.in_job ? 
                    <div style={{marginTop: -12}}>
                        <CmpFile 
                            src={info.in_job}
                            name={info.in_job_desc}
                            editable={false}
                            click={()=>{
                                window.open(info.in_job);
                            }}
                        />
                    </div> : <span>?????????</span>,
                    labelStyle
                }, {
                    label: '???????????????????????????',
                    value: info.job_card ? 
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={info.job_card}
                                        name={info.job_card_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(info.job_card);
                                        }}
                                    />
                                </div>: 
                                <span>?????????</span>,
                    labelStyle
                }, {
                    label: '??????????????????',
                    value: info.other ? 
                                <div style={{marginTop: -12}}>
                                    <CmpFile 
                                        src={info.other}
                                        name={info.other_desc}
                                        editable={false}
                                        click={()=>{
                                            window.open(info.other);
                                        }}
                                    />
                                </div> : <span>?????????</span>,
                    labelStyle
                }, {
                    label: '????????????',
                    value: info.current && info.current.operate_status_desc,
                    labelStyle,
                    valueStyle
                }, {
                    label: '????????????',
                    value: info.current && info.current.remark,
                    labelStyle,
                    valueStyle,
                }
            ]
        }]
        return (
            <RLDisplayBoard
                style={{ width: '100%' }}
                valueCol={10}
                spaceWidth={20}
                items={authedUserInfo}>
            </RLDisplayBoard>
        )
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>????????????</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.changePage('list', { tabKey: this.tabKey, page: this.page })
                    }}
                    label='??????'
                />
            </div>
        )
    }

    render() {
        return (
            <WindowContainer title={this.pageTitle} className='authed-detail'>
                {this.baseUserInfo()}
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpAuthedDetail)
