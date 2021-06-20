import BaseCmp from '@components/BaseCmp.js'

import { Upload } from 'antd';

import images from '@/libs/images'
import commonActions from '@actions/commonActions.js'

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
            <Upload
                {...this.props}
                accept='image/jpg,image/png'
                multiple={false}
                showUploadList={false}
                customRequest={(upload) => {
                    console.log('upload:', upload.file.size)
                    // if (upload.file.size > 2 * 1024 * 1024) {
                    //     this.showToast('图片尺寸不应大于2M')
                    //     this.props.clearValue();
                    //     return
                    // }
                    let formData = new FormData();
                    formData.append('type', 'picture')
                    formData.append('avatar', upload.file);
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
                    // onMouseOverCapture={() => {
                    //     this.setState({
                    //         imgUpdateIcon: images.commonImg.imgUpdateIcon
                    //     });
                    // }}
                    // onMouseOutCapture={() => {
                    //     this.setState({
                    //         imgUpdateIcon: null
                    //     });
                    // }}
                    src={ this.state.uploadFileUrl || this.props.src || this.props.default }
                    alt=''
                    style={this.props.imgStyle}
                />
            </Upload>
        )
    }
}