import { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Button, message } from 'antd';
import HistorySeminar from './HistorySeminar.js';
import UpcomingSeminar from './UpcomingSeminar.js';
import actionSeminar from '@actions/seminar/actionSeminar.js'
import BaseCmp from '@components/BaseCmp.js'
const { TabPane } = Tabs;

class SeminarList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            type: 1,
            willlistLen: 0,
            comlistLen: 0,
            page: 1,
            data: "",
            willSeminarList: [],
            comSeminarList: []
        }
    }
    getSeminarList(type, page, num = 0) {

        // let url='/v1/meeting/lists'
        let url = '/api/v1/seminar/lists'
        let param = {
            type: type.toString(),
            page: page.toString(),
            pageSize: "20"
        }
        if (num) message.loading({ content: '正在刷新...', key: "renovate" })
        actionSeminar.getSeminarList(param).then(res => {
            console.log('获取研讨会列表成功--res：', res)
            if (res.code === 200) {
                let types = type + ""
                if (types === '1') {
                    this.setState({
                        willSeminarList: res.data.list,
                        willlistLen: res.data.count
                    })
                } else if (types === '2') {
                    this.setState({
                        comSeminarList: res.data.list,
                        comlistLen: res.data.count
                    })
                }
            } else {
                this.showToast(res.msg)
            }
        })
    }

    paginationAction = (page) => {
        this.setState({
            page,
        })
        this.getSeminarList(this.state.type, page)
    }

    componentWillMount() {
        this.getSeminarList(this.state.type, 1)
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            console.log(this.state.type, this.state.page);
            this.getSeminarList(this.state.type, this.state.page)
        }, 1000 * 60);
    }

    componentWillUnmount() {
        if (this.timer != null) {
            clearInterval(this.timer);
        }
    }

    render() {
        return (
            <PageHeaderWrapper
                title={'网络研讨会'}
            >
                <div >
                    <div
                        className="my-container"
                        style={{
                            width: '100%',
                            // height:406,
                            position: 'relative',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                                right: 20,
                                top: 8,
                            }}
                        >
                            <Button
                                style={{
                                    marginLeft: 12,
                                    marginRight: 12,
                                }}
                                onClick={() => {
                                    this.getSeminarList(this.state.type, this.state.page, 1)
                                }}
                            >
                                刷新
            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    // this.props.history.push({ pathname: '/meeting/seminar/reservedseminar/0000' })
                                    this.props.changePage('edit')
                                }}>
                                预约网络研讨会</Button>
                        </div>
                        <Tabs
                            onChange={tab => {
                                this.setState(
                                    {
                                        type: Number(tab),
                                        page: 1
                                    }
                                )
                                this.getSeminarList(tab, 1)
                            }}
                            style={{
                                minHeight: 300,
                                marginLeft: 20,
                            }}
                        >
                            <TabPane tab="即将召开的网络研讨会" key={1}>
                                <UpcomingSeminar
                                    ref="willconveneSeminar"
                                    // push={this.props.history.push}
                                    changePage={this.props.changePage}
                                    paginationAction={this.paginationAction}
                                    state={this.state}
                                    cancelHandler={this.cancelHandler}
                                    getSeminarList={this.getSeminarList.bind(this)}
                                />
                            </TabPane>
                            <TabPane tab="已结束的网络研讨会" key={2}>
                                <HistorySeminar
                                    ref="completeSeminar"
                                    state={this.state}
                                    // push={this.props.history.push}
                                    changePage={this.props.changePage}
                                    paginationAction={this.paginationAction}
                                    cancelHandler={this.cancelHandler}
                                    getSeminarList={this.getSeminarList.bind(this)}
                                />
                            </TabPane>
                        </Tabs>

                    </div>
                </div>

            </PageHeaderWrapper>
        );
    }
}

export default connect((store, props) => {
    return {
        ...props,
    }
})(SeminarList);