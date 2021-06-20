
/*
    leftItems
    rightItems
*/

import BaseCmp from '@components/BaseCmp.js'
class FilterTool extends BaseCmp {

    leftItems = () => {
        if (typeof this.props.leftItems === 'function') {
            return this.props.leftItems()
        } else if (typeof this.props.leftItems === 'object') {
            return this.props.leftItems
        }
    }
    rightItems = () => {
        if (typeof this.props.rightItems === 'function') {
            return this.props.rightItems()
        } else if (typeof this.props.rightItems === 'object') {
            return this.props.rightItems
        }
    }
    render() {
        return (
            <div
                className={this.props.className ? this.props.className + ' rl-filter' : 'rl-filter'}
                style={{ ...this.props.style }}>
                <div className='filter-left'>
                    {this.leftItems()}
                </div>
                <div className='filter-right'>
                    {this.rightItems()}
                </div>

            </div>

        )
    }
}
export default FilterTool