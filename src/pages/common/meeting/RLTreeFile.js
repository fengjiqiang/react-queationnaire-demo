
import BaseCmp from '@components/BaseCmp.js'
import { RLCheckbox } from '@components/index.js'
import { connect } from 'react-redux';

class RLTreeFile extends BaseCmp {
    checkedFn = (e) => {
        let checked = e.target.checked
        this.props.treeChecked({ type: 'file', checked, targetItem: this.props.item })
    }
    render() {
        let item = this.props.item
        return (
            <div
                className={this.props.className ? this.props.className + ' rl-tree-file' : 'rl-tree-file'}
            >
                <RLCheckbox
                    label={item.name}
                    checked={this.props.item.checked}
                    onChange={this.checkedFn}
                />
            </div>
        )
    }
}
// export default RLTreeFile
export default connect((store, props) => {
    return {
        ...props,
        treeData: store.storeCommon._treeData
    }
})(RLTreeFile);