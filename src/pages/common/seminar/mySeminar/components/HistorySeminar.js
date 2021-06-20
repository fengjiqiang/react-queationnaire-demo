
import React, { Component } from 'react'
import { Table, Tag, Space, Pagination, message } from 'antd'
import CancelSeminar from "./CancelSeminar"
import actionSeminar from '@actions/seminar/actionSeminar.js'
import actionMeeting from '@actions/meetingManage/actionMeeting.js'
import BaseCmp from '@components/BaseCmp.js'
import { downloadFile } from '@/libs/utils.js';
// import { requestHost, requestYTHHost } from "../../../../env.js"
// import { requestWithParams } from "../../../../utils/utils"

class HistorySeminar extends BaseCmp {
  constructor(props) {
    super(props)
    this.state = {
      isShow: 0,
      // seminarList:[]
    }
    this.columns = [
      {
        title: '会议主题',
        key: 'title',
        width: '24%',
        render: (text, record) => {
          return (< div style={{ maxWidth: 400 }}>
            {record.title}</div>)
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
          let endTime = record.close_time && record.close_time.split(' ')[0] + ' ' + record.close_time.split(' ')[1].split(':')[0] + ':' + record.close_time.split(' ')[1].split(':')[1]
          return (< div>
            {endTime}</div>)
        }
      },
      {
        title: '操作',
        key: 'action',
        width: "17%",
        render: (text, record) => (
          <Space size="middle">
            <a
              onClick={this.deleteHandler(record.id)}>删除</a>
            {record.user_num2 ? <a
              onClick={this.deriveList(record.id)}
            >导出参会者</a> : null}

          </Space>
        ),
      },
    ];
  }
  //打开对话框
  deleteHandler(id) {
    return (e) => {
      e.stopPropagation()
      this.setState({
        isShow: id
      })
    }
  }

  //关闭对话框
  closeHandler = () => {
    this.setState({
      isShow: 0
    })
  }

  //打开详情页面
  openDetail = (id) => {
    return () => {
      // this.props.push({ pathname: "/meeting/seminar/seminardetail/" + id })
      this.props.changePage('detail', { seminarid: id })
    }
  }

  //导出参会者列表
  deriveList = (id) => {
    // return (e) => {
    //   e.stopPropagation()
    //   let url = "/api/v1/meeting/control/export"
    //   // window.open(requestYTHHost + '/api/v1/meeting/control/export?meeting_id=' + id)
    // }
    actionMeeting.exportMemberList(id).then( res => {
      if(res.code === 200 ){
          downloadFile(res.data, '直播观众列表.xlsx')
      }else{
          this.showToast({type:'error', content: '导出文件出错'})
      }
    }).catch(err =>{
        this.showToast({type:'error', content: err.msg})
    })
  }

  render() {
    let s = this.props.state
    console.log(s.comSeminarList);
    return (
      <>
        <Table
          columns={this.columns}
          dataSource={s.comSeminarList}
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
          total={s.comlistLen}
          hideOnSinglePage={true}
          current={s.page}
          showSizeChanger={false}
          pageSize={20}
          onChange={(page, pageSize) => {
            this.props.paginationAction(page)

          }}
        />
        <CancelSeminar
          isShow={this.state.isShow}
          data={{
            type: "delete",
            title: "删除会议记录",
            text: "删除后该网络研讨会记录将被永久删除",
            btn: "取消"
          }}
          btn={"删除"}
          closeHandler={this.closeHandler}
          getSeminarList={this.props.getSeminarList}
          pageCon={this.props.state}>
        </CancelSeminar>
      </>
    )
  }
}
export default HistorySeminar