import { createRef } from 'react';
import BaseCmp from '@components/BaseCmp.js';
import { RLInput, RLButton, RLSelect, RLTable, RLFilterTool, RLTooltip, RLDatePicker, RLModal, RLForm, RLFormItem, RLRadioGroup, RLTextarea } from '@components/index.js'

import eventBus from '@/libs/EventBus.js'
import { Upload } from 'antd';
import ImgCrop from '@/pages/common/ImgCropper.js';

import actionVideoManage from '../../../../store/actions/VODManage/actionVideoManage';
import { connect } from 'react-redux';
class VideoUpload extends BaseCmp {
    constructor(props){
        super(props);
        this.state = {
            uploadFile: null,
            watermark: null,
            watermarkUrl: ''
        };
        this.form = createRef();
    }

    componentDidMount() {

    }
    
    upload = () => {
        let isVideo = /\.(mp4|avi|mkv|flv|rmvb|mov|wmv)$/.test(this.state.uploadFile.name);
        if(this.state.watermark){
            let formData = new FormData();
            formData.append('img', this.state.watermark)
            actionVideoManage.uploadWatermark(formData).then(res =>{
        
                eventBus.emit('upload-video', this.state.uploadFile, {
                    type: 'video',
                    dtype: isVideo ? 0: 1, 
                    dtranscode: true,
                    dwatermark: this.state.watermark ? true : false
                });
                this.props.onCancel(); 
            }).catch(err =>{
                eventBus.emit('upload-video', this.state.uploadFile, {
                    type: 'video',
                    dtype: isVideo ? 0: 1, 
                    dtranscode: true,
                    dwatermark: this.state.watermark ? true : false
                });
                this.props.onCancel();
                this.showToast({type:'error',content: '水印上传失败'});
            })
        }else{
            eventBus.emit('upload-video', this.state.uploadFile, {
                type: 'video',
                dtype: isVideo ? 0: 1, 
                dtranscode: true,
                dwatermark: this.state.watermark ? true : false
            });
            this.props.onCancel();
        }
    }
    render(){
        return (
            <RLModal 
                title={this.props.title}
                closable={true}
                onCancel={this.props.onCancel}
                footer={null}
                visible={this.props.visible}>
                <div className="videoinput">
                    <RLForm 
                        ref={this.form}
                        labelCol={{ style: { width: 80, marginRight: 20, textAlign:'right' } }}
                        labelAlign='left'
                        validateTrigger='onBlur'
                        onFinish={this.upload}
                    >
                        <RLFormItem label="视频/音频" name="file" colon={false}
                            rules={[{
                                required: true,
                                message: '请选择上传视频'
                            }]}>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <RLInput style={{width: 220}} value={this.state.uploadFile && this.state.uploadFile.name}/>
                                <Upload 
                                    accept={this.props.accept}
                                    multiple={false}
                                    showUploadList={false}
                                    beforeUpload={(file)=>{
                                        this.setState({
                                            uploadFile: file
                                        })
                                        this.form.current.setFieldsValue({'file':file})
                                        return false;
                                    }}>
                                    <RLButton label="选择文件" 
                                        type="primary"
                                        style={{marginLeft: 20}}/>
                                </Upload>
                            </div>
                            <div>支持mp4、avi、mkv、mov、flv、rmvb、mp3、wav、wma、ape、flac、aac</div>
                        </RLFormItem>
                        <RLFormItem label="水印" name="watermark" colon={false}>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <ImgCrop 
                                    aspect = {15/7}
                                    beforeCrop={()=>{
                                        return true;
                                    }}
                                    resizeWidth={150}
                                    resizeHeight={70}
                                    >  
                                    <Upload 
                                        accept="image/*"
                                        multiple={false}
                                        showUploadList={false}
                                        resizeWidth={150}
                                        resizeHeight={70}
                                        customRequest={( { file } )=>{
                                            this.setState({
                                                watermark: file,
                                                watermarkUrl: window.URL.createObjectURL(file)
                                            })
                                            return false;
                                        }}>
                                            <img src={this.state.watermarkUrl || require('@/assets/images/default.png').default} style={{width: 150, height: 70, cursor:'pointer'}} alt=''/>
                                    </Upload>
                                </ImgCrop> 
                            </div>
                            <div>只能上传jpg/png,大小不超过2M</div>
                        </RLFormItem>
                        <RLFormItem>
                            <div style={{display:'flex',flexDirection:'row',justifyContent:'center',marginTop: 20}}>
                                <RLButton label="取消" 
                                    onClick={this.props.onCancel}
                                    style={{marginRight: 40}}/>
                                <RLButton label="开始上传"
                                    className=""
                                    type="primary"
                                    htmlType="submit"
                                />
                            </div>
                        </RLFormItem>
                    </RLForm>
                </div>
            </RLModal>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        // userInfo: store.personalInfo.userInfo,   
    }
})(VideoUpload)