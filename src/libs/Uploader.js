import axios from 'axios';
// axios.defaults.withCredentials = true;

// export default function(file, target, chunkSize, onSucuess, onError, onProgress){



// }

import mimeType from './mimeType';

export default class Uploader{
    constructor({ file, method, baseURL, url, chunkSize, onStart, onSuccess, onError, onProgress, onCancel }){

        this.file = file;
        this.baseURL = baseURL;
        this.url = url;
        this.chunkSize = chunkSize;

        this.onStart = onStart;
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.onProgress = onProgress;
        this.onCancel = onCancel;

        this.chunks = this._slice() || [];

        this.cancelled = false;
    }

    on(event, callback){
        if( event === 'success'){
            this.onSucsess = callback;
        }else if( event === 'error'){
            this.onError = callback
        }else if( event === 'progress'){
            this.onProgress = callback;
        }
    }

    async upload(params){
        this.onStart && this.onStart();
        for(let i = 0 ; i < this.chunks.length; i++){
            if(this.cancelled) {
                this.onCancel && this.onCancel();
                break;
            }
            console.log(`---------发送文件${this.file.name}第${i+1}个切片-------`);
            let res = await this._sendRequest(i, this.chunks[i], params);
            if(res.success === 1 ){
                console.log(`---------发送文件${this.file.name}第${i+1}个切片成功-------`);
                this.onProgress && this.onProgress( (((i+1) / this.chunks.length) * 100).toFixed(1) );
                if( i === this.chunks.length -1){
                    this.onSuccess && this.onSuccess(res);
                    break;
                }
            }else{
                this.onError && this.onError();
                break;
            }
        }
    }
    cancel(){
        this.cancelled = true;
    }
    addFile(file){
        this.file = file;
        this.chunks = this._slice() || [];
    }
    
    _sendRequest(chunkIndex, chunk, params){
        let formData = new FormData();
        formData.append('file', chunk, this.file.name);
        formData.append('dname', this.file.name);
        // formData.append('dtype', this.file.type);
        // formData.append('dtranscode', params && params.transcode === false ? false: true );
        formData.append('dzchunkindex', chunkIndex);
        formData.append('dztotalchunkcount', this.chunks.length);
        formData.append('dztotalfilesize', this.file.size);

        if(params && typeof params === 'object'){
            for(let k in params){
                formData.append(k, params[k]);
            }
        }
        return axios({
                method: 'POST',
                baseURL: this.baseURL,
                url: this.url,
                data: formData,
            }).then( res => {
                return res.data
            }).catch(err => {
                return err;
            });
    }
    _slice() {
        let totalSize = this.file.size; 
        let start = 0; 
        let end = start + this.chunkSize; 
        let chunks = [];
        // let mimetype = this.file.type;
        // if(!mimetype){
        //     let arr = this.file.name.split('.');
        //     let ext = arr[arr.length - 1].toLowerCase();
        //     mimetype = mimeType[ext] || 'text/pdf';
        // }
        let mimetype = 'text/pdf';
        if (this.file.type.includes('video') || this.file.type.includes('audio')) {
            mimetype = this.file.type
        }
        if(this.file.name.endsWith('rmvb') || this.file.name.endsWith('RMVB')){
            mimetype = mimeType['rmvb']
        }
        if(!this.file.type){
            let arr = this.file.name.split('.');
            let ext = arr[arr.length - 1].toLowerCase();
            if(/(avi|dv|mp4|mpeg|mpg|mov|wm|vob|flv|mkv|rmvb|wmv|mp3|mid|ogg|mp4a|wav|wma|ape|flac|aac)/.test(ext)){
                mimetype = mimeType[ext] ;
            }
        }
        while (start < totalSize) {
          // 根据长度截取每次需要上传的数据
          let chunk = this.file.slice(start, end, mimetype);
          chunks.push(chunk);
          start = end;
          end = start + this.chunkSize;
        }
        return chunks
    }     
}