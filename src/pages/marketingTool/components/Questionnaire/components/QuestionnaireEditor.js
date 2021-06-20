import React from 'react';
import BaseCmp from '@components/BaseCmp.js'
import { connect } from 'react-redux'
import {
  RLInput, RLSwitch, RLSelect
} from '@components/index.js'
import { uuid } from '@/libs/utils.js'

import './QuestionnaireEditor.less'


class QuestionnaireEditor extends BaseCmp {
  constructor(props) {
    super(props);
    this.state = {
      editor: {
        ...this.props.editor
      },
      hover: false,
    }

    this.options = [
      { value: 'radio', label: '单选' },
      { value: 'checkbox', label: '多选' },
      { value: 'rate', label: '评分' },
      { value: 'textarea', label: '问答' },
      { value: 'matrixrate', label: '矩阵评分' },
      { value: 'dropdown', label: '下拉选择框' },
      { value: 'input', label: '填空' },
      { value: 'datepicker', label: '日期' }
    ]
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.editor.editorShake !== this.props.editor.editorShake) {
  //     this.setState({
  //       editor: {
  //         ...this.state.editor,
  //         editorShake: nextProps.editor.editorShake,
  //       },
  //     });
  //   } else {
  //     this.setState({
  //       editor: {
  //         ...this.state.editor,
  //         ...nextProps.editor,
  //       },
  //     });
  //   };
  // }

  // 新增选项
  createOption = () => {
    if (this.props.editor.options.length > 4) {
      this.showToast('最多设置5个选项')
      return
    }
    this.props.handleEdit({
      ...this.props.editor,
      options: [...this.props.editor.options,'']
    },this.props.index)
  }
  // 删除选项
  deleteOption = (index) => {
    let options = [...this.props.editor.options]
    // let options = [...this.state.editor.options]
    options.splice(index, 1)
    this.props.handleEdit({
      ...this.props.editor,
      options
    },this.props.index)
  }
  //删除
  cancel = () => {
    const { index, handleCancel } = this.props;
    if (handleCancel) {
      handleCancel(index);
    }
  }

  // generateData(){
  //   switch(this.state.editor.type){
  //     case 'input':
  //     case 'datepicker':
  //     case 'textarea':
  //       if(!this.state.editor.title.trim()){
  //         message.info(`请将问题${this.props.index + 1}标题填写完整`);
  //         return false;
  //       }
  //       break;
  //     case 'radio':
  //     case 'dropdown':
  //     case 'checkbox':
  //       if(!this.state.editor.title.trim()){
  //         message.info(`请将问题${this.props.index + 1}标题填写完整`);
  //         return false;
  //       }
  //       for(let option of this.state.editor.options){
  //         if(!option.trim()){
  //           message.info(`请将问题${this.props.index + 1}标题填写完整`);
  //           return false;
  //         }
  //       }
  //       break;
  //     case 'rate':
  //       if(!this.state.editor.title.trim()){
  //         message.info(`请将问题${this.props.index + 1}标题填写完整`);
  //         return false;
  //       }
  //       for(let option of this.state.editor.options){
  //         if(!option.title.trim() || !option.score.trim()){
  //           message.info(`请将问题${this.props.index + 1}选项及对应分数填写完整`);
  //           return false;
  //         }
  //       }
  //       break;
  //     case 'matrixrate':
  //       if(!this.state.editor.title.trim()){
  //         this.setState({
  //           errorMsg: '请填写标题'
  //         })
  //         return false;
  //       }
  //       if(!this.state.editor.title.trim()){
  //         message.info(`请将问题${this.props.index + 1}行标题填写完整`);
  //         return false;
  //       }
  //       for(let option of this.state.editor.options){
  //         if(!option.title.trim() || !option.score.trim()){
  //           message.info(`请将问题${this.props.index + 1}选项及对应分数填写完整`);
  //           return false;
  //         }
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   return {
  //     type: this.state.editor.type,
  //     title: this.state.editor.title,
  //     required: this.state.editor.required,
  //     options: this.state.editor.options
  //   }
  // }

  switchType = (type) => {
    const { handleEdit } = this.props;
    if(type === this.props.editor.type){
      return;
    }
    switch (type){
      case 'radio':
      case 'checkbox':
      case 'dropdown':
      handleEdit({
          ...this.props.editor,
          type: type,
          title: '',
          options: ['','']
      }, this.props.index);
        break;
      case 'input':
      case 'datepicker':
      case 'textarea':
       handleEdit({
          ...this.props.editor,
          type: type,
          title: '',
        }, this.props.index);
        break;
      case 'rate':
       handleEdit({
          ...this.props.editor,
          type: type,
          title: '',
          options: [{title:'',score:''},{title:'',score:''}]
        }, this.props.index);
        break;
      case 'matrixrate':
        handleEdit({
            ...this.props.editor,
            type: type,
            title: '',
            rows: ['', ''],
            options: [{title:'',score:''},{title:'',score:''}]
        }, this.props.index);
        break;
      default:
        break; 
    }
  }

  render() {
    // const { editor, hover } = this.state;

    // const { title, required, options, rowTitle } = this.props.editor;
    let {
      type,
      title,
      required,
      options,
      rowTitle,
      rows
    } = this.props.editor;

    /*
     *
     * 以下元素为编辑状态下的元素
     *
     */
    //编辑状态下的题目
    const ediTitleEl = (
      <div className="editor-row-title">
        <span style={{ fontSize: 14, fontWeight: 400, color: '#333333', width: 60, textAlign: 'right' }}>标题</span>
        <RLInput
          placeholder='请输入标题（50个字以内）'
          value={title}
          id={'title'}
          maxLength={50}
          style={{ width: 520, marginLeft: 20 }}
          onChange={(e) => {
            this.props.handleEdit({
              ...this.props.editor,
              title: e.target.value
            }, this.props.index)
          }}
        />
      </div>
    );
    //编辑状态下的选项框(radio,checkbox,dropdown)
    const optionsArr = options.map((option, index) => {
      return (
        <div className="editor-row-option" key={index}>
          <span style={{ width: 60, textAlign: 'right' }}>选项{index+1}</span>
          <RLInput
            placeholder='请输入选项（30个字以内）'
            value={option}
            id={'options'}
            maxLength={30}
            style={{ width: 520, marginLeft: 20 }}
            onChange={(e) => {
              this.props.editor.options[index] = e.target.value;
              this.props.handleEdit({
                ...this.props.editor
              }, this.props.index)
            }}
          />
          {
            index === options.length - 1 && <img
              alt=''
              src={require('../../../../../assets/images/questionnaire/increase.png').default}
              className="question-increase"
              onClick={() => {
                this.createOption()
              }}
            />
          }
          {
            options.length > 2 && <img
              alt=''
              src={require('../../../../../assets/images/questionnaire/decrease.png').default}
              className="question-decrease"
              onClick={() => {
                this.deleteOption(index)
              }}
            />
          }
        </div>
      )
    })

    // 矩阵评分matrixrate 行标题
    const rowsTitle = rows.map((row, index) => {
      return (
        <div className="editor-row-option" key={index}>
          <span style={{ fontSize: 14, fontWeight: 400, color: '#333333', width: 60, textAlign: 'right' }}>行标题{index+1}</span>
          <RLInput
            placeholder='请输入行标题（30个字以内）'
            value={row}
            id={'options'}
            maxLength={30}
            style={{ width: 520, marginLeft: 20 }}
            onChange={(e) => {
              this.props.editor.rows[index] = e.target.value;
              this.props.handleEdit({
                ...this.props.editor
              }, this.props.index)
            }}
          />
          {
            index === rows.length - 1 && <img
              alt=''
              src={require('../../../../../assets/images/questionnaire/increase.png').default}
              className="question-increase"
              onClick={() => {
                if (this.props.editor.rows.length > 4) {
                  this.showToast('最多设置5个行标题')
                  return
                }
                this.props.handleEdit({
                  ...this.props.editor,
                  rows: [...this.props.editor.rows,'']
                },this.props.index)
              }}
            />
          }
          {
            rows.length > 2 && <img
              alt=''
              src={require('../../../../../assets/images/questionnaire/decrease.png').default}
              className="question-decrease"
              onClick={() => {
                let rows = [...this.props.editor.rows]
                rows.splice(index, 1)
                this.props.handleEdit({
                  ...this.props.editor,
                  rows
                },this.props.index)
              }}
            />
          }
        </div>
      )
    })

    // 编辑状态下的选项框(rate)
    const optionsRate = options.map((option, index) => {
      return (
        <div className="editor-row-option" key={index}>
          <span style={{ width: 60, textAlign: 'right' }}>选项{index+1}</span>
          <RLInput
            placeholder='请输入选项（30个字以内）'
            value={option.title}
            id={'options'}
            maxLength={30}
            style={{ width: 300, marginLeft: 20, marginRight: 50 }}
            onChange={(e) => {
              this.props.editor.options[index].title = e.target.value;
              this.props.handleEdit({
                ...this.props.editor
              }, this.props.index)
            }}
          />
          <span>分数</span>
          <RLInput
            placeholder='请设置分数'
            id={'value'}
            value={option.score}
            style={{ width: 120, marginLeft: 20 }}
            type='number'
            onChange={(e) => {
              this.props.editor.options[index].score = e.target.value;
              this.props.handleEdit({
                ...this.props.editor
              }, this.props.index)
            }}
          />
          {
            index === options.length - 1 && <img
              alt=''
              src={require('../../../../../assets/images/questionnaire/increase.png').default}
              className="question-increase"
              onClick={() => {
                if (this.props.editor.options.length > 4) {
                  this.showToast('最多设置5个选项')
                  return
                }
                this.props.handleEdit({
                  ...this.props.editor,
                  options: [...this.props.editor.options,{title:'',score:''}]
                },this.props.index)
              }}
            />
          }
          {
            options.length > 2 && <img
              alt=''
              src={require('../../../../../assets/images/questionnaire/decrease.png').default}
              className="question-decrease"
              onClick={() => {
                let options = [...this.props.editor.options]
                // let options = [...this.state.editor.options]
                options.splice(index, 1)
                this.props.handleEdit({
                  ...this.props.editor,
                  options
                },this.props.index)
              }}
            />
          }
        </div>
      )
    })

    return (
      <div className="questionnair-item">
          <div className="questionnair-editor">
            <div className="questionnair-editor-inner">
              {/* 问题类型选择 是否必填 删除按钮 */}
              <div className="editor-type">
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ width: 60, fontSize: 14, fontWeight: 400, color: '#333333', textAlign: 'right' }}>问题{this.props.index + 1}</span>
                  <RLSelect
                    options={this.options}
                    style={{ width: 200, marginLeft: 20, marginRight: 12 }}
                    value={type}
                    onChange={this.switchType}
                  />
                  <span style={{ marginRight: 5 }}>设为必填</span>
                  <RLSwitch
                    defaultChecked={required}
                    onChange={value => {
                      this.props.handleEdit({
                        ...this.props.editor,
                        required: value
                      },this.props.index)
                    }}
                  />
                </div>
                <div
                  className="question-remove"
                  onClick={() => {
                    if (this.props.isStatusEdit) {
                      this.showModal({
                        content: '确认删除后，若有已收集的数据也将被删除，是否确认删除？',
                        title: '是否删除该问题？',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                          this.cancel()
                        },
                        onCancel: () => { },
                        size: 'big'
                      })
                    } else {
                      this.cancel()
                    }
                  }}
                >
                  <img
                    alt=''
                    src={require('../../../../../assets/images/questionnaire/delete.png').default}
                    style={{ width: 16, height: 16, marginRight: 4 }}
                  />
                  <span style={{ fontSize: 14 }}>删除</span>
                </div>
              </div>

              {ediTitleEl}
              {['radio', 'dropdown', 'checkbox'].includes(type) && <div>
                {optionsArr}
              </div>}
              {['rate'].includes(type) && <div>
                {optionsRate}
              </div>}
              {
                type === 'matrixrate' && <div>
                  {rowsTitle}
                  {optionsRate}
                </div>
              }
            </div>
          </div>
        </div>
    );
  }
}

export default connect((store, props) => {
  return {
    ...props
  }
})(QuestionnaireEditor)
