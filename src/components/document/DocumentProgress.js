import React from 'react'

import { Progress, Modal } from 'antd'
import './DocumentProgress.less'
import images from '@/libs/images'


export default class DocumentProgress extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            progressNum: 0,
            type: 1
        }
        this.uploadcancelImg = images.commonImg.imgUpdateIcon
    }
    changeProgressNum = (num) => {
        this.setState({
            progressNum: num
        })
    }
    changeType = (type) => {
        this.setState({
            type
        })
    }

    render() {
        let bigText
        let smallText
        let status
        if (this.state.type === 1) {
            bigText = '正在导入...'
            smallText = '快速导入中，请耐心等候'
            status = 'normal'
        } else if (this.state.type === 2) {
            bigText = '导入成功'
            smallText = ''
            status = 'success'
        } else {
            bigText = '导入失败'
            smallText = ''
            status = 'exception'
        }
        return <Modal
            visible={this.props.isShow}
            title={<div className='modalTitle'>
                导入本地文档
            </div>}
            onCancel={this.props.cancelProgress}
            footer={null}
            closeIcon={<div className='documentCloseIcon'>收起</div>}>
            <div className='conProgress'>
                <Progress
                    percent={this.state.progressNum}
                    status={status}
                    type="circle"
                    width={80}
                />
                <div className='doingText'>{bigText}</div>
                <div className='bottomText'>{smallText}</div>
                {this.state.type === 2 ? <div
                    onClick={this.props.cancelProgressOk}
                    className='btnBottom'
                >
                    <div className='btnBottomText'>确定</div>
                </div> : null}
            </div>
        </Modal>
    }
}
