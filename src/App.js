import $ from 'jquery'
import { connect } from 'react-redux'
import './assets/styles/App.less';
import LayoutMenu from './components/layout/LayoutMenu.js'  // 左侧菜单

import LayoutWindow from './components/layout/LayoutWindow.js'  // 主窗口
import BaseCmp from './components/BaseCmp.js'
import eventBus from '@/libs/EventBus.js'
import commonActions from '@/store/actions/commonActions.js'
import CopyInviteModal from '@/pages/common/CopyInviteModal.js'
import utils from '@/libs/utils.js'
import LayoutHeader from './components/layout/LayoutHeader';
import config from './config';
import actionPersonalInfo from './store/actions/personalInfo/actionPersonalInfo';
import actionVideoManage from './store/actions/VODManage/actionVideoManage';
import actionVODManage from './store/actions/VODManage/actionVODManage';
import actionInfoManage from '@actions/infoManage/actionInfoManage.js'
import store from './store/index.js'
import actionTypes from './store/actionTypes.js'
// import Uploader from 'simple-uploader.js';
import Uploader from '@/libs/Uploader.js';

import { Progress } from 'antd';
import { RLModal, RLButton } from '@/components/index.js';
import  DraggableModal from './pages/common/DraggableModal.js';

// import { DraggableModal, DraggableModalProvider } from 'ant-design-draggable-modal';'
// import  Draggable from 'react-draggable';

import { Rnd } from 'react-rnd';
import images from '@/libs/images/index.js'
const commonImg = images.commonImg
class App extends BaseCmp {
  constructor(props) {
    super(props)
    // super.initPushVC(props.history)
    utils.initHistory(props);
    this.state = {
      uploadingFile: {},
      percentage: 0,
      uploadSucessful: false,
      uploadFailed: false,
      showUploadFailedModal: false,
      showUploadSuccessModal: false,
      uploadResponse: null
    };

    this.uploader = null;
    this.timer = null;
    // const token = commonActions.getToken()
    const token = sessionStorage.getItem('token')
    console.log('token:', token)
    if (!token) {
      utils.pushVC({ pathname: '/login' })
    }
    this.getMenuData();
    commonActions.getPermission();
    actionPersonalInfo.getUserInfo();
  }
  componentWillMount() {
    eventBus.addListener('show-invite-modal', ({ meetingId }) => {
      this.setState({
        inviteMeetingId: meetingId
      })
    })
  }
  componentDidMount() {
    this.updateTitle();
    console.log($('#root'))
    $('#root').resize((...rest) => {
      console.log(rest)
      console.log('尺寸变化')
    });

    eventBus.addListener('upload-video',(file, params)=>{
        //开始上传
        this.setState({
          uploadingFile: file
        });
        this.uploadFile(file, params);
    });

  }
  componentWillUnmount(){
    eventBus.removeListener('upload-video');
  }

  UNSAFE_componentWillUpdate(nextProps) {

  }
  componentDidUpdate(nextProps) {
    // console.log('--------------app路由更新----------------');
    this.updateTitle(nextProps);
  }

  uploadFile(file,params){
    console.log(`-------创建${file.name}的uploader--------`);
    let uploader = new Uploader({
      file, 
      method: 'POST', 
      baseURL: config.uploadBaseUrl,
      url: '/api/playback/upload', 
      chunkSize: 2 * 1024 * 1024, 
      onStart: () => {
        store.dispatch({
          type: actionTypes.UPLOAD_STATE_CHANGE,
          data: true
        });
      },
      onSuccess: (res) => {
        console.log('--------上传成功-------', res);
        this.timer = setTimeout(() => {
            this.setState({
              showUploadSuccessModal: true,
              percentage: 0.0
            });
            store.dispatch({
              type: actionTypes.UPLOAD_STATE_CHANGE,
              data: false
            });
        }, 1500);
        if(params.type === 'video'){
          let data = {
            id: res.id
          }
          actionVideoManage.createRecord(data);
          eventBus.emit('video_res_update');
        }
        else if(params.type === 'vod'){
          let data = {
            course_id: params.course_id,
            title: file.name,
            doc_url: res.url,
            filesize: file.size,
            is_down: params.is_down,
          }
          actionVODManage.resourceAdd(data).then(res=>{
            eventBus.emit('vod_res_update');
          });
        }else if(params.type === 'info'){
          let data = {
            information_id: params.info_id,
            title: file.name,
            doc_url: res.url
          }
          actionInfoManage.infoDocAdd(data).then(res => {
            console.log('资讯资料-------------', res)
            if (res.code === 200) {
              eventBus.emit('info_res_update')
            }
          })
        }
      }, 
      onError: () => {
        console.log('--------上传失败-------');
        this.setState({
          showUploadFailedModal: true,
          percentage: 0.0
        });
        store.dispatch({
          type: actionTypes.UPLOAD_STATE_CHANGE,
          data: false
        });
      }, 
      onProgress: (progress)=>{
        console.log('-------上传进度---------', progress);
        this.setState({
          percentage: progress
        });
      },
      onCancel: ()=>{
        console.log('-------上传取消---------');
        this.setState({
          percentage: 0
        })
        store.dispatch({
          type: actionTypes.UPLOAD_STATE_CHANGE,
          data: false
        });
      }
    });
    uploader.upload({ ...params });
  }

