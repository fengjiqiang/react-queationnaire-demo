
import BaseCmp from '@components/BaseCmp.js'
import RLCheckbox from './RLCheckbox.js'

class RLTreeFile extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    getItem = (item) => {
        if (item.type === 'folder') {
            return this.getFolder(item)
        } else if (item.type === 'file') {
            return this.getFile(item)
        }
    }
    getFolder = (item) => {
        return (
            <div className='tree-item folder-item'>
                <div className='folder-title'>
                    <RLCheckbox label={item.name} />
                    <img
                        src={require('../assets/images/array_right.png').default}
                    />
                </div>

                <div className='file-container'>
                    {(() => {
                        if (item.children && item.children.length) {
                            return item.children.map(i => {
                                return this.getItem(i)
                            })
                        }
                    })()}
                </div>
                {/* <div className='file-container'>
                    <div className='tree-item file-item'>
                        <RLCheckbox label='像个里拉' />
                    </div>
                </div> */}
            </div>
        )
    }
    getFile = (item) => {
        return (
            <div className='tree-item file-item'>
                <RLCheckbox label={item.name} />
            </div>
        )
    }
    render() {

        return (
            <div
                className={this.props.className ? this.props.className + ' rl-tree-file' : 'rl-tree-file'}
            >
                {/* <div className='tree-item folder-item'>
                    <div className='folder-title'>
                        <RLCheckbox label='我的设备' />
                        <img src={require('../assets/images/array_right.png').default} />
                    </div>
                    <div className='file-container'>
                        <div className='tree-item file-item'>
                            <RLCheckbox label='像个里拉' />

                        </div>
                    </div>
                </div>

                <div className='tree-item folder-item'>
                    <div className='folder-title'>
                        <RLCheckbox label='我的用户' />
                        <img src={require('../assets/images/array_right.png').default} />
                    </div>
                    <div className='file-container'>
                        <div className='tree-item file-item'>
                            <RLCheckbox label='像个里拉' />

                        </div>
                    </div>
                </div> */}

                {
                    this.state.treeData.map(item => {
                        return this.getItem(item)
                    })
                }
            </div>
        )
    }
}
export default RLTreeFile