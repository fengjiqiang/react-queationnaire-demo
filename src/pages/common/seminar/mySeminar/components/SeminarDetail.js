import React, { Component } from 'react'
import { Modal, Button, Input, message, Alert } from "antd"
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import actionSeminar from '@actions/seminar/actionSeminar.js'
import BaseCmp from '@components/BaseCmp.js'
// import { black } from 'chalk';
// import add_1 from "../../../../assets/add_1.svg"
import CancelSeminar from "./CancelSeminar"
import { connect } from 'react-redux';
// import { pullUpHost } from '../../../../env'

class SeminarDetail extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            invitedHonourShow: 0,
            invitedViewerShow: 0,
            invitedViewerValue: "",
            detailInfo: {},
            list: [],
            listCopy: [],
            preserveDisable: 0,
            cancelShow: 0,
            deleteShow: 0,
            endShow: 0,
            data: {
                type: null,
                title: null,
                text: null,
                btn: null
            },
            honourDiv: [{
                key: 0,
                isfalse: 0,
                isNull: 0,
                username: "",
                value: ""
            }],

        }
    }

    getDetailInfo = () => {
        let param = {
            meeting_id: this.props.seminarid + ""
        }
        actionSeminar.seminarDetail().then(res => {
            console.log('获取研讨会详情---res:', res)
            if (res.code === 200) {
                let clist = res.data.list
                clist.forEach((v, i) => {
                    v.resend = 1
                })
                this.setState({
                    detailInfo: res.data.info,
                    list: clist,
                    listCopy: clist
                }, () => { console.log(this.state.list) })
            } else {
                this.showToast(res.msg)
            }
        })
    }

    //打开邀请嘉宾
    invitedHonour = () => {
        this.setState({
            invitedHonourShow: 1,
            list: this.state.listCopy
        })
    }

    //关闭对话框
    closeHandler = () => {
        let clist = [...this.state.list]
        clist.forEach((v, i) => {
            v.resend = 1
        })
        this.setState({
            invitedHonourShow: 0,
            list: clist,
            honourDiv: [{
                key: 0,
                isfalse: 0,
                username: "",
                value: ""
            }]
        })
    }
    closeHandlerV = () => {
        this.setState({
            invitedViewerShow: 0
        })
    }
    closeHandlerT = () => {
        this.setState({
            cancelShow: 0,
            deleteShow: 0,
            endShow: 0,
            data: {
                type: null,
                title: null,
                text: null,
                btn: null
            },
        })
    }

    //会话框内添加嘉宾
    addHonour = () => {
        let donourD = [...this.state.honourDiv, {
            key: this.state.honourDiv.length,
            username: "",
            value: ""
        }]
        this.setState({
            honourDiv: donourD
        }, () => {
            let inviteHonou = document.querySelector(".inviteHonou")
            inviteHonou.scrollTop = inviteHonou.scrollHeight
        })
    }

    //删除对话框内嘉宾
    deleteHonourDiv = (i) => {
        return () => {
            let honourD = [...this.state.honourDiv]
            honourD.splice(i, 1)
            this.setState({
                honourDiv: honourD
            })
        }
    }

    //输入框输入改变时
    inputChange = (key) => {
        return (e) => {
            if (e.target.id === 'name' && e.target.value.length > 12) return
            let hD = [...this.state.honourDiv]
            hD.forEach((v, i) => {
                if (v.key === key) {
                    if (e.target.id === "name") {
                        v.username = e.target.value
                    } else {
                        v.value = e.target.value
                    }
                }
                return
            })
            this.setState({
                honourDiv: hD
            })
        }
    }

    //输入框获取焦焦点
    inputOnFocus = (key) => {
        return (e) => {
            let hD = [...this.state.honourDiv]
            if (e.target.id === "name") {
                hD.forEach((v, i) => {
                    if (v.key === key) {
                        v.isNull = 0
                    }
                })
                this.setState({
                    honourDiv: hD
                })
                return
            } else {
                hD.forEach((v, i) => {
                    if (v.key === key) {
                        v.isfalse = 0
                    }
                })
                this.setState({
                    honourDiv: hD
                })
                return
            }
        }
    }


    //输入框失去焦点
    inputOnBlur = (key) => {
        return (e) => {
            console.log(e.target.value);
            if (e.target.id === "value") {
                let emaliReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/
                let phoneReg = /^1\d{10}$/
                let isTrue = emaliReg.test(e.target.value.replace(/(^\s*)|(\s*$)/g, '')) || phoneReg.test(e.target.value.replace(/(^\s*)|(\s*$)/g, ''))
                let hD = [...this.state.honourDiv]
                if (!isTrue) {
                    hD.forEach((v1, i1) => {
                        if (v1.key === key) {
                            v1.isfalse = 1
                            v1.value = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
                        }
                    })
                    this.setState({
                        honourDiv: hD
                    })
                    return
                }
            }
            let hD = [...this.state.honourDiv]
            hD.forEach((v, i) => {
                if (v.key === key) {
                    if (e.target.id === "name") {
                        v.username = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
                    } else {
                        v.value = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
                    }
                }
                return
            })
            this.setState({
                honourDiv: hD
            })
        }
    }

    //重新发送邀请
    resendPreserve = (v, i) => {
        return () => {
            if (!v.resend) return
            // let url = "/api/v1/seminar/sendMessage"
            let param = {
                meeting_id: this.props.seminarid + "",
                username: v.username,
                value: v.value
            }
            actionSeminar.seminarSend(param).then(res => {
                console.log('重新发送邀请--res:', res)
                if (res.code === 200) {
                    let clist = [...this.state.list]
                    clist[i].resend = 0
                    this.setState({
                        list: clist
                    })
                } else {
                    this.showToast(res.msg)
                }
            })
        }
    }

    //获取星期
    getWeek = (dateString) => {
        let dateArray = dateString.split("-");
        let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        return "周" + "日一二三四五六".charAt(date.getDay());
    };
    //获取复制信息
    getCopyMessage = (type, value) => {
        let { title, start_date, start_time, end_date, end_time, room_id, password } = this.state.detailInfo
        let vivewUrl = ""
        this.state.list.forEach((v, i) => {
            if (v.username === "游客") return vivewUrl = v.url
        })
        let sDate = start_date.split("-").join(".")
        let eDate = end_date.split("-").join(".")
        let sWeek = this.getWeek(start_date)
        let eWeek = this.getWeek(end_date)
        let sTime = start_time.substring(0, 5)
        let eTime = end_time.substring(0, 5)
        let time
        if (start_date === end_date) {
            time = sDate + " " + sWeek + " " + sTime + "~" + eTime
        } else {
            time = sDate + " " + sWeek + " " + sTime + " ~ " + eDate + " " + eWeek + " " + eTime
        }
        let nickName = "XXX"
        // let nickName = this.props.currentUser.name ? this.props.currentUser.name : "XXX"
        let Url2 = ""
        if (type === "honour") {
            Url2 = value.username + " 您好！" +
                "\n" +
                '\n您收到了参加Boom网络研讨会的邀请' +
                '\n会议主题：' + title +
                '\n会议时间：' + time +
                '\n\n通过Windows、Mac、iPhone或者Android设备加入：' +
                '\n点击链接，加入网络研讨会' +
                '\n' + value.url +
                '\n注意：这是您的专属链接，不得与其他人分享。' +
                '\n\n网络研讨会ID：' + room_id +
                '\n密码：' + (password ? password : "无")
        } else {
            Url2 = nickName + " 邀请您参加Boom网络研讨会" +
                '\n会议主题：' + title +
                '\n会议时间：' + time +
                '\n\n点击链接，加入网络研讨会' +
                '\n' + vivewUrl +
                '\n\n网络研讨会ID：' + room_id +
                '\n密码：' + (password ? password : "无")
        }

        return Url2
    }
    //复制嘉宾邀请
    copyHonourDiv = (v) => {
        return () => {
            let Url2 = this.getCopyMessage("honour", v)
            let oInput = document.createElement('textarea');
            oInput.value = Url2;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand('Copy')
            oInput.className = 'oInput';
            oInput.style.display = 'none';
            message.destroy();
            message.success('复制成功')
        }
    }

    //删除已发送信息的嘉宾
    deleteHonourList = (i) => {
        return () => {
            let clist = [...this.state.list]
            clist.splice(i, 1)
            this.setState({
                list: clist
            })
        }
    }

    //邀请观众
    invitedViewer = () => {
        let message = this.getCopyMessage("vivew")
        this.setState({
            invitedViewerShow: 1,
            invitedViewerValue: message
        })
    }

    //复制观众邀请
    copyViewerDiv = () => {
        let oInput = document.createElement('textarea');
        oInput.value = this.state.invitedViewerValue
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand('Copy')
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        message.destroy();
        this.closeHandlerV()
        message.success('复制成功')
    }

    //开始、加入会议
    seminarStart = (record) => {
        return (e) => {
            console.log(record);
            e.stopPropagation()
            let hushKey = record.split("?")[1]
            // let url = pullUpHost + "?" + hushKey
            // window.open(url)
        }
    }

    //打开取消、结束、删除研讨会对话框
    clickHandler = (id) => {
        return (e) => {
            e.stopPropagation()
            console.log(e.target.innerText);
            switch (e.target.innerText) {
                case "取消研讨会":
                    this.setState({
                        cancelShow: id,
                        data: {
                            type: "cancel",
                            title: "取消会议",
                            text: "您是会议的创建者，取消后其他成员将无法入会。",
                            btn: "我再想想"
                        }
                    })
                    break;
                case "结束研讨会":
                    this.setState({
                        endShow: id,
                        data: {
                            type: "end",
                            title: "结束会议",
                            text: "您是否确定结束此网络研讨会？",
                            btn: "取消"
                        }
                    })
                    break;
                case "删除":
                    this.setState({
                        deleteShow: id,
                        data: {
                            type: "delete",
                            title: "删除会议",
                            text: "您是会议的创建者，删除后其他成员将无法入会。",
                            btn: "取消"
                        }
                    })
                    break;
                default: break;
            }
        }
    }

    //编辑会议
    seminarEdit = (id) => {
        return (e) => {
            console.log(id);
            e.stopPropagation()
            // this.props.history.push({ pathname: '/meeting/seminar/reservedseminar/' + record })
            this.props.changePage('edit', { seminarid: id })
        }
    }

    //footer
    footDiv = (joinUrl) => {
        if (this.state.detailInfo.status === 0) {
            return (
                <div style={{ width: "100%", height: 32, display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                    <div
                        onClick={this.clickHandler(this.props.id)}
                        style={{ width: 120, height: 30, color: "#333333", border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>取消研讨会</div>
                    <div
                        onClick={this.seminarEdit(this.props.id)}
                        style={{ width: 120, height: 30, color: "#333333", marginLeft: 40, marginRight: 40, border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>编辑研讨会</div>
                    <div
                        onClick={this.seminarStart(joinUrl)}
                        style={{ width: 120, height: 30, color: "#ffffff", backgroundColor: "#5584ff", border: "none", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>开始研讨会</div>
                </div>
            )
        } else if (this.state.detailInfo.status === 1) {
            return (
                <div style={{ width: "100%", height: 32, display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                    <div
                        onClick={this.clickHandler(this.props.seminarid + "")}
                        style={{ width: 120, height: 30, color: "#333333", border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>结束研讨会</div>
                    <div
                        onClick={this.seminarStart(joinUrl)}
                        style={{ width: 120, height: 30, marginLeft: 40, color: "#ffffff", backgroundColor: "#5584ff", border: "none", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>立即加入</div>
                </div>
            )
        } else {
            return (
                <div style={{ width: "100%", height: 32, display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                    <div
                        onClick={this.clickHandler(this.props.seminarid + "")}
                        style={{ width: 88, height: 30, color: "#333333", border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>删除</div>
                    <div
                        onClick={() => {
                            // this.props.history.push("/meeting/seminar")
                            this.props.changePage('list')
                        }}
                        style={{ width: 88, height: 30, marginLeft: 40, color: "#ffffff", backgroundColor: "#5584ff", border: "none", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>返回</div>
                </div>
            )
        }
    }

    //保存嘉宾
    preserveHonour = () => {
        this.setState({
            preserveDisable: 1
        })
        let honourDivs = [...this.state.honourDiv]
        let hList = this.state.list.filter((v3, i3) => { return v3.is_master !== 1 && v3.is_guest !== 1 })
        let error = 0
        let honourDiv = honourDivs.filter((v, i) => {
            return (!(!v.isfalse && v.username.replace(/(^\s*)|(\s*$)/g, '') === "" && v.value.replace(/(^\s*)|(\s*$)/g, '') === ""))
        })

        honourDiv.forEach((v, i) => {
            let newName = v.username.replace(/(^\s*)|(\s*$)/g, '')
            let newValue = v.value.replace(/(^\s*)|(\s*$)/g, '')
            if (!v.isfalse) {
                if (newName === "" && newValue === "") return error = 0
                if (newName === "" || newValue === "") {
                    error = 1
                    if (newName === "") v.isNull = 1
                    if (newValue === "") v.isfalse = 1
                    return
                }
            }
            if (v.isfalse) return error = 2
        })
        if (error === 1) {
            message.error("您有必填项未填写")
            let nameInput = document.querySelectorAll("#name")
            let nameInputNulls = Array.from(nameInput).filter((vn) => {
                return !vn.value
            })

            if (nameInputNulls.length > 0) nameInputNulls[0].focus()
            this.setState({
                preserveDisable: 0,
                honourDiv
            })
            return
        }
        if (error === 2) {
            this.setState({
                preserveDisable: 0
            })
            return
        }
        let preserveList = []
        hList.forEach((vh) => {
            let preObj = {
                username: vh.username.replace(/(^\s*)|(\s*$)/g, ''),
                value: vh.value.replace(/(^\s*)|(\s*$)/g, '')
            }
            preserveList.push(preObj)
        })
        honourDiv.forEach((vd) => {
            let preseObj = {
                username: vd.username.replace(/(^\s*)|(\s*$)/g, ''),
                value: vd.value.replace(/(^\s*)|(\s*$)/g, '')
            }
            preserveList.push(preseObj)
        })
        let preserveJson = JSON.stringify(preserveList)
        //调用接口，保存嘉宾
        let param = {
            meeting_id: this.props.seminarid + "",
            list: preserveJson
        }
        let url = "/api/v1/seminar/preserve"
        message.loading({ content: '正在保存...', key: "preserve" })
        message.destroy();
        actionSeminar.seminarInvite().then(res => {
            console.log('保存研讨会邀请嘉宾列表--res:', res)
            if (res.code === 200) {
                this.setState({
                    preserveDisable: 0
                })
                this.getDetailInfo()
                this.closeHandler()
            } else {
                this.showToast(res.msg)
                this.setState({
                    preserveDisable: 0
                })
            }
        })
    }

    componentWillMount() {
        this.getDetailInfo()
    }
    render() {
        if (!this.state.list.length > 0) return (<div></div>)
        let joinUrl = ''
        let honourDiv = this.state.honourDiv;
        let { title, start_date, start_time, end_date, end_time, room_id, is_password, password, video_master, video_honour, status } = this.state.detailInfo
        let newStartTime = start_time && (start_time.split(':')[0] + ':' + start_time.split(':')[1])
        let newEndTime = end_time && (end_time.split(':')[0] + ':' + end_time.split(':')[1])
        let honourList = this.state.list.filter((v1, i1) => { return v1.is_master !== 1 && v1.is_guest !== 1 })
        let audience = ''
        if (this.state.list.length > 0) {
            this.state.list.forEach(i => {
                if (i.is_guest) {
                    audience = i.url
                }
                if (i.is_master) {
                    joinUrl = i.url
                }
            })
        }
        return (
            <PageHeaderWrapper title={'网络研讨会详情'}>
                <div
                    className="my-container"
                    style={{
                        width: '100%',
                        position: "relative",
                        paddingTop: 20,
                        paddingBottom: 30,
                        backgroundColor: '#ffffff',
                    }}>
                    {status === 2 ? null : (
                        <Button
                            onClick={this.seminarStart(joinUrl)}
                            style={{ width: 120, height: 30, color: "#ffffff", backgroundColor: "#5584ff", border: "none", position: "absolute", top: 20, right: 20 }}>{status ? "加入研讨会" : "开始研讨会"}</Button>
                    )}

                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>会议主题</div>
                        <div style={{ width: 700, minHeight: 20, }}>{title}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>开始时间</div>
                        <div style={{ width: 700, minHeight: 20, }}>{start_date + " " + newStartTime}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>结束时间</div>
                        <div style={{ width: 700, minHeight: 20, }}>{end_date + " " + newEndTime}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>网络研讨会ID</div>
                        <div style={{ width: 700, minHeight: 20, }}>{room_id}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>研讨会密码</div>
                        <div style={{ width: 700, minHeight: 20, }}>{is_password ? null : "无"}{password}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>视频</div>
                        <div >
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ width: 50, marginRight: 30 }}>主持人</div>
                                <div>{video_master ? "开" : "关"}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
                                <div style={{ width: 50, marginRight: 30 }}>嘉宾</div>
                                <div>{video_honour ? "开" : "关"}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: 740, marginLeft: 80, marginTop: 20, borderTop: "1px dashed #dcdfe6" }}></div>
                    <div style={{ width: 810, display: "flex", flexDirection: "row", marginTop: 20, position: "relative" }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>邀请嘉宾</div>
                        <div style={{ width: 550, minHeight: 20 }}>
                            {!honourList.length ? (<span style={{ color: "#999999" }}>未邀请嘉宾</span>) : (
                                honourList.map((v, i) => {
                                    // display: black, 
                                    return (
                                        <span style={{ float: "left" }}>{v.username}（{v.value}）,</span>
                                    )
                                })
                            )}
                        </div>
                        {status === 2 ? null : (
                            <div
                                style={{ position: 'absolute', top: 0, right: 0, color: "#216BFF", cursor: "pointer" }}
                                onClick={this.invitedHonour}>邀请</div>
                        )}

                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: 20, width: 810, position: "relative" }}>
                        <div style={{ width: 162, height: 20, marginRight: 20, textAlign: "right" }}>邀请观众</div>
                        <div style={{ width: 550, minHeight: 20, }}>
                            <div>网络研讨会规模： 100人</div>
                            <div>加入网络研讨会的链接：{audience}</div>
                        </div>
                        {status === 2 ? null : (
                            <div
                                onClick={this.invitedViewer}
                                style={{ position: "absolute", top: 0, right: 0, color: "#216BFF", cursor: "pointer" }}>邀请观众</div>
                        )}
                    </div>
                    {this.footDiv(joinUrl)}
                </div>
                <Modal
                    title="邀请嘉宾"
                    width={800}
                    visible={this.state.invitedHonourShow}
                    onCancel={this.closeHandler}
                    footer={<div>
                        <Button
                            onClick={this.closeHandler}
                            style={{ width: 80, height: 40, border: "1px solid #dcdfe6", borderRadius: 4, color: "#666666", marginRight: 20 }}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={this.preserveHonour}
                            disabled={this.state.preserveDisable}
                            style={{ width: 80, height: 40, backgroundColor: "#4d88fe", border: "none", borderRadius: 4, color: "#fff", marginRight: 40, marginLeft: 20 }}
                        >
                            保存
                        </Button>
                    </div>}
                >
                    <div className={"inviteHonou"} style={{ width: "100%", height: 400, overflowY: "auto", overflowX: "hidden" }}>
                        <div style={{ color: "#000000", fontWeight: 500, marginLeft: 20, marginRight: 20 }}>
                            邀请成员作为网络研讨会的嘉宾
                            </div>
                        <div style={{ width: "100%", marginLeft: 20 }}>
                            <div style={{ width: "100%", height: 40, marginTop: 10, display: "flex", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #dcdfe6", color: "#333333" }}>
                                <div style={{ width: 200 }}>名称</div>
                                <div>手机号/邮箱</div>
                            </div>
                        </div>
                        <div className="addHonouDiv" style={{ width: "100%", marginLeft: 20 }}>
                            {honourList.map((vl, il) => {
                                return (
                                    <div style={{ width: "100%", height: 50, display: "flex", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #dcdfe6", color: "#333333", position: "relative" }}>
                                        <div style={{ width: 200 }}>
                                            {vl.username}
                                        </div>
                                        <div>
                                            {vl.value}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", position: "absolute", right: 25 }}>
                                            <div
                                                onClick={this.resendPreserve(vl, il)}
                                                style={{ width: 60, height: 30, border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#999999", cursor: "pointer" }}>
                                                {vl.resend ? "重新发送" : "已发送"}</div>
                                            <div
                                                onClick={this.copyHonourDiv(vl)}
                                                style={{ width: 60, height: 30, border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#999999", cursor: "pointer", marginLeft: 20 }}>
                                                复制</div>
                                            <div
                                                onClick={this.deleteHonourList(il)}
                                                style={{ width: 60, height: 30, border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#999999", cursor: "pointer", marginLeft: 20 }}>
                                                删除</div>
                                        </div>
                                    </div>
                                )
                            })}
                            {honourDiv.map((v, i) => {
                                return (
                                    <div style={{ width: "100%", marginTop: 10, display: "flex", flexDirection: "row", borderBottom: "1px solid #dcdfe6", color: "#333333", position: "relative" }}>
                                        <div style={{ width: 200, marginBottom: 10 }}>
                                            <Input
                                                id="name"
                                                autoComplete="off"
                                                value={v.username}
                                                onFocus={this.inputOnFocus(i)}
                                                onBlur={this.inputOnBlur(i)}
                                                onChange={this.inputChange(i)}
                                                placeholder={'名称'}
                                                style={{ width: 160, border: v.isNull ? '1px solid red' : "1px solid #d9d9d9" }}></Input>
                                            {v.isNull ? (<div style={{ marginTop: 5, color: "#FF5656" }}>此字段为必填字段</div>) : null}
                                        </div>
                                        <div style={{ marginBottom: 10 }}>
                                            <Input
                                                id="value"
                                                autoComplete="off"
                                                value={v.value}
                                                style={{ width: 300, border: v.isfalse ? '1px solid red' : "1px solid #d9d9d9" }}
                                                onChange={this.inputChange(i)}
                                                onBlur={this.inputOnBlur(i)}
                                                onFocus={this.inputOnFocus(i)}
                                                placeholder={'请输入手机号或邮箱'}
                                            ></Input>
                                            {v.isfalse ? (<div style={{ marginTop: 5, color: "#FF5656" }}>请输入一个正确的手机号或邮箱</div>) : null}
                                        </div>
                                        <div
                                            onClick={this.deleteHonourDiv(i)}
                                            style={{ width: 60, height: 30, border: "1px solid #dcdfe6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#999999", position: "absolute", right: 25, cursor: "pointer" }}>
                                            删除</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div
                            onClick={this.addHonour}
                            style={{ width: 120, marginLeft: 20, marginTop: 15, display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }}>
                            {/* <img src={add_1} alt="" /> */}
                            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 400, textAlign: "center", color: "#4d88fe" }}>添加一名嘉宾</span>
                        </div>
                    </div>
                </Modal>
                <Modal
                    title="邀请观众"
                    width={800}
                    visible={this.state.invitedViewerShow}
                    onCancel={this.closeHandlerV}
                    footer={
                        <div style={{ width: "100%", height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Button
                                onClick={this.copyViewerDiv}
                                style={{ width: 120, height: 40, background: "#4d88fe", borderRadius: 4, border: "none", color: "#FFFFFF" }}>
                                复制邀请信息
                            </Button>
                        </div>
                    }>
                    <div style={{ whiteSpace: "pre-wrap", marginLeft: 80 }}>
                        {this.state.invitedViewerValue}
                    </div>
                </Modal>
                <CancelSeminar
                    isShow={this.state.cancelShow || this.state.endShow || this.state.deleteShow}
                    data={this.state.data}
                    // history={this.props.history}
                    closeHandler={this.closeHandlerT}>
                </CancelSeminar>
            </PageHeaderWrapper>
        )
    }
}

export default connect(({ user }) => ({
    // currentUser: user.currentUser,
}))(SeminarDetail);
