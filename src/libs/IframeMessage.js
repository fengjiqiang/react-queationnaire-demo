
/**
 * method：GET_TOKEN :获取token
 * 
 * 
*/

import config from '@/config.js'
import Task from './Task.js'
let pIframeHost;
if (window.parent !== window) {
    try {
        pIframeHost = window.parent.location.href;
    } catch (e) {
        pIframeHost = document.referrer;
    }
}
console.log(12345, pIframeHost)
const iframeMessage = {
    requestQueue: {},
    targetWindow: window.parent,
    localOrigin: window.location.origin,
    send(data, method) {
        console.log(pIframeHost)
        if (method.includes('-')) {
            throw new Error('method 不能含有-字符')
            return
        }
        return new Promise((resolve, reject) => {
            let tag = new Date().getTime()
            this.targetWindow.postMessage({
                type: 'request',
                method,
                tag,
                data,
                _method: 'request-' + method + tag
            }, pIframeHost)
            this.requestQueue[tag] = new Task({ tag, timeout: 15, resolve, reject, requestQueue: this.requestQueue })
        })
    },

}
window.addEventListener('message', (e) => {
    let data = e.data
    if (data.type === 'request') {
        console.log('父窗口请求我了', e)
    } else {

        let tag = data.tag
        let task = iframeMessage.requestQueue[tag]
        if (task) {
            task.res(data.data)
            delete iframeMessage.requestQueue[tag]
        } else {
            // console.log('无请求的响应，可能是超时了的请求返回')
        }
    }
})
export default iframeMessage