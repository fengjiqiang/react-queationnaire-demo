import { connect } from 'react-redux';
import WindowContainer from '@components/WindowContainer.js'
import BaseCmp from '@components/BaseCmp.js'
import { RLTabs } from '@components/index.js'

import UnauthedList from './UnauthedList.js'
import ProcessedList from './ProcessedList.js'
// import utils from '@/libs/utils.js'


class CmpUnauthedUserList extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
            defaultTabKey: props.tabKey ? props.tabKey : 'unauthed'
        }
    }
    render() {
        let tabPanes = [
            {
                tab: '待认证',
                id: 'unauthed'
            },
            {
                tab: '我已处理',
                id: 'processed'
            }
        ]

        return (
            <WindowContainer title=''>
                <div>
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
                            if (this.state.defaultTabKey === 'unauthed') {
                                console.log('this.props', this.props)
                                return <UnauthedList
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    {...this.props}
                                />
                            } else if (this.state.defaultTabKey === 'processed') {
                                return <ProcessedList
                                    history={this.props.history}
                                    changePage={this.props.changePage}
                                    {...this.props}
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
})(CmpUnauthedUserList)
