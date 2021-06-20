

class Task {
    constructor(props) {
        this.tag = props.tag
        this.timeout = props.timeout
        console.log(props)
        this.requestQueue = props.requestQueue
        this.resolve = props.resolve
        this.reject = props.reject
        this.startTimer()
    }
    res(data) {
        clearTimeout(this.timer)
        this.timer = null
        delete this.requestQueue[this.tag]
        this.resolve(data)
    }
    rej(data) {
        console.log('this.requestQueue:')
        clearTimeout(this.timer)
        this.timer = null
        delete this.requestQueue[this.tag]
        this.reject(data)
    }
    startTimer() {
        this.timer = setTimeout(() => {
            this.rej({ code: 599, data: '请求超时了' })
        }, this.timeout * 1000)
    }
}
export default Task