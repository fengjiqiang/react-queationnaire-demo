import BaseCmp from './BaseCmp.js'
import { connect } from 'react-redux'
import { Breadcrumb } from 'antd';


class WindowContainer extends BaseCmp {
    getBreadcrumb() {
        return (
            <div className='windowBreadcrumb'>

                <Breadcrumb>
                    {
                        this.props.menuPath.map(item => {
                            return <Breadcrumb.Item key={item.menu_code}>{item.name}</Breadcrumb.Item>
                        })
                    }

                </Breadcrumb>

            </div>
        )
    }
    getPageTitle() {
        let title = this.props.title
        if (title) {
            if (typeof title === 'function') {
                return title()
            } else if (typeof title === 'object') {
                return title
            } else if (typeof title === 'string') {
                return (
                    <div className='pageTitle'>
                        <span>{title}</span>
                    </div>
                )
            }
        } else {
            return null
        }
    }
    render() {
        return (
            <div
                className={this.props.className ? this.props.className + ' windowContainer' : 'windowContainer'}
            >
                {/* {this.getBreadcrumb()} */}
                {this.props.title ? this.getPageTitle() : null}
                <div style={{
                    borderWidth: 2,
                    marginTop: 20,
                    paddingLeft: 20,
                    paddingRight: 40,
                    flex: 1,
                    overflow: 'auto',
                    // display: 'flex'
                }}>
                    {this.props.children}
                </div>

            </div>
        )

    }
}

export default connect((store, props) => {
    return {
        ...props,
        menuPath: store.storeCommon.menuPath
    }
})(WindowContainer)