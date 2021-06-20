
/*
    type :primary/default
*/

import { Button } from 'antd';
import BaseCmp from '@components/BaseCmp.js'
class RLButton extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            label: props.label
        }
    }
    startTimer = (count) => {
        this.setState({
            label: Number(count)
        }, () => {
            this.timer = setInterval(() => {
                let label = this.state.label - 1
                console.log(label)
                if (label < 0) {
                    clearInterval(this.timer)
                    this.timer = null
                    this.setState({
                        label: this.props.rLabel || this.props.label
                    })
                } else {
                    this.setState({
                        label
                    })
                }

            }, 1000)
        })

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.label !== this.props.label) {
            this.setState({
                label: nextProps.label
            })
        }
    }
    render() {
        return (
            <Button {...this.props}
                className={this.props.className ? this.props.className + ' rl-button' : 'rl-button'}
                type={this.props.type || 'default'}
                disabled={this.props.disabled || this.timer}
                style={{ ...this.props.style, width: this.props.width, height: this.props.height }}
                onClick={(e) => {
                    if (this.props.onClick) {
                        this.props.onClick(e)
                    }
                }}
            >
                {this.props.loading && <span className='btn-loading' style={{ position: 'absolute', left: 0 }}></span>}
                {this.timer ? this.state.label + 's' : this.state.label}
            </Button>

        )
    }
}
export default RLButton