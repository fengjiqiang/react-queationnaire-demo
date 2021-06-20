
/**
 * kvList=[{label,value}]
 * labelCol=4
 * valueCol=8
 */
import BaseCmp from '@components/BaseCmp.js'
import { Divider } from 'antd';

class RLKVList extends BaseCmp {

    render() {
        return (
            <div
                className={this.props.className ? this.props.className + ' rl-kvlist' : 'rl-kvlist'}
                style={{ ...this.props.style }}>
                {
                    this.props.kvList.map((item, index) => {
                        let label, value;
                        if (!item) {
                            return null
                        }
                        if (typeof item.label === 'function') {
                            label = item.label()
                        } else if (typeof item.label === 'object') {
                            label = item.label
                        } else if (typeof item.label === 'string') {
                            label = (
                                <span style={{ flex: this.props.labelCol || 4, textAlign: 'right', marginRight: this.props.spaceWidth || 0, fontSize: '12px', lineHeight: '17px', color: '#333', ...item.labelStyle }}>{item.label}</span>
                            )
                        }
                        if (typeof item.value === 'function') {
                            value = item.value()
                        } else if (typeof item.value === 'object') {
                            value = item.value
                        } else if (typeof item.value === 'string') {
                            value = (
                                <span style={{ flex: this.props.valueCol || 8, textAlign: 'left', fontSize: '12px', lineHeight: '17px', color: '#333', ...item.valueStyle }}>{item.value}</span>
                            )
                        }
                        return (
                            <>
                                <div style={{ display: 'flex', flexDirection: item.warp ? 'column': 'row', marginBottom: 20, alignItems: 'flex-start' }}
                                    key={index}
                                >
                                    {label}
                                    {value}
                                </div>
                                { item.separator? <Divider/> :null}
                            </>
                        )



                    })
                }
            </div>

        )
    }
}
export default RLKVList