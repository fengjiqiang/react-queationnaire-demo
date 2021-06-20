import React from 'react'
import { Modal } from 'antd';

export default class LargeModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }
    render() {
        return (
            <Modal
                {...this.props}
                width={this.props.width ? this.props.width : 640}
                wrapClassName={this.props.wrapClassName ? this.props.wrapClassName + ' largeModal' : 'largeModal'}
                visible={this.state.visible}
                title={this.props.title}
                footer={null}
                onCancel={() => {
                    this.setState({
                        visible: false
                    })
                    this.props.onCancel && this.props.onCancel()
                }}

            >
                {this.props.children}
            </Modal>
        )
    }
}