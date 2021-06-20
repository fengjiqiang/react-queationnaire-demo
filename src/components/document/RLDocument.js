import BaseCmp from '@components/BaseCmp.js'
import './RLDocument.less'
import images from '@/libs/images/index.js'
const commonImg = images.commonImg

export default class RLdocument extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    docUpLoad = (url) => {
        return () => {
            window.open(url)
        }
    }
    docDelete = (id) => {
        return () => {
            this.props.docDelete(id)
        }
    }
    render() {
        let detailNameBox = this.props.isDetail ? 'docUpListBoxDetail' : 'docUpListBox'
        let docUpListItem = this.props.isDetail ? 'docUpListItemDetail' : 'docUpListItem'
        return (
            <div className={detailNameBox}>
                {this.props.fileList.map(i => {
                    let docImg = commonImg.documentWOC
                    let docArr = i.title && i.title.split('.')
                    let docType = docArr && docArr.pop()
                    let docTitle = docArr && docArr.join('.')
                    if (docType === 'xls' || docType === 'xlsx') docImg = commonImg.documentX
                    if (docType === 'ppt' || docType === 'pptx') docImg = commonImg.documentPPT
                    if (docType === 'pdf') docImg = commonImg.documentPDF
                    let docId = i.id || i.lid
                    return <div className={docUpListItem}>
                        <div className='docUpListItemLeft'>
                            <img src={docImg} style={{ width: 20, height: 20 }} />
                            <div className='docUpListItemLeftTitle'>{docTitle}</div>
                            <div>.{docType}</div>
                        </div>
                        {i.is_me ? <div className='docUpListItemRight'>
                            {(!i.upLoad) ? <div onClick={this.docUpLoad(i.doc_url)}><img src={commonImg.docUpLoad} style={{ width: 20, height: 20, cursor: 'pointer' }} /></div> : null}
                            {(!this.props.isDetail) ? <div onClick={this.docDelete(docId)}><img src={commonImg.docDelete} style={{ width: 20, height: 20, marginLeft: 5, cursor: 'pointer' }} /></div> : null}
                        </div> : null}
                    </div>
                })}
            </div>
        )
    }
} 