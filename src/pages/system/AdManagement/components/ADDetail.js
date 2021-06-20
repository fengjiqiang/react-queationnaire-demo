import React from 'react';
import {
    RLButton,
    RLDisplayBoard,
    RLTag
} from '@components/index.js'
import WindowContainer from '@components/WindowContainer.js'
import BaseCmp from '@components/BaseCmp.js'
import { dealTableTime } from '@/libs/utils.js'
import { getADDetail } from '@actions/system/system.js'

class ADDetail extends BaseCmp {
    constructor(props) {
        super(props)
        this.ADid = this.props.id
        this.state = {
            ADDetail: {
                title: '',
                type: '首页banner',
                argument: '',
                argue_type: undefined,
                webapp: '',
                website: '',
                start_at: '',
                end_at: '',
                is_show: '',
                click_count: '',
                created_at: '',
                updated_at: ''
            }
        }

    }
    componentDidMount() {
        this.getADDetail(this.ADid)
    }
    getADDetail = (ADid) => {
        getADDetail({ id: ADid }).then(res => {
            if (res.code !== 200) {
                this.showToast({ type: 'error', content: '获取广告详情失败' })
            } else {
                let {
                    title,
                    type, argument, argue_type, webapp, website, start_at, end_at,
                    is_show, click_count, created_at, updated_at
                } = res.data;
                this.setState({
                    ADDetail: {
                        title,
                        type, argument, argue_type, webapp, website, start_at, end_at,
                        is_show, click_count, created_at, updated_at
                    }
                })
            }
        })
    }
    pageTitle = () => {
        return (
            <div className="custom-page-title">
                <span>广告详情</span>
                <RLButton
                    className="custom-page-title-btn"
                    type="default"
                    onClick={() => {
                        this.props.return && this.props.return()
                    }}
                    label='返回'
                />
            </div>
        )
    }
    render() {
        const { title,
            type, argument, argue_type, webapp, website, start_at, end_at,
            is_show, click_count, created_at, updated_at
        } = this.state.ADDetail
        let valueBtnStyle = {
            flex: 10,
            display: 'flex',
            flexDirection: 'row'
        }
        let labelStyle = {
            color: '#999',
            fontSize: 14,
            textAlign: 'left',
            width: 56,
            flex: 'none'
        }
        let valueStyle = {
            color: '#333',
            fontSize: 14
        }
        let basicBoxStyle = {
            width: 500,
            height: 200,
            border: '1px solid rgb(220, 223, 230)',
            borderRadius: 3,
            padding: '10px 10px 10px 10px',
            boxSizing: 'border-box'
        }
        let ADInfo = [
            {
                list: [
                    {
                        label: '广告主题',
                        value: title,
                        labelStyle,
                        valueStyle,
                    },
                    {
                        label: '广告类型',
                        labelStyle,
                        valueStyle,
                        value: (() => {
                            if (type == 'index') {
                                return '首页banner'
                            } else {
                                return null
                            }
                        })()
                    },
                    {
                        label: '开始时间',
                        labelStyle,
                        valueStyle,
                        value: dealTableTime(start_at)
                    },
                    {
                        label: '结束时间',
                        labelStyle,
                        valueStyle,
                        value: dealTableTime(end_at)
                    },
                    {
                        label: '广告状态',
                        labelStyle,
                        valueStyle,
                        value: is_show === 1 ? '已上线' : '未上线'
                    },
                    {
                        label: 'web轮播图片',
                        labelStyle,
                        valueStyle,
                        value: <div>
                            <img src={website} alt='' width='200' />
                        </div>
                    },
                    {
                        label: '移动端轮播图片',
                        labelStyle,
                        valueStyle,
                        value: <div>
                            <img src={webapp} alt='' width='200' />
                        </div>
                    },
                    {
                        label: '图片关联类型',
                        labelStyle,
                        valueStyle,
                        value: (() => {
                            if (argue_type == '1') {
                                return '会议'
                            } else if (argue_type == '2') {
                                return '直播'
                            } else if (argue_type == '3') {
                                return '链接地址'
                            } else if (argue_type == '4') {
                                return '点播'
                            }
                        })()
                    },
                    {
                        label: '图片关联信息',
                        labelStyle,
                        valueStyle,
                        value: (() => {
                            if (argue_type == '1') {
                                return `会议ID:${argument}`
                            } else if (argue_type == '2') {
                                return `直播ID:${argument}`
                            } else if (argue_type == '3') {
                                return `链接地址:${argument}`
                            } else if (argue_type == '4') {
                                return `点播ID:${argument}`
                            }
                        })()
                    },
                    // {
                    //     label: '点击人数',
                    //     labelStyle,
                    //     valueStyle,
                    //     value: click_count + ''
                    // },
                    {
                        label: '创建时间',
                        labelStyle,
                        valueStyle,
                        value: created_at
                    },
                    {
                        label: '更新时间',
                        labelStyle,
                        valueStyle,
                        value: updated_at
                    }
                ]
            }
        ]
        return (
            <div className="floatBox">
                <WindowContainer title={this.pageTitle} className='my-meeting-detail'>
                    <RLDisplayBoard
                        style={{ width: '100%', flex: 1 }}
                        labelCol={2}
                        valueCol={10}
                        spaceWidth={20}
                        className='meeting-info'
                        items={ADInfo}>
                    </RLDisplayBoard>
                </WindowContainer>
            </div>

        )
    }
}
export default ADDetail