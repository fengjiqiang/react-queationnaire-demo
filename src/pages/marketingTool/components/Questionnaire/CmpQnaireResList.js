import BaseCmp from '@components/BaseCmp.js'
import WindowContainer from '@components/WindowContainer.js'
import { connect } from 'react-redux'
import {
    RLInput, RLButton, RLTable, RLFilterTool, RLSwitch, RLTooltip, RLModal, RLSelect
} from '@components/index.js'
import utils, { downloadUrl, downloadFile } from '@/libs/utils.js'
import config from '@/config.js'
import interfaces from '@/api/interfaces.js'
import { dealTime, dealTableTime, dealDateTime } from '@/libs/utils.js'
import locale from 'antd/es/date-picker/locale/zh_CN'
import moment from 'moment';
import actionQuestionnaire from '@actions/marketingTool/actionQuestionnaire.js'


class CmpQnaireResList extends BaseCmp {
    constructor(props) {
        super(props)
        this.qnaireId = props.qnaireId;
        this.qnairePage = props.page;
        this.state = {
            title: '',   // 问卷名称
            user_type: undefined,
            qnaireDetail: {
                question: "[]"
            },
            qnaireResListInfo: {
                pageNum: 1,  // 总页数
                count: 0,    // 总条数
                list: [],    // 数据数组
                page: 1,     // 当前第几页
            },
            getListLoading: true,   // 获取列表loading
            allSelect: [],    //所有选择ID集合
        }
       
        this.getQnaireDetail();
        this.getQnaireResList();
    }
    componentDidMount() {
        // this.getQnaireResList()
    }
    componentWillUnmount() {

    }
    getQnaireDetail(){
        actionQuestionnaire.getQnaireDetail({ id: this.qnaireId }).then(res => {
            if (res.code === 200) {
                const data = res.data
                this.setState({
                    qnaireDetail: {
                        ...data,
                        end_time_at: moment(dealTime(data.end_time_at, 'YYYY-MM-DD HH:mm')),
                    },
                });
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        })
    }
    getQnaireResList({ sign, page } = { sign: true, page: this.state.qnaireResListInfo.page }) {
        if (sign) {
            this.setState({
                getListLoading: true
            })
        }
        actionQuestionnaire.getSurveyList({
            id: this.qnaireId,
            user_type: this.state.user_type || 0,
            page,
            page_size: this.pageSize
        }).then(res => {
            if (res.code === 200) {
                if (res.date && res.data.list.length === 0 && page > 1) {
                    this.getQnaireResList({ page: page - 1 })
                } else {
                    let newState = {
                        qnaireResListInfo: {
                            list: res.data.list,
                            page,
                            count: res.data.count,
                            pageNum: Math.ceil(res.data.count / this.pageSize)
                        }
                    }
                    this.setState(newState)
                }
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).finally(() => {
            this.setState({
                getListLoading: false
            })
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>调查结果</span>
                <RLButton
                    label="返回"
                    onClick={() => {
                        this.props.changePage('list', {
                            page: this.qnairePage
                        })
                    }}
                />
            </div>
        )
    }
    getLeftItems = () => {
        return ([
            <div style={{fontSize:16,fontWeight:400}}>
                问卷主题: {this.state.qnaireDetail.title}
            </div>
        ])
    }
    getRightItems = () => {
        return ([
            <RLSelect placeholder='用户类型'
                options={[
                    {label: '认证用户',value: 2},
                    {label: '普通用户', value: 1},
                    {label: '游客', value: 3}
                ]}
                allowClear={true}
                style={{ width: 240, marginRight: 12 }}
                key='user_type'
                value={this.state.user_type}
                onChange={val => {
                    this.setState({
                        user_type: val
                    }, ()=>{
                        this.getQnaireResList();
                    })
                }}
            />,
            <RLButton 
                label="批量导出"
                type="primary"
                onClick={() => {
                    actionQuestionnaire.surveyResultExport({ qid: this.qnaireId, ids: this.state.allSelect.join(',') }).then(res => {
                        if (res.code === 200) {
                            downloadFile(res.data, '问卷调查结果.xlsx')
                            this.setState({
                                allSelect: []
                            })
                        } else {
                            this.showToast({ type: 'error', content: '导出文件出错' })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }}
                disabled={this.state.allSelect.length <= 0}
            />
        ])
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        let i = 0
        let currentPage = this.state.qnaireResListInfo.list
        let allSelect = [...this.state.allSelect]
        for (i; i < currentPage.length; i++) {
            let isInSelect = selectedRowKeys.findIndex(ele => { return ele == currentPage[i].id })
            let isInOrigin = allSelect.findIndex(ele => { return ele == currentPage[i].id })
            // 取消勾选
            if (isInSelect === -1 && isInOrigin !== -1) {
                allSelect.splice(isInOrigin, 1)
            }
            // 勾选
            else if (isInSelect !== -1 && isInOrigin === -1) {
                allSelect.push(selectedRowKeys[isInSelect])
            }
            this.setState({
                allSelect: [...allSelect]
            })
        }
    }

    pageChange = (page, pageSize) => {
        this.getQnaireResList({ page })
    }

    render() {
        const questions = JSON.parse(this.state.qnaireDetail.question);
        const questionColumns = questions.map((item, index) => {
            return {
                title: questions[index].title,
                key: questions[index].title,
                // width: (100 / questions.length).toFixed(1) + '%',
                width: 400,
                render: (text, record) => <RLTooltip placement="bottomLeft" title={JSON.parse(record.answer)[questions[index].questionId]}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.parse(record.answer)[questions[index].questionId]}
                    </div>
                </RLTooltip>
            }
        });
        this.columns = [
            {
                title: '序号',
                key: 'index',
                width: '80px',
                fixed: 'left',
                render: (text, record, index) =>{
                    return <div>{this.pageSize * (this.state.qnaireResListInfo.page - 1) + index + 1}</div>
                }
            },
            {
                title: '用户昵称',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '130px',
                fixed: 'left',
                render: (text, record) => <RLTooltip placement="bottomLeft" title={record.nickname}>
                    <div className='line-clamp-noColor' style={{display:'flex',flexDirection:'column'}}>
                        <div>{record.nickname}</div>
                        {
                            record.user_type === 2 && <div>(认证用户)</div>
                        }
                    </div>
                </RLTooltip>
            },
            {
                title: '提交时间',
                dataIndex: 'nickname',
                key: 'nickname',
                width: '130px',
                render: (text, record) => <div>
                    {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm')}
                </div>
            },
            {
                title: '得分',
                dataIndex: 'score',
                key: 'score',
                width: '100px'
            },
          
            ...questionColumns,
        ]
        const { list, count, page } = this.state.qnaireResListInfo
        let colLength = questions.length * 400 + 440
        return (
            <WindowContainer title={this.pageTitle}>
                <div className="page-qnaire-result-list">
                    <RLFilterTool leftItems={this.getLeftItems} rightItems={this.getRightItems} />
                    <RLTable
                        ref={t => this.table = t}
                        loading={this.state.getListLoading}
                        dataSource={list}
                        rowKey='id'
                        columns={this.columns}
                        rowSelection= {{
                            type: 'checkbox',
                            selectedRowKeys: this.state.allSelect,
                            onChange: this.onSelectChange,
                            getCheckboxProps: (record) => ({
                                disabled: false
                            })
                        }}
                        paginationInfo={{
                            total: count,
                            pageSize: this.pageSize,
                            onChange: this.pageChange,
                            current: page
                        }}
                        rowClassName='rl-table-click-row'
                        scroll={{ x: colLength }}
                    />
                    {
                        this.state.shareModal && this.renderShare()
                    }
                </div>
            </WindowContainer>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props
    }
})(CmpQnaireResList)