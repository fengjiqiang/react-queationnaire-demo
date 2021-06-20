
import React, { Component } from 'react'
import { Table, Tag, Space, Pagination } from 'antd'
import CancelSeminar from "./CancelSeminar"
// import { pullUpHost } from "../../../../env"

class UpcomingSeminar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cancelShow: 0,
      deleteShow: 0,
      endShow: 0,
      data: {
        type: null,
        title: null,
        text: null,
        btn: null
      }
    }
    this.columns = [
      {
        title: '会议主题',
        key: 'title',
        render: (text, record) => {
          return (<>
            {record.status === 1 ? (<div style={{ width: 56, height: 20, backgroundColor: "rgba(68,217,123,0.1)", color: "#44d97b", borderRadius: 2, float: "left", marginRight: 5, textAlign: "center", paddingLeft: 5, paddingRight: 5 }}>进行中</div>) : null}
            {record.title}</>)
        }
      },
      {
        title: '网络研讨会ID',
        dataIndex: 'room',
        key: 'room',
        width: "15%"
      },
      {
        title: '开始时间',
        key: 'start_time',
        width: "22%",
        render: (text, record) => {
          let startTime = record.start_time && record.start_time.split(' ')[0] + ' ' + record.start_time.split(' ')[1].split(':')[0] + ':' + record.start_time.split(' ')[1].split(':')[1]
          return (< div>
            {startTime}</div>)
        }
      },
      {
        title: '结束时间',
        key: 'end_time',
        width: "22%",
        render: (text, record) => {
          let endTime = record.end_time && record.end_time.split(' ')[0] + ' ' + record.end_time.split(' ')[1].split(':')[0] + ':' + record.end_time.split(' ')[1].split(':')[1]
          return (< div>
            {endTime}</div>)
        }
      },
      {
        title: '操作',
        key: 'action',
        width: "17%",
        render: (text, record) => {
          let actionStr = null
          if (record.status === 0) return actionStr = (<>
            <a
              onClick={this.seminarStart(record)}>
              开始</a>
            <a
              style={{ marginLeft: 10, marginRight: 10 }}
              onClick={this.seminarEdit(record)}>
              编辑</a>
            <a
              onClick={this.clickHandler(record.id)}>
              取消</a></>)
          if (record.status === 1) return actionStr = (
            <>
              <a
                onClick={this.seminarStart(record)}>加入</a>
              <a
                style={{ marginLeft: 10 }}
                onClick={this.clickHandler(record.id)}
              >结束</a></>
          )
          if (record.status === 2) return actionStr = (
            <>
              <a
                onClick={this.seminarStart(record)}>
                加入</a>
              <a
                style={{ marginLeft: 10 }}
                onClick={this.clickHandler(record.id)}>删除</a></>
          )
          return (
            <Space size="middle">
              {actionStr}
            </Space>
          )
        }
      },
    ];
  }
  //开始会议
  seminarStart = (record) => {
    return (e) => {
      e.stopPropagation()
      let hushKey = record.url.split("?")[1]
      // let url = pullUpHost + "?" + hushKey
      // window.open(url)
    }
  }

  //编辑会议
  seminarEdit = (record) => {
    return (e) => {
      e.stopPropagation()
      // this.props.push({ pathname: '/meeting/seminar/reservedseminar/' + record.id })
      this.props.changePage('edit', { id: record.id })
    }
  }

  //弹出对话框
  clickHandler = (id) => {
    return (e) => {
      e.stopPropagation()
      switch (e.target.text) {
        case "取消":
          this.setState({
            cancelShow: id,
            data: {
              type: "cancel",
              title: "取消会议",
              text: "您是会议的创建者，取消后其他成员将无法入会。",
              btn: "我再想想"
            }
          })
          break;
        case "结束":
          this.setState({
            endShow: id,
            data: {
              type: "end",
              title: "结束会议",
              text: "您是否确定结束此网络研讨会？",
              btn: "取消"
            }
          })
          break;
        case "删除":
          this.setState({
            deleteShow: id,
            data: {
              type: "delete",
              title: "删除会议",
              text: "您是会议的创建者，删除后其他成员将无法入会。",
              btn: "取消"
            }
          })
          break;
        default: break;
      }
    }
  }
  //关闭对话框
  closeHandler = () => {
    this.setState({
      cancelShow: 0,
      endShow: 0,
      deleteShow: 0
    })
  }

  //打开详情页面
  openDetail = (id) => {
    return () => {
      // this.props.push({ pathname: "/meeting/seminar/seminardetail/" + id })
      this.props.changePage('detail', { seminarid: id })
    }
  }


  render() {
    let s = this.props.state
    return (
      <>
        <Table
          columns={this.columns}
          dataSource={s.willSeminarList}
          style={{ marginBottom: 10 }}
          pagination={false}
          onRow={(record, rowkey) => {
            return {
              onClick: this.openDetail(record.id),
              onMouseEnter: event => {
                event.stopPropagation()
                event.target.style.cursor = "pointer"
              }
            }
          }}
        />
        <Pagination
          style={{ float: 'right', marginRight: 30, paddingBottom: 20 }}
          total={s.willlistLen}
          hideOnSinglePage={true}
          pageSize={20}
          current={s.page}
          showSizeChanger={false}
          onChange={(page, pageSize) => {
            this.props.paginationAction(page)

          }}
        />
        <CancelSeminar
          isShow={this.state.cancelShow || this.state.endShow || this.state.deleteShow}
          data={this.state.data}
          closeHandler={this.closeHandler}
          getSeminarList={this.props.getSeminarList}
          pageCon={this.props.state}>
        </CancelSeminar>

      </>
    )
  }
}
export default UpcomingSeminar