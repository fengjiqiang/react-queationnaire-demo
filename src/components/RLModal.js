
/*
afterFix

*/

import { Modal } from 'antd';
import BaseCmp from '@components/BaseCmp.js'


class RLModal extends BaseCmp {
    render() {

        return (
            <Modal {...this.props}
                className={this.props.className ? this.props.className + ' rl-modal' : 'rl-modal'}
            >{this.props.children}</Modal>
        )
    }
}
export default RLModal