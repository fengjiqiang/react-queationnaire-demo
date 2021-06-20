
import BaseCmp from '@components/BaseCmp.js'
import RLCheckbox from './RLCheckbox.js'
import RLTreeFile from './RLTreeFile.js'
import { connect } from 'react-redux';

class RLTreeFolder extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            showChildren: true,
        }
    }
    checkAllFn = (e) => {
        let checked = e.target.checked
        this.props.treeChecked({ type: 'folder', checked, targetItem: this.props.item })
    }
    render() {
        let item = this.props.item
        return (
            <div className='rl-tree-folder tree-item folder-item'>
                <div className='folder-title'
                    onClick={() => {
                        this.setState({
                            showChildren: !this.state.showChildren
                        })
                    }}
                >
                    <RLCheckbox
                        label={item.name}
                        checked={this.props.item.checked}
                        indeterminate={this.props.item.indeterminate}
                        onChange={this.checkAllFn}
                    />
                    <img
                        alt=''
                        src={require('../assets/images/array_right.png').default}
                    />
                </div>
                {
                    this.state.showChildren && <div className='file-container'>
                        {(() => {
                            return this.props.item.children.map(i => {
                                if (i.type === 'file') {
                                    return <RLTreeFile
                                        key={i.id}
                                        treeData={this.props.treeData}
                                        item={i}
                                        treeChecked={this.props.treeChecked}
                                    />
                                } else {
                                    return <RLTreeFolder
                                        key={i.id}
                                        treeData={this.props.treeData}
                                        item={i}
                                        treeChecked={this.props.treeChecked}
                                    />
                                }

                            })
                        })()}
                    </div>
                }

            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
    }
})(RLTreeFolder);