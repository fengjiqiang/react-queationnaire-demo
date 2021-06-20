import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, DatePicker, Space, Checkbox, Radio, message, TimePicker } from 'antd';
import moment from "moment"
import actionSeminar from '@actions/seminar/actionSeminar.js'
import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux';


class SeminarEdit extends BaseCmp {

  constructor(props) {
    super(props)
    this.state = {
      meetingValue: "",
      isMeetV: 0,
      start_date: moment().format("YYYY-MM-DD"),
      start_time: moment().format("HH:mm"),
      end_date: moment().add(1, "hours").format("YYYY-MM-DD"),
      end_time: moment().add(1, "hours").format("HH:mm"),
      is_password: false,
      video_master: "0",
      video_honour: "0",
      passwordValue: "",
      meeting_id: null,
      disable: 0,
      // ispawV:null
    }
  }

  //编辑默认状态
  editDataInit = () => {
    let param = {
      meeting_id: this.props.seminarid + ""
    }
    actionSeminar.seminarDetail(param).then(res => {
      console.log('编辑研讨会--res:', res)
      if (res.code === 200) {
        let { title, start_date, start_time, end_date, end_time, is_password, password, video_honour, video_master } = res.data.info
        start_time = start_time.substring(0, 5)
        end_time = end_time.substring(0, 5)
        this.setState({
          meetingValue: title,
          start_date,
          start_time,
          end_date,
          end_time,
          is_password,
          passwordValue: password,
          video_master: video_master + "",
          video_honour: video_honour + ""
        })
      } else {
        this.showToast(res.msg)
      }
    })
  }

  //会议主题input回调
  meetingTopicChange = (e) => {
    this.setState({
      meetingValue: e.target.value
    })
    if (e.target.value.length > 100) {
      this.setState({
        isMeetV: 1,
        meetingValue: this.state.meetingValue.substring(0, 100)
      })
    } else {
      if (this.state.isMeetV === 1) {
        this.setState({
          isMeetV: 0
        })
      }
    }
  }

  //转换时间格式
  datetimeFormat(datetime) {
    let Y = '' + datetime.getFullYear();
    let M = ('' + (datetime.getMonth() + 1)).padStart(2, 0);
    let D = ('' + datetime.getDate()).padStart(2, 0);
    let h = ('' + datetime.getHours()).padStart(2, 0);
    let m = ('' + datetime.getMinutes()).padStart(2, 0);
    return `${Y}-${M}-${D} ${h}:${m}`
  }

  //默认开始时间的设置
  getInitStartTime() {
    let _d = new Date()
    _d.setSeconds(0)
    let _m = _d.getMinutes()
    let dm = 15 - _m % 15
    _d.setMinutes(_m + dm)
    return this.datetimeFormat(_d)
  }

  //默认结束时间
  getInitEndTime() {
    let datetime = this.getInitStartTime()
    let _datetime = new Date(datetime.replace(/-/g, '/'))
    _datetime.setMinutes(_datetime.getMinutes() + 60)
    return this.datetimeFormat(_datetime)
  }

  //初始日期
  getInitTime = () => {
    let start = this.getInitStartTime().split(" ")
    let start_date = start[0]
    let start_time = start[1]
    let end = this.getInitEndTime().split(" ")
    let end_date = end[0]
    let end_time = end[1]
    this.setState({
      start_date,
      start_time,
      end_date,
      end_time
    })
  }

  //开始日期改变的回调函数
  startDateOnChange = (value, dateString) => {
    let date = dateString + ' ' + this.state.start_time
    let end_date = new Date(date.replace(/-/g, '/'))
    end_date.setHours(end_date.getHours() + 1);
    end_date = this.datetimeFormat(end_date)
    this.setState({
      start_date: dateString,
      end_date: end_date.split(" ")[0],
      end_time: end_date.split(" ")[1]
    })
  }

  //开始时间改变的回调
  startTimeOnChange = (value, dateString) => {
    let date = this.state.start_date + ' ' + dateString
    let end_date = new Date(date.replace(/-/g, '/'))
    end_date.setHours(end_date.getHours() + 1);
    end_date = this.datetimeFormat(end_date)
    this.setState({
      start_time: dateString,
      end_date: end_date.split(" ")[0],
      end_time: end_date.split(" ")[1]
    })
  }

  //结束日期改变的回调函数
  endDateOnChange = (value, dateString) => {
    this.setState({
      end_date: dateString
    })
  }

  //结束时间改变的回调函数
  endTimeOnChange = (value, dateString) => {
    this.setState({
      end_time: dateString
    })
  }

  // 验证日期
  dateValid() {
    let start = this.state.start_date + " " + this.state.start_time
    let end = this.state.end_date + " " + this.state.end_time
    let startDate = new Date(start.replace(/-/g, '/')).getTime();
    let endDate = new Date(end.replace(/-/g, '/')).getTime();
    let now = new Date().getTime();
    let d_time = endDate - startDate;
    if (d_time > 1000 * 60 * 60 * 24) {
      return '会议时长不能超过24小时'
    } else if (d_time < 0) {
      return '起始时间不能大于等于结束时间'
    } else if (startDate < now) {
      return '开始时间不能小于当前时间'
    } else if (startDate - now > 1000 * 60 * 60 * 24) {
      return '只能预约最近24小时的会议'
    }
    else {
      return null
    }

  }

