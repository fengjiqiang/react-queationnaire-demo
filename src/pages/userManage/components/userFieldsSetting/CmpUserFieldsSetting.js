import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'
import BaseCmp from '@components/BaseCmp.js'
import { RLTabs } from '@components/index.js'

import RegisterField from './RegisterField.js'
import CertificationField from './CertificationField.js'
// import utils from '@/libs/utils.js'


class CmpUserFieldsSetting extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            defaultTabKey: props.tabKey ? props.tabKey : 'register'
        }
    }
    render() {
        let tabPanes = [
            {
                tab: '注册字段',
                id: 'register'
            },
            {
                tab: '认证字段',
                id: 'certification'
            }
        ]

        return (
            <WindowContainer title=''>
                <div className="page-meetinglist">
                    <RLTabs
                        onChange={(key) => {
                            console.log('tab:', key)
                            this.setState({
                                defaultTabKey: key
                            })
                        }}
                        tabPanes={tabPanes}
                        defaultActiveKey={this.state.defaultTabKey}
                    />
                    {
                        (() => {
                            if (this.state.defaultTabKey === 'register') {
                                console.log('this.props', this.props)
                                return <RegisterField
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                />
                            } else if (this.state.defaultTabKey === 'certification') {
                                return <CertificationField
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                />
                            }
                        })()
                    }
                </div>
            </WindowContainer>
        )
    }
}

export default connect((store, props) => {
    return {
        ...props
    }
})(CmpUserFieldsSetting)
