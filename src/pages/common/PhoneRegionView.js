
import BaseCmp from '@components/BaseCmp.js'
import commonAction from '@actions/commonActions'
import { connect } from 'react-redux'
// import PhoneSideBar from './PhoneSideBar.js'
import './PhoneRegionView.less'
class PhoneRegionView extends BaseCmp {
    constructor(props) {
        super(props)
        this.getAreaCode()

    }
    componentWillMount() {
        console.log('componentWillMount')

    }
    componentDidMount() {
        console.log('componentDidMount')
        document.addEventListener('click', this.documentClick)

    }
    componentWillUnmount() {
        document.removeEventListener('click', this.documentClick)
        console.log('componentWillUnmount')

    }
    documentClick = () => {
        console.log('documentClick')
        this.props.togglePhoneRegion(false)
    }
    getAreaCode = () => {
        commonAction.getAreaCodeList()
    }
    onSelect = (obj) => {
        this.props.onSelect && this.props.onSelect(obj)
        this.props.togglePhoneRegion(false)
    }
    render() {
        return (
            <div className='phone-region' style={{ ...this.props.style }}>
                {
                    this.props.areacodeList.map(subItem => {
                        return (
                            <div className='sub-list-container'
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                key={subItem.title}
                            >
                                <div className='sub-list-title'>
                                    <span>{subItem.title}</span>
                                </div>
                                <div className='sub-list'>
                                    {
                                        (() => {
                                            let list = []
                                            for (let name in subItem.subList) {
                                                list.push(
                                                    <div
                                                        className={
                                                            (
                                                                this.props.selected &&
                                                                this.props.selected.name === name &&
                                                                this.props.selected.value === subItem.subList[name]
                                                            ) ?
                                                                'sub-list-item active' :
                                                                'sub-list-item'
                                                        }
                                                        key={name}
                                                        onClick={(e) => {
                                                            this.onSelect({ name, value: subItem.subList[name] })

                                                        }}
                                                    >
                                                        <span style={{ marginRight: 2 }}>{name}</span>
                                                        <span>{subItem.subList[name]}</span>
                                                    </div>
                                                )
                                            }
                                            return list
                                        })()
                                    }
                                    {/* <div className='sub-list-item active'>
                                        <span>中国香港特别行政区</span>
                                        <span>+86</span>
                                    </div> */}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
// export default PhoneRegionView
export default connect((store, props) => {
    return {
        ...props,
        areacodeList: store.storeCommon.areacodeList
    }
})(PhoneRegionView);