  //密码选择的回调函数
  pawHave = (e) => {
    this.setState({
      is_password: e.target.checked
    }, () => {
      if (!this.state.is_password) return
      let inp = document.querySelector(".pwdInput input")
      inp.focus()
    })
  }

  //密码输入的回调
  passwordChange = (e) => {
    let isnum = /^\d*$/.test(e.target.value);
    if (!isnum) return
    this.setState({
      passwordValue: e.target.value
    })
    if (e.target.value.length > 4) return this.setState({
      passwordValue: e.target.value.substring(0, 4),
    })

  }

  //取消预约研讨会
  cancelReserved = () => {
    // this.props.history.push("/meeting/seminar")
    this.props.changePage('list')
  }

  //主持人视频权限
  videoMasterChange = e => {
    this.setState({
      video_master: e.target.value
    })
  }

  //嘉宾视频权限
  videoHonourChange = e => {
    this.setState({
      video_honour: e.target.value
    })
  }

  //预约会议
  reservedSeminar = (type) => {
    return () => {
      if (this.state.disable === 1) return
      let { meetingValue, start_date, start_time, end_date, end_time, is_password, passwordValue, video_honour, video_master } = this.state
      meetingValue = meetingValue.replace(/(^\s*)|(\s*$)/g, '')
      let dateValid = this.dateValid()
      if (!start_date || !start_time) {
        message.destroy();
        message.warn("请设置研讨会开始日期")
        return
      }
      if (!end_date || !end_time) {
        message.destroy();
        message.warn("请设置研讨会结束日期")
        return
      }
      if (dateValid) {
        message.destroy();
        message.warn(dateValid)
        return
      }
      if (is_password && !passwordValue) {
        message.destroy();
        message.warn("请设置研讨会密码")
        return
      }
      if (is_password && passwordValue.length < 4) {
        message.destroy();
        message.warn("请设置四位研讨会密码")
        return
      }
      this.setState({
        disable: 1
      })
      // let seminarName = !this.props.currentUser.name ? "XXX的研讨会" : (this.props.currentUser.name + "的研讨会")
      let seminar = {
        title: meetingValue ? meetingValue : 'seminarName',
        start_date,
        start_time: start_time + ":00",
        end_date,
        end_time: end_time + ":00",
        is_password: is_password ? 1 : 0,
        password: passwordValue,
        video_master,
        video_honour
      }

      if (type === "reserved") {
        message.loading({ content: '预约会议中...', key: "reserve" })
        console.log(seminar);
        actionSeminar.seminarCreate(seminar).then(res => {
          if (res.code === 200) {
            this.props.changePage('detail', { seminarid: res.data.meeting_id })
          } else {
            this.showToast(res.msg)
          }
        }).finally(() => {
          this.setState({
            submitLoading: false
          })
        })
      } else {
        let seminar1 = {
          meeting_id: this.props.id + "",
          ...seminar
        }
        console.log(seminar1);

        actionSeminar.seminarEdit(seminar1).then(res => {
          console.log('编辑研讨会---resd:', res)
          if (res.code === 200) {
            this.props.changePage('detail', { seminarid: this.props.seminarid })
          } else {
            this.showToast(res.msg)
          }
        }).finally(() => {
          this.setState({
            submitLoading: false
          })
        })
      }

    }
  }
  componentWillMount() {
    if (this.props.id) {
      this.editDataInit()
    } else {
      this.getInitTime()
    }

  }
  componentDidMount() {
    let inps = document.querySelectorAll("input")
    inps[0].focus()
  }
  render() {
    // let seminarName = !this.props.currentUser.name ? "XXX的研讨会" : (this.props.currentUser.name + "的研讨会")

    return (
      <PageHeaderWrapper title={'预约网络研讨会'}>
        <div
          className="my-container"
          style={{
            width: '100%',
            paddingTop: 20,
            backgroundColor: '#ffffff',
          }}>
          {/* 会议主题 */}
          <div style={{ display: "flex", flexDirection: 'row' }}>
            <div style={{ width: 220, height: 32, marginRight: 30, display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
              <span style={{ color: "red", marginRight: 4 }}>*</span>
              <span style={{ fontSize: 16 }}>会议主题</span>
            </div>
            <Input
              style={{ width: 360, height: 32 }}
              allowClear={true}
              autoComplete="off"
              placeholder={'seminarName'}
              value={this.state.meetingValue}
              onChange={this.meetingTopicChange}></Input>
            {this.state.isMeetV === 1 ? (<div style={{ height: 32, lineHeight: "32px", color: "red", marginLeft: 10 }}>会议主题不可以超过100个字符哦~</div>) : null}
          </div>
          {/* 会议开始时间 */}
          <div style={{ display: "flex", flexDirection: 'row', marginTop: 20 }}>
            <div style={{ width: 220, height: 32, marginRight: 30, display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
              <span style={{ color: "red", marginRight: 4 }}>*</span>
              <span style={{ fontSize: 16 }}>开始时间</span>
            </div>
            <Space direction="vertical" size={12} style={{ display: "flex", flexDirection: "row" }}>
              <DatePicker
                style={{ marginRight: 20 }}
                allowClear={false}
                disabledDate={
                  (current) => current && current < moment().subtract(1, "days") || current > moment().add(1, 'days')
                }
                onChange={this.startDateOnChange}
                value={moment(this.state.start_date, 'YYYY-MM-DD')} />
              <TimePicker
                format={'HH:mm'}
                allowClear={false}
                minuteStep={15}
                value={moment(this.state.start_time, "HH:mm")}
                onChange={this.startTimeOnChange}
              />
            </Space>
          </div>
          {/* 会议结束时间 */}
          <div style={{ display: "flex", flexDirection: 'row', marginTop: 20 }}>
            <div style={{ width: 220, height: 32, marginRight: 30, display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
              <span style={{ color: "red", marginRight: 4 }}>*</span>
              <span style={{ fontSize: 16 }}>结束时间</span>
            </div>
            <Space direction="vertical" size={12} style={{ display: "flex", flexDirection: "row" }}>
              <DatePicker
                style={{ marginRight: 20 }}
                allowClear={false}
                disabledDate={
                  (current) => (current && current < moment(this.state.start_date).subtract(0, "days") || current > moment(this.state.start_date).add(1, 'day'))
                }
                onChange={this.endDateOnChange}
                value={moment(this.state.end_date, 'YYYY-MM-DD')} />
              <TimePicker
                format={'HH:mm'}
                allowClear={false}
                minuteStep={15}
                value={moment(this.state.end_time, "HH:mm")}
                onChange={this.endTimeOnChange}
              />
            </Space>
          </div>
          {/* 研讨会密码 */}
          <div style={{ display: "flex", flexDirection: 'row', marginTop: 20, alignItems: "center" }}>
            <div style={{ width: 220, height: 32, marginRight: 30, display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 16 }}>研讨会密码</span>
            </div>
            <Checkbox onChange={this.pawHave} style={{ fontSize: 14 }} checked={this.state.is_password}>设置密码</Checkbox>
            {this.state.is_password && this.state.is_password ? (<Input.Password style={{ width: 273 }} allowClear={true} placeholder={"请输入4位数字密码"} value={this.state.passwordValue} onChange={this.passwordChange} className={"pwdInput"} />) : null}
            {/* {this.state.ispawV?(<div style={{height:32,lineHeight:"32px",color:"red",marginLeft:10}}>{this.state.ispawV}</div>):null} */}
          </div>
          {/* 研讨会权限 */}
          <div style={{ display: "flex", flexDirection: 'row', marginTop: 20, alignItems: "center" }}>
            <div style={{ width: 220, height: 32, marginRight: 30, display: "flex", alignItems: "center", justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 16 }}>视频</span>
            </div>
            <div>
              <div>
                <span style={{ marginRight: 30 }}>主持人</span>
                <Radio.Group onChange={this.videoMasterChange} value={this.state.video_master}>
                  <Radio value={"1"}>开</Radio>
                  <Radio value={"0"}>关</Radio>
                </Radio.Group>
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ marginRight: 44 }}>嘉宾</span>
                <Radio.Group onChange={this.videoHonourChange} value={this.state.video_honour}>
                  <Radio value={"1"}>开</Radio>
                  <Radio value={"0"}>关</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
          {/* 确认和取消 */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 35, paddingBottom: 30 }}>
            <div style={{ width: "88px", height: "30px", background: "#ffffff", border: "1px solid #dcdfe6", borderRadius: "3px", fontSize: "16px", lineHeight: "30px", textAlign: "center", marginRight: 20, cursor: "pointer" }}
              onClick={this.cancelReserved}>取消</div>
            {this.props.id ? (
              <div style={{ width: "88px", height: "30px", background: "#5584ff", border: "1px solid rgba(0,0,0,0)", borderRadius: "3px", fontSize: "16px", color: "#ffffff", lineHeight: "30px", textAlign: "center", marginLeft: 20, cursor: "pointer" }}
                onClick={this.reservedSeminar("save")}
                disabled={this.state.disable}
              >保存</div>) : (
                <div style={{ width: "88px", height: "30px", background: "#5584ff", border: "1px solid rgba(0,0,0,0)", borderRadius: "3px", fontSize: "16px", color: "#ffffff", lineHeight: "30px", textAlign: "center", marginLeft: 20, cursor: "pointer" }}
                  onClick={this.reservedSeminar("reserved")}
                >预约</div>
              )}
          </div>
        </div>
      </PageHeaderWrapper>

    );
  }
}
export default connect(({ user }) => ({
  // currentUser: user.currentUser,
}))(SeminarEdit);