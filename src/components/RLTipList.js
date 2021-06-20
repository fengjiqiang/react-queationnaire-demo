
/*
afterFix

*/

import BaseCmp from '@components/BaseCmp.js'
class RLTipList extends BaseCmp {
    render() {
        let sign = null
        let textStyle = { lineHeight: '17px', fontSize: 12, color: '#999' }
        if (this.props.showSign !== false) {
            if (!this.props.sign) {
                sign = <span style={textStyle}>·</span>
            } else {
                switch (typeof this.props.sign) {
                    case 'string':
                        sign = <span style={textStyle}>{this.props.sign}</span>
                        break;
                    case 'object':
                        sign = this.props.sign
                        break;
                    case 'function':
                        sign = this.props.sign()
                        break;

                    default:
                        break;
                }
            }
        }

        return (
            <div className={this.props.className ? this.props.className + ' rl-tipList' : 'rl-tipList'} style={{ ...this.props.style }}>
                {this.props.list.map(item => {
                    return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                        {sign}
                        <span style={{ ...textStyle, marginLeft: 4 }}>{item.text}</span>
                    </div>
                })}
            </div>

        )
    }
}
export default RLTipList