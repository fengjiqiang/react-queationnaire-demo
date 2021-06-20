import BaseCmp from '@components/BaseCmp.js'
import { Upload } from 'antd';
import ImgCrop from '@/pages/common/ImgCropper.js'
import { PlusOutlined } from '@ant-design/icons';
import commonActions from '@actions/commonActions.js'

const limtSize = 2 * 1024 * 1024;
export default class CmpUpload extends BaseCmp {
    constructor(props) {
        super(props);
        this.limtSize = this.props.limtSize ? this.props.limtSize : limtSize
        this.state = {
            uploadFile: null,
            imgUpdateIcon: null,
            uploadFileUrl: '',
        }
    }
    render() {
        return (
            // <ImgCrop
            //     className="img-crop"
            //     modalTitle="裁剪图片"
            //     modalCancel="取消"
            //     modalOk="确定"
            //     minZoom={0.5}
            //     maxZoom={3}
            //     aspect={this.props.aspect}
            // >
            <>
                <Upload
                    accept={this.props.accept}
                    listType="picture-card"
                    onRemove={(ele) => {
                        this.props.remove && this.props.remove()
                    }}
                    showUploadList={{
                        ...this.props.showUploadList
                    }}
                    fileList={this.props.picList}
                    customRequest={(upload) => {
                        if (upload.file.size > this.limtSize) {
                            this.showToast({ type: 'error', content: '选择文件超过限制' })
                            return false
                        }
                        let formData = new FormData();
                        if (this.props.fileType === 'image') {
                            if (upload.file.type.indexOf('image') === -1) {
                                this.showToast({ type: 'error', content: '只能上传图片' })
                                return false
                            }
                        }
                        if (upload.file.type.indexOf('image') !== -1) {
                            formData.append('type', 'picture')
                        } else {
                            formData.append('type', 'doc')
                        }
                        formData.append('resource', upload.file);
                        commonActions.fileUpload(formData).then(res => {
                            this.props.upload && this.props.upload(res)
                        })
                    }}
                >
                    {!this.props.picList.length && <div>
                        <PlusOutlined />
                    </div>}
                </Upload>
            </>
            // </ImgCrop>
        )
    }
}