  initPageTabs = (menus) => {

    let currentPathname = this.props.history.location.pathname
    console.log('this.props.history:', menus, currentPathname)
    let menu = this.getRoute(menus, currentPathname)
    console.log('app--menu:', menu, currentPathname)
    commonActions.cacheRoutesChange({ type: 'add', route: menu })
  }
  getRoute = (menus, currentPathname) => {

    for (let i = 0; i < menus.length; i++) {
      if (!menus[i].children || !menus[i].children.length) {
        if (menus[i].menu_route === currentPathname) {
          return menus[i]
        }
      } else {
        let menu = this.getRoute(menus[i].children, currentPathname)
        if (menu) {
          console.log('menu123', menu)
          return menu
        }
      }
    }
  }
  updateTitle(nextProps) {
    commonActions.getPath(this.props.location.pathname)

  }
  // 获取左侧菜单json数据
  getMenuData = () => {
    return commonActions.getMenuData().then(res => {
      if (res.code === 200) {
        if (this.props.location.pathname === '/') {
          commonActions.getPath('/personalinfo')
        } else {
          commonActions.getPath(this.props.location.pathname)
        }
        let cacheRoute = config.cacheRoute
        if (cacheRoute) {
          this.initPageTabs(res.data)
        }

      } else {
        this.showToast({ type: 'error', content: res.msg })
      }
      return
    })
  }
  cancelUpload = () => {
      this.showModal({
          content: '您确定要取消当前文件上传吗？',
          title: '取消上传?',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
              this.uploader && this.uploader.cancel();
              store.dispatch({
                type: actionTypes.UPLOAD_STATE_CHANGE,
                data: false
              });
          },
          onCancel: () => { },
          size: 'big'
      })
  }

  render() {

    return (
        <div className="App">
          <LayoutHeader history={this.props.history} />

          <div className='vertical-body' style={{position:'relative'}}>
            <LayoutMenu style={{ width: '240px', overflowY: 'auto' }} history={this.props.history} />
            <LayoutWindow style={{ flex: 1, overflow: 'auto' }} history={this.props.history} />
          </div>
          { this.state.showUploadSuccessModal && <RLModal 
              title="上传结果"
              visible={this.state.showUploadSuccessModal}
              onCancel={()=>{
                this.setState({showUploadSuccessModal: false})
              }}
              footer={null}
            >
              <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                <img
                  alt=''
                  src={commonImg.success}
                  style={{ width: 80, height: 80, marginBottom: 20 }}
                />
                <div style={{ color: '#333333' }}>
                  {`${this.state.uploadingFile.name || ''} 上传成功`}
                </div>
              </div>
              <div className='modal-btnContainer'>
                <RLButton
                  label='确定'
                  type='primary'
                  htmlType="submit"
                  style={{ margin: 'auto' }}
                  onClick={() => {
                    this.setState({ showUploadSuccessModal: false })
                  }}
                />
              </div>
          </RLModal>}
          { this.state.showUploadFailedModal && <RLModal
            title="上传结果"
            visible={this.state.showUploadFailedModal}
            onCancel={()=>{
              this.setState({ showUploadFailedModal: false})
            }}
            footer={null}
            >
            <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
              <img
                alt=''
                src={commonImg.fail}
                style={{ width: 80, height: 80, marginBottom: 20 }}
              />
              <div style={{ color: '#333333' }}>
                {`${this.state.uploadingFile.name || ''} 上传失败，请重新上传`}
              </div>
            </div>
            <div className='modal-btnContainer'>
              <RLButton
                label='确定'
                type='primary'
                htmlType="submit"
                style={{ margin: 'auto' }}
                onClick={() => {
                  this.setState({ showUploadFailedModal: false })
                }}
              />
            </div>
          </RLModal>}
            {
                this.props.uploading && 
                  <Rnd
                      default={{
                        x: 0,
                        y: 0,
                        width: 350,
                        height: 110,
                      }}
                      enableResizing={ false }
                      bounds="window"
                  > 
                      <div style={{backgroundColor: '#808A87',display:'flex',flexDirection:'row',justifyContent:'center',flexWrap:'wrap',borderRadius: 4}}>
                        <div style={{width: '100%', height: 30,display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                          {/* <img src='1.png' alt='' onClick={()=>{
                              this.cancelUpload();
                            }}
                            style={{width:15,height:15,cursor:'pointer',marginRight:10}}
                          /> */}
                        </div>
                        <div style={{width:'90%',height:30,display:'flex',flexDirection:'row',justifyContent:'center'}}>
                          <span style={{ width: 255, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {this.state.uploadingFile && this.state.uploadingFile.name}
                          </span>
                          <span>正在上传</span>
                        </div>
                        <div style={{width:'95%',height: 50,display:'flex',flexDirection:'row',justifyContent:'center'}}>
                           <Progress percent={this.state.percentage} style={{width: '90%',height: 40}}/>
                        </div>
                       
                      </div>
                  </Rnd>
           }
            
        </div>
    )
  }
}


export default connect((store, props) => {
  return {
      ...props,
      uploading: store.storeCommon.uploading,
      // uploading: true
  }
})(App)
