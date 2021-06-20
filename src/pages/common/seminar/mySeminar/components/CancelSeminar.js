import React, { Component } from 'react'
import { Modal, Button, message } from "antd"
import actionSeminar from '@actions/seminar/actionSeminar.js'
import BaseCmp from '@components/BaseCmp.js'

export default class CancelSeminar extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            disabled: 0
        }
    }
    // 删除研讨会
    seminarDelete = () => {
        actionSeminar.seminarDelete({ meeting_id: this.props.isShow }).then(res => {
            console.log('删除研讨会---res：', res)
            if (res.code === 200) {
                if (this.props.getSeminarList) {
                    this.props.getSeminarList(this.props.pageCon.type, this.props.pageCon.page)
                } else {
                    this.props.changePage('list')
                }
                this.setState({
                    disabled: 0
                })
                this.props.closeHandler()
            } else {
                this.showToast(res.msg)
            }
        })
    }
    // 结束研讨会
    seminarClose = () => {
        actionSeminar.seminarClose({ meeting_id: this.props.isShow }).then(res => {
            console.log('结束研讨会---res：', res)
            if (res.code === 200) {
                if (this.props.getSeminarList) {
                    this.props.getSeminarList(this.props.pageCon.type, this.props.pageCon.page)
                } else {
                    this.props.changePage('list')
                }
                this.setState({
                    disabled: 0
                })
                this.props.closeHandler()
            } else {
                this.showToast(res.msg)
            }
        })
    }

    clickHandler = (type) => {
        return () => {

            switch (type) {
                case "cancel":
                    console.log(type);
                    this.seminarDelete()
                    break;
                case "end":
                    this.seminarClose()
                    break;
                case "delete":
                    this.seminarDelete()
                    break;
                default:
                    return
            }
        }
    }


    render() {
        let { isShow, data, closeHandler } = this.props
        return (
            <Modal
                title={data.title}
                visible={isShow}
                onCancel={closeHandler}
                footer={null}
                footer={
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center' }}>
                        <Button
                            onClick={closeHandler}
                            style={{
                                width: 100,
                                height: 40,
                                marginRight: 30,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                border: "1px solid #dcdfe6",
                                color: "#666666",
                                borderRadius: "4px"
                            }
                            }>{data.btn}</Button>
                        <Button
                            disabled={this.state.disabled}
                            onClick={this.clickHandler(data.type)}
                            style={{
                                width: 100,
                                height: 40,
                                marginLeft: 30,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#4d88fe",
                                border: "1px solid rgba(0,0,0,0)",
                                color: "#fff",
                                borderRadius: "4px"
                            }}>{this.props.btn ? this.props.btn : data.title}</Button>
                    </div>
                }>
                <p style={{ textAlign: "center" }}>{data.text}</p>
            </Modal>
        )
    }
}
