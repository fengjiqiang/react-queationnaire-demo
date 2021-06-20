
import axios from 'axios'
import actionTypes from '../store/actionTypes.js'
import { message } from 'antd';
import Cookies from 'js-cookie'
import Store from '../store/index.js'
import config from '../config.js'
import md5 from 'js-md5';
import interfaces from '@/api/interfaces.js'
import commonActions from '@/store/actions/commonActions.js'
import iframeMessage from '@/libs/IframeMessage.js'
import moment from 'moment'
import { getConfirmLocale } from 'antd/lib/modal/locale';

// const env = localStorage.getItem('env')
const HOST = config.requestHosts

var CryptoJS = require("crypto-js");
const aesKey = '1234567890123456789012335475'
const key = CryptoJS.enc.Utf8.parse(aesKey)



const utils = {
    copy(info, CB) {
        let msg;
        switch (typeof info) {
            case 'string':
                msg = info
                break;
            case 'object':
                msg = JSON.stringify(info)
                break;
            case 'number':
                msg = info;
                break;
            default:
                break;

        }
        let oInput = document.createElement('textarea');
        oInput.value = msg;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        oInput.remove()
        CB && CB()
    },
    showToast(param) {
        let content, duration
        if (typeof param === 'string') {
            content = param
        } else if (typeof param === 'object') {
            content = param.content
            duration = param.duration
        }
        duration = duration || 3

        if (content) {
            message.destroy()
            message.info({ content, duration, className: 'rl-message' })
        }
    },
    initHistory(props) {
        this.history = props.history
        this.pushVC = function (params) {
            if (typeof params === 'string') {
                this.history.push(params)
            } else if (typeof params === 'object') {
                let { pathname, ...rest } = params
                pathname += '?'
                for (let key in rest) {
                    pathname = pathname + key + '=' + rest[key] + '&'
                }
                this.history.push(pathname)
            }

        }
    }
}
// const token = Cookies.get('token')
export function showToast({ content, duration = 5, type = 'info', onClose = () => { }, style = {}, className }) {
    if (typeof message[type] === 'function' && content) {
        message[type]({ content, duration, onClose, className })
    }
}
export function getAesStr(msg) {
    return CryptoJS.AES.encrypt(JSON.stringify(msg), key, {
        iv: CryptoJS.enc.Utf8.parse(aesKey.substr(0, 16)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}
function getHeaders(extraCheckdelay = '') {
    let delay = new Date().getTime() + '';
    let checkdelay = md5(
        delay.substr(delay.length - 5, 5)
        + config.requestHeaders.p
        + config.requestHeaders.ver
        + config.requestHeaders.ch
        + delay.substr(0, 5)
        + config.requestHeaders.os
        + delay + extraCheckdelay
    );
    return { delay, checkdelay, version: config.requestHeaders.ver }
}
// 封装请求
export function getData({ method, url, data = {}, headers = {}, contentType, extraCheckdelay, responseType }) {
    // showToast({ type: 'error', content: '服务器走神了' })
    // if (!Cookies.get('token')) {
    // let token = Cookies.get('token');

    //从sessionStorage 获取token
    let token = sessionStorage.getItem('token');

    if (!token && url !== '/api/v1/admin/user/login') {
        return Promise.reject({
            code: 501, message: '登录超时'
        })
    }
    if (!url) {
        showToast({ type: 'error', content: '您没有该权限' })
        console.log('您没有该权限', url)
        return Promise.reject({
            code: 401, message: '您没有该权限', data: url
        })
    }
    method = method.toLowerCase()
    // url = HOST + url

    if (method === 'get' && Object.keys(data)) {
        url += '?';
        for (let key in data) {
            url += (key + '=' + data[key] + '&')
        }
        data = null
    }
    let defaultHeader = getHeaders(extraCheckdelay)
    if (contentType) {
        defaultHeader['Content-Type'] = contentType
    }
    let baseHost = HOST

    if (url && url.startsWith('/api/playback/')) {
        baseHost = config.uploadBaseUrl;
    }
    return axios({
        method, url, data,
        baseURL: baseHost,
        headers: {
            Authorization: 'Bearer ' + token,
            ...config.requestHeaders,
            ...defaultHeader,
            ...headers
        },
        responseType: responseType || 'json'
    }).then(res => {
        if (!res.data) {
            return Promise.reject()
        }
        let code = Number(res.data.code)
        // if (url.includes('api/v2/corp/user/list')) {
        //     utils.showToast('权限不足')
        // }
        if (code === 440001) {
            utils.showToast('登录失效,请重新登录')
            utils.pushVC({ pathname: '/login' })
        }
        else if (code === 160004) {
            // 获取菜单
            commonActions.getMenuData()
            commonActions.getPermission()
            utils.showToast('您没有此权限')
            utils.pushVC({ pathname: '/personalinfo' })
            return Promise.reject({ ...res.data, code })
        } else if (code === 470001) {
            utils.showToast('登录失效,请重新登录')
            utils.pushVC({ pathname: '/login' })
            // iframeMessage.send({}, 'BAD_TOKEN')
            return Promise.reject({ ...res.data, code })
        }
        // 返回文件对象
        if (responseType === 'blob') {
            //未成功
            if (res.data.type === 'application/json') {
                return Promise.resolve({ code: 201, msg: '导出文件出错' })
            }
            //成功返回
            return { data: res.data, code: 200 }
        }
        return { ...res.data, code }
    }).catch(err => {
        // return Promise.reject({ code: 500, data: err, msg: '服务器走神了' })
        console.log('error:', err)
        // if (err.code === 160004) {
        //     // showToast({ type: 'error', content: err.msg })
        // } else if (err.code === 470001) {

        // } else {

        // }
        showToast({ type: 'error', content: '服务器走神了' })
        return Promise.reject(err)
    })
}
export function getResponse({ method, url, data = {}, headers = {}, contentType, extraCheckdelay }) {
    if ((method === 'get' || method === 'delete') && Object.keys(data)) {
        url += '?';
        for (let key in data) {
            url += (key + '=' + data[key] + '&')
        }
        data = null
    }
    let defaultHeader = getHeaders(extraCheckdelay)
    if (contentType) {
        defaultHeader['Content-Type'] = contentType
    }
    return axios({
        method,
        url,
        data,
        baseURL: config.uploadBaseUrl,
        headers: {
            // Authorization: 'Bearer ' + sessionStorage.getItem('token'), 
            // ...config.requestHeaders, 
            // ...defaultHeader, 
            ...headers
        },
    }).then(res => {
        console.log('---------then---------', res)
        return res.data;
    }).catch(err => {
        // return err;
        utils.showToast({ type: 'error', content: err.msg })
    });
}
export function downloadFile(blob, filename) {
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
}
export function downloadUrl(url, filename) {
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
}

/**
 * 查询将日期转化为时间戳
 */
export function dealSearchTime(str, isStart) {
    if (!str) {
        return ''
    }
    if (isStart) {
        return new Date(str + ' 0:0:0').getTime() / 1000
    } else {
        return new Date(str + ' 23:59:59').getTime() / 1000
    }
}

/**
 * 将时间戳转化为日期字符串
 */
export function dealTableTime(str) {
    if (!str) {
        return ''
    }
    return moment(str * 1000).format('YYYY-MM-DD HH:mm')
}

/**
 * 将日期时间转化为时间戳
 * @param {*} str 
 * @param {*} isStart 
 * @returns 
 */
export function dealDateTime(str) {
    if (!str) {
        return ''
    }
    return new Date(str).getTime() / 1000
}

/**
 * 将时间戳转化为日期时间字符串
 * @param {*} str 
 * @param {*} type 
 * @returns 
 */
export function dealTime(str, type = 'YYYY-MM-DD HH:mm') {
    if (!str) {
        return ''
    }
    return moment(str * 1000).format(type)
}

/**
 * 根据文件后缀区分文件
 * @param {*} fileName 文件名（带后缀）
 * @returns 
 */
export function getFileType(fileName) {
    let index = fileName.lastIndexOf(".")
    let suffix = ''   // 后缀
    let result = ''   // 类型结果
    if (index !== -1) {
        suffix = fileName.substr(index + 1).toLowerCase()
    }
    if (!suffix) return false   // 无后缀 返回false

    // 匹配 视频
    const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
    result = videolist.find(item => item === suffix)
    if (result) return 'video'
    // 匹配 音频
    const radiolist = ['mp3', 'wav', 'wmv']
    result = radiolist.find(item => item === suffix)
    if (result) return 'radio'
    // 匹配 图片
    const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'tif', 'tiff']
    result = imglist.find(item => item === suffix)
    if (result) return 'image'
    // 匹配 文档
    // pdf
    const pdflist = ['pdf'];
    result = pdflist.find(item => item === suffix)
    if (result) return 'pdf'
    // txt
    const txtlist = ['txt']
    result = txtlist.find(item => item === suffix)
    if (result) return 'txt'
    // word
    const wordlist = ['doc', 'docx']
    result = wordlist.find(item => item === suffix)
    if (result) return 'word'
    // excel
    const excelist = ['xls', 'xlsx']
    result = excelist.find(item => item === suffix)
    if (result) return 'excel'
    // ppt
    const pptlist = ['ppt', 'pptx']
    result = pptlist.find(item => item === suffix)
    if (result) return 'ppt'
    // 匹配 压缩包
    const ziplist = ['zip', 'rar', 'gz']
    result = ziplist.find(item => item === suffix)
    if (result) return 'zip'
    // 其他 文件类型
    return 'other'
}

export function strTrim(str) {
    if (!str) {
        return ''
    }
    return str.replace(/^\s+|\s+$/gm, '');
}
export function getStrLength(str) {
    let w = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            w++;
        } else {
            w += 2;
        }
    }
    return w
}
export function getFileTile(fileName) {
    if (/\.([a-zA-Z0-9]+)$/.test(fileName)) { // 如果没有文件类型，从原始文件名中获取后缀
        return fileName.replace(/(.*)\.([a-zA-Z0-9]+)$/, '$2') || ''
    }
    return ''
}

export function uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    const id = s.join('');
    return id;
}

export default utils



