import BaseCmp from '@components/BaseCmp.js'

import { Upload } from 'antd';
// import ImgCrop from 'antd-img-crop';
// import ImgCrop from './CmpImageCropper.js';
import ImgCrop from './ImgCropper.js';
import images from '@/libs/images'
import commonActions from '@actions/commonActions.js'

import './CmpUpload.less';

const IMAGE_EXPRESSION = /(png|jpe?g)(\?.*)?$/   // 上传图片格式
export default class CmpUpload extends BaseCmp {
    constructor(props) {
        super(props);
        this.state = {
            uploadFile: null,
            imgUpdateIcon: null,
            uploadFileUrl: '',
        }
    }
    render() {
        return (
            <ImgCrop
                aspect={this.props.aspect || 1 / 1}
                beforeCrop={(file) => {
                    if(file.size > 2 * 1024 * 1024){
                        this.showToast('图片尺寸不应大于2M');
                        return false
                    }
                    return true;
                }}
            >
                <Upload
                    {...this.props}
                    accept='.jpeg,.png,.jpg'
                    multiple={false}
                    showUploadList={false}
                    customRequest={(upload, cropped) => {
                        console.log('upload:', upload.file)
                        if (!upload.file.type.match(IMAGE_EXPRESSION)) {
                            this.showToast('只能上传jpg/png')
                            return
                        }
                        // if (!cropped && upload.file.size > 2 * 1024 * 1024) {
                        //     this.showToast('图片尺寸不应大于2M')
                        //     return
                        // }
                        let formData = new FormData();
                        formData.append('type', 'picture')
                        formData.append('resource', upload.file);
                        commonActions.fileUpload(formData).then(res => {
                            this.props.saveUrl(res.data.fileurl);
                            this.setState({
                                uploadFileUrl: res.data.fileurl
                            })
                        })
                    }
                    }
                >
                    <img
                        src={this.state.uploadFileUrl || this.props.src || this.props.default}
                        alt=''
                        style={{ ...this.props.imgStyle, cursor: 'pointer' }}
                    />
                </Upload>
            </ImgCrop>
        )
    }
}