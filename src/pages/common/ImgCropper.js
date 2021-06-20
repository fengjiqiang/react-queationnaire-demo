import React, { useState, useCallback, useMemo, useRef, forwardRef } from 'react';
import Cropper from 'react-cropper';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver';
import "cropperjs/dist/cropper.css";
import Modal from 'antd/es/modal';
import './ImgCropper.less';
import BaseCmp from '@components/BaseCmp.js'

const pkg = 'img-crop';
const MEDIA_CLASS = `${pkg}-media`;
const IMAGE_EXPRESSION = /(png|jpe?g)(\?.*)?$/   // 上传图片格式

let cropper = null;
export default class ImgCropper extends BaseCmp {
    constructor(props){
        super(props);
        this.state = {
            image: null,
            imgName: '',
            cropper: null
        };
    }
    renderUpload = () => {
        const children = this.props.children;
        const upload = Array.isArray(children) ? children[0] : children;
        const { beforeUpload, accept, ...restUploadProps } = upload.props;
    
        return {
          ...upload,
          props: {
            ...restUploadProps,
            accept: accept || 'image/*',
            beforeUpload: (file, fileList) =>
              new Promise((resolve, reject) => {
                if (!file.type.match(IMAGE_EXPRESSION)) {
                    this.showToast('只能上传jpg/png')
                    return
                }

                if(this.props.beforeCrop && !this.props.beforeCrop(file)){
                    return;
                }

                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    this.setState({
                        image: reader.result,
                        imgName: file.name
                    });

                    const img = new Image();
                    img.src = reader.result;
                    img.onload = function () {
                        if(cropper){
                            const canvasData = cropper.getCanvasData();
                            console.log('--------natural width height------', this.width, this.height)
                            console.log('------canvas data width height-----', canvasData.width, canvasData.height);

                            if(canvasData.height > 400){
                                // cropper.setCanvasData({left:0,right:0,width:552})
                                const zoomVal =  400 / canvasData.height ;
                                console.log('-------zoom pivot------', zoomVal);
                                cropper.zoomTo(zoomVal);
                            }
                        }      
                    };
       
                });
                reader.readAsDataURL(file);
              }),
          },
        };
      }
    
    dataURLtoFile = (dataurl, filename) => { 
	    let arr = dataurl.split(','),
	        mime = arr[0].match(/:(.*?);/)[1],
	        bstr = atob(arr[1]),
	        n = bstr.length,
	        u8arr = new Uint8Array(n);
	    while (n--) {
	        u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new File([u8arr], filename, { type: mime });
    }

    onClose = () => {
        // this.props.onClose();
        this.setState({
            image: null
        })
    }
    download(file){

        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.style.display = 'none';
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click()
      
    }
    onOk = async () => {

        const children = this.props.children;
        const upload = Array.isArray(children) ? children[0] : children;
        const { customRequest } = upload.props;

        this.onClose();
        
        // const cropper = this.state.cropper;

        const imgUrl = cropper.getCroppedCanvas().toDataURL();

        const imgFile = this.dataURLtoFile(imgUrl, this.state.imgName);

        this.resize(imgFile,this.props.resizeWidth, this.props.resizeWidth, customRequest);
    }
    resize = (img, width, height, callback) => {
        let image = new Image();
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        image.onload = () => {
            let img_w = image.naturalWidth; 
            let img_h = image.naturalHeight;

            let dimg_w = img_w;
            let dimg_h = img_h;

            if(width && height){
                dimg_w = width;
                dimg_h = Math.ceil(dimg_w*img_h/img_w);

                if(dimg_h>height){
                    dimg_h = height;
                    dimg_w = Math.ceil(dimg_h*img_w/img_h);
                }
            }

            canvas.width = dimg_w;
            canvas.height = dimg_h;
            context.drawImage(image, 0, 0, dimg_w, dimg_h);

            canvas.toBlob((blob)=> {
                let names = img.name.split('.');
                if(names.length === 0){
                    names = [''];
                }
                names[names.length - 1] = '.jpeg';
                let name = names.join('');
                let file = new File([blob], name, {type:'image/jpeg'});
                callback({file: file})
            }, 'image/jpeg', 0.8)
            
        }
        let reader = new FileReader();
        reader.readAsDataURL(img);

        reader.onload = function(e){
            image.src = reader.result;
        }
    }
    render(){
        const {
            image
        } = this.state;
        const {
            title,
            aspect
        } = this.props;
        return (
        <>
            {this.renderUpload()}
            {image && (
                <Modal
                    visible={true}
                    title={title || '图片裁剪'}
                    wrapClassName={`${pkg}-modal`}
                    onOk={this.onOk}
                    onCancel={this.onClose}
                    cancelText="取消"
                    okText="确定"
                    // maskClosable={false}
                    destroyOnClose
                >
                    <Cropper
                        style={{ width: 600, height:400 }}
                        zoomTo={1}
                        initialAspectRatio={ aspect || 1 }
                        aspectRatio={ aspect || 1}
                        src={image}
                        viewMode={0}
                        guides={true}
                        minCropBoxHeight={ parseInt(100 * (aspect || 1)) }
                        minCropBoxWidth={100}
                        background={true}
                        responsive={true}
                        autoCropArea={0.95}
                        checkOrientation={false}
                        onInitialized={
                            (instance) => {
                            // this.setState({
                            //     cropper: instance
                            // });
                            cropper = instance;
                        }}
                    />
            </Modal>
      )} 
        </>
        )
    }
}