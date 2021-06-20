import { Component } from 'react'
import { message, Modal } from 'antd';
import config from '@/config.js'
import eventBus from '@/libs/EventBus.js'
class BaseCmp extends Component {
    constructor(props) {
        super(props)
        this.themeColor = config.themeColor
        this.layoutBgColor = config.layoutBgColor
        this.pageSize = config.pageSize
    }
    // toast提示
    showToast(param) {
        let content, duration, type, onClose, style

        if (typeof param === 'string') {
            content = param
        } else if (typeof param === 'object') {
            content = param.content
            duration = param.duration
            type = param.type
            style = param.style
            onClose = param.onClose
        }
        duration = duration || 3
        type = type || 'info'
        style = style || {}

        onClose = onClose || function () { }
        if (typeof message[type] === 'function' && content) {
            message.destroy()
            message[type]({ content, duration, onClose, className: 'rl-message', style: {} })
        }
    }
    // 获取链接参数
    getParams(search) {
        let param = search.substring(1, search.length)

        console.log('res--spiit:', param)
        let paramArr = param.split('&')
        let paramObj = {}
        for (let i = 0; i < paramArr.length; i++) {
            let item = paramArr[i]
            if (!item) {
                continue
            }
            let itemArr = item.split('=')
            paramObj[itemArr[0]] = itemArr[1]
        }
        return paramObj
    }
    // 弹框
    showModal({
        title, content, okText = '确定', cancelText = '取消', singleText,
        onOk, onCancel, onSingle, count, size = 'big', className = ''
    }) {
        let sizeClassName = '-modal'
        sizeClassName = size + sizeClassName
        let modal;
        if (singleText) {
            modal = Modal.info()
            let singleTextDisplay
            if (count) {
                singleTextDisplay = singleText + '(' + count + 's)'
            } else {
                singleTextDisplay = singleText
            }
            modal.update({
                title,
                content,
                okText: singleTextDisplay,
                maskClosable: true,
                className: 'infoModal ' + sizeClassName + ' ' + className,

                onOk: () => {
                    onSingle && onSingle()
                }
            })
            if (count && count > 0) {
                count = Number(count)
                let timer = setInterval(() => {
                    count--
                    singleTextDisplay = singleText + '(' + count + 's)'
                    modal.update({
                        okText: singleTextDisplay,
                    })
                    if (count <= 0) {
                        clearInterval(timer)
                        onSingle && onSingle()
                        modal.destroy()
                    }
                }, 1000)
            }
        } else {
            modal = Modal.confirm()
            modal.update({
                title,
                content,
                cancelText: cancelText,
                okText: okText,
                maskClosable: true,
                className: 'confirmModal ' + sizeClassName + ' ' + className,
                onCancel: () => {
                    onCancel && onCancel()
                    modal.destroy()
                },
                onOk: () => {
                    if (onOk) {
                        return onOk()
                    } else {
                        return true
                    }

                }
            })
        }
        return modal

    }
    // 邀请弹窗
    showInviteModal(id) {
        eventBus.emit('show-invite-modal', {
            meetingId: id
        })
    }
    showRoomNumber(_room) {
        let room = String(_room)
        if (room.length > 6) {
            room = room.split('')
            room.splice(7, 0, ' ')
            room.splice(3, 0, ' ')
        } else {
            room = room.split('')
            room.splice(3, 0, ' ')
        }
        room = room.join('')
        return room
    }

}
// export default withRouter(BaseCmp)
export default BaseCmp