
/*
options

*/

import BaseCmp from '@components/BaseCmp.js'
import RLKVList from './RLKVList.js'
class RLDisplayBoard extends BaseCmp {
    render() {
        return (
            <div className={this.props.className ? this.props.className + ' rl-displayBoard' : 'rl-displayBoard'} style={{ border: '1px solid #dcdfe6', borderRadius: 8, padding: 20, background: '#fff', ...this.props.style }}>
                <div className='border-item-container'>
                    {this.props.items && this.props.items.map((item, index) => {
                        if (!item) return null;
                        return (
                            <div className='board-item' key={index}>
                                {item.title && <div className='board-title'>
                                    <span>{item.title}</span>
                                </div>}
                                <RLKVList
                                    kvList={item.list}
                                    labelCol={this.props.labelCol}
                                    valueCol={this.props.valueCol}
                                    spaceWidth={this.props.spaceWidth}
                                    style={{ paddingLeft: 50 }}
                                    key={'board'}
                                />
                            </div>

                        )
                    })}
                </div>

                {this.props.children}
            </div>

        )
    }
}
export default RLDisplayBoard