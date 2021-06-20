
/*
afterFix

*/

import { Checkbox, Row, Col } from 'antd';
import RLCheckbox from './RLCheckbox'
import BaseCmp from '@components/BaseCmp.js'
class RLCheckboxGroup extends BaseCmp {
    render() {
        let options = this.props.items.map(item => {
            let obj = JSON.parse(JSON.stringify(item))
            if (this.props.labelkey) {
                obj = { ...obj, label: item[this.props.labelkey] }
            }
            if (this.props.valuekey) {
                obj = { ...obj, value: item[this.props.valuekey] }
            }

            return obj
        })
        return (
            <Checkbox.Group className={this.props.className ? this.props.className + ' rl-checkbox-group' : 'rl-checkbox-group'}
                {...this.props}
                style={{ ...this.props.checkboxGroupStyle }}
            >
                {
                    this.props.isCol ? <Row>
                        {
                            options.map(item => {
                                return (
                                    <Col span={8}>
                                        <RLCheckbox value={item.value} key={item.value} label={item.label} />
                                    </Col>

                                )
                            })
                        }
                    </Row> : options.map(item => {
                        return (
                            <RLCheckbox value={item.value} key={item.value} label={item.label} />
                        )
                    })
                }
            </Checkbox.Group>
        )
    }
}
export default RLCheckboxGroup